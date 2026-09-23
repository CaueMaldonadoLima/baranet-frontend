import { NextRequest, NextResponse } from "next/server";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const opticaId = resolveOpticaId(request.cookies.get(OPTICA_COOKIE)?.value);

  const upstream = await baranetFetch(`/v1/oticas/${opticaId}/people/${id}`);
  const data = await readJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
