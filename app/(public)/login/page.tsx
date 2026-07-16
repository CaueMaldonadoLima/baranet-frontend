"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[linear-gradient(222deg,#CE4257_0%,#FF7F51_100%)]">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 border border-white/30">
              <Store className="size-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Baranet ERP</h1>
              <p className="text-white/60 text-sm mt-0.5">Gestão para redes de óticas</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user" className="text-sm font-medium text-white/80">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                <input
                  id="user"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="seu.usuario"
                  className="w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-white text-[#CE4257] font-semibold hover:bg-white/90 h-11 rounded-lg"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-white/40 text-xs mt-6">
            Esqueceu a senha?{" "}
            <a href="#" className="text-white/70 hover:text-white underline transition-colors">
              Recuperar acesso
            </a>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2026 Baranet · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
