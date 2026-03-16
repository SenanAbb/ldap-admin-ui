import { NextResponse } from "next/server";

import { resolveAuthWithLdapFallback } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type JsonPatchOp = {
  op: "replace" | "add" | "remove";
  path: string;
  value?: any;
};

const OPENMETADATA_API_URL = process.env.OPENMETADATA_API_URL ?? "";
const OPENMETADATA_BOT_TOKEN = process.env.OPENMETADATA_BOT_TOKEN ?? "";

function requireEnv(name: string, value: string): string {
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function mapOpenmdGroupsToRoleNames(openmdGroupCns: string[]): string[] {
  const groups = new Set(openmdGroupCns.map((g) => (g ?? "").trim().toLowerCase()).filter(Boolean));
  const roleNames: string[] = [];

  if (groups.has("openmd_admin")) roleNames.push("Admin");
  if (groups.has("openmd_data_steward")) roleNames.push("DataSteward");
  if (groups.has("openmd_data_consumer")) roleNames.push("DataConsumer");

  return roleNames;
}

async function omFetch(path: string, init: RequestInit = {}) {
  const base = requireEnv("OPENMETADATA_API_URL", OPENMETADATA_API_URL);
  const token = requireEnv("OPENMETADATA_BOT_TOKEN", OPENMETADATA_BOT_TOKEN);

  const url = joinUrl(base, path);
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  } catch (error: any) {
    const meta = {
      message: String(error?.message ?? error),
      name: String(error?.name ?? ""),
      code: String(error?.code ?? ""),
      cause: error?.cause
        ? {
            message: String(error.cause?.message ?? error.cause),
            name: String(error.cause?.name ?? ""),
            code: String(error.cause?.code ?? ""),
          }
        : undefined,
    };
    const e = new Error(`OpenMetadata fetch failed: ${meta.message}`);
    // @ts-ignore
    e.meta = meta;
    throw e;
  }
}

async function getUserByName(username: string): Promise<any> {
  const r = await omFetch(`/api/v1/users/name/${encodeURIComponent(username)}?fields=roles`);
  if (!r.ok) {
    throw new Error(r.json?.message || `OpenMetadata: failed to read user ${username} (HTTP ${r.status})`);
  }
  return r.json;
}

async function getRoleByName(roleName: string): Promise<any> {
  const r = await omFetch(`/api/v1/roles/name/${encodeURIComponent(roleName)}`);
  if (!r.ok) {
    throw new Error(r.json?.message || `OpenMetadata: failed to read role ${roleName} (HTTP ${r.status})`);
  }
  return r.json;
}

function toEntityRef(entity: any) {
  return {
    id: entity?.id,
    type: entity?.type ?? entity?.entityType ?? "role",
    name: entity?.name,
    fullyQualifiedName: entity?.fullyQualifiedName,
    description: entity?.description,
    displayName: entity?.displayName,
    href: entity?.href,
  };
}

export async function POST(request: Request) {
  const auth = await resolveAuthWithLdapFallback(request.headers);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({} as any));
    const uid = typeof body?.uid === "string" ? body.uid.trim() : "";
    const openmdGroupCnsRaw = Array.isArray(body?.openmdGroupCns) ? body.openmdGroupCns : [];
    const openmdGroupCns = openmdGroupCnsRaw
      .filter((v: unknown): v is string => typeof v === "string")
      .map((v: string) => v.trim())
      .filter(Boolean);

    if (!uid) {
      return NextResponse.json({ error: "uid_required" }, { status: 400 });
    }

    const desiredRoleNames = mapOpenmdGroupsToRoleNames(openmdGroupCns);

    const user = await getUserByName(uid);
    const userId = user?.id;
    if (!userId) {
      throw new Error(`OpenMetadata: user has no id (${uid})`);
    }

    const desiredRoles = [] as any[];
    for (const roleName of desiredRoleNames) {
      const role = await getRoleByName(roleName);
      desiredRoles.push(toEntityRef(role));
    }

    const patch: JsonPatchOp[] = [{ op: "replace", path: "/roles", value: desiredRoles }];

    const patchRes = await omFetch(`/api/v1/users/${encodeURIComponent(String(userId))}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(patch),
    });

    if (!patchRes.ok) {
      throw new Error(
        patchRes.json?.message || patchRes.json?.error || `OpenMetadata: PATCH user failed (HTTP ${patchRes.status})`,
      );
    }

    return NextResponse.json({ success: true, uid, desiredRoleNames });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "openmetadata_reconcile_failed",
        meta: error?.meta,
      },
      { status: 500 },
    );
  }
}
