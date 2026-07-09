"use client";

import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export function Toaster() {
  const { toasts } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
