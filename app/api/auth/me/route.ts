import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, SESSION_COOKIE, OPTICA_COOKIE } from "@/lib/server/baranet";
import type { BaranetErrorBody } from "@/lib/server/baranet";

interface AuthMe {
  id: number;
  name: string;
  email: string;
  role: string;
  optica?: { id: number; name: string };
}

const isProd = process.env.NODE_ENV === "production";

export async function GET(request: NextRequest) {
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionValue) {
    return NextResponse.json({ message: "Sessão ausente." }, { status: 401 });
  }

  const upstream = await baranetFetch("/v1/auth/me", {
    cookie: `${SESSION_COOKIE}=${sessionValue}`,
  });

  if (!upstream.ok) {
    const error = await readJson<BaranetErrorBody>(upstream);
    const response = NextResponse.json(error ?? { message: `Erro ${upstream.status}` }, { status: upstream.status });
    if (upstream.status === 401) {
      response.cookies.delete(SESSION_COOKIE);
      response.cookies.delete(OPTICA_COOKIE);
    }
    return response;
  }

  const data = await readJson<AuthMe>(upstream);
  const response = NextResponse.json(data ?? {});

  if (data?.optica?.id !== undefined) {
    response.cookies.set(OPTICA_COOKIE, String(data.optica.id), {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
