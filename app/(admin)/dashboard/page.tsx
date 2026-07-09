"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  FolderOpen,
  Star,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline, WeeklyBars } from "@/components/charts";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";

// Mock analytics until Supabase lands — static so SSR/CSR stay in sync.
const VIEW_TRENDS: Record<string, number[]> = {
  items: [8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 12, 12],
  categories: [3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5],
  featured: [1, 1, 2, 2, 3, 3, 3, 2, 2, 3, 3, 3],
  soldOut: [0, 1, 1, 0, 0, 2, 1, 1, 3, 2, 2, 2],
};

const WEEKLY_VIEWS = [
  { label: "Mon", value: 182 },
  { label: "Tue", value: 214 },
  { label: "Wed", value: 196 },
  { label: "Thu", value: 241 },
  { label: "Fri", value: 338 },
  { label: "Sat", value: 402 },
  { label: "Sun", value: 356 },
];

export default function DashboardPage() {
  const { restaurant, categories, items, notify } = useStore();

  const soldOut = items.filter((i) => !i.isAvailable);
  const featured = items.filter((i) => i.isFeatured);
  const apiUrl = `/api/public/menu/${restaurant.slug}`;

  const copyApiUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}${apiUrl}`);
    notify("API URL copied to clipboard");
  };

  const stats = [
    {
      label: "Menu items",
      value: items.length,
      delta: "+2 this week",
      up: true,
      icon: UtensilsCrossed,
      trend: VIEW_TRENDS.items,
      href: "/menu",
    },
    {
      label: "Categories",
      value: categories.length,
      delta: "+1 this week",
      up: true,
      icon: FolderOpen,
      trend: VIEW_TRENDS.categories,
      href: "/menu/categories",
    },
    {
      label: "Featured",
      value: featured.length,
      delta: "steady",
      up: true,
      icon: Star,
      trend: VIEW_TRENDS.featured,
      href: "/menu",
    },
    {
      label: "Sold out",
      value: soldOut.length,
      delta: soldOut.length > 0 ? "needs attention" : "all clear",
      up: soldOut.length === 0,
      icon: AlertTriangle,
      trend: VIEW_TRENDS.soldOut,
      href: "/menu",
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-40 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-white/20 bg-white/5 text-white"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  restaurant.isPublished ? "bg-emerald-400" : "bg-stone-400"
                )}
              />
              {restaurant.isPublished ? "Menu is live" : "Draft mode"}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              {restaurant.name}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-stone-400">
              {restaurant.tagline} — manage your menu here and every connected
              website updates instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              className="bg-white text-stone-900 shadow-md hover:bg-stone-100"
            >
              <Link href="/menu">
                <Plus className="h-4 w-4" /> Add item
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={copyApiUrl}
            >
              <Copy className="h-3.5 w-3.5" /> Copy API URL
            </Button>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, delta, up, icon: Icon, trend, href }) => (
          <Link key={label} href={href}>
            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight">
                      {value}
                    </div>
                    <div
                      className={cn(
                        "mt-1 flex items-center gap-1 text-xs font-medium",
                        up ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {up ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {delta}
                    </div>
                  </div>
                  <Sparkline points={trend} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Weekly views */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Menu views</CardTitle>
              <CardDescription>
                Last 7 days · sample data until analytics connect
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tracking-tight">
                {WEEKLY_VIEWS.reduce((s, d) => s + d.value, 0).toLocaleString()}
              </div>
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> +18% vs last week
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyBars data={WEEKLY_VIEWS} />
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* API card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                Public menu API
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </CardTitle>
              <CardDescription>
                Connect any website to this endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-stone-900 px-3.5 py-3 font-mono text-xs leading-relaxed text-stone-300 shadow-inner">
                <span className="text-emerald-400">GET</span>{" "}
                <span className="break-all">{apiUrl}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyApiUrl}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={apiUrl} target="_blank" rel="noreferrer">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Needs attention */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Needs attention</CardTitle>
              <CardDescription>Items currently sold out</CardDescription>
            </CardHeader>
            <CardContent>
              {soldOut.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Everything is available. Nice.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {soldOut.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{item.name}</span>
                      <Badge variant="destructive">Sold out</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Featured items</CardTitle>
            <CardDescription>Highlighted on your public menu</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/menu">
              Manage <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {featured.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No featured items yet. Star an item on the Menu page to feature it.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {item.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {cat?.name}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-semibold">
                      {formatPrice(item.price, restaurant.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
