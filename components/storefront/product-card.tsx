import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  badge?: string | null;
  className?: string;
}

export function ProductCard({
  slug,
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  className,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/loja/produto/${slug}`}
      className={cn(
        "group flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl select-none">
          👓
        </div>
        {badge && (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--store-primary)] text-white text-xs font-semibold px-2.5 py-1 leading-none">
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 text-white text-xs font-bold px-2.5 py-1 leading-none">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--store-primary)] transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            R$ {price.toLocaleString("pt-BR")}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              R$ {originalPrice.toLocaleString("pt-BR")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
