"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Cadastro } from "../../_components/formulario-cadastro";

// /cadastro/<cliente|fornecedor|funcionario>/<id>: alterar um cadastro
// existente, aberto pela lista. O id é o do papel (no funcionário, o de
// optica_users), não o da pessoa. Representante ainda não é gravado na API.
export default function AlterarCadastroPage({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = use(params);
  if ((tipo !== "cliente" && tipo !== "fornecedor" && tipo !== "funcionario") || !/^\d+$/.test(id)) notFound();
  return <Cadastro tipoInicial={tipo} id={Number(id)} />;
}
