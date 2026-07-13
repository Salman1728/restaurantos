"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  isAuthed,
  sessionToken,
  verifyPassword,
} from "@/lib/auth";
import { getDb } from "@/lib/firebase";
import type { MenuCategory, MenuItem, Restaurant } from "@/lib/types";

// Server actions behind every admin mutation. The client store applies
// optimistic updates and calls these to persist; each one verifies the
// admin session, writes Firestore, and revalidates the admin pages.

// ---------- Auth ----------

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/login");
}

// ---------- Helpers ----------

async function requireAdminAndDb() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

function revalidateAdmin() {
  for (const path of ["/dashboard", "/menu", "/menu/categories", "/settings"]) {
    revalidatePath(path);
  }
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function failed(e: unknown): ActionResult {
  return { ok: false, error: e instanceof Error ? e.message : "Failed" };
}

/** Strips the id (it's the document key) and drops undefined values. */
function toDoc<T extends { id: string }>(entity: T): Omit<T, "id"> {
  const { id: _id, ...rest } = entity;
  return rest;
}

// ---------- Restaurants ----------

export async function saveRestaurant(
  id: string,
  patch: Partial<Restaurant>
): Promise<ActionResult> {
  try {
    const db = await requireAdminAndDb();
    const { id: _id, ...fields } = patch;
    await db.collection("restaurants").doc(id).set(fields, { merge: true });
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return failed(e);
  }
}

export async function createRestaurant(
  name: string
): Promise<ActionResult & { restaurant?: Restaurant }> {
  try {
    const db = await requireAdminAndDb();
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: "Name is required" };

    const baseSlug =
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "restaurant";
    const taken = new Set(
      (await db.collection("restaurants").get()).docs.map((d) =>
        String(d.data().slug)
      )
    );
    let slug = baseSlug;
    for (let n = 2; taken.has(slug); n++) slug = `${baseSlug}-${n}`;

    const ref = db.collection("restaurants").doc();
    const restaurant: Restaurant = {
      id: ref.id,
      slug,
      name: trimmed,
      tagline: "",
      description: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      currency: "KES",
      openingHours: "",
      isPublished: false,
      createdAt: new Date().toISOString(),
    };
    await ref.set(toDoc(restaurant));
    revalidateAdmin();
    return { ok: true, restaurant };
  } catch (e) {
    return failed(e);
  }
}

// ---------- Categories ----------

export async function saveCategory(
  category: MenuCategory
): Promise<ActionResult> {
  try {
    const db = await requireAdminAndDb();
    await db.collection("categories").doc(category.id).set(toDoc(category));
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return failed(e);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const db = await requireAdminAndDb();
    // The store already blocks deleting non-empty categories; double-check
    // here so a stale client can never orphan items.
    const items = await db
      .collection("items")
      .where("categoryId", "==", id)
      .limit(1)
      .get();
    if (!items.empty)
      return { ok: false, error: "Category still has items" };
    await db.collection("categories").doc(id).delete();
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return failed(e);
  }
}

// ---------- Menu items ----------

export async function saveItem(item: MenuItem): Promise<ActionResult> {
  try {
    const db = await requireAdminAndDb();
    await db.collection("items").doc(item.id).set(toDoc(item));
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return failed(e);
  }
}

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    const db = await requireAdminAndDb();
    await db.collection("items").doc(id).delete();
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return failed(e);
  }
}
