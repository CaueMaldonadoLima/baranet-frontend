import { describe, expect, it } from "vitest";
import type { CustomerDetail } from "@/services/types";
import { clienteParaForm, clienteVazio, formParaClienteWrite, validarCliente } from "./cliente-form";

const customerCompleto: CustomerDetail = {
  id: 3,
  personId: 7,
  name: "Maria Souza",
  document: "12345678909",
  status: "ativo",
  whatsapp: "(11) 98888-7777",
  customerType: "BOM",
  allowWithoutDocument: false,
  rg: "12.345.678-9",
  birthDate: "1990-05-20",
  gender: "feminino",
  maritalStatus: "casado",
  birthplace: "Campinas",
  commercialDdd: "11",
  commercialPhone: "3333-4444",
  extension: "12",
  isForeigner: false,
  foreignerStatus: null,
  rgIssueDate: "2008-01-10",
  rgIssuer: "SSP",
  rgState: "SP",
  nickname: "Mari",
  address: { zip: "13010000", state: "SP", city: "Campinas", street: "Rua A", number: "10", neighborhood: "Centro", complement: "ap 2", country: "Brasil", streetType: null },
  lastPurchase: "2026-08-01",
  registeredAt: "2025-01-02T10:00:00Z",
  updatedAt: "2026-09-01T12:00:00Z",
};

describe("clienteParaForm", () => {
  it("carrega os dados pessoais e o endereço do cliente", () => {
    const form = clienteParaForm(customerCompleto);
    expect(form.nome).toBe("Maria Souza");
    expect(form.documento).toBe("12345678909");
    expect(form.whatsapp).toBe("(11) 98888-7777");
    expect(form.tipoCliente).toBe("bom");
    expect(form.nascimento).toBe("1990-05-20");
    expect(form.ufRg).toBe("SP");
    expect(form.apelido).toBe("Mari");
    expect(form.endereco.cidade).toBe("Campinas");
    expect(form.endereco.complemento).toBe("ap 2");
  });

  it("traz as datas do sistema só para exibir", () => {
    const form = clienteParaForm(customerCompleto);
    expect(form.ultimaCompra).toBe("2026-08-01");
    expect(form.dataCadastro).toBe("2025-01-02");
    expect(form.atualizacao).toBe("2026-09-01");
  });

  it("marca menor sem CPF quando a API permite cadastro sem documento", () => {
    const form = clienteParaForm({ ...customerCompleto, allowWithoutDocument: true, document: null });
    expect(form.menorSemCpf).toBe(true);
    expect(form.documento).toBe("");
  });
});

describe("formParaClienteWrite", () => {
  it("volta ao payload da API (ida e volta)", () => {
    const write = formParaClienteWrite(clienteParaForm(customerCompleto));
    expect(write).toMatchObject({
      name: "Maria Souza",
      document: "12345678909",
      whatsapp: "(11) 98888-7777",
      customerType: "BOM",
      status: "ativo",
      allowWithoutDocument: false,
      rg: "12.345.678-9",
      birthDate: "1990-05-20",
      gender: "feminino",
      maritalStatus: "casado",
      birthplace: "Campinas",
      commercialDdd: "11",
      commercialPhone: "3333-4444",
      extension: "12",
      isForeigner: false,
      rgIssueDate: "2008-01-10",
      rgIssuer: "SSP",
      rgState: "SP",
      nickname: "Mari",
      country: "Brasil",
      city: "Campinas",
      state: "SP",
      address: { zip: "13010000", city: "Campinas", street: "Rua A", number: "10" },
    });
  });

  it("não manda documento de menor sem CPF", () => {
    const write = formParaClienteWrite({ ...clienteVazio(), nome: "Joãozinho", documento: "123", menorSemCpf: true });
    expect(write).not.toHaveProperty("document");
    expect(write.allowWithoutDocument).toBe(true);
  });

  it("só manda o documento de estrangeiro quando é estrangeiro", () => {
    const write = formParaClienteWrite({ ...clienteVazio(), nome: "X", documentoEstrangeiro: "RNE1", estrangeiro: false });
    expect(write).not.toHaveProperty("foreignerStatus");
  });

  it("tira a máscara do CPF", () => {
    const write = formParaClienteWrite({ ...clienteVazio(), nome: "X", documento: "123.456.789-09" });
    expect(write.document).toBe("12345678909");
  });
});

describe("validarCliente", () => {
  it("exige o nome", () => {
    expect(validarCliente(clienteVazio())).toBe("Informe o nome do cliente.");
    expect(validarCliente({ ...clienteVazio(), nome: "X" })).toBeNull();
  });
});

describe("formParaClienteWrite ao editar", () => {
  it("manda null nos campos apagados", () => {
    const write = formParaClienteWrite({ ...clienteParaForm(customerCompleto), apelido: "", rg: "" }, "editar");
    expect(write.nickname).toBeNull();
    expect(write.rg).toBeNull();
  });

  it("limpa o CPF ao marcar menor sem CPF", () => {
    const write = formParaClienteWrite({ ...clienteParaForm(customerCompleto), menorSemCpf: true }, "editar");
    expect(write.document).toBeNull();
    expect(write.allowWithoutDocument).toBe(true);
  });

  it("devolve os campos que o formulário não mostra (DDD, telefone, e-mail, redes sociais)", () => {
    const write = formParaClienteWrite(
      clienteParaForm({
        ...customerCompleto,
        ddd: "11",
        phone: "3333-0000",
        email: "maria@x.com",
        personType: "fisica",
        socialNetworks: { instagram: "@maria", facebook: null },
      }),
      "editar"
    );
    expect(write).toMatchObject({
      ddd: "11",
      phone: "3333-0000",
      email: "maria@x.com",
      personType: "fisica",
      socialNetworks: { instagram: "@maria" },
    });
  });
});
