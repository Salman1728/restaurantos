/**
 * One-time Firestore seed: pushes the built-in mock data (all restaurants,
 * categories, and items) with their existing ids as document ids, so the
 * public API keeps serving identical payloads to the client sites.
 * Safe to re-run — skips when the restaurants collection already has docs.
 *
 * Run:  npm run seed
 * Auth: reads ./firebase-service-account.json (gitignored).
 */
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { mockCategories, mockItems, mockRestaurants } from "../lib/data/mock";

const key = JSON.parse(readFileSync("firebase-service-account.json", "utf8"));
initializeApp({ credential: cert(key) });
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

function withoutId<T extends { id: string }>(entity: T): Omit<T, "id"> {
  const { id: _id, ...rest } = entity;
  return rest;
}

async function main() {
  const existing = await db.collection("restaurants").limit(1).get();
  if (!existing.empty) {
    console.log("Restaurants already exist — skipping seed.");
    return;
  }

  // Firestore batches cap at 500 writes; chunk to stay under it.
  const writes: { collection: string; id: string; data: object }[] = [
    ...mockRestaurants.map((r) => ({
      collection: "restaurants",
      id: r.id,
      data: withoutId(r),
    })),
    ...mockCategories.map((c) => ({
      collection: "categories",
      id: c.id,
      data: withoutId(c),
    })),
    ...mockItems.map((i) => ({
      collection: "items",
      id: i.id,
      data: withoutId(i),
    })),
  ];

  for (let start = 0; start < writes.length; start += 450) {
    const batch = db.batch();
    for (const w of writes.slice(start, start + 450)) {
      batch.set(db.collection(w.collection).doc(w.id), w.data);
    }
    await batch.commit();
    console.log(
      `Committed ${Math.min(start + 450, writes.length)}/${writes.length} writes…`
    );
  }

  console.log(
    `Seeded ${mockRestaurants.length} restaurants, ${mockCategories.length} categories, ${mockItems.length} items.`
  );
}

main().then(() => process.exit(0));
