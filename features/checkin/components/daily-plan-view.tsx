"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { StudentDashboardData } from "../queries";
import { toggleTaskStatusAction, swapTaskAction } from "../actions";
import { ActiveSessionCard } from "@/features/practice/components/active-session-card";
import { PixelIcon } from "@/components/pixel";

interface DailyPlanViewProps {
  data: StudentDashboardData;
  onEditCheckin?: () => void;
}

export function DailyPlanView({ data, onEditCheckin }: DailyPlanViewProps) {
  const { todayPlan, todayCheckin, profile, daysUntilExam, activeSession } =
    data;

  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);
  const [swappingTaskId, setSwappingTaskId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (!todayPlan) return null;

  const mode = todayPlan.mode;

  const modeConfig = {
    recovery: {
      title: "Mode Pemulihan",
      subtitle: "Hari ini ritme santai dulu.",
      bg: "bg-moodi-sky/30",
      badgeBg: "bg-moodi-sky",
      border: "border-moodi-sky",
      accent: "text-ink",
    },
    challenge: {
      title: "Mode Tantangan",
      subtitle: "Energimu prima, dorong kapasitas maksimal.",
      bg: "bg-moodi-pink/30",
      badgeBg: "bg-moodi-pink",
      border: "border-moodi-pink",
      accent: "text-ink",
    },
    balanced: {
      title: "Mode Seimbang",
      subtitle: "Jaga ritme dan konsistensi belajarmu.",
      bg: "bg-moodi-butter/30",
      badgeBg: "bg-moodi-butter",
      border: "border-moodi-butter",
      accent: "text-ink",
    },
  }[mode];

  // Referral & Rest Suggestion checks from rule engine
  const isReferralTriggered = data.isReferralTriggered;
  const restSuggestion = data.restSuggestion;

  function handleToggle(taskId: string, currentStatus: string) {
    setTogglingTaskId(taskId);
    startTransition(async () => {
      await toggleTaskStatusAction(
        taskId,
        currentStatus === "done" ? "pending" : "done",
      );
      setTogglingTaskId(null);
    });
  }

  function handleSwap(taskId: string) {
    setSwappingTaskId(taskId);
    startTransition(async () => {
      await swapTaskAction(taskId);
      setSwappingTaskId(null);
    });
  }

  const completedCount =
    todayPlan.tasks.filter((t) => t.status === "done").length;
  const totalTasks = todayPlan.tasks.length;

  return (
    <div className="space-y-6">
      {/* Active Tryout Session Alert */}
      {activeSession && <ActiveSessionCard session={activeSession} />}

      {/* Gentle Referral Banner (if high strain persists) */}
      {isReferralTriggered && (
        <aside
          aria-label="Dukungan Kesejahteraan"
          className="pixel-shadow flex flex-col gap-3 border-2 border-border bg-moodi-peach/40 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-muted-foreground">
              <PixelIcon name="support" size={16} />
              <span>Ruang Dukungan</span>
            </div>
            <h3 className="font-semibold text-foreground">
              Beberapa hari ini terasa berat. Kamu tidak harus menghadapinya sendirian.
            </h3>
            <p className="text-xs text-muted-foreground">
              Tersedia konselor sekolah dan kontak layanan resmi yang siap mendengar tanpa menghakimi.
            </p>
          </div>
          <Link
            className="pixel-press inline-flex shrink-0 items-center justify-center gap-1.5 border-2 border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--border)] hover:bg-muted"
            href="/dashboard/support"
          >
            <span>Kontak bantuan</span>
            <PixelIcon name="arrow-right" size={14} />
          </Link>
        </aside>
      )}

      {/* Rest Suggestion Banner (Rule key: rest_suggestion) */}
      {restSuggestion?.isTriggered && (
        <aside
          aria-label="Saran Istirahat"
          className="pixel-shadow flex flex-col gap-3 border-2 border-border bg-moodi-butter/40 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-muted-foreground">
              <PixelIcon name="sleep" size={16} />
              <span>Saran Istirahat</span>
            </div>
            <h3 className="font-semibold text-foreground">
              {restSuggestion.reason}
            </h3>
            <p className="text-xs text-muted-foreground">
              Belajar efektif tidak selalu tentang durasi yang terus ditambah. Luangkan waktu sejenak di Ruang Tenang atau istirahat cukup.
            </p>
          </div>
          <Link
            className="pixel-press inline-flex shrink-0 items-center justify-center gap-1.5 border-2 border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--border)] hover:bg-muted"
            href="/dashboard/calm"
          >
            <span>Ke Ruang Tenang</span>
            <PixelIcon name="arrow-right" size={14} />
          </Link>
        </aside>
      )}

      {/* Structural Mode Banner & Daily Status */}
      <section
        aria-labelledby="today-mode-title"
        className={`pixel-shadow border-2 border-border ${modeConfig.bg} p-5 sm:p-7 space-y-4`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-pixelify text-sm font-bold text-foreground tracking-wide">
              {modeConfig.title}
            </span>
            {daysUntilExam !== null && (
              <span className="text-xs font-mono text-muted-foreground">
                {daysUntilExam} hari menuju UTBK
              </span>
            )}
          </div>

          {onEditCheckin && (
            <button
              className="pixel-press inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
              onClick={onEditCheckin}
              type="button"
            >
              <PixelIcon name="edit" size={14} />
              <span>Ubah kondisi</span>
            </button>
          )}
        </div>

        <div>
          <h2
            className="font-pixelify text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            id="today-mode-title"
          >
            {modeConfig.subtitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            <span className="font-semibold">Kenapa ini?</span> {todayPlan.reason}
          </p>
        </div>

        {/* Streamlined Condition Snapshot */}
        {todayCheckin && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/40 pt-3 text-xs text-muted-foreground font-mono">
            <span>
              Tidur {todayCheckin.sleepHours}j · Energi {todayCheckin.energy}/5 · Mood {todayCheckin.mood}/5 · Stres {todayCheckin.stress}/5
            </span>
            {todayCheckin.note && (
              <span className="italic font-sans text-foreground">
                · &ldquo;{todayCheckin.note}&rdquo;
              </span>
            )}
          </div>
        )}

        {/* Target summary if present */}
        {profile?.targetUniversity && (
          <div className="text-xs text-muted-foreground">
            Target:{" "}
            <span className="font-semibold text-foreground">
              {profile.targetUniversity}
              {profile.targetMajor ? ` · ${profile.targetMajor}` : ""}
            </span>
          </div>
        )}
      </section>

      {/* Today's Tasks */}
      <section aria-labelledby="tasks-heading" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h2
              className="font-pixelify text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              id="tasks-heading"
            >
              Rencana Belajar Hari Ini
            </h2>
            <p className="text-xs text-muted-foreground">
              {completedCount} dari {totalTasks} langkah terselesaikan.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {todayPlan.tasks.map((task, index) => {
            const isDone = task.status === "done";
            const isToggling = togglingTaskId === task.id;
            const isSwapping = swappingTaskId === task.id;

            const typeConfig = {
              lesson: { label: "Materi Konsep", icon: "book" as const },
              review: { label: "Ulasan Catatan", icon: "target" as const },
              practice: { label: "Latihan Soal", icon: "timer" as const },
              tryout: { label: "Simulasi Tryout", icon: "chart" as const },
              calm: { label: "Ruang Tenang", icon: "breathe" as const },
              rest: { label: "Istirahat", icon: "sleep" as const },
            }[task.type] ?? { label: "Tugas", icon: "target" as const };

            const targetHref =
              task.type === "lesson" && (task as any).lessonId
                ? `/dashboard/study/lessons/${(task as any).lessonId}`
                : task.type === "tryout"
                  ? "/dashboard/mock-exam"
                  : task.type === "calm"
                    ? "/dashboard/calm"
                    : "/dashboard/study";

            return (
              <article
                className={`pixel-shadow flex flex-col justify-between border-2 border-border p-4 transition-all sm:p-5 ${
                  isDone
                    ? "bg-muted/50 opacity-70"
                    : index === 0 && !isDone
                      ? "bg-card border-l-4 border-l-moodi-sky"
                      : "bg-card"
                }`}
                key={task.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <PixelIcon name={typeConfig.icon} size={16} className="text-muted-foreground" />
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {typeConfig.label}
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {task.estMinutes} mnt
                      </span>
                    </div>

                    <h3
                      className={`mt-2 text-base font-bold sm:text-lg ${
                        isDone
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.reason && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {task.reason}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2 shrink-0 sm:mt-0">
                    <button
                      className={`pixel-press inline-flex min-h-9 items-center gap-1.5 border-2 border-border px-3 py-1 text-xs font-bold ${
                        isDone
                          ? "bg-foreground text-background"
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                      disabled={isToggling}
                      onClick={() => handleToggle(task.id, task.status)}
                      type="button"
                    >
                      {isDone && <PixelIcon name="check" size={12} />}
                      <span>{isDone ? "Selesai" : "Tandai selesai"}</span>
                    </button>

                    <button
                      className="text-xs text-muted-foreground underline hover:text-foreground disabled:opacity-50 px-1"
                      disabled={isSwapping || isDone}
                      onClick={() => handleSwap(task.id)}
                      title="Ganti dengan pilihan topik alternatif"
                      type="button"
                    >
                      {isSwapping ? "..." : "Ganti"}
                    </button>

                    {!isDone && (
                      <Link
                        className="pixel-press inline-flex min-h-9 items-center justify-center gap-1.5 border-2 border-border bg-moodi-sky px-4 text-xs font-bold text-ink hover:bg-moodi-sky/90"
                        href={targetHref}
                      >
                        <span>Mulai</span>
                        <PixelIcon name="arrow-right" size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
