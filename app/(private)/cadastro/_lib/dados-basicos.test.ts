import { describe, expect, it } from "vitest";
import { clienteVazio } from "./cliente-form";
import { enderecoVazio } from "./comum";
import {
  basicosDoCliente,
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
