"use client";

import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { logout } from "@/app/actions";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/menu": "Menu Items",
  "/menu/categories": "Categories",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const { restaurant } = useStore();
  const section = titles[pathname] ?? "Overview";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{restaurant.name}</span>
          <span className="text-border">/</span>
          <span className="font-medium">{section}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <a
              href={`/api/public/menu/${restaurant.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View live menu
            </a>
          </Button>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-xs font-semibold text-white shadow-sm"
            title={restaurant.email}
          >
            {restaurant.name[0]}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
