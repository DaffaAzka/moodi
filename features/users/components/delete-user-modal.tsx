"use client";

import { useState } from "react";
import { deleteUserAction } from "../actions";
import { PixelIcon } from "@/components/pixel";
import type { UserListItem } from "../types";

export function DeleteUserModal({
  user,
  currentAdminId,
  onClose,
}: {
  user: UserListItem | null;
  currentAdminId: string;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!user) return null;

  const isSelf = user.id === currentAdminId;

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSelf) {
      setError("Kamu tidak dapat menghapus akunmu sendiri.");
      return;
    }

    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await deleteUserAction({ error: "", success: "" }, formData);

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
              <PixelIcon name="trash" size={16} />
            </div>
            <h2 className="font-pixelify text-xl font-bold text-foreground">
              Hapus Pengguna
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

        {isSelf ? (
          <div
            className="mb-4 border-2 border-border bg-moodi-peach/40 p-3 text-xs font-semibold text-ink"
            role="alert"
          >
            <p className="font-bold">Aksi Tidak Diizinkan</p>
            <p className="mt-1">
              Kamu sedang masuk dengan akun ini. Kamu tidak dapat menghapus akunmu sendiri demi keamanan sistem.
            </p>
          </div>
        ) : (
          <div
            className="mb-4 border-2 border-border bg-moodi-peach/30 p-3 text-xs text-ink"
            role="alert"
          >
            <p className="font-bold">⚠️ Peringatan Penghapusan Permanen</p>
            <p className="mt-1 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Menghapus akun <strong>&ldquo;{user.name}&rdquo;</strong> ({user.email}) akan menghapus seluruh data terkait (riwayat tryout, check-in harian, dan progres belajar).
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
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tryout yang diselesaikan:</span>
            <span className="font-bold">{user._count.tryoutSessions}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-muted-foreground">Catatan Check-in:</span>
            <span className="font-bold">{user._count.checkins}</span>
          </div>
        </div>

        <form className="flex items-center justify-end gap-2 border-t border-border/40 pt-3" onSubmit={handleDelete}>
          <input name="id" type="hidden" value={user.id} />
          <button
            className="pixel-press border-2 border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
            onClick={onClose}
            type="button"
          >
            Batal
          </button>
          <button
            className="pixel-press border-2 border-border bg-moodi-peach px-4 py-2 text-xs font-bold text-ink shadow-[2px_2px_0_var(--border)] hover:brightness-95 disabled:opacity-50"
            disabled={isPending || isSelf}
            type="submit"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Pengguna"}
          </button>
        </form>
      </div>
    </div>
  );
}
