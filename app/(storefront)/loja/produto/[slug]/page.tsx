"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { Star, Check, ShoppingCart, Zap } from "lucide-react";
import { mockProducts } from "@/mocks/storefront";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/storefront/cart-context";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { add } = useCart();

  const product = mockProducts.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = React.useState<string>(
    product?.colors[0] ?? ""
  );
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <span className="mb-4 block text-6xl">🔍</span>
        <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
        <p className="mt-2 text-gray-500">O produto que você procura não existe ou foi removido.</p>
        <Link href="/loja" className="mt-6 inline-block text-sm text-[var(--store-primary)] underline underline-offset-2">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const related = mockProducts.filter((p) => p.slug !== slug).slice(0, 4);

  function handleAddToCart() {
    add({
      id: product!.id,
      name: product!.name,
      brand: product!.brand,
      price: product!.price,
      color: selectedColor,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/loja" className="hover:text-[var(--store-primary)] transition-colors">Home</Link>
        <span>/</span>
        <Link
          href={`/loja/categoria/${product.category}`}
          className="hover:text-[var(--store-primary)] transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl bg-gray-50 overflow-hidden flex items-center justify-center">
          <span className="text-[120px] select-none">👓</span>
          {product.badge && (
            <span className="absolute top-4 left-4 rounded-full bg-[var(--store-primary)] px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--store-primary)]">
            {product.brand}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight sm:text-3xl">
            {product.name}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviews} avaliações)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              R$ {product.price.toLocaleString("pt-BR")}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                R$ {product.originalPrice.toLocaleString("pt-BR")}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Cor: <span className="font-semibold text-gray-900">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[var(--store-primary)]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <ul className="grid grid-cols-2 gap-1.5">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-sm text-gray-700">
                <Check className="size-4 shrink-0 text-green-500" />
                {f}
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all ${
                addedFeedback
                  ? "bg-green-500"
                  : "bg-[var(--store-primary)] hover:opacity-90"
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="size-4" />
                  Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" />
                  Adicionar ao carrinho
                </>
              )}
            </button>

            <Link href="/loja/checkout">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--store-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--store-primary)] transition-all hover:bg-[var(--store-primary)] hover:text-white">
                <Zap className="size-4" />
                Comprar agora
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Related products */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Você também pode gostar</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {related.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              brand={p.brand}
              price={p.price}
              originalPrice={p.originalPrice}
              rating={p.rating}
              reviews={p.reviews}
              badge={p.badge}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
