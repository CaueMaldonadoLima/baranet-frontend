"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import { Cadastro, TIPOS_VISIVEIS, type TipoCadastro } from "../_components/formulario-cadastro";

// /cadastro/novo?tipo=<tipo>: cadastro novo, aberto pelo "Incluir novo" da lista.
// Representante oculto vai para o cadastro de marcas, onde ele é incluído.
export default function NovoCadastroPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = use(searchParams);
  const visivel = TIPOS_VISIVEIS.find((t) => t.value === tipo);
  if (!visivel && tipo === "representante") redirect("/cadastro/marcas/nova");
  const tipoInicial: TipoCadastro = visivel?.value ?? "cliente";
  return <Cadastro tipoInicial={tipoInicial} id={null} />;
}
