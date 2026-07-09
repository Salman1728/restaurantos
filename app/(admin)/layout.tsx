import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Toaster } from "@/components/toaster";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
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
