import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";
import type { BaranetErrorBody } from "@/lib/server/baranet";

// Representantes de marca (tela 18) — não é o Tipo de Cadastro "Representante".
export async function GET(request: NextRequest) {
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);
  const qs = request.nextUrl.search;

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/representatives${qs}`);
  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: NextRequest) {
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);
  const body = await request.json().catch(() => ({}));

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/representatives`, {
    method: "POST",
    body,
  });

  if (!upstream.ok) {
    const error = await readJson<BaranetErrorBody>(upstream);
    return NextResponse.json(error ?? { message: `Erro ${upstream.status}` }, { status: upstream.status });
  }

  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
