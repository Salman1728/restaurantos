import { FieldValue } from "firebase-admin/firestore";
import type {
  MenuCategory,
  MenuItem,
  MenuViewStat,
  Promo,
  Restaurant,
} from "@/lib/types";
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

export async function getPromos(restaurantId: string): Promise<Promo[]> {
  const db = getDb();
  // No mock promos exist — unconfigured/demo mode simply has none.
  if (!db) return [];
  try {
    const snap = await db
      .collection("promos")
      .where("restaurantId", "==", restaurantId)
      .get();
    return snap.docs.map((d) => fromDoc<Promo>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getPromos failed:", err);
    return [];
  }
}

// ---------- Analytics ----------

/** YYYY-MM-DD in Africa/Nairobi (UTC+3, no DST). */
function nairobiDate(daysAgo = 0) {
  return new Date(Date.now() + 3 * 3600_000 - daysAgo * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/** Counts one public-API menu fetch. Never throws — analytics must not break the API. */
export async function trackMenuView(restaurantId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  const date = nairobiDate();
  try {
    await db
      .collection("menuViews")
      .doc(`${restaurantId}_${date}`)
      .set(
        { restaurantId, date, count: FieldValue.increment(1) },
        { merge: true }
      );
  } catch (err) {
    console.error("Firestore trackMenuView failed:", err);
  }
}

/** View counts for every restaurant over the last `days` days. */
export async function getAllMenuViews(days = 14): Promise<MenuViewStat[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const cutoff = nairobiDate(days - 1);
    const snap = await db
      .collection("menuViews")
      .where("date", ">=", cutoff)
      .get();
    return snap.docs.map((d) => d.data() as MenuViewStat);
  } catch (err) {
    console.error("Firestore getAllMenuViews failed:", err);
    return [];
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

export async function getAllPromos(): Promise<Promo[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const snap = await db.collection("promos").get();
    return snap.docs.map((d) => fromDoc<Promo>(d)).sort(bySortOrder);
  } catch (err) {
    console.error("Firestore getAllPromos failed:", err);
    return [];
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
