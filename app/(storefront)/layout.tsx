import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/storefront/cart-context";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { mockStore, mockCategories } from "@/mocks/storefront";
import { ToastProvider, Toaster } from "@/components/shared/toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: `${mockStore.name} — Ótica Online`,
  description: mockStore.tagline,
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(inter.variable, "font-sans antialiased bg-gray-50")}
        style={
          {
            "--store-primary": mockStore.primaryColor,
            "--store-secondary": mockStore.secondaryColor,
            "--store-accent": mockStore.accentColor,
          } as React.CSSProperties
        }
      >
        <ToastProvider>
          <CartProvider>
            <StorefrontHeader storeName={mockStore.logoText} categories={mockCategories} />
            <main className="min-h-[60vh]">{children}</main>
            <StorefrontFooter store={mockStore} categories={mockCategories} />
          </CartProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
