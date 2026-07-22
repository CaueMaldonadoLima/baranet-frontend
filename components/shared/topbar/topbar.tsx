"use client";

import * as React from "react";
import { Bell, ChevronDown, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchInput from "@/components/shared/search-header/components/search-input";

interface Store {
  id: string;
  name: string;
}

interface TopbarUser {
  name: string;
  email: string;
  role?: string;
}

interface TopbarProps {
  user?: TopbarUser;
  stores?: Store[];
  activeStore?: string;
  onStoreChange?: (storeId: string) => void;
  className?: string;
  showUserMenu?: boolean;
}

function UserMenu({ user }: { user: TopbarUser }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
          {initials}
        </span>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
          {user.role && (
            <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
          )}
        </div>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-border bg-card shadow-md z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <User className="size-4 text-muted-foreground" />
              Meu perfil
            </button>
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Settings className="size-4 text-muted-foreground" />
              Configurações
            </button>
          </div>
          <div className="border-t border-border py-1">
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StoreSelector({ stores, activeStore, onStoreChange }: { stores: Store[]; activeStore?: string; onStoreChange?: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const active = stores.find((s) => s.id === activeStore) ?? stores[0];

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (stores.length <= 1) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="truncate max-w-36">{active?.name}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-52 rounded-lg border border-border bg-card shadow-md z-50 overflow-hidden">
          <div className="py-1">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => { onStoreChange?.(store.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-sm transition-colors",
                  store.id === active?.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar({ user, stores = [], activeStore, onStoreChange, className, showUserMenu = true }: TopbarProps) {
  const defaultUser: TopbarUser = user ?? { name: "Usuário", email: "usuario@otica.com", role: "Vendedor" };

  return (
    <header className={cn("flex items-center justify-between gap-4 px-[4.2vw] py-4 border-b border-border/50 bg-card/50", className)}>
      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchInput id="topbar-search" placeholder="Pesquisar..." />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {showUserMenu && stores.length > 1 && (
          <StoreSelector stores={stores} activeStore={activeStore} onStoreChange={onStoreChange} />
        )}

        <button
          aria-label="Notificações"
          className="relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-4" />
          <span className="hidden lg:inline">Notificações</span>
          <span className="absolute top-1.5 right-1.5 lg:right-2 size-2 rounded-full bg-destructive" />
        </button>

        <button
          aria-label="Ajuda"
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HelpCircle className="size-4" />
          <span className="hidden lg:inline">Ajuda</span>
        </button>

        <button
          aria-label="Configurações"
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Settings className="size-4" />
          <span className="hidden lg:inline">Configurações</span>
        </button>

        {showUserMenu && <UserMenu user={defaultUser} />}
      </div>
    </header>
  );
}
