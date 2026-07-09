"use client";

import { useState, type FormEvent } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { categoryTint, cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/types";

export default function CategoriesPage() {
  const {
    categories,
    items,
    addCategory,
    updateCategory,
    deleteCategory,
    notify,
  } = useStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MenuCategory | null>(null);

  const itemCount = (catId: string) =>
    items.filter((i) => i.categoryId === catId).length;

  const openAdd = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEdit = (cat: MenuCategory) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setDialogOpen(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) {
      updateCategory(editing.id, {
        name: name.trim(),
        description: description.trim(),
      });
      notify("Category updated");
    } else {
      addCategory({ name: name.trim(), description: description.trim() });
      notify("Category added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (cat: MenuCategory) => {
    const ok = deleteCategory(cat.id);
    if (ok) {
      notify("Category deleted");
    } else {
      notify("Move or delete its items first");
    }
    setConfirmDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organise your menu into sections shown on the public site."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, index) => {
          const count = itemCount(cat.id);
          const tint = categoryTint(index);
          return (
            <Card
              key={cat.id}
              className="group transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                      tint.bg,
                      tint.text
                    )}
                  >
                    <FolderOpen className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="iconSm"
                      variant="ghost"
                      onClick={() => openEdit(cat)}
                      title="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="iconSm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(cat)}
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="mt-3 font-semibold">{cat.name}</h3>
                <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                  {cat.description || "No description"}
                </p>
                <Badge variant="secondary" className="mt-3">
                  {count} item{count === 1 ? "" : "s"}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "Add category"}
            </DialogTitle>
            <DialogDescription>
              Categories group items on your public menu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Desserts"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional short description"
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
                {editing ? "Save changes" : "Add category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {confirmDelete && itemCount(confirmDelete.id) > 0
                ? `“${confirmDelete.name}” still has ${itemCount(
                    confirmDelete.id
                  )} item(s). Move or delete them first — deleting will be blocked.`
                : `“${confirmDelete?.name}” will be removed. This can't be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={
                confirmDelete !== null && itemCount(confirmDelete.id) > 0
              }
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
