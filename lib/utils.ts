import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Soft identity tints for category avatars — assigned by category
// position in fixed order, never re-shuffled when the list changes.
const TINTS = [
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
] as const;

export function categoryTint(index: number) {
  return TINTS[((index % TINTS.length) + TINTS.length) % TINTS.length];
}

export function formatPrice(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
