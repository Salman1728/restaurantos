// Core domain types. These mirror the future Supabase tables
// (restaurants, menu_categories, menu_items) one-to-one so the
// mock data layer can be swapped for real queries without churn.

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  openingHours: string;
  isPublished: boolean;
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  // Optional presentation fields — client sites that use them (photo
  // menus, grouped sections, size variants) get them via the public API;
  // sites that don't simply ignore them.
  imageUrl?: string;
  badge?: string;
  dietary?: string[];
  group?: string;
  priceLarge?: number;
}
