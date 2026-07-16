"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/mocks/erp";

type Product = (typeof mockProducts)[number];

interface CartItem {
  product: Product;
  qty: number;
}

const PAYMENT_METHODS = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "cartão", label: "Cartão" },
  { id: "pix", label: "PIX" },
  { id: "crediário", label: "Crediário" },
];

export default function NovaVendaPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState("cartão");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const filtered = search.trim().length > 0
    ? mockProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
      )
    : [];

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setSearch("");
  }

  function updateQty(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const total = Math.max(subtotal - discount, 0);

  function handleFinalize() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCart([]);
      setCustomer("");
      setPayment("cartão");
      setDiscount(0);
    }, 1500);
  }

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Vendas", href: "/vendas" },
          { label: "Nova Venda" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Nova Venda</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Coluna esquerda — produtos */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Buscar Produto</h2>
            <div className="relative">
              <Input
                placeholder="Digite o nome do produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addToCart(p)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <div>
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-2 text-muted-foreground text-xs">{p.code}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-muted-foreground text-xs">Estoque: {p.stock}</span>
                        <span className="font-semibold text-foreground">
                          {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h2 className="font-semibold text-foreground pt-2">Itens da Venda</h2>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                <ShoppingBag className="size-8 opacity-40" />
                <p className="text-sm">Nenhum item adicionado</p>
              </div>
            ) : (
              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Produto</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Qtd</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Valor unit.</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Subtotal</th>
                      <th className="px-4 py-2 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cart.map((item) => (
                      <tr key={item.product.id} className="bg-card hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">{item.product.code}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.product.id, -1)}
                              className="flex size-6 items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.product.id, 1)}
                              disabled={item.qty >= item.product.stock}
                              className="flex size-6 items-center justify-center rounded border border-border hover:bg-muted transition-colors disabled:opacity-40"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {item.product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {(item.product.price * item.qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Coluna direita — resumo */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Cliente</h2>
            <Input
              placeholder="Nome do cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Forma de Pagamento</h2>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(m.id)}
                  className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                    payment === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Resumo</h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>

              <div className="flex items-center justify-between text-sm gap-3">
                <span className="text-muted-foreground shrink-0">Desconto (R$)</span>
                <Input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-28 h-7 text-right"
                />
              </div>

              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleFinalize}
              disabled={cart.length === 0 || loading}
            >
              {loading ? "Finalizando..." : "Finalizar Venda"}
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/vendas">Cancelar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
