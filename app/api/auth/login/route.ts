import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, findCookie, parseSetCookies, readJson, SESSION_COOKIE, OPTICA_COOKIE } from "@/lib/server/baranet";
import type { BaranetErrorBody } from "@/lib/server/baranet";

interface AuthMe {
  id: number;
  name: string;
  email: string;
  role: string;
  optica?: { id: number; name: string };
}

const isProd = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "E-mail e senha são obrigatórios." }, { status: 422 });
  }

  const upstream = await baranetFetch("/v1/auth/login", {
    method: "POST",
    body: { email: body.email, password: body.password, opticaId: body.opticaId },
  });

  if (!upstream.ok) {
    const error = await readJson<BaranetErrorBody>(upstream);
    return NextResponse.json(error ?? { message: `Erro ${upstream.status}` }, { status: upstream.status });
  }

  const data = await readJson<AuthMe>(upstream);
  const response = NextResponse.json(data ?? {});

  const sessionValue = findCookie(parseSetCookies(upstream), SESSION_COOKIE);
  if (sessionValue) {
    response.cookies.set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });
  }

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
