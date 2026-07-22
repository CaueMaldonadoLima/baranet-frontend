import Link from "next/link";
import { mockBanners, mockCategories, mockProducts, mockTestimonials } from "@/mocks/storefront";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function StorefrontHomePage() {
  const banner = mockBanners[0];
  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <div className="pb-16">
      {/* Hero / Banner */}
      <section
        className="relative flex min-h-[360px] sm:min-h-[440px] items-center justify-center bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-secondary)] px-6 py-16 text-white"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            {banner.title}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-white/80">
            {banner.subtitle}
          </p>
          <div className="mt-8">
            <Link href={banner.href}>
              <Button className="rounded-full bg-white text-[var(--store-primary)] hover:bg-white/90 px-8 py-3 text-sm font-semibold shadow-lg">
                {banner.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16 py-12">

        {/* Categorias */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Categorias</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {mockCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/loja/categoria/${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:border-[var(--store-primary)] hover:shadow-md"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.count} itens</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Produtos em Destaque</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
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
        </section>

        {/* Depoimentos */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">O que nossos clientes dizem</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {mockTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--store-primary)] text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`size-3 ${j < t.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Banner CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-secondary)] px-8 py-14 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Precisando de óculos?</h2>
          <p className="mt-3 text-base text-white/80 sm:text-lg">
            Agende uma consulta com nossos especialistas e encontre a solução perfeita para você.
          </p>
          <div className="mt-8">
            <Link href="/loja/contato">
              <Button className="rounded-full bg-white text-[var(--store-primary)] hover:bg-white/90 px-8 py-3 text-sm font-semibold shadow-lg">
                Agendar consulta
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
