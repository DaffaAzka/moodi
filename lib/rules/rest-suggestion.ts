import { RULES } from "@/config/rules";

export interface DailyPracticeSummary {
  date: Date;
  secondsSpent: number;
  accuracy: number; // 0 to 100
}

export interface RestSuggestionResult {
  isTriggered: boolean;
  ruleKey: "rest_suggestion" | null;
  reason: string | null;
}

/**
 * Pure rule engine for rest_suggestion (AGENTS.md section 7):
 * "Accuracy falls while study time rises for two days in a row ->
 *  A message to ease the load, without blaming the student"
 */
export function evaluateRestSuggestion(
  dailySummaries: DailyPracticeSummary[],
  _config = RULES.restSuggestion,
): RestSuggestionResult {
  if (dailySummaries.length < 2) {
    return { isTriggered: false, ruleKey: null, reason: null };
  }

  const dayRecent = dailySummaries[0];
  const dayPrior = dailySummaries[1];

  // Calendar continuity: must be consecutive days (diff = 1)
  const msRecent = Date.UTC(
    dayRecent.date.getFullYear(),
    dayRecent.date.getMonth(),
    dayRecent.date.getDate(),
  );
  const msPrior = Date.UTC(
    dayPrior.date.getFullYear(),
    dayPrior.date.getMonth(),
    dayPrior.date.getDate(),
  );
  const diffDays = Math.round((msRecent - msPrior) / (24 * 60 * 60 * 1000));

  if (diffDays !== 1) {
    return { isTriggered: false, ruleKey: null, reason: null };
  }

  // Accuracy falls while study time rises
  const studyTimeRose = dayRecent.secondsSpent > dayPrior.secondsSpent;
  const accuracyFell = dayRecent.accuracy < dayPrior.accuracy;

  if (studyTimeRose && accuracyFell) {
    return {
      isTriggered: true,
      ruleKey: "rest_suggestion",
      reason:
        "Dua hari ini kamu berlatih lebih keras namun hasil akurasi menurun. Otakmu butuh istirahat sejenak untuk mengendapkan materi.",
    };
  }

  return { isTriggered: false, ruleKey: null, reason: null };
}
