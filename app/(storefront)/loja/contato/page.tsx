"use client";

import * as React from "react";
import { CheckCircle, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockStore } from "@/mocks/storefront";

const horarios = [
  { dia: "Segunda a Sexta", hora: "9h às 18h" },
  { dia: "Sábado", hora: "9h às 13h" },
  { dia: "Domingo e Feriados", hora: "Fechado" },
];

export default function ContatoPage() {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [assunto, setAssunto] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      setNome("");
      setEmail("");
      setAssunto("");
      setMensagem("");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Fale conosco</h1>
          <p className="text-gray-500 mt-1">Estamos aqui para ajudar. Envie sua mensagem!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-5">Enviar mensagem</h2>

            {enviado ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle className="size-10" style={{ color: "var(--store-primary)" }} />
                <p className="font-semibold text-green-700">Mensagem enviada com sucesso!</p>
                <p className="text-sm text-gray-500">Entraremos em contato em breve.</p>
                <button
                  type="button"
                  className="mt-2 text-sm cursor-pointer hover:underline"
                  style={{ color: "var(--store-primary)" }}
                  onClick={() => setEnviado(false)}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                  <Input
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    placeholder="Qual o assunto?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <Textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Escreva sua mensagem aqui…"
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white"
                  style={{ backgroundColor: "var(--store-primary)" }}
                >
                  {loading ? "Enviando…" : "Enviar mensagem"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-800">Informações de contato</h2>
              <div className="flex items-start gap-3">
                <Phone className="size-5 shrink-0 mt-0.5" style={{ color: "var(--store-primary)" }} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Telefone</p>
                  <p className="text-sm text-gray-600">{mockStore.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-5 shrink-0 mt-0.5" style={{ color: "var(--store-primary)" }} />
                <div>
                  <p className="text-sm font-medium text-gray-700">E-mail</p>
                  <p className="text-sm text-gray-600">{mockStore.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 mt-0.5" style={{ color: "var(--store-primary)" }} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Endereço</p>
                  <p className="text-sm text-gray-600">{mockStore.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="size-5 shrink-0" style={{ color: "var(--store-primary)" }} />
                <h2 className="font-semibold text-gray-800">Horário de funcionamento</h2>
              </div>
              <div className="space-y-2">
                {horarios.map(({ dia, hora }) => (
                  <div key={dia} className="flex justify-between text-sm">
                    <span className="text-gray-600">{dia}</span>
                    <span
                      className="font-medium"
                      style={{ color: hora === "Fechado" ? "#9ca3af" : "var(--store-primary)" }}
                    >
                      {hora}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
