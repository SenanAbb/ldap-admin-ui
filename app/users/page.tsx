"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import { Header } from "@/components/admin/header"
import { SyncSidebarControls } from "@/components/admin/sync/sync-controls"
import { UserDialog } from "@/components/admin/users/user-dialog"
import { PaginationBar } from "@/components/admin/users/pagination-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { LDAPGroup, LDAPUser } from "@/lib/types"

const ITEMS_PER_PAGE = 12

type SyncStatusPayload = {
  state: "queued" | "running" | "success" | "error"
  cycleId?: number
  startedAt?: number
  finishedAt?: number | null
  services?: Record<
    string,
    {
      state?: "pending" | "running" | "success" | "error" | "skipped"
      error?: { message?: string; stderr?: string; stdout?: string; code?: unknown }
    }
  >
}

async function fetchJsonWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<{ ok: boolean; status: number; json: any }> {
  const controller = new AbortController()
  const timeoutMs = init.timeoutMs ?? 15_000
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(input, { ...init, signal: controller.signal })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, json }
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { ok: false, status: 0, json: { error: "timeout" } }
    }
    return { ok: false, status: 0, json: { error: err?.message || "network_error" } }
  } finally {
    window.clearTimeout(timer)
  }
}

function formatSyncStatusError(status: SyncStatusPayload | null): string {
  const services = status?.services
  if (!services) return "Sincronización con errores"
  const parts: string[] = []
  for (const [key, v] of Object.entries(services)) {
    if (v?.state !== "error") continue
    const msg = v?.error?.message || "Error desconocido"
    parts.push(`${key}: ${msg}`)
  }
  return parts.length ? `Sincronización con errores (${parts.join(" | ")})` : "Sincronización con errores"
}

async function waitForSyncCompletion(options: { timeoutMs?: number; pollMs?: number } = {}) {
  const timeoutMs = options.timeoutMs ?? 180_000
  const pollMs = options.pollMs ?? 1_500
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    const r = await fetchJsonWithTimeout("/api/sync/status", { cache: "no-store", timeoutMs: 8_000 })
    if (!r.ok) {
      throw new Error(`SYNC: no se pudo leer el estado de sync (${r.json?.error || `HTTP ${r.status}`})`)
    }
    const status = (r.json?.status ?? null) as SyncStatusPayload | null
    if (!status) {
      await new Promise((resolve) => window.setTimeout(resolve, pollMs))
      continue
    }
    if (status.state === "success") return
    if (status.state === "error") {
      throw new Error(`SYNC: ${formatSyncStatusError(status)}`)
    }
    await new Promise((resolve) => window.setTimeout(resolve, pollMs))
  }

  throw new Error("SYNC: timeout esperando al worker de sincronización")
}

type UsersApiUser = {
  dn: string
  uid: string
  cn?: string
  givenName?: string
  sn?: string
  mail?: string
  dni?: string
}

const isDniNie = (uid: string): boolean => {
  const v = (uid ?? "").trim()
  if (!v) return false
  if (/^[0-9]{8}[A-Za-z]$/.test(v)) return true
  if (/^[XYZxyz][0-9]{7}[A-Za-z]$/.test(v)) return true
  return false
}

