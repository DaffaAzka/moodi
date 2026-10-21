"use client";

import { useState } from "react";
import { changeUserRoleAction } from "../actions";
import { PixelIcon } from "@/components/pixel";
import type { UserListItem } from "../types";

export function ChangeRoleModal({
  user,
  currentAdminId,
  onClose,
}: {
  user: UserListItem | null;
  currentAdminId: string;
  onClose: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">(
    user?.role ?? "student",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!user) return null;

  const isSelf = user.id === currentAdminId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSelf) {
      setError("Kamu tidak dapat mengubah peran akunmu sendiri.");
      return;
    }

    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await changeUserRoleAction({ error: "", success: "" }, formData);

    setIsPending(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[8vh] pb-8">
      {/* Backdrop */}
      <div
        aria-hidden
        className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        aria-modal="true"
        className="relative z-10 w-full max-w-md border-2 border-border bg-card p-5 shadow-[6px_6px_0_var(--border)] sm:p-6"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center border-2 border-border bg-moodi-peach text-ink">
              <PixelIcon name="refresh" size={16} />
            </div>
            <h2 className="font-pixelify text-xl font-bold">
              Ubah Peran Pengguna
            </h2>
          </div>
          <button
            className="grid size-8 shrink-0 place-items-center border-2 border-border text-lg leading-none hover:bg-muted"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {isSelf && (
          <div
            className="mb-4 border-2 border-border bg-moodi-butter/40 p-3 text-xs font-semibold text-ink"
            role="alert"
          >
            <p className="font-bold">Perhatian Akun Sendiri</p>
            <p className="mt-1">
              Kamu sedang masuk dengan akun ini. Kamu tidak dapat mengubah peran akunmu sendiri untuk mencegah hilangnya akses administratif.
            </p>
          </div>
        )}

        {error && (
          <div
            className="mb-4 border-2 border-border bg-moodi-peach/40 p-3 text-xs font-semibold text-ink"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-4 border-2 border-border bg-muted/20 p-3 text-xs">
          <span className="text-muted-foreground">Target Pengguna:</span>
          <p className="mt-0.5 text-sm font-bold text-foreground">{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-muted-foreground">Peran saat ini:</span>
            <span
              className={`border border-border px-2 py-0.5 text-[11px] font-bold ${
                user.role === "admin"
                  ? "bg-moodi-peach text-ink"
                  : "bg-moodi-sky text-ink"
              }`}
            >
              {user.role === "admin" ? "Admin" : "Siswa"}
            </span>
          </div>
        </div>

        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          <input name="id" type="hidden" value={user.id} />

          <div className="space-y-2">
            <label className="font-bold text-foreground">
              Pilih Peran Baru:
            </label>

            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-start gap-2.5 border-2 border-border p-3 transition-colors ${
                  selectedRole === "student"
                    ? "bg-moodi-sky/30 border-foreground shadow-[2px_2px_0_var(--border)]"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <input
                  checked={selectedRole === "student"}
                  disabled={isSelf}
                  name="role"
                  onChange={() => setSelectedRole("student")}
                  type="radio"
                  value="student"
                />
                <div>
                  <span className="block font-bold text-foreground">Siswa (Student)</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    Akses standar belajar persiapan UTBK: materi, latihan soal, tryout bertahap, dan ruang tenang.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 border-2 border-border p-3 transition-colors ${
                  selectedRole === "admin"
                    ? "bg-moodi-peach/30 border-foreground shadow-[2px_2px_0_var(--border)]"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <input
                  checked={selectedRole === "admin"}
                  disabled={isSelf}
                  name="role"
                  onChange={() => setSelectedRole("admin")}
                  type="radio"
                  value="admin"
                />
                <div>
                  <span className="block font-bold text-foreground">Administrator</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    Akses administratif penuh: pengelolaan bank soal, topik dan subtes, draf AI, serta manajemen seluruh pengguna.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-3">
            <button
              className="pixel-press border-2 border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
              onClick={onClose}
              type="button"
            >
              Batal
            </button>
            <button
              className="pixel-press border-2 border-border bg-moodi-sky px-4 py-2 text-xs font-bold text-ink shadow-[2px_2px_0_var(--border)] hover:brightness-95 disabled:opacity-50"
              disabled={isPending || isSelf}
              type="submit"
            >
              {isPending ? "Menyimpan..." : "Simpan Peran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
