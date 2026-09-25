import type { PersonAddress } from "@/services/types";

// Utilitários compartilhados pela conversão formulário ↔ API do cadastro.

/**
 * criar: campos vazios ficam de fora do payload.
 * editar: campos vazios vão como null, para a API apagar o valor antigo.
 */
export type Modo = "criar" | "editar";

export interface EnderecoForm {
  cep: string;
  uf: string;
  /** Tipo do endereço (comercial/cobrança/entrega) — ainda não existe na API */
  tipo: string;
  bairro: string;
  pais: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
}

export function enderecoVazio(): EnderecoForm {
  return {
    cep: "",
    uf: "",
    tipo: "comercial",
    bairro: "",
    pais: "Brasil",
    cidade: "",
    logradouro: "",
    numero: "",
    complemento: "",
  };
}

export function enderecoParaForm(address: Partial<PersonAddress> | undefined): EnderecoForm {
  const vazio = enderecoVazio();
  if (!address) return vazio;
  return {
    ...vazio,
    cep: address.zip ?? "",
    uf: address.state ?? "",
    bairro: address.neighborhood ?? "",
    pais: address.country ?? vazio.pais,
    cidade: address.city ?? "",
    logradouro: address.street ?? "",
    numero: address.number ?? "",
    complemento: address.complement ?? "",
  };
}

export function formParaEndereco(
  e: EnderecoForm,
  modo: Modo = "criar"
): Partial<Record<keyof PersonAddress, string | null>> {
  return limpos(modo, {
    zip: apenasDigitos(e.cep),
    state: e.uf.trim().toUpperCase(),
    neighborhood: e.bairro,
    country: e.pais,
    city: e.cidade,
    street: e.logradouro,
    number: e.numero,
    complement: e.complemento,
  });
}

export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

/** Remove chaves com string vazia (após trim) ou undefined; faz trim no resto */
export function semVazios<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const saida: Record<string, unknown> = {};
  for (const [chave, valor] of Object.entries(obj)) {
    if (valor === undefined) continue;
    if (typeof valor === "string") {
      if (valor.trim() !== "") saida[chave] = valor.trim();
    } else {
      saida[chave] = valor;
    }
  }
  return saida as Partial<T>;
}

/** Trim nas strings; vazias saem (criar) ou viram null (editar); undefined sempre sai */
export function limpos<T extends Record<string, unknown>>(
  modo: Modo,
  obj: T
): { [K in keyof T]?: T[K] | null } {
  if (modo === "criar") return semVazios(obj);
  const saida: Record<string, unknown> = {};
  for (const [chave, valor] of Object.entries(obj)) {
    if (valor === undefined) continue;
    saida[chave] = typeof valor === "string" ? valor.trim() || null : valor;
  }
  return saida as { [K in keyof T]?: T[K] | null };
}

/** Número do campo; vazio sai (criar) ou vira null (editar) */
export function numeroNoModo(modo: Modo, valor: string): number | null | undefined {
  const numero = numeroOuUndefined(valor);
  return numero === undefined && modo === "editar" ? null : numero;
}

/** "1.500,50" → 1500.5; "" → undefined */
export function numeroOuUndefined(valor: string): number | undefined {
  const limpo = valor.trim();
  if (!limpo) return undefined;
  const normalizado = limpo.includes(",") ? limpo.replace(/\./g, "").replace(",", ".") : limpo;
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : undefined;
}

export function textoDeNumero(valor: number | null | undefined) {
  return valor === null || valor === undefined ? "" : String(valor);
}

export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