type GroupsApiGroup = {
  dn: string
  cn: string
  members: string[]
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<LDAPUser[]>([])
  const [groups, setGroups] = useState<LDAPGroup[]>([])
  const [kpis, setKpis] = useState<any | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<LDAPUser | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, groupsRes, kpisRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/ldap/groups"),
        fetch("/api/ldap/kpis"),
      ])
      const usersJson = await usersRes.json()
      const groupsJson = await groupsRes.json()
      const kpisJson = await kpisRes.json().catch(() => ({}))

      const apiUsers: UsersApiUser[] = usersJson.users || []
      const apiGroups: GroupsApiGroup[] = groupsJson.groups || []

      setKpis(kpisJson.kpis ?? null)

      const memberOfByUid = new Map<string, string[]>()
      for (const g of apiGroups) {
        const groupDn = g.dn
        for (const memberDn of g.members || []) {
          const first = memberDn.split(",")[0] || ""
          const uid = first.replace(/^uid=/i, "").trim()
          if (!uid) continue
          const prev = memberOfByUid.get(uid)
          if (prev) prev.push(groupDn)
          else memberOfByUid.set(uid, [groupDn])
        }
      }

      const usersWithMemberOf: LDAPUser[] = apiUsers.map((u) => ({
        dn: u.dn,
        uid: u.uid,
        cn: u.cn || u.uid,
        sn: u.sn || "",
        givenName: u.givenName || "",
        mail: u.mail,
        memberOf: memberOfByUid.get(u.uid) || [],
        enabled: true,
        createdAt: undefined,
        lastLogin: undefined,
      }))

      setUsers(usersWithMemberOf)
      setGroups(
        apiGroups.map((g) => ({
          dn: g.dn,
          cn: g.cn,
          members: g.members,
          description: undefined,
          createdAt: undefined,
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      return (
        u.uid.toLowerCase().includes(q) ||
        (u.cn || "").toLowerCase().includes(q) ||
        (u.mail || "").toLowerCase().includes(q)
      )
    })
  }, [search, users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const pageUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleCreateUser = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (user: LDAPUser) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDeleteUser = async (user: LDAPUser) => {
    await fetch(`/api/users/${encodeURIComponent(user.uid)}`, { method: "DELETE" })
    await loadData()
  }

  const handleSaveUser = async ({ user, password }: { user: LDAPUser; password?: string }) => {
    if (editingUser) {
      const patch: any = {
        givenName: user.givenName,
        sn: user.sn,
        cn: user.cn,
      }
      if (user.mail) patch.mail = user.mail
      if (password) patch.password = password

      const patchRes = await fetchJsonWithTimeout(`/api/users/${encodeURIComponent(user.uid)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!patchRes.ok) {
        if (patchRes.status === 503 && patchRes.json?.error === "ldap_unavailable") {
          throw new Error("LDAP: servicio no disponible")
        }
        throw new Error(patchRes.json?.error || `LDAP: HTTP ${patchRes.status}`)
      }

      const prevGroups = new Set(editingUser.memberOf || [])
      const nextGroups = new Set(user.memberOf || [])

      const add = [...nextGroups].filter((dn) => !prevGroups.has(dn))
      const remove = [...prevGroups].filter((dn) => !nextGroups.has(dn))

      const dnToCn = (dn: string) => dn.split(",")[0].replace(/^cn=/, "")

      const changedGroupCns = Array.from(
        new Set([...add, ...remove].map((dn) => dnToCn(dn)).filter(Boolean)),
      )

      for (const groupDn of add) {
        const r = await fetchJsonWithTimeout(`/api/users/${encodeURIComponent(user.uid)}/groups?skipSync=1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupCn: dnToCn(groupDn) }),
        })
        if (!r.ok) {
          if (r.status === 503 && r.json?.error === "ldap_unavailable") {
            throw new Error("LDAP: servicio no disponible")
          }
          throw new Error(r.json?.error || `LDAP: HTTP ${r.status}`)
        }
      }
      for (const groupDn of remove) {
        const r = await fetchJsonWithTimeout(
          `/api/users/${encodeURIComponent(user.uid)}/groups?groupCn=${encodeURIComponent(dnToCn(groupDn))}&skipSync=1`,
          { method: "DELETE" },
        )
        if (!r.ok) {
          if (r.status === 503 && r.json?.error === "ldap_unavailable") {
            throw new Error("LDAP: servicio no disponible")
          }
          throw new Error(r.json?.error || `LDAP: HTTP ${r.status}`)
        }
      }

      if (changedGroupCns.length) {
        const syncRes = await fetchJsonWithTimeout(`/api/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupCns: changedGroupCns, force: true }),
        })
        if (!syncRes.ok || !syncRes.json?.success) {
          throw new Error(syncRes.json?.error ? `SYNC: ${syncRes.json.error}` : `SYNC: HTTP ${syncRes.status}`)
        }
        if (syncRes.json?.enqueued) {
          await waitForSyncCompletion()
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? {
                ...u,
                givenName: user.givenName,
                sn: user.sn,
                cn: user.cn,
                mail: user.mail,
                memberOf: user.memberOf,
              }
            : u,
        ),
      )
      setEditingUser((prev) => (prev && prev.uid === user.uid ? { ...prev, memberOf: user.memberOf } : prev))
    } else {
      const createRes = await fetchJsonWithTimeout("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          givenName: user.givenName,
          sn: user.sn,
          cn: user.cn,
          mail: user.mail,
          password: password || "",
        }),
      })
      if (!createRes.ok) {
        if (createRes.status === 503 && createRes.json?.error === "ldap_unavailable") {
          throw new Error("LDAP: servicio no disponible")
        }
        throw new Error(createRes.json?.error || `LDAP: HTTP ${createRes.status}`)
      }

      const dnToCn = (dn: string) => dn.split(",")[0].replace(/^cn=/, "")
      const changedGroupCns = Array.from(new Set((user.memberOf || []).map((dn) => dnToCn(dn)).filter(Boolean)))
      for (const groupDn of user.memberOf || []) {
        const r = await fetchJsonWithTimeout(`/api/users/${encodeURIComponent(user.uid)}/groups?skipSync=1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupCn: dnToCn(groupDn) }),
        })
        if (!r.ok) {
          if (r.status === 503 && r.json?.error === "ldap_unavailable") {
            throw new Error("LDAP: servicio no disponible")
          }
          throw new Error(r.json?.error || `LDAP: HTTP ${r.status}`)
        }
      }

      if (changedGroupCns.length) {
        const syncRes = await fetchJsonWithTimeout(`/api/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupCns: changedGroupCns, force: true }),
        })
        if (!syncRes.ok || !syncRes.json?.success) {
          throw new Error(syncRes.json?.error ? `SYNC: ${syncRes.json.error}` : `SYNC: HTTP ${syncRes.status}`)
        }
        if (syncRes.json?.enqueued) {
          await waitForSyncCompletion()
        }
      }

      await loadData()
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 rounded bg-muted animate-pulse" />
                <div className="mt-2 h-3 w-40 rounded bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="h-9 w-80 max-w-full rounded bg-muted animate-pulse" />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-full rounded bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
        title="Gestión de Usuarios"
        description="Administra los usuarios del directorio LDAP"
      >
        <Button size="sm" className="gap-2" onClick={handleCreateUser}>
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </Header>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {kpis && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpis.totalUsers}</div>
                <p className="mt-1 text-xs text-muted-foreground">Registrados en LDAP</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios con grupos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpis.usersWithGroups}</div>
                <p className="mt-1 text-xs text-muted-foreground">Cobertura {kpis.coverage}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios sin grupos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpis.usersWithoutGroups}</div>
                <p className="mt-1 text-xs text-muted-foreground">Pendientes de asignación</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Promedio grupos/usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{kpis.avgGroupsPerUser}</div>
                <p className="mt-1 text-xs text-muted-foreground">Distribución actual</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar por usuario, nombre o email"
              className="pl-9"
            />
          </div>
        </div>
        <UserTable users={pageUsers} groups={groups} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        <PaginationBar currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        groups={groups}
        onSave={handleSaveUser}
      />
    </>
  )
}
