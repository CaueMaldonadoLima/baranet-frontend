"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, Truck } from "lucide-react";
import { useCart } from "@/components/storefront/cart-context";

const FREE_SHIPPING_THRESHOLD = 300;

export default function CartPage() {
  const { items, remove, update, total, count } = useCart();

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : null;

  if (count === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/loja" className="hover:text-[var(--store-primary)] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Carrinho</span>
        </nav>

        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="size-12 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Seu carrinho está vazio</h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Adicione produtos incríveis ao seu carrinho e finalize seu pedido.
          </p>
          <Link href="/loja" className="mt-8">
            <button className="rounded-2xl bg-[var(--store-primary)] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              Continuar comprando
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/loja" className="hover:text-[var(--store-primary)] transition-colors">Home</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Carrinho</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Carrinho <span className="text-base font-normal text-gray-400">({count} {count === 1 ? "item" : "itens"})</span>
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Items list */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.color}`}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Product image */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-4xl">
                👓
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{item.brand}</p>
                <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                {item.color && (
                  <p className="text-xs text-gray-500">Cor: {item.color}</p>
                )}
                <p className="text-sm font-bold text-gray-900">
                  R$ {item.price.toLocaleString("pt-BR")}
                </p>
              </div>

              {/* Qty + remove */}
              <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                <button
                  onClick={() => remove(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="Remover item"
                >
                  <X className="size-4" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => update(item.id, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[var(--store-primary)] hover:text-[var(--store-primary)] transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => update(item.id, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[var(--store-primary)] hover:text-[var(--store-primary)] transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>

                <p className="text-sm font-bold text-gray-900">
                  R$ {(item.price * item.qty).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-bold text-gray-900">Resumo do pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {total.toLocaleString("pt-BR")}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                {shipping === 0 ? (
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <Truck className="size-3.5" />
                    Grátis
                  </span>
                ) : (
                  <span className="text-gray-400">Calcular frete</span>
                )}
              </div>

              {shipping !== 0 && total > 0 && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Frete grátis para compras acima de R$ {FREE_SHIPPING_THRESHOLD.toLocaleString("pt-BR")}. Faltam{" "}
                  <strong>R$ {(FREE_SHIPPING_THRESHOLD - total).toLocaleString("pt-BR")}</strong>.
                </p>
              )}

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-xl">R$ {total.toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/loja/checkout">
                <button className="w-full rounded-2xl bg-[var(--store-primary)] py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  Finalizar Compra
                </button>
              </Link>
              <Link href="/loja">
                <button className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                  Continuar comprando
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
