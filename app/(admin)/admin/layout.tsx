"use client";

import { Inter } from "next/font/google";
import "../../globals.css";
import { cn } from "@/lib/utils";
import { ToastProvider, Toaster } from "@/components/shared/toast";
import { Sidebar } from "@/components/shared/sidebar/sidebar";
import { Topbar } from "@/components/shared/topbar/topbar";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Puzzle,
  DollarSign,
  Bell,
  Users,
  Settings,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ADMIN_NAV = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Clientes",
    items: [
      { label: "Óticas", href: "/admin/oticas", icon: Building2 },
      { label: "Planos", href: "/admin/planos", icon: CreditCard },
      { label: "Módulos", href: "/admin/modulos", icon: Puzzle },
    ],
  },
  {
    label: "Gestão",
    items: [
      { label: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
      { label: "Notificações", href: "/admin/notificacoes", icon: Bell },
      { label: "Usuários", href: "/admin/usuarios", icon: Users },
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
    ],
  },
];

const ADMIN_USER = {
  name: "Carlos Baranet",
  email: "carlos@baranet.com.br",
  role: "Super Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <ToastProvider>
          <div
            className={cn(
              "flex w-full min-h-screen",
              "bg-[linear-gradient(222deg,#1e3a8a_0%,#3b82f6_100%)]",
              "py-6",
            )}
          >
            <Sidebar
              appName="Baranet"
              appArea="Admin"
              navGroups={ADMIN_NAV}
            />
            <div className="flex flex-col w-full bg-zinc-100 rounded-l-2xl min-h-0 overflow-hidden">
              <Topbar user={ADMIN_USER} />
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
