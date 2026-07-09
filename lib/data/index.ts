import type { MenuCategory, MenuItem, Restaurant } from "@/lib/types";
import { mockCategories, mockItems, mockRestaurants } from "./mock";

// Server-side data-access layer.
//
// Every function here maps to a single Supabase query. To go live:
//   1. Create a Supabase client in lib/supabase/server.ts
//   2. Replace each function body with the equivalent query, e.g.
//        supabase.from("restaurants").select("*").eq("slug", slug).single()
//   3. Delete lib/data/mock.ts
// Call sites (API routes, server components) stay unchanged.

export async function getRestaurantBySlug(
  slug: string
): Promise<Restaurant | null> {
  return mockRestaurants.find((r) => r.slug === slug) ?? null;
}

export async function getCategories(
  restaurantId: string
): Promise<MenuCategory[]> {
  return mockCategories
    .filter((c) => c.restaurantId === restaurantId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getMenuItems(
  restaurantId: string
): Promise<MenuItem[]> {
  return mockItems
    .filter((i) => i.restaurantId === restaurantId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
