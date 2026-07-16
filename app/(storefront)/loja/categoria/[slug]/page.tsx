"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { mockProducts, mockCategories } from "@/mocks/storefront";
import { ProductCard } from "@/components/storefront/product-card";

const BRANDS = ["Rayban", "Oakley", "Essilor", "Zeiss", "Silhouette"];
const PRICE_RANGES = [
  { label: "Até R$ 300", id: "ate-300" },
  { label: "R$ 300 a R$ 600", id: "300-600" },
  { label: "Acima de R$ 600", id: "acima-600" },
];

function matchesPrice(price: number, range: string): boolean {
  if (range === "ate-300") return price <= 300;
  if (range === "300-600") return price > 300 && price <= 600;
  if (range === "acima-600") return price > 600;
  return false;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const category = mockCategories.find((c) => c.slug === slug);
  const baseProducts = category
    ? mockProducts.filter((p) => p.category === slug)
    : mockProducts;

  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = React.useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function togglePrice(id: string) {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const filtered = baseProducts.filter((p) => {
    const brandOk = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const priceOk =
      selectedPrices.length === 0 || selectedPrices.some((r) => matchesPrice(p.price, r));
    return brandOk && priceOk;
  });

  const hasActiveFilters = selectedBrands.length > 0 || selectedPrices.length > 0;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Marca</p>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--store-primary)]"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Preço</p>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPrices.includes(range.id)}
                onChange={() => togglePrice(range.id)}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--store-primary)]"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      {hasActiveFilters && (
        <button
          onClick={() => { setSelectedBrands([]); setSelectedPrices([]); }}
          className="text-xs text-[var(--store-primary)] underline underline-offset-2"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/loja" className="hover:text-[var(--store-primary)] transition-colors">Home</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{category?.name ?? "Todos os produtos"}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? `${category.icon} ${category.name}` : "Todos os produtos"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <div className="mb-4 md:hidden">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[10px] font-bold text-white">
              {selectedBrands.length + selectedPrices.length}
            </span>
          )}
        </button>

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-gray-900">Filtrar por</p>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="size-4 text-gray-400" />
              </button>
            </div>
            <FilterPanel />
          </div>
        )}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-5 font-semibold text-gray-900">Filtrar por</p>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-5xl">🔍</span>
              <p className="text-lg font-semibold text-gray-700">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  badge={product.badge}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
