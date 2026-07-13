import { NextResponse } from "next/server";
import {
  getCategories,
  getMenuItems,
  getPromos,
  getRestaurantBySlug,
  trackMenuView,
} from "@/lib/data";

// Public, unauthenticated menu feed consumed by restaurant websites
// (e.g. hanam-flavor.vercel.app). CORS is wide open by design — this is
// read-only public menu data.
//
// Response shape (the contract client sites integrate against):
// {
//   restaurant: { name, slug, whatsappNumber, currency, tagline, address, openingHours },
//   promos: [{ id, title, description, badge }],            // active only
//   categories: [{ id, name, items: [{ id, name, description, price,
//                                      currency, available, featured, special }] }]
// }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// WhatsApp deep links need digits only, international format, no "+".
function toWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? `254${digits.slice(1)}` : digits;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  const [categories, items, promos] = await Promise.all([
    getCategories(restaurant.id),
    getMenuItems(restaurant.id),
    getPromos(restaurant.id),
    // Analytics ride along with the data fetches; never throws.
    trackMenuView(restaurant.id),
  ]);

  return NextResponse.json(
    {
      restaurant: {
        name: restaurant.name,
        slug: restaurant.slug,
        whatsappNumber: toWhatsAppNumber(restaurant.whatsapp),
        currency: restaurant.currency,
        tagline: restaurant.tagline,
        address: restaurant.address,
        openingHours: restaurant.openingHours,
      },
      promos: promos
        .filter((p) => p.isActive)
        .map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          badge: p.badge || null,
        })),
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        items: items
          .filter((i) => i.categoryId === cat.id)
          .map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            price: i.price,
            currency: restaurant.currency,
            available: i.isAvailable,
            featured: i.isFeatured,
            special: i.isSpecial ?? false,
            // Optional presentation fields — null when the restaurant
            // doesn't use them (photo menus, grouped sections, sizes).
            imageUrl: i.imageUrl ?? null,
            badge: i.badge ?? null,
            dietary: i.dietary ?? null,
            group: i.group ?? null,
            priceLarge: i.priceLarge ?? null,
          })),
      })),
    },
    { headers: corsHeaders }
  );
}
