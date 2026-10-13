import { describe, expect, it } from "vitest";
import type { Employee } from "@/services/types";
import {
  formParaFuncionarioWrite,
  funcionarioParaForm,
  funcionarioVazio,
  validarFuncionario,
  type FuncionarioForm,
} from "./funcionario-form";

const employee: Employee = {
  id: 12,
  personId: 30,
  personType: "fisica",
  name: "Ana Lima",
  document: "52998224725",
  ddd: "41",
  phone: "99999-0000",
  role: "vendedor",
  email: "ana@otica.com.br",
  store: "Loja Centro",
  storeId: "3",
  status: "ativo",
  commission: 2.5,
  sales: 0,
  hasPassword: true,
  address: { zip: "80000000", city: "Curitiba", state: "PR", street: "Rua B", number: "5" },
};

const preenchido = (patch: Partial<FuncionarioForm> = {}): FuncionarioForm => ({
  ...funcionarioVazio(),
  nome: "Ana",
  email: "ana@otica.com.br",
  funcao: "caixa",
  ...patch,
});

describe("funcionarioVazio", () => {
  it("começa como pessoa física, sem senha manual", () => {
    const form = funcionarioVazio();
    expect(form.pessoa).toBe("fisica");
    expect(form.senhaManual).toBe(false);
  });
});

describe("funcionarioParaForm", () => {
  it("carrega os dados do funcionário", () => {
    const form = funcionarioParaForm(employee);
    expect(form).toMatchObject({
      nome: "Ana Lima",
      email: "ana@otica.com.br",
      funcao: "vendedor",
      documento: "52998224725",
      comissao: "2.5",
      lojaId: "3",
      temSenha: true,
    });
    expect(form.endereco.cidade).toBe("Curitiba");
  });
});

describe("formParaFuncionarioWrite", () => {
  it("volta ao payload da API (ida e volta)", () => {
    const write = formParaFuncionarioWrite(funcionarioParaForm(employee), "editar");
    expect(write).toMatchObject({
      name: "Ana Lima",
      email: "ana@otica.com.br",
      role: "vendedor",
      personType: "fisica",
      document: "52998224725",
      ddd: "41",
      phone: "99999-0000",
      status: "ativo",
      commission: 2.5,
      storeId: 3,
      address: { zip: "80000000", city: "Curitiba", state: "PR" },
    });
  });

  it("ao criar, deixa de fora o que está vazio e não manda senha", () => {
    const write = formParaFuncionarioWrite(preenchido());
    expect(write).not.toHaveProperty("document");
    expect(write).not.toHaveProperty("commission");
    expect(write).not.toHaveProperty("storeId");
    expect(write).not.toHaveProperty("password");
    expect(write.role).toBe("caixa");
  });

  it("tira a máscara do CPF e aceita comissão com vírgula", () => {
    const write = formParaFuncionarioWrite(preenchido({ documento: "529.982.247-25", comissao: "1,5" }));
    expect(write.document).toBe("52998224725");
    expect(write.commission).toBe(1.5);
  });

  it("manda a senha só quando definida manualmente", () => {
    const comSenha = formParaFuncionarioWrite(
      preenchido({ senhaManual: true, senha: "segredo1", confirmacaoSenha: "segredo1" })
    );
    expect(comSenha).toMatchObject({ password: "segredo1", password_confirmation: "segredo1" });

    const desmarcada = formParaFuncionarioWrite(preenchido({ senhaManual: false, senha: "segredo1" }));
    expect(desmarcada).not.toHaveProperty("password");
  });

  it("ao editar, loja e comissão apagadas vão como null", () => {
    const form = funcionarioParaForm(employee);
    const write = formParaFuncionarioWrite({ ...form, lojaId: "", comissao: "" }, "editar");
    expect(write.storeId).toBeNull();
    expect(write.commission).toBeNull();
    expect(write).not.toHaveProperty("password");
  });
});

describe("validarFuncionario", () => {
  it("exige nome, e-mail válido e função", () => {
    expect(validarFuncionario(funcionarioVazio())).toBe("Informe o nome do funcionário.");
    expect(validarFuncionario(preenchido({ email: "" }))).toBe("Informe o e-mail do funcionário.");
    expect(validarFuncionario(preenchido({ email: "ana" }))).toBe("Informe um e-mail válido.");
    expect(validarFuncionario(preenchido({ funcao: "" }))).toBe("Selecione a função do funcionário.");
    expect(validarFuncionario(preenchido())).toBeNull();
  });

  it("confere a senha quando definida manualmente", () => {
    expect(validarFuncionario(preenchido({ senhaManual: true }))).toMatch(/Informe a senha/);
    expect(
      validarFuncionario(preenchido({ senhaManual: true, senha: "abc12345", confirmacaoSenha: "outra" }))
    ).toBe("As senhas não conferem.");
  });
});
