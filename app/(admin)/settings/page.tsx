"use client";

import { useState, type FormEvent } from "react";
import { Phone, Save, Store, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { restaurant } = useStore();
  // Key by restaurant so the form re-seeds when the active restaurant changes.
  return <SettingsForm key={restaurant.id} />;
}

function SettingsForm() {
  const { restaurant, updateRestaurant, notify } = useStore();
  const [form, setForm] = useState({ ...restaurant });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = (e: FormEvent) => {
    e.preventDefault();
    const slug = form.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-");
    updateRestaurant({ ...form, slug });
    setForm((f) => ({ ...f, slug }));
    notify("Settings saved");
  };

  return (
    <>
      <PageHeader
        title="Restaurant Settings"
        description="Profile details served to your public website via the menu API."
      />

      <form onSubmit={save} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Store className="h-4 w-4" />
              </span>
              Profile
            </CardTitle>
            <CardDescription>
              Name, slug and description shown on your public menu.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Restaurant name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Public API: /api/public/menu/{form.slug || "…"}
              </p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <Phone className="h-4 w-4" />
              </span>
              Contact & location
            </CardTitle>
            <CardDescription>
              Shown on the public site and used for customer orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Wallet className="h-4 w-4" />
              </span>
              Menu display
            </CardTitle>
            <CardDescription>
              Currency, hours and publishing status.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency prefix</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                placeholder="e.g. KSh, $, £"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hours">Opening hours</Label>
              <Input
                id="hours"
                value={form.openingHours}
                onChange={(e) => set("openingHours", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 sm:col-span-2">
              <div>
                <div className="text-sm font-medium">Publish menu</div>
                <p className="text-sm text-muted-foreground">
                  When off, the public API returns 404 and connected websites
                  hide the menu.
                </p>
              </div>
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) => set("isPublished", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-border bg-card/90 px-5 py-3 shadow-lg backdrop-blur">
          <p className="text-sm text-muted-foreground">
            Changes go live on every connected website immediately.
          </p>
          <Button type="submit">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </form>
    </>
  );
}
