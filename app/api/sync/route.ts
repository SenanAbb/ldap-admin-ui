import { NextResponse } from "next/server";

import { resolveAuthWithLdapFallback } from "@/lib/auth";
import {
  enqueueRangerUserResync,
  enqueueSync,
  enqueueSyncFromGroupCn,
  enqueueSyncFromGroupCnWithOptions,
  inferTargetsFromGroupCn,
  markHueGroupForSync,
} from "@/lib/sync-queue";

type SyncTarget = "ambari" | "ranger" | "hue";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await resolveAuthWithLdapFallback(request.headers);
  console.log("/api/sync request", {
    authorized: auth.isAuthorized,
    user: auth.user,
    groupsCount: auth.groups?.length ?? 0,
  });
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({} as any));
    console.log("/api/sync body", body);
    const groupCn = typeof body?.groupCn === "string" ? body.groupCn : undefined;
    const groupCnsRaw = Array.isArray(body?.groupCns) ? body.groupCns : undefined;
    const groupCns = groupCnsRaw
      ? groupCnsRaw
          .filter((v: unknown): v is string => typeof v === "string")
          .map((v: string) => v.trim())
          .filter(Boolean)
      : [];
    const rangerUsername = typeof body?.rangerUsername === "string" ? body.rangerUsername : undefined;
    const force = !!body?.force;

    if (rangerUsername) {
      const result = await enqueueRangerUserResync(rangerUsername, { force });
      console.log("/api/sync enqueue ranger user", { rangerUsername, force, result });
      return NextResponse.json({ success: true, ...result, targets: ["ranger"], rangerUsername, force });
    }

    if (groupCn) {
      const result = force
        ? await enqueueSyncFromGroupCnWithOptions(groupCn, { force: true })
        : await enqueueSyncFromGroupCn(groupCn);
      console.log("/api/sync enqueue from group", { groupCn, force, result });
      return NextResponse.json({ success: true, ...result, targets: "from_group", force });
    }

    if (groupCns.length) {
      const targets = new Set<SyncTarget>();
      for (const cn of groupCns) {
        const inferred = inferTargetsFromGroupCn(cn);
        for (const t of inferred) targets.add(t);
        if (cn === "hue_admin" || cn === "hue_user" || cn.startsWith("hue_")) {
          await markHueGroupForSync(cn);
        }
      }

      const uniqueTargets = Array.from(targets);
      if (!uniqueTargets.length) {
        return NextResponse.json({ success: true, enqueued: false, targets: [] });
      }

      const result = await enqueueSync(uniqueTargets, { force });
      console.log("/api/sync enqueue from groups", { groupCnsCount: groupCns.length, targets: uniqueTargets, force, result });
      return NextResponse.json({ success: true, ...result, targets: uniqueTargets, groupCnsCount: groupCns.length, force });
    }

    const targetsRaw = Array.isArray(body?.targets) ? body.targets : [];
    const targets = targetsRaw.filter(
      (t: unknown): t is SyncTarget => t === "ambari" || t === "ranger" || t === "hue",
    );

    if (!targets.length) {
      return NextResponse.json(
        { error: "targets or groupCn is required" },
        { status: 400 },
      );
    }

    const result = await enqueueSync(targets, { force });
    console.log("/api/sync enqueue targets", { targets, force, result });
    return NextResponse.json({ success: true, ...result, targets });
  } catch (error: any) {
    console.error("/api/sync error", error);
    return NextResponse.json(
      { error: error?.message || "Failed to enqueue sync" },
      { status: 500 },
    );
  }
}
