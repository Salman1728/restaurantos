"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Check, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";

interface ItemFormState {
  name: string;
  description: string;
  price: string;
  categoryId: string;
}

const emptyForm: ItemFormState = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
};

export default function MenuItemsPage() {
  const {
    restaurant,
    categories,
    items,
    addItem,
    updateItem,
    deleteItem,
    notify,
  } = useStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<ItemFormState>(emptyForm);
  const [priceEditId, setPriceEditId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (i) =>
        (categoryFilter === "all" || i.categoryId === categoryFilter) &&
        (q === "" ||
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q))
    );
  }, [items, search, categoryFilter]);

  const grouped = useMemo(
    () =>
      categories
        .map((cat) => ({
          category: cat,
          items: filtered.filter((i) => i.categoryId === cat.id),
        }))
        .filter((g) => g.items.length > 0),
    [categories, filtered]
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      categoryId: item.categoryId,
    });
    setDialogOpen(true);
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !form.categoryId || !Number.isFinite(price) || price < 0)
      return;

    if (editing) {
      updateItem(editing.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        categoryId: form.categoryId,
      });
      notify("Item updated");
    } else {
      addItem({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        categoryId: form.categoryId,
        isAvailable: true,
        isFeatured: false,
      });
      notify("Item added");
    }
    setDialogOpen(false);
  };

  const startPriceEdit = (item: MenuItem) => {
    setPriceEditId(item.id);
    setPriceDraft(String(item.price));
  };

  const savePrice = (item: MenuItem) => {
    const price = Number(priceDraft);
    if (Number.isFinite(price) && price >= 0 && price !== item.price) {
      updateItem(item.id, { price });
      notify("Price updated");
    }
    setPriceEditId(null);
  };

  return (
    <>
      <PageHeader
        title="Menu Items"
        description="Manage dishes, prices, availability and featured picks."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          >
            All
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              active={categoryFilter === cat.id}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No items match. Try a different search or add a new item.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ category, items: catItems }) => {
            return (
            <section key={category.id}>
              <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-foreground">
                {category.name}
                <span className="font-normal text-muted-foreground">
                  · {catItems.length} item{catItems.length === 1 ? "" : "s"}
                </span>
              </h2>
              <Card>
                <ul className="divide-y divide-border">
                  {catItems.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5",
                        !item.isAvailable && "bg-muted/40"
                      )}
                    >
                      <button
                        onClick={() => {
                          updateItem(item.id, { isFeatured: !item.isFeatured });
                          notify(
                            item.isFeatured
                              ? "Removed from featured"
                              : "Marked as featured"
                          );
                        }}
                        title={
                          item.isFeatured ? "Remove from featured" : "Feature this item"
                        }
                        className="shrink-0 rounded-md p-1 transition-colors hover:bg-muted"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            item.isFeatured
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          )}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "truncate font-medium",
                              !item.isAvailable && "text-muted-foreground"
                            )}
                          >
                            {item.name}
                          </span>
                          {!item.isAvailable && (
                            <Badge variant="destructive">Sold out</Badge>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      {priceEditId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground">
                            {restaurant.currency}
                          </span>
                          <Input
                            autoFocus
                            type="number"
                            min={0}
                            value={priceDraft}
                            onChange={(e) => setPriceDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") savePrice(item);
                              if (e.key === "Escape") setPriceEditId(null);
                            }}
                            className="h-8 w-24 text-right tabular-nums"
                          />
                          <Button
                            size="iconSm"
                            variant="ghost"
                            onClick={() => savePrice(item)}
                            title="Save price"
                          >
                            <Check className="h-4 w-4 text-emerald-600" />
                          </Button>
                          <Button
                            size="iconSm"
                            variant="ghost"
                            onClick={() => setPriceEditId(null)}
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startPriceEdit(item)}
                          title="Click to edit price"
                          className="group/price flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 font-medium tabular-nums transition-all hover:border-border hover:bg-muted/60 hover:shadow-sm"
                        >
                          {formatPrice(item.price, restaurant.currency)}
                          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover/price:opacity-100" />
                        </button>
                      )}

                      <div className="flex shrink-0 items-center gap-2">
                        <div
                          className="flex items-center gap-2"
                          title={item.isAvailable ? "Available" : "Sold out"}
                        >
                          <Switch
                            checked={item.isAvailable}
                            onCheckedChange={(checked) => {
                              updateItem(item.id, { isAvailable: checked });
                              notify(
                                checked
                                  ? `${item.name} is back on the menu`
                                  : `${item.name} marked sold out`
                              );
                            }}
                          />
                          <span className="w-16 text-xs text-muted-foreground">
                            {item.isAvailable ? "Available" : "Sold out"}
                          </span>
                        </div>
                        <Button
                          size="iconSm"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                          title="Edit item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="iconSm"
                          variant="ghost"
                          onClick={() => setConfirmDelete(item)}
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
            );
          })}
        </div>
      )}

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "Add menu item"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the item details below."
                : "New items are available by default."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForm} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="item-name">Name</Label>
              <Input
                id="item-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Grilled Red Snapper"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="item-category">Category</Label>
                <select
                  id="item-category"
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="item-price">Price ({restaurant.currency})</Label>
                <Input
                  id="item-price"
                  required
                  type="number"
                  min={0}
                  step="any"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item-desc">Description</Label>
              <Textarea
                id="item-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short description shown on the public menu"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editing ? "Save changes" : "Add item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete item?</DialogTitle>
            <DialogDescription>
              “{confirmDelete?.name}” will be removed from the menu. This
              can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) {
                  deleteItem(confirmDelete.id);
                  notify("Item deleted");
                }
                setConfirmDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
