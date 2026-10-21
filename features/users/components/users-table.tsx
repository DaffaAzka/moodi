"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PixelIcon } from "@/components/pixel";
import type { UserListItem } from "../types";

export function UsersTable({
  users,
  totalCount,
  totalPages,
  currentPage,
  currentAdminId,
  onEditUser,
  onChangeRole,
  onResetPassword,
  onDeleteUser,
}: {
  users: UserListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentAdminId: string;
  onEditUser: (user: UserListItem) => void;
  onChangeRole: (user: UserListItem) => void;
  onResetPassword: (user: UserListItem) => void;
  onDeleteUser: (user: UserListItem) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  }

  function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  if (users.length === 0) {
    return (
      <div className="border-2 border-border bg-card p-12 text-center shadow-[4px_4px_0_var(--border)]">
        <div className="mx-auto flex size-12 items-center justify-center border-2 border-border bg-muted text-muted-foreground">
          <PixelIcon name="user" size={24} />
        </div>
        <h3 className="mt-4 font-pixelify text-lg font-bold text-foreground">
          Tidak ada pengguna ditemukan
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Coba sesuaikan kata kunci pencarian atau ganti filter peran.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop / Tablet Table View (hidden on mobile) */}
      <div className="hidden overflow-x-auto border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] md:block">
        <table className="min-w-full divide-y-2 divide-border text-left text-xs">
          <thead className="bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Pengguna</th>
              <th className="px-3 py-3">Peran</th>
              <th className="px-3 py-3">Target Belajar</th>
              <th className="px-3 py-3">Aktivitas</th>
              <th className="px-3 py-3">Terdaftar</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y border-border">
            {users.map((u) => {
              const isSelf = u.id === currentAdminId;
              const hasTarget =
                u.studentProfile?.targetUniversity || u.studentProfile?.targetMajor;

              return (
                <tr className="hover:bg-muted/30 transition-colors" key={u.id}>
                  {/* User info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center border-2 border-border font-bold text-xs select-none ${
                          u.role === "admin"
                            ? "bg-moodi-peach/40 text-ink"
                            : "bg-moodi-sky/40 text-ink"
                        }`}
                      >
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-bold text-foreground sm:text-sm">
                            {u.name}
                          </span>
                          {isSelf && (
                            <span className="border border-border bg-muted px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground">
                              Kamu
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className="truncate">{u.email}</span>
                          {u.emailVerified ? (
                            <span
                              className="text-moodi-sky"
                              title="Email terverifikasi"
                            >
                              <PixelIcon name="check-circle" size={12} />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 border-2 border-border px-2.5 py-0.5 text-[11px] font-bold ${
                        u.role === "admin"
                          ? "bg-moodi-peach text-ink"
                          : "bg-moodi-sky text-ink"
                      }`}
                    >
                      {u.role === "admin" ? "Admin" : "Siswa"}
                    </span>
                  </td>

                  {/* Student Target */}
                  <td className="px-3 py-3">
                    {u.role === "student" ? (
                      hasTarget ? (
                        <div className="max-w-[180px] leading-tight">
                          <p className="truncate font-semibold text-foreground">
                            {u.studentProfile?.targetUniversity || "Universitas belum diatur"}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {u.studentProfile?.targetMajor || "Jurusan belum diatur"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Belum diatur
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        Akses Panel Admin
                      </span>
                    )}
                  </td>

                  {/* Activity Stats */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                      <span>
                        <strong className="text-foreground">{u._count.tryoutSessions}</strong> tryout
                      </span>
                      <span>
                        <strong className="text-foreground">{u._count.checkins}</strong> check-in
                      </span>
                    </div>
                  </td>

                  {/* Registered date */}
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="pixel-press inline-flex size-8 items-center justify-center border-2 border-border bg-card hover:bg-muted text-foreground"
                        onClick={() => onEditUser(u)}
                        title="Ubah data pengguna"
                        type="button"
                      >
                        <PixelIcon name="edit" size={14} />
                      </button>

                      <button
                        className={`pixel-press inline-flex size-8 items-center justify-center border-2 border-border ${
                          isSelf
                            ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                            : "bg-card hover:bg-muted text-foreground"
                        }`}
                        disabled={isSelf}
                        onClick={() => onChangeRole(u)}
                        title={
                          isSelf
                            ? "Kamu tidak dapat mengubah peran akunmu sendiri"
                            : "Ubah peran pengguna"
                        }
                        type="button"
                      >
                        <PixelIcon name="refresh" size={14} />
                      </button>

                      <button
                        className="pixel-press inline-flex size-8 items-center justify-center border-2 border-border bg-card hover:bg-muted text-foreground"
                        onClick={() => onResetPassword(u)}
                        title="Reset kata sandi"
                        type="button"
                      >
                        <PixelIcon name="save" size={14} />
                      </button>

                      <button
                        className={`pixel-press inline-flex size-8 items-center justify-center border-2 border-border ${
                          isSelf
                            ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                            : "bg-moodi-peach/30 hover:bg-moodi-peach text-ink"
                        }`}
                        disabled={isSelf}
                        onClick={() => onDeleteUser(u)}
                        title={
                          isSelf
                            ? "Kamu tidak dapat menghapus akunmu sendiri"
                            : "Hapus pengguna"
                        }
                        type="button"
                      >
                        <PixelIcon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack View (visible on <768px) */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => {
          const isSelf = u.id === currentAdminId;
          const hasTarget =
            u.studentProfile?.targetUniversity || u.studentProfile?.targetMajor;

          return (
            <div
              className="border-2 border-border bg-card p-4 shadow-[3px_3px_0_var(--border)] space-y-3"
              key={u.id}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center border-2 border-border font-bold text-xs select-none ${
                      u.role === "admin"
                        ? "bg-moodi-peach/40 text-ink"
                        : "bg-moodi-sky/40 text-ink"
                    }`}
                  >
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground text-sm">
                        {u.name}
                      </span>
                      {isSelf && (
                        <span className="border border-border bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                          Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center border-2 border-border px-2 py-0.5 text-[10px] font-bold ${
                    u.role === "admin"
                      ? "bg-moodi-peach text-ink"
                      : "bg-moodi-sky text-ink"
                  }`}
                >
                  {u.role === "admin" ? "Admin" : "Siswa"}
                </span>
              </div>

              {u.role === "student" && hasTarget && (
                <div className="border border-border/60 bg-muted/20 p-2 text-[11px]">
                  <span className="font-bold text-foreground block">
                    {u.studentProfile?.targetUniversity}
                  </span>
                  <span className="text-muted-foreground">
                    {u.studentProfile?.targetMajor}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                <span>
                  <strong>{u._count.tryoutSessions}</strong> tryout • <strong>{u._count.checkins}</strong> check-in
                </span>
                <span>{formatDate(u.createdAt)}</span>
              </div>

              {/* Mobile Actions */}
              <div className="grid grid-cols-4 gap-1.5 border-t border-border/40 pt-2">
                <button
                  className="pixel-press flex min-h-8 items-center justify-center gap-1 border-2 border-border bg-card text-[11px] font-semibold hover:bg-muted"
                  onClick={() => onEditUser(u)}
                  type="button"
                >
                  <PixelIcon name="edit" size={12} />
                  <span>Edit</span>
                </button>

                <button
                  className="pixel-press flex min-h-8 items-center justify-center gap-1 border-2 border-border bg-card text-[11px] font-semibold hover:bg-muted disabled:opacity-40"
                  disabled={isSelf}
                  onClick={() => onChangeRole(u)}
                  type="button"
                >
                  <PixelIcon name="refresh" size={12} />
                  <span>Peran</span>
                </button>

                <button
                  className="pixel-press flex min-h-8 items-center justify-center gap-1 border-2 border-border bg-card text-[11px] font-semibold hover:bg-muted"
                  onClick={() => onResetPassword(u)}
                  type="button"
                >
                  <PixelIcon name="save" size={12} />
                  <span>Sandi</span>
                </button>

                <button
                  className="pixel-press flex min-h-8 items-center justify-center gap-1 border-2 border-border bg-moodi-peach/30 text-[11px] font-semibold text-ink hover:bg-moodi-peach disabled:opacity-40"
                  disabled={isSelf}
                  onClick={() => onDeleteUser(u)}
                  type="button"
                >
                  <PixelIcon name="trash" size={12} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 border-2 border-border bg-card p-3 shadow-[2px_2px_0_var(--border)] sm:flex-row sm:items-center sm:justify-between text-xs">
          <p className="text-muted-foreground">
            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (total {totalCount} pengguna)
          </p>

          <div className="flex items-center gap-2">
            <button
              className="pixel-press inline-flex min-h-8 items-center gap-1 border-2 border-border bg-background px-3 font-semibold hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              type="button"
            >
              <PixelIcon name="chevron-left" size={14} />
              <span>Sebelumnya</span>
            </button>

            <button
              className="pixel-press inline-flex min-h-8 items-center gap-1 border-2 border-border bg-background px-3 font-semibold hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
              type="button"
            >
              <span>Berikutnya</span>
              <PixelIcon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
