"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuCategory, MenuItem, Promo, Restaurant } from "@/lib/types";
import {
  createRestaurant as createRestaurantAction,
  deleteCategoryAction,
  deleteItemAction,
  deletePromoAction,
  saveCategory,
  saveItem,
  savePromo,
  saveRestaurant,
  type ActionResult,
} from "@/app/actions";

// Client-side state for the admin dashboard (multi-restaurant).
//
// The admin layout fetches all tenants' data server-side (Firestore) and
// feeds it in as props. Every mutation applies an optimistic local update,
// then persists through the matching server action; failures surface as a
// toast so the admin knows to retry. When Firebase isn't configured
// (`persisted: false`) the store runs in-memory as a demo, exactly like
// the original mock setup. All reads/writes are scoped to the active
// restaurant.

interface Toast {
  id: number;
  message: string;
}

interface StoreValue {
  restaurants: Restaurant[];
  restaurant: Restaurant;
  setActiveRestaurant: (id: string) => void;
  addRestaurant: (name: string) => Promise<boolean>;
  categories: MenuCategory[];
  items: MenuItem[];
  promos: Promo[];
  toasts: Toast[];
  notify: (message: string) => void;
  updateRestaurant: (patch: Partial<Restaurant>) => void;
  addPromo: (
    data: Pick<Promo, "title" | "description" | "badge" | "isActive">
  ) => void;
  updatePromo: (id: string, patch: Partial<Promo>) => void;
  deletePromo: (id: string) => void;
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

const genId = (prefix: string) =>
  `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

interface StoreProviderProps {
  children: ReactNode;
  initialRestaurants: Restaurant[];
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
  initialPromos: Promo[];
  persisted: boolean;
}

export function StoreProvider({
  children,
  initialRestaurants,
  initialCategories,
  initialItems,
  initialPromos,
  persisted,
}: StoreProviderProps) {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(initialRestaurants);
  const [activeId, setActiveId] = useState<string>(
    initialRestaurants[0]?.id ?? ""
  );
  const [allCategories, setAllCategories] =
    useState<MenuCategory[]>(initialCategories);
  const [allItems, setAllItems] = useState<MenuItem[]>(initialItems);
  const [allPromos, setAllPromos] = useState<Promo[]>(initialPromos);
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
  const promos = useMemo(
    () => allPromos.filter((p) => p.restaurantId === activeId),
    [allPromos, activeId]
  );

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // Fire-and-report persistence: the optimistic update already happened;
  // only failures need the admin's attention.
  const persist = useCallback(
    (write: () => Promise<ActionResult>) => {
      if (!persisted) return;
      write()
        .then((res) => {
          if (!res.ok) notify(`Not saved: ${res.error ?? "unknown error"}`);
        })
        .catch(() => notify("Not saved: network error"));
    },
    [persisted, notify]
  );

  const setActiveRestaurant = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const addRestaurant = useCallback(
    async (name: string): Promise<boolean> => {
      if (!persisted) {
        const restaurant: Restaurant = {
          id: genId("rest"),
          slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: name.trim(),
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
        setRestaurants((rs) => [...rs, restaurant]);
        setActiveId(restaurant.id);
        return true;
      }
      try {
        const res = await createRestaurantAction(name);
        if (!res.ok || !res.restaurant) {
          notify(`Not created: ${res.error ?? "unknown error"}`);
          return false;
        }
        const created = res.restaurant;
        setRestaurants((rs) => [...rs, created]);
        setActiveId(created.id);
        return true;
      } catch {
        notify("Not created: network error");
        return false;
      }
    },
    [persisted, notify]
  );

  const updateRestaurant = useCallback(
    (patch: Partial<Restaurant>) => {
      setRestaurants((rs) =>
        rs.map((r) => (r.id === activeId ? { ...r, ...patch } : r))
      );
      persist(() => saveRestaurant(activeId, patch));
    },
    [activeId, persist]
  );

  const addPromo = useCallback(
    (data: Pick<Promo, "title" | "description" | "badge" | "isActive">) => {
      const promo: Promo = {
        id: genId("promo"),
        restaurantId: activeId,
        sortOrder:
          allPromos.filter((p) => p.restaurantId === activeId).length + 1,
        createdAt: new Date().toISOString(),
        ...data,
      };
      setAllPromos((ps) => [...ps, promo]);
      persist(() => savePromo(promo));
    },
    [activeId, allPromos, persist]
  );

  const updatePromo = useCallback(
    (id: string, patch: Partial<Promo>) => {
      const current = allPromos.find(
        (p) => p.id === id && p.restaurantId === activeId
      );
      if (!current) return;
      const next = { ...current, ...patch };
      setAllPromos((ps) => ps.map((p) => (p.id === id ? next : p)));
      persist(() => savePromo(next));
    },
    [activeId, allPromos, persist]
  );

  const deletePromo = useCallback(
    (id: string) => {
      setAllPromos((ps) =>
        ps.filter((p) => !(p.id === id && p.restaurantId === activeId))
      );
      persist(() => deletePromoAction(id));
    },
    [activeId, persist]
  );

  const addCategory = useCallback(
    (data: Pick<MenuCategory, "name" | "description">) => {
      const category: MenuCategory = {
        id: genId("cat"),
        restaurantId: activeId,
        sortOrder:
          allCategories.filter((c) => c.restaurantId === activeId).length + 1,
        ...data,
      };
      setAllCategories((cats) => [...cats, category]);
      persist(() => saveCategory(category));
    },
    [activeId, allCategories, persist]
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<MenuCategory>) => {
      const current = allCategories.find(
        (c) => c.id === id && c.restaurantId === activeId
      );
      if (!current) return;
      const next = { ...current, ...patch };
      setAllCategories((cats) =>
        cats.map((c) => (c.id === id ? next : c))
      );
      persist(() => saveCategory(next));
    },
    [activeId, allCategories, persist]
  );

  // Returns false when the category still has items — caller shows the error.
  const deleteCategory = useCallback(
    (id: string): boolean => {
      const hasItems = allItems.some(
        (i) => i.categoryId === id && i.restaurantId === activeId
      );
      if (hasItems) return false;
      setAllCategories((cats) =>
        cats.filter((c) => !(c.id === id && c.restaurantId === activeId))
      );
      persist(() => deleteCategoryAction(id));
      return true;
    },
    [activeId, allItems, persist]
  );

  const addItem = useCallback(
    (data: Omit<MenuItem, "id" | "restaurantId" | "sortOrder">) => {
      const item: MenuItem = {
        id: genId("item"),
        restaurantId: activeId,
        sortOrder:
          allItems.filter(
            (i) =>
              i.categoryId === data.categoryId && i.restaurantId === activeId
          ).length + 1,
        ...data,
      };
      setAllItems((its) => [...its, item]);
      persist(() => saveItem(item));
    },
    [activeId, allItems, persist]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<MenuItem>) => {
      const current = allItems.find(
        (i) => i.id === id && i.restaurantId === activeId
      );
      if (!current) return;
      const next = { ...current, ...patch };
      setAllItems((its) => its.map((i) => (i.id === id ? next : i)));
      persist(() => saveItem(next));
    },
    [activeId, allItems, persist]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setAllItems((its) =>
        its.filter((i) => !(i.id === id && i.restaurantId === activeId))
      );
      persist(() => deleteItemAction(id));
    },
    [activeId, persist]
  );

  return (
    <StoreContext.Provider
      value={{
        restaurants,
        restaurant,
        setActiveRestaurant,
        addRestaurant,
        categories,
        items,
        promos,
        toasts,
        notify,
        updateRestaurant,
        addPromo,
        updatePromo,
        deletePromo,
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
