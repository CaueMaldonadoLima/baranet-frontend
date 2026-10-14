"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import {
  CADASTRO_DE_MARCA,
  Cadastro,
  REPRESENTANTE_SO_NA_MARCA,
  TIPOS_CADASTRO,
  type TipoCadastro,
} from "../_components/formulario-cadastro";

// /cadastro/novo?tipo=<tipo>: cadastro novo, aberto pelo "Incluir novo" da lista.
// Representante vai para o cadastro de marcas, onde ele é incluído.
export default function NovoCadastroPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = use(searchParams);
  if (tipo === "representante" && REPRESENTANTE_SO_NA_MARCA) redirect(CADASTRO_DE_MARCA);
  const tipoInicial: TipoCadastro = TIPOS_CADASTRO.find((t) => t.value === tipo)?.value ?? "cliente";
  return <Cadastro tipoInicial={tipoInicial} id={null} />;
}
