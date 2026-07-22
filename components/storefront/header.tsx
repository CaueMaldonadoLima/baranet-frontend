"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";
import type { mockCategories } from "@/mocks/storefront";

interface StorefrontHeaderProps {
  storeName: string;
  categories: typeof mockCategories;
}

export function StorefrontHeader({ storeName, categories }: StorefrontHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { count } = useCart();
  const pathname = usePathname();

  // Fechar menu ao navegar
  React.useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/loja" className="flex-shrink-0">
            <span className="text-xl font-bold text-[var(--store-primary)] tracking-tight">
              {storeName}
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/loja" className={cn("px-3 py-2 text-sm font-medium rounded-lg transition-colors", pathname === "/loja" ? "text-[var(--store-primary)]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}>
              Início
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Produtos <ChevronDown className="size-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/loja/categoria/${cat.slug}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/loja/sobre" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              Sobre
            </Link>
            <Link href="/loja/contato" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              className="flex size-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Search className="size-5" />
            </button>
            <Link
              href="/loja/conta"
              aria-label="Minha conta"
              className="flex size-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <User className="size-5" />
            </Link>
            <Link
              href="/loja/carrinho"
              aria-label={`Carrinho (${count} itens)`}
              className="relative flex size-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-white text-[10px] font-bold leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden flex size-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos, marcas..."
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link href="/loja" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Início
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/loja/categoria/${cat.slug}`}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
            <Link href="/loja/sobre" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Sobre
            </Link>
            <Link href="/loja/contato" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Contato
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
