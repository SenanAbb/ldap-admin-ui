import { NextResponse } from "next/server";

import { resolveAuthWithLdapFallback } from "@/lib/auth";
import { fetchKpis, isLdapUnavailableError } from "@/lib/ldap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await resolveAuthWithLdapFallback(request.headers);
  if (!auth.isAuthorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const kpis = await fetchKpis();
    return NextResponse.json({ kpis });
  } catch (error) {
    if (isLdapUnavailableError(error)) {
      return NextResponse.json({ error: "ldap_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 });
  }
}
