import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";

// Lojas da ótica ("Cadastrar quem pode usar o serviço" do fornecedor). Só leitura.
export async function GET(request: NextRequest) {
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);
  const qs = request.nextUrl.search;

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/stores${qs}`);
  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
