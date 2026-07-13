import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ros_admin";

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "restaurantos";
}

export function sessionToken() {
  return createHash("sha256")
    .update(`${adminPassword()}::restaurantos-admin`)
    .digest("hex");
}

export function verifyPassword(password: string) {
  return password === adminPassword();
}

export async function isAuthed() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionToken();
}
