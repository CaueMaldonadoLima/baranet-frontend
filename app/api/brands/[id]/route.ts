import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";
import type { BaranetErrorBody } from "@/lib/server/baranet";

// Marca (telas 17 e 18): carregar e alterar.
type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/brands/${id}`);
  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);
  const body = await request.json().catch(() => ({}));

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/brands/${id}`, {
    method: "PUT",
    body,
  });

  if (!upstream.ok) {
    const error = await readJson<BaranetErrorBody>(upstream);
    return NextResponse.json(error ?? { message: `Erro ${upstream.status}` }, { status: upstream.status });
  }

  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
