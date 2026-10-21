"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { PixelIcon } from "@/components/pixel";
import type { UserRole } from "@/app/generated/prisma/client";

export function UserFilters({
  onAddUser,
}: {
  onAddUser: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentRole = searchParams.get("role") || "all";
  const currentSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  function updateQuery(updates: { role?: string; search?: string; page?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.role !== undefined) {
      if (updates.role === "all") {
        params.delete("role");
      } else {
        params.set("role", updates.role);
      }
      params.delete("page"); // Reset to page 1 on filter change
    }

    if (updates.search !== undefined) {
      const trimmed = updates.search.trim();
      if (!trimmed) {
        params.delete("search");
      } else {
        params.set("search", trimmed);
      }
      params.delete("page"); // Reset to page 1 on search change
    }

    if (updates.page !== undefined) {
      params.set("page", updates.page);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({ search: searchTerm });
  }

  const roleTabs: Array<{ id: UserRole | "all"; label: string }> = [
    { id: "all", label: "Semua" },
    { id: "student", label: "Siswa" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Role filter buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {roleTabs.map((tab) => {
          const isActive = currentRole === tab.id;
          return (
            <button
              className={`pixel-press inline-flex min-h-9 items-center border-2 border-border px-3 text-xs font-semibold ${
                isActive
                  ? "bg-foreground text-background shadow-[2px_2px_0_var(--border)]"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
              key={tab.id}
              onClick={() => updateQuery({ role: tab.id })}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar & Add Button */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-md">
        <form
          className="relative flex-1"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="min-h-9 w-full border-2 border-border bg-background pl-8 pr-8 text-xs font-normal placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-2 focus:ring-link"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            type="text"
            value={searchTerm}
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <PixelIcon name="search" size={14} />
          </span>
          {searchTerm && (
            <button
              aria-label="Bersihkan pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchTerm("");
                updateQuery({ search: "" });
              }}
              type="button"
            >
              <PixelIcon name="close" size={14} />
            </button>
          )}
        </form>

        <button
          className="pixel-press inline-flex min-h-9 shrink-0 items-center gap-1.5 border-2 border-border bg-moodi-sky px-3 text-xs font-semibold text-ink shadow-[2px_2px_0_var(--border)] hover:brightness-95 active:translate-x-[2px] active:translate-y-[2px]"
          onClick={onAddUser}
          type="button"
        >
          <PixelIcon name="plus" size={14} />
          <span>Tambah Pengguna</span>
        </button>
      </div>
    </div>
  );
}
