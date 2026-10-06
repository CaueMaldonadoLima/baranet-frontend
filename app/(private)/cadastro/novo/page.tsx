"use client";

import { use } from "react";
import { Cadastro, ehTipo } from "../_components/formulario-cadastro";

// /cadastro/novo?tipo=<tipo>: cadastro novo, aberto pelo "Incluir novo" da lista.
export default function NovoCadastroPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = use(searchParams);
  return <Cadastro tipoInicial={ehTipo(tipo) ? tipo : "cliente"} id={null} />;
}
