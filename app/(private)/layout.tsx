"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ToastProvider, Toaster } from "@/components/shared/toast";
import { Sidebar } from "@/components/shared/sidebar/sidebar";
import { Topbar } from "@/components/shared/topbar/topbar";
import {
  LayoutDashboard,
  UserPlus,
  ShoppingBag,
  ShoppingCart,
  Boxes,
  Wallet,
  FileText,
  Settings,
  FlaskConical,
  LogOut,
  ChevronDown,
  Glasses,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ERP_NAV = [
  {
    items: [
      { label: "Página Inicial", href: "/", icon: LayoutDashboard },
      { label: "Cadastro", href: "/cadastro", icon: UserPlus },
      { label: "E-comerce", href: "/ecommerce", icon: ShoppingBag, iconClassName: "text-amber-400" },
      { label: "Vendas", href: "/vendas", icon: ShoppingCart, iconClassName: "text-emerald-400" },
      { label: "Estoque", href: "/estoque", icon: Boxes, iconClassName: "text-amber-600" },
      { label: "Financeiro", href: "/caixa", icon: Wallet, iconClassName: "text-yellow-400" },
      { label: "Fiscal", href: "/fiscal", icon: FileText, iconClassName: "text-green-400" },
      { label: "Administrativo", href: "/configuracoes", icon: Settings, iconClassName: "text-slate-300" },
      { label: "Cont.Lab", href: "/laboratorio", icon: FlaskConical, iconClassName: "text-teal-300" },
    ],
  },
];

const MOCK_STORE = { id: "1", name: "Loja 01" };

const MOCK_USER = {
  name: "Vanessa Rodrigues",
  email: "vanessa@otica.com",
  role: "Gerente",
};

function SidebarFooter() {
  const initials = MOCK_USER.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 px-1 py-2 rounded-xl">
      <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white text-xs font-semibold shrink-0">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{MOCK_USER.name}</p>
        <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-white/70 bg-white/10 rounded-full px-2 py-0.5">
          {MOCK_STORE.name}
          <ChevronDown className="size-3" aria-hidden />
        </span>
      </div>
      <Link
        href="/login"
        aria-label="Sair"
        className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors shrink-0"
      >
        <LogOut className="size-4" />
      </Link>
    </div>
  );
}

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <ToastProvider>
          <div
            className={cn(
              "flex w-full min-h-screen",
              "bg-[linear-gradient(222deg,#CE4257_0%,#FF7F51_100%)]",
              "p-4",
            )}
          >
            <Sidebar
              appName="Baranet"
              navGroups={ERP_NAV}
              footerContent={<SidebarFooter />}
              activeItemClassName="bg-sidebar-active-bg text-sidebar-active-foreground"
              inactiveItemClassName="bg-sidebar-bg text-white hover:brightness-110"
              showActiveChevron
              uppercaseLogo
              logoMark={
                <span className="flex size-8 items-center justify-center rounded-lg bg-white text-sidebar-bg shrink-0">
                  <Glasses className="size-4.5" aria-hidden />
                </span>
              }
            />
            <div className="flex flex-col w-full bg-zinc-100 rounded-l-2xl min-h-0 overflow-hidden">
              <Topbar showUserMenu={false} />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
