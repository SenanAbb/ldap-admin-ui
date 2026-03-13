import { NextResponse } from "next/server";

import { resolveAuthWithLdapFallback } from "@/lib/auth";
import { getSyncRedisUrl } from "@/lib/sync-queue";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await resolveAuthWithLdapFallback(request.headers);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { createClient } = await import("redis");
  const client = createClient({ url: getSyncRedisUrl() });

  try {
    await client.connect();
    const raw = await client.get(process.env.SYNC_KEY_STATUS ?? "sync:status");
    const parsed = raw ? JSON.parse(raw) : null;
    return NextResponse.json({ status: parsed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to read sync status" },
      { status: 500 },
    );
  } finally {
    try {
      await client.disconnect();
    } catch {
      // ignore
    }
  }
}
