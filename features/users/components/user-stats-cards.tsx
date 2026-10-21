"use client";

import { PixelIcon, type PixelIconName } from "@/components/pixel";
import type { UserStats } from "../types";

export function UserStatsCards({ stats }: { stats: UserStats }) {
  const cards: Array<{
    label: string;
    value: number;
    icon: PixelIconName;
    bgAccent: string;
    description: string;
  }> = [
    {
      label: "Total Pengguna",
      value: stats.totalUsers,
      icon: "user",
      bgAccent: "bg-moodi-sky/30 border-moodi-sky",
      description: "Akun terdaftar di MOODI",
    },
    {
      label: "Siswa Aktif",
      value: stats.totalStudents,
      icon: "book",
      bgAccent: "bg-moodi-butter/40 border-moodi-butter",
      description: "Peserta persiapan UTBK",
    },
    {
      label: "Administrator",
      value: stats.totalAdmins,
      icon: "target",
      bgAccent: "bg-moodi-peach/30 border-moodi-peach",
      description: "Pengelola konten & sistem",
    },
    {
      label: "Izin Kesejahteraan",
      value: stats.totalConsents,
      icon: "heart",
      bgAccent: "bg-moodi-pink/30 border-moodi-pink",
      description: "Siswa dengan wellbeing consent",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => (
        <div
          className="flex flex-col justify-between border-2 border-border bg-card p-4 shadow-[3px_3px_0_var(--border)]"
          key={c.label}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {c.label}
            </span>
            <div
              className={`flex size-8 shrink-0 items-center justify-center border-2 border-border ${c.bgAccent} text-ink`}
            >
              <PixelIcon name={c.icon} size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-pixelify text-2xl font-bold sm:text-3xl">
              {c.value.toLocaleString("id-ID")}
            </span>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {c.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
