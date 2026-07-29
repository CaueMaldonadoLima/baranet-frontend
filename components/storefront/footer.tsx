import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import type { mockStore, mockCategories } from "@/mocks/storefront";

interface StorefrontFooterProps {
  store: typeof mockStore;
  categories: typeof mockCategories;
}

export function StorefrontFooter({ store, categories }: StorefrontFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-white">{store.logoText}</span>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{store.tagline}</p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="size-4 text-white" />
              </a>
              <a href="#" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="size-4 text-white" />
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Produtos</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/loja/categoria/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Institucional</h3>
            <ul className="space-y-2">
              {[
                { href: "/loja/sobre", label: "Sobre nós" },
                { href: "/loja/contato", label: "Contato" },
                { href: "/politica-de-privacidade", label: "Política de privacidade" },
                { href: "/troca-e-devolucao", label: "Troca e devolução" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="size-4 shrink-0 mt-0.5 text-gray-500" />
                <span className="text-sm text-gray-400">{store.phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="size-4 shrink-0 mt-0.5 text-gray-500" />
                <span className="text-sm text-gray-400">{store.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 mt-0.5 text-gray-500" />
                <span className="text-sm text-gray-400">{store.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2026 {store.logoText}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Powered by <span className="text-gray-500">Baranet ERP</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
