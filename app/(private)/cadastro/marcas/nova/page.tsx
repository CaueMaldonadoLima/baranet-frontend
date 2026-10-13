"use client";

import { use } from "react";
import { FormularioMarca } from "../_components/formulario-marca";

// /cadastro/marcas/nova: cadastrar marca. Com ?fornecedor=<supplierId> (vindo
// da aba Marcas da ficha), a marca criada já é vinculada a esse fornecedor.
export default function NovaMarcaPage({ searchParams }: { searchParams: Promise<{ fornecedor?: string }> }) {
  const { fornecedor } = use(searchParams);
  const supplierId = fornecedor && /^\d+$/.test(fornecedor) ? Number(fornecedor) : null;
  return <FormularioMarca marcaId={null} supplierId={supplierId} />;
}
