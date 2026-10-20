import { RULES } from "@/config/rules";
import type { DayMode } from "@/app/generated/prisma/enums";

export interface CheckinInput {
  sleepHours: number;
  energy: number;
  mood: number;
  stress: number;
}

export interface HistoricalCheckin {
  mood: number;
  stress: number;
  checkinDate: Date;
}

export interface ModeEvaluationResult {
  mode: DayMode;
  ruleKey: string;
  reason: string;
  isReferralTriggered: boolean;
}

export function isHighStrainCondition(mood: number, stress: number): boolean {
  return (
    mood <= RULES.referral.moodAtMost || stress >= RULES.referral.stressAtLeast
  );
}

export function checkReferralTriggered(
  todayInput: { mood: number; stress: number },
  recentHistory: HistoricalCheckin[],
  todayDate: Date = new Date(),
): boolean {
  if (!isHighStrainCondition(todayInput.mood, todayInput.stress)) {
    return false;
  }
  if (recentHistory.length < 2) {
    return false;
  }

  const prev1 = recentHistory[0];
  const prev2 = recentHistory[1];
  if (!prev1 || !prev2) return false;

  const diffDays = (a: Date, b: Date) => {
    const msA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const msB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((msA - msB) / (24 * 60 * 60 * 1000));
  };

  const diff1 = diffDays(todayDate, new Date(prev1.checkinDate));
  const diff2 = diffDays(new Date(prev1.checkinDate), new Date(prev2.checkinDate));

  // Must be strictly consecutive calendar days (1 day gap between each)
  if (diff1 !== 1 || diff2 !== 1) {
    return false;
  }

  return (
    isHighStrainCondition(prev1.mood, prev1.stress) &&
    isHighStrainCondition(prev2.mood, prev2.stress)
  );
}

export function evaluateDailyMode(
  input: CheckinInput,
  recentHistory: HistoricalCheckin[] = [],
  wellbeingConsent = true,
  todayDate: Date = recentHistory[0]
    ? new Date(new Date(recentHistory[0].checkinDate).getTime() + 24 * 60 * 60 * 1000)
    : new Date(),
): ModeEvaluationResult {
  // Without consent, daily mode stays fixed to balanced (AGENTS.md section 8)
  if (!wellbeingConsent) {
    return {
      mode: "balanced",
      ruleKey: "no_consent",
      reason: "Persetujuan data kondisi harian belum aktif. Mode belajar disetel ke Seimbang.",
      isReferralTriggered: false,
    };
  }

  // 1. Check Referral Rule: 3 consecutive days of low mood (<= 2) or high stress (>= 4)
  const isReferralTriggered = checkReferralTriggered(input, recentHistory, todayDate);

  // 2. Recovery Rule: sleep < 5 OR stress >= 4
  if (
    input.sleepHours < RULES.recovery.sleepBelowHours ||
    input.stress >= RULES.recovery.stressAtLeast
  ) {
    const reason =
      input.sleepHours < RULES.recovery.sleepBelowHours
        ? `Tidurmu ${input.sleepHours} jam, jadi hari ini kita fokus latihan ringan dan ulasan konsep santai.`
        : "Tingkat beban pikiranmu sedang tinggi. Hari ini disarankan istirahat aktif dan latihan ringan tanpa tekanan waktu.";

    return {
      mode: "recovery",
      ruleKey: "recovery",
      reason,
      isReferralTriggered,
    };
  }

  // 3. Challenge Rule: sleep >= 7 AND energy >= 4 AND stress <= 2
  if (
    input.sleepHours >= RULES.challenge.sleepAtLeastHours &&
    input.energy >= RULES.challenge.energyAtLeast &&
    input.stress <= RULES.challenge.stressAtMost
  ) {
    return {
      mode: "challenge",
      ruleKey: "challenge",
      reason:
        "Tidur cukup dan energimu prima hari ini. Waktu yang tepat untuk simulasi penuh atau mengerjakan target soal menantang.",
      isReferralTriggered,
    };
  }

  // 4. Default: Balanced
  return {
    mode: "balanced",
    ruleKey: "balanced",
    reason:
      "Kondisimu dalam ritme stabil. Jaga konsistensi dengan latihan terarah dan ulasan topik harian.",
    isReferralTriggered,
  };
}
