"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  Settings,
  Globe,
  ArrowUpRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const { restaurant, restaurants, setActiveRestaurant, items, notify } =
    useStore();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const soldOut = items.filter((i) => !i.isAvailable).length;

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/menu",
      label: "Menu Items",
      icon: UtensilsCrossed,
      badge: soldOut > 0 ? soldOut : undefined,
    },
    { href: "/menu/categories", label: "Categories", icon: FolderOpen },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-sidebar bg-[radial-gradient(80%_40%_at_50%_0%,rgba(194,65,12,0.13),transparent)]">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-[0_4px_12px_rgba(194,65,12,0.4)]">
          <ChefHat className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-white">
            RestaurantOS
          </div>
          <div className="text-[11px] tracking-wide text-sidebar-foreground">
            ADMIN CONSOLE
          </div>
        </div>
      </div>

      <div className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
        Manage
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active =
            href === "/menu"
              ? pathname === "/menu"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-active text-sidebar-active-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "text-sidebar-foreground hover:bg-sidebar-active/50 hover:text-sidebar-active-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-orange-400 to-orange-600" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  active ? "text-orange-400" : "text-stone-500 group-hover:text-stone-300"
                )}
              />
              {label}
              {badge !== undefined && (
                <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]">
        {switcherOpen && (
          <div className="border-b border-white/5 py-1.5">
            <div className="px-3.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
              Restaurants
            </div>
            {restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRestaurant(r.id);
                  setSwitcherOpen(false);
                  if (r.id !== restaurant.id) notify(`Switched to ${r.name}`);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-white/[0.05]",
                  r.id === restaurant.id
                    ? "text-white"
                    : "text-sidebar-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    r.isPublished ? "bg-emerald-400" : "bg-stone-500"
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                {r.id === restaurant.id && (
                  <Check className="h-3.5 w-3.5 text-orange-400" />
                )}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setSwitcherOpen((o) => !o)}
          className="flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-white/[0.04]"
          title="Switch restaurant"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-stone-700 to-stone-800 text-sm font-semibold text-white ring-1 ring-white/10">
            {restaurant.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-medium text-white">
              {restaurant.name}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-sidebar-foreground">
              <span className="relative flex h-1.5 w-1.5">
                {restaurant.isPublished && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-1.5 w-1.5 rounded-full",
                    restaurant.isPublished ? "bg-emerald-400" : "bg-stone-500"
                  )}
                />
              </span>
              {restaurant.isPublished ? "Menu live" : "Draft"}
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-stone-500" />
        </button>
        <a
          href={`/api/public/menu/${restaurant.slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between border-t border-white/5 px-3.5 py-2.5 text-xs text-sidebar-foreground transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Public menu API
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
