import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, SESSION_COOKIE, OPTICA_COOKIE } from "@/lib/server/baranet";

export async function POST(request: NextRequest) {
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionValue) {
    // Best-effort: mesmo se o backend falhar, ainda derrubamos a sessão local.
    await baranetFetch("/v1/auth/logout", {
      method: "POST",
      cookie: `${SESSION_COOKIE}=${sessionValue}`,
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ message: "Logout OK" });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(OPTICA_COOKIE);
  return response;
}
