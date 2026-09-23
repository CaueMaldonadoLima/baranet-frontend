import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";

// Cadastro unificado (Pessoa). Só leitura: a criação acontece pelos papéis
// (POST /customers, /suppliers, ...), que aceitam personId.
export async function GET(request: NextRequest) {
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);
  const qs = request.nextUrl.search;

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/people${qs}`);
  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
