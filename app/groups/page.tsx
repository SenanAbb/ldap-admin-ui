"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/admin/header"
import { GroupCard } from "@/components/admin/groups/group-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, List } from "lucide-react"
import type { LDAPGroup, LDAPUser } from "@/lib/types"
import { cn } from "@/lib/utils"

type UsersApiUser = {
  dn: string
  uid: string
  cn?: string
  givenName?: string
  sn?: string
  mail?: string
}

type GroupsApiGroup = {
  dn: string
  cn: string
  description?: string
  members: string[]
}

export default function GroupsPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<LDAPUser[]>([])
  const [groups, setGroups] = useState<LDAPGroup[]>([])
  const [kpis, setKpis] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [serviceFilter, setServiceFilter] = useState<
    "all" | "ambari" | "ranger" | "hue" | "zeppelin" | "grafana" | "openmd" | "airflow" | "other"
  >("all")

  const groupService = (
    cnValue: string,
  ): "ambari" | "ranger" | "hue" | "zeppelin" | "grafana" | "openmd" | "airflow" | "other" => {
    const cn = (cnValue || "").toLowerCase()
    if (cn.startsWith("ambari_")) return "ambari"
    if (cn.startsWith("ranger_")) return "ranger"
    if (cn.startsWith("hue") || cn.startsWith("hue_")) return "hue"
    if (cn.startsWith("zeppelin_")) return "zeppelin"
    if (cn.startsWith("grafana_")) return "grafana"
    if (cn.startsWith("openmd_")) return "openmd"
    if (cn.startsWith("airflow_")) return "airflow"
    return "other"
  }

  const serviceLabel: Record<ReturnType<typeof groupService>, string> = {
    ambari: "Ambari",
    ranger: "Ranger",
    hue: "Hue",
    zeppelin: "Zeppelin",
    grafana: "Grafana",
    openmd: "OpenMD",
    airflow: "Airflow",
    other: "Otros",
  }

  const serviceOrder: Array<ReturnType<typeof groupService>> = [
    "ambari",
    "ranger",
    "hue",
    "zeppelin",
    "grafana",
    "openmd",
    "airflow",
    "other",
  ]

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

      const mappedUsers: LDAPUser[] = apiUsers.map((u) => ({
        dn: u.dn,
        uid: u.uid,
        cn: u.cn || u.uid,
        sn: u.sn || "",
        givenName: u.givenName || "",
        mail: u.mail,
        memberOf: [],
        enabled: true,
        createdAt: undefined,
        lastLogin: undefined,
      }))

      const mappedGroups: LDAPGroup[] = apiGroups.map((g) => ({
        dn: g.dn,
        cn: g.cn,
        description: g.description,
        members: g.members,
        createdAt: undefined,
      }))

      setUsers(mappedUsers)
      setGroups(mappedGroups)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const layoutClassName = useMemo(() => {
    return cn(
      "gap-4",
      viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col",
    )
  }, [viewMode])

  const filteredGroups = useMemo(() => {
    if (serviceFilter === "all") return groups
    return groups.filter((g) => groupService(g.cn) === serviceFilter)
  }, [groups, serviceFilter])

  const groupedGroups = useMemo(() => {
    const out: Record<ReturnType<typeof groupService>, LDAPGroup[]> = {
      ambari: [],
      ranger: [],
      hue: [],
      zeppelin: [],
      grafana: [],
      openmd: [],
      airflow: [],
      other: [],
    }
    for (const g of filteredGroups) {
      out[groupService(g.cn)].push(g)
    }
    for (const k of Object.keys(out) as Array<keyof typeof out>) {
      out[k].sort((a, b) => a.cn.localeCompare(b.cn))
    }
    return out
  }, [filteredGroups])

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
          <div className="h-9 w-[640px] max-w-full rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                <div className="h-3 w-10 rounded bg-muted animate-pulse" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="h-28 rounded-xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Header title="Gestión de Grupos" description="Administra los grupos y permisos del directorio LDAP">
        <div className="flex items-center rounded-lg border border-border p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 w-7 p-0", viewMode === "grid" && "bg-secondary")}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Vista de cuadrícula</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 w-7 p-0", viewMode === "list" && "bg-secondary")}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Vista de lista</span>
          </Button>
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-8">
          {kpis && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Grupos totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{kpis.totalGroups}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Incluye todas las tipologías</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Grupos vacíos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{kpis.emptyGroups}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Sin miembros asignados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Miembros únicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{kpis.uniqueMembers}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Usuarios con al menos un grupo</p>
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
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={serviceFilter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setServiceFilter("all")}
              >
                Todos
              </Button>
              {serviceOrder.map((svc) => (
                <Button
                  key={svc}
                  variant={serviceFilter === svc ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setServiceFilter(svc)}
                >
                  {serviceLabel[svc]}
                </Button>
              ))}
            </div>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <p className="text-sm font-medium text-foreground">No hay grupos para este filtro</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prueba con otro servicio o vuelve a "Todos".
              </p>
            </div>
          ) : (
            serviceOrder.map((svc) => {
              const svcGroups = groupedGroups[svc]
              if (svcGroups.length === 0) return null
              return (
                <section key={svc} className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-sm font-semibold text-foreground">{serviceLabel[svc]}</h2>
                    <span className="text-xs text-muted-foreground">{svcGroups.length}</span>
                  </div>
                  <div className={layoutClassName}>
                    {svcGroups.map((group) => (
                      <GroupCard key={group.cn} group={group} users={users} viewMode={viewMode} />
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
