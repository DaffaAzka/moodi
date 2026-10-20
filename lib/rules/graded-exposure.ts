import { RULES } from "@/config/rules";
import type { ErrorCause, TryoutMode } from "@/app/generated/prisma/enums";

export interface SessionAutopsySummary {
  sessionId: string;
  totalWrongAnswers: number;
  panicOrTimeoutCount: number;
}

export interface GradedExposureResult {
  isTriggered: boolean;
  ruleKey: "graded_exposure" | null;
  reason: string | null;
  recommendedLevel: TryoutMode | null;
  panicOrTimeoutShare: number;
}

export function evaluateGradedExposure(
  recentSessions: SessionAutopsySummary[],
  config = RULES.gradedExposure,
): GradedExposureResult {
  if (recentSessions.length === 0) {
    return {
      isTriggered: false,
      ruleKey: null,
      reason: null,
      recommendedLevel: null,
      panicOrTimeoutShare: 0,
    };
  }

  const targetSessions = recentSessions.slice(0, config.recentTryouts);
  const totalWrong = targetSessions.reduce((acc, s) => acc + s.totalWrongAnswers, 0);
  const totalPressureMistakes = targetSessions.reduce(
    (acc, s) => acc + s.panicOrTimeoutCount,
    0,
  );

  if (totalWrong === 0) {
    return {
      isTriggered: false,
      ruleKey: null,
      reason: null,
      recommendedLevel: null,
      panicOrTimeoutShare: 0,
    };
  }

  const share = totalPressureMistakes / totalWrong;

  if (share > config.panicOrTimeoutShare) {
    const pct = Math.round(share * 100);
    return {
      isTriggered: true,
      ruleKey: "graded_exposure",
      reason: `Sebanyak ${pct}% kesalahan di tryout terakhirmu berkaitan dengan tekanan waktu atau kepanikan. Disarankan latihan bertahap di mode Santai untuk menstabilkan fokus.`,
      recommendedLevel: "relaxed",
      panicOrTimeoutShare: share,
    };
  }

  return {
    isTriggered: false,
    ruleKey: null,
    reason: null,
    recommendedLevel: null,
    panicOrTimeoutShare: share,
  };
}

export function isPanicOrTimeoutError(tag: ErrorCause | null): boolean {
  return tag === "panic" || tag === "out_of_time";
}
