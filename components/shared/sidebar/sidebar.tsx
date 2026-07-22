"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppVersion } from "@/components/shared/app-version";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  iconClassName?: string;
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
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  showActiveChevron?: boolean;
  logoMark?: React.ReactNode;
  uppercaseLogo?: boolean;
}

function NavLink({
  item,
  activeItemClassName,
  inactiveItemClassName,
  showActiveChevron,
}: {
  item: NavItem;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  showActiveChevron?: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-l-full rounded-r-none text-sm font-medium transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0",
        isActive
          ? (activeItemClassName ?? "bg-white/20 text-white")
          : (inactiveItemClassName ?? "text-white/70 hover:bg-white/10 hover:text-white")
      )}
    >
      <item.icon
        className={cn("size-4 shrink-0", !isActive && item.iconClassName)}
        aria-hidden
      />
      <span className="truncate flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span className="text-xs bg-white/25 rounded-full px-1.5 py-0.5 leading-none tabular-nums">
          {item.badge}
        </span>
      )}
      {isActive && showActiveChevron && <ChevronsLeft className="size-4 shrink-0" aria-hidden />}
    </Link>
  );
}

export function Sidebar({
  appName,
  appArea,
  navGroups,
  className,
  footerContent,
  activeItemClassName,
  inactiveItemClassName,
  showActiveChevron,
  logoMark,
  uppercaseLogo,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[17%] min-w-52 max-w-64 flex flex-col justify-between py-5 pl-3 shrink-0",
        className
      )}
    >
      {/* Brand */}
      <div className="flex flex-col gap-6 min-h-0">
        <div className="px-3 flex items-center gap-2">
          {logoMark}
          <div>
            <h1
              className={cn(
                "text-white font-bold text-xl tracking-tight leading-none",
                uppercaseLogo && "uppercase"
              )}
            >
              {appName}
            </h1>
            {appArea && (
              <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-medium">
                {appArea}
              </p>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-5 overflow-y-auto">
          {navGroups.map((group, i) => (
            <div key={i} className="flex flex-col gap-2">
              {group.label && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  activeItemClassName={activeItemClassName}
                  inactiveItemClassName={inactiveItemClassName}
                  showActiveChevron={showActiveChevron}
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-2 px-1">
        {footerContent}
        <AppVersion className="text-white/30 text-xs" />
      </footer>
    </aside>
  );
}
