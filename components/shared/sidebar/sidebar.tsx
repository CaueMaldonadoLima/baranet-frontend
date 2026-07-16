"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppVersion } from "@/components/shared/app-version";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface SidebarProps {
  appName: string;
  appArea?: string;
  navGroups: NavGroup[];
  className?: string;
  footerContent?: React.ReactNode;
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-white/20 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <item.icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className="ml-auto text-xs bg-white/25 rounded-full px-1.5 py-0.5 leading-none tabular-nums">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ appName, appArea, navGroups, className, footerContent }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[17%] min-w-52 max-w-64 flex flex-col justify-between px-3 py-5 shrink-0",
        className
      )}
    >
      {/* Brand */}
      <div className="flex flex-col gap-6 min-h-0">
        <div className="px-3">
          <h1 className="text-white font-bold text-xl tracking-tight leading-none">
            {appName}
          </h1>
          {appArea && (
            <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-medium">
              {appArea}
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-5 overflow-y-auto">
          {navGroups.map((group, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              {group.label && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-2 px-3">
        {footerContent}
        <AppVersion className="text-white/30 text-xs" />
      </footer>
    </aside>
  );
}
