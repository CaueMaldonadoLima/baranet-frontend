"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ToastProvider, Toaster } from "@/components/shared/toast";
import { Sidebar } from "@/components/shared/sidebar/sidebar";
import { Topbar } from "@/components/shared/topbar/topbar";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Boxes,
  FlaskConical,
  Truck,
  Wallet,
  FileText,
  UserCog,
  BarChart3,
  Settings,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ERP_NAV = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Vendas", href: "/vendas", icon: ShoppingCart },
      { label: "Clientes", href: "/clientes", icon: Users },
      { label: "Pedidos de Lab.", href: "/laboratorio", icon: FlaskConical },
      { label: "Caixa", href: "/caixa", icon: Wallet },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { label: "Produtos", href: "/produtos", icon: Package },
      { label: "Estoque", href: "/estoque", icon: Boxes },
      { label: "Fornecedores", href: "/fornecedores", icon: Truck },
      { label: "Funcionários", href: "/funcionarios", icon: UserCog },
    ],
  },
  {
    label: "Gestão",
    items: [
      { label: "Fiscal / NF-e", href: "/fiscal", icon: FileText },
      { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

const MOCK_STORES = [
  { id: "1", name: "Loja Centro" },
  { id: "2", name: "Loja Shopping" },
];

const MOCK_USER = {
  name: "Vanessa Rodrigues",
  email: "vanessa@otica.com",
  role: "Gerente",
};

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <ToastProvider>
          <div
            className={cn(
              "flex w-full min-h-screen",
              "bg-[linear-gradient(222deg,#CE4257_0%,#FF7F51_100%)]",
              "py-6",
            )}
          >
            <Sidebar
              appName="Baranet"
              appArea="ERP"
              navGroups={ERP_NAV}
            />
            <div className="flex flex-col w-full bg-zinc-100 rounded-l-2xl min-h-0 overflow-hidden">
              <Topbar
                user={MOCK_USER}
                stores={MOCK_STORES}
                activeStore="1"
              />
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
