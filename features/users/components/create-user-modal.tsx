"use client";

import { useState } from "react";
import { createUserAction } from "../actions";
import { PixelIcon } from "@/components/pixel";

export function CreateUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await createUserAction({ error: "", success: "" }, formData);

    setIsPending(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[6vh] pb-8">
      {/* Backdrop */}
      <div
        aria-hidden
        className="fixed inset-0 bg-foreground/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        aria-modal="true"
        className="relative z-10 w-full max-w-lg border-2 border-border bg-card p-5 shadow-[6px_6px_0_var(--border)] sm:p-6"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center border-2 border-border bg-moodi-sky text-ink">
              <PixelIcon name="plus" size={16} />
            </div>
            <h2 className="font-pixelify text-xl font-bold">
              Tambah Pengguna Baru
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

        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="create-name">
              Nama Lengkap <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              id="create-name"
              maxLength={100}
              name="name"
              placeholder="Contoh: Daffa Pratama"
              required
              type="text"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="create-email">
              Alamat Email <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              id="create-email"
              maxLength={255}
              name="email"
              placeholder="nama@email.com"
              required
              type="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="create-password">
              Kata Sandi Awal <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              id="create-password"
              minLength={8}
              name="password"
              placeholder="Minimal 8 karakter"
              required
              type="password"
            />
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">
              Peran Pengguna <span className="text-moodi-pink">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex cursor-pointer items-start gap-2 border-2 border-border p-2.5 transition-colors ${
                  role === "student"
                    ? "bg-moodi-sky/30 border-foreground shadow-[2px_2px_0_var(--border)]"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <input
                  checked={role === "student"}
                  className="mt-0.5"
                  name="role"
                  onChange={() => setRole("student")}
                  type="radio"
                  value="student"
                />
                <div>
                  <span className="block font-bold text-foreground">Siswa</span>
                  <span className="block text-[11px] text-muted-foreground">
                    Akses materi, tryout, dan ruang tenang.
                  </span>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2 border-2 border-border p-2.5 transition-colors ${
                  role === "admin"
                    ? "bg-moodi-peach/30 border-foreground shadow-[2px_2px_0_var(--border)]"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <input
                  checked={role === "admin"}
                  className="mt-0.5"
                  name="role"
                  onChange={() => setRole("admin")}
                  type="radio"
                  value="admin"
                />
                <div>
                  <span className="block font-bold text-foreground">Admin</span>
                  <span className="block text-[11px] text-muted-foreground">
                    Akses bank soal, materi AI, dan pengguna.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Optional student fields if role is student */}
          {role === "student" && (
            <div className="space-y-3 border-2 border-dashed border-border bg-muted/20 p-3">
              <span className="block font-bold text-foreground">
                Profil Target Belajar Siswa (Opsional)
              </span>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="create-target-univ">
                    Target Universitas
                  </label>
                  <input
                    className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                    id="create-target-univ"
                    name="targetUniversity"
                    placeholder="Contoh: ITB, UI, UGM"
                    type="text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="create-target-major">
                    Target Jurusan
                  </label>
                  <input
                    className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                    id="create-target-major"
                    name="targetMajor"
                    placeholder="Contoh: Teknik Informatika"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="create-exam-date">
                  Target Tanggal Ujian UTBK
                </label>
                <input
                  className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                  id="create-exam-date"
                  name="examDate"
                  type="date"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 font-semibold text-muted-foreground">
                <input
                  defaultChecked
                  name="wellbeingConsent"
                  type="checkbox"
                />
                <span>Aktifkan Izin Data Kesejahteraan (Wellbeing Consent)</span>
              </label>
            </div>
          )}

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
              {isPending ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
