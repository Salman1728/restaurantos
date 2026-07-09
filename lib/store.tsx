"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { MenuCategory, MenuItem, Restaurant } from "@/lib/types";
import { adminRestaurant, mockCategories, mockItems } from "@/lib/data/mock";

// Client-side state for the admin dashboard.
//
// Every mutation below corresponds to one Supabase write. When wiring
// Supabase, keep the optimistic state updates and add the matching
// insert/update/delete call inside each action.

interface Toast {
  id: number;
  message: string;
}

interface StoreValue {
  restaurant: Restaurant;
  categories: MenuCategory[];
  items: MenuItem[];
  toasts: Toast[];
  notify: (message: string) => void;
  updateRestaurant: (patch: Partial<Restaurant>) => void;
  addCategory: (data: Pick<MenuCategory, "name" | "description">) => void;
  updateCategory: (id: string, patch: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => boolean;
  addItem: (
    data: Omit<MenuItem, "id" | "restaurantId" | "sortOrder">
  ) => void;
  updateItem: (id: string, patch: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

let nextId = 100;
const genId = (prefix: string) => `${prefix}_${nextId++}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(adminRestaurant);
  const [categories, setCategories] = useState<MenuCategory[]>(() =>
    mockCategories.filter((c) => c.restaurantId === adminRestaurant.id)
  );
  const [items, setItems] = useState<MenuItem[]>(() =>
    mockItems.filter((i) => i.restaurantId === adminRestaurant.id)
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const updateRestaurant = useCallback((patch: Partial<Restaurant>) => {
    setRestaurant((r) => ({ ...r, ...patch }));
  }, []);

  const addCategory = useCallback(
    (data: Pick<MenuCategory, "name" | "description">) => {
      setCategories((cats) => [
        ...cats,
        {
          id: genId("cat"),
          restaurantId: adminRestaurant.id,
          sortOrder: cats.length + 1,
          ...data,
        },
      ]);
    },
    []
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<MenuCategory>) => {
      setCategories((cats) =>
        cats.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
    },
    []
  );

  // Returns false when the category still has items — caller shows the error.
  const deleteCategory = useCallback(
    (id: string): boolean => {
      let ok = false;
      setItems((currentItems) => {
        const hasItems = currentItems.some((i) => i.categoryId === id);
        if (!hasItems) {
          ok = true;
          setCategories((cats) => cats.filter((c) => c.id !== id));
        }
        return currentItems;
      });
      return ok;
    },
    []
  );

  const addItem = useCallback(
    (data: Omit<MenuItem, "id" | "restaurantId" | "sortOrder">) => {
      setItems((its) => [
        ...its,
        {
          id: genId("item"),
          restaurantId: adminRestaurant.id,
          sortOrder:
            its.filter((i) => i.categoryId === data.categoryId).length + 1,
          ...data,
        },
      ]);
    },
    []
  );

  const updateItem = useCallback((id: string, patch: Partial<MenuItem>) => {
    setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((its) => its.filter((i) => i.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        restaurant,
        categories,
        items,
        toasts,
        notify,
        updateRestaurant,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
