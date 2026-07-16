"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle,
  CreditCard,
  FileText,
  QrCode,
} from "lucide-react";
import { useCart } from "@/components/storefront/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PaymentMethod = "pix" | "cartao" | "boleto";

interface AddressData {
  nome: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  cartao: "Cartão de crédito",
  boleto: "Boleto",
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {[1, 2, 3].map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors"
              style={
                current >= step
                  ? {
                      backgroundColor: "var(--store-primary)",
                      borderColor: "var(--store-primary)",
                      color: "#fff",
                    }
                  : { borderColor: "#d1d5db", color: "#9ca3af" }
              }
            >
              {step}
            </div>
            <span
              className="text-xs hidden sm:block"
              style={
                current >= step
                  ? { color: "var(--store-primary)", fontWeight: 600 }
                  : { color: "#9ca3af" }
              }
            >
              {step === 1 ? "Endereço" : step === 2 ? "Pagamento" : "Confirmação"}
            </span>
          </div>
          {idx < 2 && (
            <div
              className="h-0.5 w-16 sm:w-24 mx-1 mt-[-10px]"
              style={{
                backgroundColor: current > step ? "var(--store-primary)" : "#e5e7eb",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OrderSummary({
  items,
  total,
}: {
  items: { name: string; price: number; qty: number }[];
  total: number;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Resumo do pedido</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum item no carrinho.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {items.map((item) => (
            <li key={item.name} className="flex justify-between text-sm text-gray-700">
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="font-medium">
                R$ {(item.price * item.qty).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
        <span>Total</span>
        <span>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [step, setStep] = React.useState(1);
  const [address, setAddress] = React.useState<AddressData>({
    nome: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [payment, setPayment] = React.useState<PaymentMethod>("pix");
  const [card, setCard] = React.useState({ numero: "", nome: "", validade: "", cvv: "" });

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCardChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleConfirm() {
    clear();
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Checkout</h1>
        <StepIndicator current={step} />

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">1. Dados de entrega</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <Input name="nome" value={address.nome} onChange={handleAddressChange} placeholder="Seu nome completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input name="email" type="email" value={address.email} onChange={handleAddressChange} placeholder="seu@email.com" />
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <Input name="cep" value={address.cep} onChange={handleAddressChange} placeholder="00000-000" maxLength={9} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {}}
                >
                  Buscar
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                  <Input name="rua" value={address.rua} onChange={handleAddressChange} placeholder="Nome da rua" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <Input name="numero" value={address.numero} onChange={handleAddressChange} placeholder="123" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <Input name="bairro" value={address.bairro} onChange={handleAddressChange} placeholder="Bairro" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <Input name="cidade" value={address.cidade} onChange={handleAddressChange} placeholder="Cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <Input name="estado" value={address.estado} onChange={handleAddressChange} placeholder="SP" maxLength={2} />
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-6 text-white"
              style={{ backgroundColor: "var(--store-primary)" }}
              onClick={() => setStep(2)}
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">2. Forma de pagamento</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {(
                  [
                    { id: "pix" as PaymentMethod, label: "PIX", icon: QrCode },
                    { id: "cartao" as PaymentMethod, label: "Cartão de crédito", icon: CreditCard },
                    { id: "boleto" as PaymentMethod, label: "Boleto", icon: FileText },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer"
                    style={
                      payment === id
                        ? { borderColor: "var(--store-primary)", backgroundColor: "color-mix(in srgb, var(--store-primary) 8%, white)" }
                        : { borderColor: "#e5e7eb", backgroundColor: "#fff" }
                    }
                  >
                    <Icon
                      className="size-6"
                      style={{ color: payment === id ? "var(--store-primary)" : "#6b7280" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: payment === id ? "var(--store-primary)" : "#374151" }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {payment === "cartao" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do cartão</label>
                    <Input name="numero" value={card.numero} onChange={handleCardChange} placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome no cartão</label>
                    <Input name="nome" value={card.nome} onChange={handleCardChange} placeholder="NOME SOBRENOME" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                      <Input name="validade" value={card.validade} onChange={handleCardChange} placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <Input name="cvv" value={card.cvv} onChange={handleCardChange} placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {payment === "pix" && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium border border-gray-300">
                    QR Code PIX
                  </div>
                  <p className="text-sm text-gray-600 text-center max-w-xs">
                    O QR Code será gerado após a confirmação do pedido.
                  </p>
                </div>
              )}

              {payment === "boleto" && (
                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  O boleto será gerado após a confirmação do pedido e terá vencimento em 3 dias úteis.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <OrderSummary items={items} total={total} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                className="flex-1 text-white"
                style={{ backgroundColor: "var(--store-primary)" }}
                onClick={handleConfirm}
              >
                Confirmar pedido
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
            <CheckCircle
              className="size-16 mx-auto mb-4"
              style={{ color: "var(--store-primary)" }}
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido confirmado!</h2>
            <p className="text-gray-500 mb-1 text-sm">Número do pedido</p>
            <p className="text-lg font-semibold mb-6" style={{ color: "var(--store-primary)" }}>
              PED-2026099
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-200">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Valor total</span>
                <span className="font-semibold">
                  R$ {total > 0 ? total.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Forma de pagamento</span>
                <span className="font-semibold">{PAYMENT_LABELS[payment]}</span>
              </div>
            </div>

            {payment === "pix" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
                <p className="font-semibold text-emerald-800 mb-2">Instruções de pagamento PIX</p>
                <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Selecione a opção PIX e depois "Pagar"</li>
                  <li>Escaneie o QR Code ou copie a chave PIX</li>
                  <li>Confirme o pagamento no valor indicado</li>
                  <li>Guarde o comprovante</li>
                </ol>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/loja">Continuar comprando</Link>
              </Button>
              <Button
                className="flex-1 text-white"
                style={{ backgroundColor: "var(--store-primary)" }}
                asChild
              >
                <Link href="/loja/conta/pedidos">Ver meus pedidos</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
