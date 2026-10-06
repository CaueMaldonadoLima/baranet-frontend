"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Cadastro } from "../../_components/formulario-cadastro";

// /cadastro/<cliente|fornecedor>/<id>: alterar um cadastro existente, aberto
// pela lista. Os outros tipos ainda não são gravados na API.
export default function AlterarCadastroPage({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = use(params);
  if ((tipo !== "cliente" && tipo !== "fornecedor") || !/^\d+$/.test(id)) notFound();
  return <Cadastro tipoInicial={tipo} id={Number(id)} />;
}
