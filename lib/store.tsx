"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuCategory, MenuItem, Restaurant } from "@/lib/types";
import { adminRestaurant, mockCategories, mockItems, mockRestaurants } from "@/lib/data/mock";

// Client-side state for the admin dashboard (multi-restaurant).
//
// Every mutation below corresponds to one Supabase write. When wiring
// Supabase, keep the optimistic state updates and add the matching
// insert/update/delete call inside each action. All reads/writes are
// scoped to the active restaurant — ids are only unique per restaurant.

interface Toast {
  id: number;
  message: string;
}

interface StoreValue {
  restaurants: Restaurant[];
  restaurant: Restaurant;
  setActiveRestaurant: (id: string) => void;
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [activeId, setActiveId] = useState<string>(adminRestaurant.id);
  const [allCategories, setAllCategories] =
    useState<MenuCategory[]>(mockCategories);
  const [allItems, setAllItems] = useState<MenuItem[]>(mockItems);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const restaurant =
    restaurants.find((r) => r.id === activeId) ?? restaurants[0];

  const categories = useMemo(
    () => allCategories.filter((c) => c.restaurantId === activeId),
    [allCategories, activeId]
  );
  const items = useMemo(
    () => allItems.filter((i) => i.restaurantId === activeId),
    [allItems, activeId]
  );

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const setActiveRestaurant = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateRestaurant = useCallback(
    (patch: Partial<Restaurant>) => {
      setRestaurants((rs) =>
        rs.map((r) => (r.id === activeId ? { ...r, ...patch } : r))
      );
    },
    [activeId]
  );

  const addCategory = useCallback(
    (data: Pick<MenuCategory, "name" | "description">) => {
      setAllCategories((cats) => [
        ...cats,
        {
          id: genId("cat"),
          restaurantId: activeId,
          sortOrder:
            cats.filter((c) => c.restaurantId === activeId).length + 1,
          ...data,
        },
      ]);
    },
    [activeId]
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<MenuCategory>) => {
      setAllCategories((cats) =>
        cats.map((c) =>
          c.id === id && c.restaurantId === activeId ? { ...c, ...patch } : c
        )
      );
    },
    [activeId]
  );

  // Returns false when the category still has items — caller shows the error.
  const deleteCategory = useCallback(
    (id: string): boolean => {
      let ok = false;
      setAllItems((currentItems) => {
        const hasItems = currentItems.some(
          (i) => i.categoryId === id && i.restaurantId === activeId
        );
        if (!hasItems) {
          ok = true;
          setAllCategories((cats) =>
            cats.filter(
              (c) => !(c.id === id && c.restaurantId === activeId)
            )
          );
        }
        return currentItems;
      });
      return ok;
    },
    [activeId]
  );

  const addItem = useCallback(
    (data: Omit<MenuItem, "id" | "restaurantId" | "sortOrder">) => {
      setAllItems((its) => [
        ...its,
        {
          id: genId("item"),
          restaurantId: activeId,
          sortOrder:
            its.filter(
              (i) =>
                i.categoryId === data.categoryId &&
                i.restaurantId === activeId
            ).length + 1,
          ...data,
        },
      ]);
    },
    [activeId]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<MenuItem>) => {
      setAllItems((its) =>
        its.map((i) =>
          i.id === id && i.restaurantId === activeId ? { ...i, ...patch } : i
        )
      );
    },
    [activeId]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setAllItems((its) =>
        its.filter((i) => !(i.id === id && i.restaurantId === activeId))
      );
    },
    [activeId]
  );

  return (
    <StoreContext.Provider
      value={{
        restaurants,
        restaurant,
        setActiveRestaurant,
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
