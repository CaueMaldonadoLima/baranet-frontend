"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "entrar" | "criar";

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

export default function ContaLoginPage() {
  const [tab, setTab] = React.useState<Tab>("entrar");

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);

  const [regNome, setRegNome] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regCpf, setRegCpf] = React.useState("");
  const [regTelefone, setRegTelefone] = React.useState("");
  const [regSenha, setRegSenha] = React.useState("");
  const [regConfirmarSenha, setRegConfirmarSenha] = React.useState("");
  const [regLoading, setRegLoading] = React.useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => setLoginLoading(false), 1500);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegLoading(true);
    setTimeout(() => setRegLoading(false), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-8 pt-8 pb-2 text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--store-primary)" }}>
            Minha Conta
          </h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua conta ou crie uma nova</p>
        </div>

        <div className="flex border-b border-gray-200 mt-6">
          <button
            type="button"
            onClick={() => setTab("entrar")}
            className="flex-1 py-3 text-sm font-medium transition-colors cursor-pointer"
            style={
              tab === "entrar"
                ? { color: "var(--store-primary)", borderBottom: "2px solid var(--store-primary)" }
                : { color: "#6b7280", borderBottom: "2px solid transparent" }
            }
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setTab("criar")}
            className="flex-1 py-3 text-sm font-medium transition-colors cursor-pointer"
            style={
              tab === "criar"
                ? { color: "var(--store-primary)", borderBottom: "2px solid var(--store-primary)" }
                : { color: "#6b7280", borderBottom: "2px solid transparent" }
            }
          >
            Criar conta
          </button>
        </div>

        <div className="px-8 py-6">
          {tab === "entrar" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs cursor-pointer hover:underline"
                  style={{ color: "var(--store-primary)" }}
                >
                  Esqueci a senha
                </button>
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: "var(--store-primary)" }}
              >
                {loginLoading ? "Entrando…" : "Entrar"}
              </button>
            </form>
          )}

          {tab === "criar" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <Input
                  value={regNome}
                  onChange={(e) => setRegNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <Input
                  value={regCpf}
                  onChange={(e) => setRegCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <Input
                  value={regTelefone}
                  onChange={(e) => setRegTelefone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <Input
                  type="password"
                  value={regSenha}
                  onChange={(e) => setRegSenha(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                <Input
                  type="password"
                  value={regConfirmarSenha}
                  onChange={(e) => setRegConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: "var(--store-primary)" }}
              >
                {regLoading ? "Criando conta…" : "Criar conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
