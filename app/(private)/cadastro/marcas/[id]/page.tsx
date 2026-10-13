"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { FormularioMarca } from "../_components/formulario-marca";

// /cadastro/marcas/<id>: alterar uma marca, aberta pela lista de marcas.
export default function AlterarMarcaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  if (!/^\d+$/.test(id)) notFound();
  return <FormularioMarca key={id} marcaId={Number(id)} supplierId={null} />;
}
