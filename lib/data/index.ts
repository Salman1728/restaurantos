import type { MenuCategory, MenuItem, Restaurant } from "@/lib/types";
import { getDb } from "@/lib/firebase";
import { mockCategories, mockItems, mockRestaurants } from "./mock";

// Server-side data-access layer, backed by Firestore (Admin SDK).
//
// Collections mirror lib/types.ts one-to-one: restaurants, categories,
// items. The document id doubles as the entity id. When Firebase is not
// configured (fresh clone, missing env), everything falls back to the
// built-in mock data so the app still runs as a demo.
//
// Queries filter by field only and sort in code — that keeps Firestore
// free of composite-index requirements.

function fromDoc<T>(doc: FirebaseFirestore.QueryDocumentSnapshot): T {
  return { ...(doc.data() as Omit<T, "id">), id: doc.id } as T;
}

const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) =>
  a.sortOrder - b.sortOrder;

export async function getRestaurantBySlug(
  slug: string
): Promise<Restaurant | null> {
  const db = getDb();
  if (!db) return mockRestaurants.find((r) => r.slug === slug) ?? null;
  try {
    const snap = await db
      .collection("restaurants")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    return snap.empty ? null : fromDoc<Restaurant>(snap.docs[0]);
  } catch (err) {
    console.error("Firestore getRestaurantBySlug failed:", err);
    return mockRestaurants.find((r) => r.slug === slug) ?? null;
  }
}

export async function getCategories(
  restaurantId: string
): Promise<MenuCategory[]> {
  const db = getDb();
  if (!db)
    return mockCategories
      .filter((c) => c.restaurantId === restaurantId)
      .sort(bySortOrder);
  try {
    const snap = await db
      .collection("categories")
      .where("restaurantId", "==", restaurantId)
      .get();
    return snap.docs.map((d) => fromDoc<MenuCategory>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getCategories failed:", err);
    return mockCategories
      .filter((c) => c.restaurantId === restaurantId)
      .sort(bySortOrder);
  }
}

export async function getMenuItems(
  restaurantId: string
): Promise<MenuItem[]> {
  const db = getDb();
  if (!db)
    return mockItems
      .filter((i) => i.restaurantId === restaurantId)
      .sort(bySortOrder);
  try {
    const snap = await db
      .collection("items")
      .where("restaurantId", "==", restaurantId)
      .get();
    return snap.docs.map((d) => fromDoc<MenuItem>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getMenuItems failed:", err);
    return mockItems
      .filter((i) => i.restaurantId === restaurantId)
      .sort(bySortOrder);
  }
}

// ---------- Admin (all tenants at once, feeds the dashboard store) ----------

const byCreatedAt = (a: Restaurant, b: Restaurant) =>
  a.createdAt.localeCompare(b.createdAt);

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const db = getDb();
  if (!db) return [...mockRestaurants];
  try {
    const snap = await db.collection("restaurants").get();
    const restaurants = snap.docs
      .map((d) => fromDoc<Restaurant>(d))
      .sort(byCreatedAt);
    // Empty database (not yet seeded) — run as a demo rather than break.
    return restaurants.length > 0 ? restaurants : [...mockRestaurants];
  } catch (err) {
    console.error("Firestore getAllRestaurants failed:", err);
    return [...mockRestaurants];
  }
}

export async function getAllCategories(): Promise<MenuCategory[]> {
  const db = getDb();
  if (!db) return [...mockCategories];
  try {
    const snap = await db.collection("categories").get();
    return snap.docs.map((d) => fromDoc<MenuCategory>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getAllCategories failed:", err);
    return [...mockCategories];
  }
}

export async function getAllItems(): Promise<MenuItem[]> {
  const db = getDb();
  if (!db) return [...mockItems];
  try {
    const snap = await db.collection("items").get();
    return snap.docs.map((d) => fromDoc<MenuItem>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getAllItems failed:", err);
    return [...mockItems];
  }
}
