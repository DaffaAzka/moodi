"use client";

import { useState } from "react";
import { resetUserPasswordAction } from "../actions";
import { PixelIcon } from "@/components/pixel";
import type { UserListItem } from "../types";

export function ResetPasswordModal({
  user,
  onClose,
}: {
  user: UserListItem | null;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await resetUserPasswordAction({ error: "", success: "" }, formData);

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
            <div className="flex size-7 items-center justify-center border-2 border-border bg-moodi-sky text-ink">
              <PixelIcon name="save" size={16} />
            </div>
            <h2 className="font-pixelify text-xl font-bold">
              Reset Kata Sandi
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

        {error && (
          <div
            className="mb-4 border-2 border-border bg-moodi-peach/40 p-3 text-xs font-semibold text-ink"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-4 border-2 border-border bg-muted/20 p-3 text-xs">
          <span className="text-muted-foreground">Reset sandi untuk:</span>
          <p className="mt-0.5 text-sm font-bold text-foreground">{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            ℹ️ Semua sesi login aktif milik pengguna ini akan otomatis dihentikan demi keamanan.
          </p>
        </div>

        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          <input name="id" type="hidden" value={user.id} />

          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="reset-new-password">
              Kata Sandi Baru <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              id="reset-new-password"
              minLength={8}
              name="password"
              placeholder="Minimal 8 karakter"
              required
              type="password"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="reset-confirm-password">
              Konfirmasi Kata Sandi Baru <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              id="reset-confirm-password"
              minLength={8}
              name="confirmPassword"
              placeholder="Ketik ulang kata sandi baru"
              required
              type="password"
            />
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
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Mereset..." : "Reset Kata Sandi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
