import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { StoreProvider } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Toaster } from "@/components/toaster";
import { isAuthed } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  getAllCategories,
  getAllItems,
  getAllPromos,
  getAllRestaurants,
} from "@/lib/data";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAuthed())) redirect("/login");

  const [restaurants, categories, items, promos] = await Promise.all([
    getAllRestaurants(),
    getAllCategories(),
    getAllItems(),
    getAllPromos(),
  ]);

  return (
    <StoreProvider
      initialRestaurants={restaurants}
      initialCategories={categories}
      initialItems={items}
      initialPromos={promos}
      persisted={isFirebaseConfigured()}
    >
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-64">
          <Topbar />
          <main className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-6xl animate-fade-up">{children}</div>
          </main>
        </div>
        <Toaster />
      </div>
    </StoreProvider>
  );
}
