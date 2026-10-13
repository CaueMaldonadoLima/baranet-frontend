import type {
  Person,
  Representative,
  RepresentativeSegmentSlug,
  RepresentativeWrite,
} from "@/services/types";
import { apenasDigitos, emailValido, limpos, type Modo } from "./comum";

// Inclusão do representante na aba Representantes da marca (tela 18) e a
// conversão de/para o payload de /representatives.

export const SEGMENTOS_REPRESENTANTE: { value: RepresentativeSegmentSlug; label: string }[] = [
  { value: "armacoes", label: "Armações" },
  { value: "lentes", label: "Lentes" },
  { value: "lentes_de_contato", label: "Lentes de contato" },
  { value: "maquinas_e_equipamentos", label: "Máquinas e equipamentos" },
  { value: "acessorios", label: "Acessórios" },
];

export interface RepresentanteForm {
  /** Pessoa já cadastrada, encontrada pelo Código: o POST a reaproveita */
  personId: number | null;
  codigo: string;
  nome: string;
  documento: string;
  whatsapp: string;
  email: string;
  segmentos: RepresentativeSegmentSlug[];
  estado: string;
  cidade: string;
}

export function representanteVazio(): RepresentanteForm {
  return {
    personId: null,
    codigo: "",
    nome: "",
    documento: "",
    whatsapp: "",
    email: "",
    segmentos: [],
    estado: "",
    cidade: "",
  };
}

/** Pessoa encontrada pelo Código que ainda não é representante */
export function pessoaParaRepresentante(p: Person): RepresentanteForm {
  return {
    ...representanteVazio(),
    personId: p.id,
    codigo: String(p.code),
    nome: p.name,
    documento: p.document ?? "",
    whatsapp: p.whatsapp ?? p.phone ?? "",
    email: p.email ?? "",
    estado: p.address?.state ?? p.state ?? "",
    cidade: p.address?.city ?? p.city ?? "",
  };
}

export function representanteParaForm(r: Representative): RepresentanteForm {
  return {
    personId: r.personId,
    codigo: String(r.code),
    nome: r.name,
    documento: r.document ?? "",
    whatsapp: r.whatsapp ?? r.phone ?? "",
    email: r.email ?? "",
    segmentos: r.segments.map((s) => s.slug),
    estado: r.state ?? "",
    cidade: r.city ?? "",
  };
}

export function formParaRepresentativeWrite(f: RepresentanteForm, modo: Modo = "criar"): RepresentativeWrite {
  const write: RepresentativeWrite = {
    ...limpos(modo, {
      name: f.nome,
      document: apenasDigitos(f.documento),
      whatsapp: apenasDigitos(f.whatsapp),
      email: f.email,
      state: f.estado.trim().toUpperCase(),
      city: f.cidade,
    }),
    segments: f.segmentos,
  };
  if (modo === "criar") {
    write.active = true;
    if (f.personId !== null) write.personId = f.personId;
  }
  return write;
}

export function validarRepresentante(f: RepresentanteForm): string | null {
  if (!f.nome.trim() && f.personId === null) return "Informe o nome do representante.";
  if (f.email.trim() && !emailValido(f.email)) return "Informe um e-mail válido.";
  if (f.segmentos.length === 0) return "Selecione ao menos um segmento.";
  return null;
}

export function rotuloSegmentos(r: Representative) {
  return r.segments.map((s) => s.label).join(", ");
}
