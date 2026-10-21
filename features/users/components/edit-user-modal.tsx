"use client";

import { useState } from "react";
import { updateUserAction } from "../actions";
import { PixelIcon } from "@/components/pixel";
import type { UserListItem } from "../types";

export function EditUserModal({
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
    const res = await updateUserAction({ error: "", success: "" }, formData);

    setIsPending(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  const examDateValue = user.studentProfile?.examDate
    ? new Date(user.studentProfile.examDate).toISOString().split("T")[0]
    : "";

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
            <div className="flex size-7 items-center justify-center border-2 border-border bg-moodi-butter text-ink">
              <PixelIcon name="edit" size={16} />
            </div>
            <h2 className="font-pixelify text-xl font-bold">
              Ubah Data Pengguna
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
          <input name="id" type="hidden" value={user.id} />

          {/* Nama Lengkap */}
          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="edit-name">
              Nama Lengkap <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              defaultValue={user.name}
              id="edit-name"
              maxLength={100}
              name="name"
              required
              type="text"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-foreground" htmlFor="edit-email">
              Alamat Email <span className="text-moodi-pink">*</span>
            </label>
            <input
              className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-link"
              defaultValue={user.email}
              id="edit-email"
              maxLength={255}
              name="email"
              required
              type="email"
            />
          </div>

          {/* Email verification status toggle */}
          <div className="flex items-center gap-2 border-2 border-border bg-muted/20 p-2.5">
            <input
              defaultChecked={user.emailVerified}
              id="edit-email-verified"
              name="emailVerified"
              type="checkbox"
            />
            <label
              className="cursor-pointer font-semibold text-foreground select-none"
              htmlFor="edit-email-verified"
            >
              Email Terverifikasi
            </label>
          </div>

          {/* If user is student, allow editing target university & exam date */}
          {user.role === "student" && (
            <div className="space-y-3 border-2 border-dashed border-border bg-muted/20 p-3">
              <span className="block font-bold text-foreground">
                Profil Target Belajar Siswa
              </span>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="edit-target-univ">
                    Target Universitas
                  </label>
                  <input
                    className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                    defaultValue={user.studentProfile?.targetUniversity ?? ""}
                    id="edit-target-univ"
                    name="targetUniversity"
                    placeholder="Contoh: ITB, UI, UGM"
                    type="text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="edit-target-major">
                    Target Jurusan
                  </label>
                  <input
                    className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                    defaultValue={user.studentProfile?.targetMajor ?? ""}
                    id="edit-target-major"
                    name="targetMajor"
                    placeholder="Contoh: Kedokteran"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="edit-exam-date">
                  Target Tanggal Ujian UTBK
                </label>
                <input
                  className="min-h-9 w-full border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-link"
                  defaultValue={examDateValue}
                  id="edit-exam-date"
                  name="examDate"
                  type="date"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 font-semibold text-muted-foreground">
                <input
                  defaultChecked={user.studentProfile?.wellbeingConsent ?? false}
                  name="wellbeingConsent"
                  type="checkbox"
                />
                <span>Izin Data Kesejahteraan (Wellbeing Consent)</span>
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
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
