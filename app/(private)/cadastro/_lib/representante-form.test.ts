import { describe, expect, it } from "vitest";
import type { Person, Representative } from "@/services/types";
import {
  formParaRepresentativeWrite,
  pessoaParaRepresentante,
  representanteParaForm,
  representanteVazio,
  rotuloSegmentos,
  validarRepresentante,
  type RepresentanteForm,
} from "./representante-form";

const representante: Representative = {
  id: 4,
  code: 4,
  personId: 12,
  personType: "fisica",
  name: "Carlos Rep",
  document: "52998224725",
  whatsapp: "41999990000",
  phone: "41999990000",
  email: "carlos@rep.com.br",
  status: "ativo",
  state: "PR",
  city: "Curitiba",
  company: null,
  segments: [
    { slug: "armacoes", label: "Armações" },
    { slug: "lentes", label: "Lentes" },
  ],
  brandIds: [],
  active: true,
};

const preenchido = (patch: Partial<RepresentanteForm> = {}): RepresentanteForm => ({
  ...representanteVazio(),
  nome: "Carlos",
  segmentos: ["lentes"],
  ...patch,
});

describe("formParaRepresentativeWrite", () => {
  it("ao criar, manda só o preenchido, sem máscaras, e ativo", () => {
    const write = formParaRepresentativeWrite(
      preenchido({ documento: "529.982.247-25", whatsapp: "(41) 99999-0000", estado: "pr" })
    );
    expect(write).toEqual({
      name: "Carlos",
      document: "52998224725",
      whatsapp: "41999990000",
      state: "PR",
      segments: ["lentes"],
      active: true,
    });
  });

  it("reaproveita a pessoa encontrada pelo Código", () => {
    const write = formParaRepresentativeWrite(preenchido({ personId: 30 }));
    expect(write.personId).toBe(30);
  });

  it("ao editar, campos apagados vão como null e não manda personId", () => {
    const form = representanteParaForm(representante);
    const write = formParaRepresentativeWrite({ ...form, cidade: "", email: "" }, "editar");
    expect(write.city).toBeNull();
    expect(write.email).toBeNull();
    expect(write).not.toHaveProperty("personId");
    expect(write.segments).toEqual(["armacoes", "lentes"]);
  });
});

describe("pessoaParaRepresentante", () => {
  it("preenche com os dados da pessoa e prefere o endereço", () => {
    const pessoa = {
      id: 30,
      code: 30,
      name: "Ana",
      document: null,
      whatsapp: null,
      phone: "4133330000",
      email: null,
      city: "Antiga",
      state: "SP",
      address: { city: "Londrina", state: "PR" },
    } as unknown as Person;
    expect(pessoaParaRepresentante(pessoa)).toMatchObject({
      personId: 30,
      codigo: "30",
      nome: "Ana",
      whatsapp: "4133330000",
      cidade: "Londrina",
      estado: "PR",
    });
  });
});

describe("validarRepresentante", () => {
  it("exige nome (sem pessoa), e-mail válido e segmento", () => {
    expect(validarRepresentante(preenchido({ nome: "" }))).toBe("Informe o nome do representante.");
    expect(validarRepresentante(preenchido({ email: "x" }))).toBe("Informe um e-mail válido.");
    expect(validarRepresentante(preenchido({ segmentos: [] }))).toBe("Selecione ao menos um segmento.");
    expect(validarRepresentante(preenchido())).toBeNull();
  });
});

describe("rotuloSegmentos", () => {
  it("junta os rótulos da API", () => {
    expect(rotuloSegmentos(representante)).toBe("Armações, Lentes");
  });
});
