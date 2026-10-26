import { describe, expect, it } from "vitest";
import { clienteVazio } from "./cliente-form";
import { enderecoVazio } from "./comum";
import type { Person } from "@/services/types";
import {
  basicosDaPessoa,
  basicosDoCliente,
  idDoPapel,
  pessoaComDocumento,
  basicosDoFornecedor,
  clienteComBasicos,
  fornecedorComBasicos,
  funcionarioComBasicos,
  pessoaDoDocumento,
} from "./dados-basicos";
import { fornecedorVazio } from "./fornecedor-form";
import { funcionarioVazio } from "./funcionario-form";

describe("pessoaDoDocumento", () => {
  it("reconhece CPF e CNPJ, com ou sem máscara", () => {
    expect(pessoaDoDocumento("529.982.247-25")).toBe("fisica");
    expect(pessoaDoDocumento("12345678901234")).toBe("juridica");
    expect(pessoaDoDocumento("123")).toBeNull();
  });
});

describe("troca de tipo", () => {
  const fornecedor = {
    ...fornecedorVazio(),
    documento: "12345678901234",
    ddd: "11",
    telefone: "67981371568",
    nomeFantasia: "nome fantasia",
    razaoSocial: "razao social",
    endereco: { ...enderecoVazio(), cidade: "Curitiba", uf: "PR" },
  };

  it("fornecedor → funcionário leva documento, nome, telefone e endereço", () => {
    const f = funcionarioComBasicos(funcionarioVazio(), basicosDoFornecedor(fornecedor));
    expect(f).toMatchObject({
      documento: "12345678901234",
      nome: "razao social",
      ddd: "11",
      telefone: "67981371568",
    });
    expect(f.endereco.cidade).toBe("Curitiba");
  });

  it("fornecedor → cliente junta DDD e telefone no Whatsapp", () => {
    const c = clienteComBasicos(clienteVazio(), basicosDoFornecedor({ ...fornecedor, telefone: "981371568" }));
    expect(c.whatsapp).toBe("11981371568");
    expect(c.nome).toBe("razao social");
  });

  it("cliente → fornecedor separa o DDD do Whatsapp", () => {
    const cliente = { ...clienteVazio(), nome: "Ana", whatsapp: "(67) 98137-1568" };
    const f = fornecedorComBasicos(fornecedorVazio(), basicosDoCliente(cliente));
    expect(f).toMatchObject({ razaoSocial: "Ana", ddd: "67", telefone: "981371568" });
  });

  it("campo vazio na origem não apaga o que o destino já tinha", () => {
    const destino = { ...funcionarioVazio(), nome: "Já digitado", email: "a@b.com" };
    const f = funcionarioComBasicos(destino, basicosDoFornecedor(fornecedorVazio()));
    expect(f.nome).toBe("Já digitado");
    expect(f.email).toBe("a@b.com");
  });
});

describe("reaproveitamento", () => {
  const pessoa = {
    id: 12,
    code: 12,
    name: "Carlos",
    document: "52998224725",
    ddd: "41",
    phone: "999990000",
    whatsapp: null,
    email: "c@x.com",
    status: "ativo",
    address: { city: "Curitiba", state: "PR" },
    customerId: 10,
    supplierId: null,
    employeeId: null,
  } as unknown as Person;

  it("só aceita o documento inteiro, com ou sem máscara", () => {
    const outra = { ...pessoa, id: 13, document: "52998224700" } as Person;
    expect(pessoaComDocumento([outra, pessoa], "529.982.247-25")?.id).toBe(12);
    expect(pessoaComDocumento([pessoa], "5299822")).toBeNull();
  });

  it("diz se a pessoa já tem o papel do tipo", () => {
    expect(idDoPapel(pessoa, "cliente")).toBe(10);
    expect(idDoPapel(pessoa, "fornecedor")).toBeNull();
  });

  it("preenche o formulário com os dados da pessoa", () => {
    const f = funcionarioComBasicos(funcionarioVazio(), basicosDaPessoa(pessoa));
    expect(f).toMatchObject({ nome: "Carlos", documento: "52998224725", ddd: "41", telefone: "999990000", email: "c@x.com" });
    expect(f.endereco.cidade).toBe("Curitiba");
  });
});
