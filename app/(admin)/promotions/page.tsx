"use client";

import { useState, type FormEvent } from "react";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Promo } from "@/lib/types";

interface PromoFormState {
  title: string;
  description: string;
  badge: string;
  isActive: boolean;
}

const emptyForm: PromoFormState = {
  title: "",
  description: "",
  badge: "",
  isActive: true,
};

export default function PromotionsPage() {
  const { promos, addPromo, updatePromo, deletePromo, notify } = useStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState<PromoFormState>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<Promo | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (promo: Promo) => {
    setEditing(promo);
    setForm({
      title: promo.title,
      description: promo.description,
      badge: promo.badge,
      isActive: promo.isActive,
    });
    setDialogOpen(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      badge: form.badge.trim(),
      isActive: form.isActive,
    };
    if (editing) {
      updatePromo(editing.id, data);
      notify("Promotion updated");
    } else {
      addPromo(data);
      notify("Promotion added");
    }
    setDialogOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Banners and offers served to your website and QR menu."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add promotion
          </Button>
        }
      />

      {promos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No promotions yet</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Create an offer and it goes live on every connected site.
              </p>
            </div>
            <Button onClick={openAdd} variant="outline" size="sm">
              <Plus className="h-4 w-4" /> Add your first promotion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <Card
              key={promo.id}
              className={cn(
                "group transition-all hover:-translate-y-0.5 hover:shadow-md",
                !promo.isActive && "opacity-70"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <Megaphone
                    className={cn(
                      "mt-1 h-4 w-4",
                      promo.isActive ? "text-orange-500" : "text-muted-foreground"
                    )}
                  />
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="iconSm"
                      variant="ghost"
                      onClick={() => openEdit(promo)}
                      title="Edit promotion"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="iconSm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(promo)}
                      title="Delete promotion"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <h3 className="font-semibold">{promo.title}</h3>
                  {promo.badge && (
                    <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/15">
                      {promo.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                  {promo.description || "No description"}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Switch
                    checked={promo.isActive}
                    onCheckedChange={(checked) => {
                      updatePromo(promo.id, { isActive: checked });
                      notify(
                        checked
                          ? `“${promo.title}” is now live`
                          : `“${promo.title}” paused`
                      );
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {promo.isActive ? "Live" : "Paused"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit promotion" : "Add promotion"}
            </DialogTitle>
            <DialogDescription>
              Active promotions appear on the public menu API for this
              restaurant&apos;s websites.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="promo-title">Title</Label>
              <Input
                id="promo-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Happy Hour"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-badge">Badge</Label>
              <Input
                id="promo-badge"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. 20% OFF (optional)"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-desc">Description</Label>
              <Textarea
                id="promo-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short pitch shown on the banner"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <Switch
                id="promo-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
              />
              <Label htmlFor="promo-active" className="cursor-pointer">
                {form.isActive ? "Live immediately" : "Start paused"}
              </Label>
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
                {editing ? "Save changes" : "Add promotion"}
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
            <DialogTitle>Delete promotion?</DialogTitle>
            <DialogDescription>
              “{confirmDelete?.title}” will be removed everywhere it appears.
              This can&apos;t be undone.
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
                  deletePromo(confirmDelete.id);
                  notify("Promotion deleted");
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
