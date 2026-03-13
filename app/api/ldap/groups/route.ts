import { NextResponse } from "next/server";

import { fetchGroups } from "@/lib/ldap";
import { resolveAuthWithLdapFallback } from "@/lib/auth";
import { isLdapUnavailableError } from "@/lib/ldap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await resolveAuthWithLdapFallback(request.headers);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const groups = await fetchGroups();
    return NextResponse.json({ groups });
  } catch (error) {
    if (isLdapUnavailableError(error)) {
      return NextResponse.json({ error: "ldap_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
