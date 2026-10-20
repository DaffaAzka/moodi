import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { RULES } from "@/config/rules";

export const getInsightDashboardData = cache(async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { wellbeingConsent: true },
  });
  const wellbeingConsent = profile?.wellbeingConsent ?? false;

  const [checkinsRaw, errorTagsRaw, topicStatsRaw, tryoutSessionsRaw] =
    await Promise.all([
      wellbeingConsent
        ? prisma.checkin.findMany({
            where: { userId },
            orderBy: { checkinDate: "desc" },
            take: 14,
          })
        : Promise.resolve([]),
      prisma.sessionAnswer.groupBy({
        by: ["errorTag"],
        where: {
          session: { userId },
          errorTag: { not: null },
        },
        _count: { id: true },
      }),
      prisma.topicStat.findMany({
        where: { userId },
        orderBy: [{ attempts: "desc" }],
        take: 15,
        include: {
          topic: {
            select: {
              id: true,
              name: true,
              subtest: {
                select: { id: true, name: true, code: true },
              },
            },
          },
        },
      }),
      prisma.tryoutSession.findMany({
        where: {
          userId,
          finishedAt: { not: null },
          score: { not: null },
        },
        orderBy: { finishedAt: "desc" },
        take: 20,
        select: {
          id: true,
          startedAt: true,
          finishedAt: true,
          score: true,
        },
      }),
    ]);

  const checkins = checkinsRaw
    .map((c) => ({
      ...c,
      sleepHours: Number(c.sleepHours),
    }))
    .reverse(); // chronological for charting

  const errorSpread = errorTagsRaw
    .filter((e) => e.errorTag !== null)
    .map((e) => ({
      tag: e.errorTag!,
      count: e._count.id,
    }));

  const topicMastery = topicStatsRaw.map((ts) => {
    const accuracy =
      ts.attempts > 0 ? Math.round((ts.correct / ts.attempts) * 100) : 0;
    return {
      topicId: ts.topic.id,
      topicName: ts.topic.name,
      subtestName: ts.topic.subtest.name,
      subtestCode: ts.topic.subtest.code,
      attempts: ts.attempts,
      correct: ts.correct,
      accuracy,
    };
  });

  const tryoutScores = tryoutSessionsRaw.map((s) => ({
    id: s.id,
    date: s.finishedAt,
    score: s.score !== null ? Number(s.score) : 0,
  }));

  // Correlate factual self-reported sleep with tryout accuracy
  const checkinByDate = new Map<string, number>();
  for (const c of checkinsRaw) {
    const key = new Date(c.checkinDate).toISOString().slice(0, 10);
    checkinByDate.set(key, Number(c.sleepHours));
  }

  let wellRestedSum = 0;
  let wellRestedCount = 0;
  let underRestedSum = 0;
  let underRestedCount = 0;

  for (const s of tryoutSessionsRaw) {
    if (!s.finishedAt || s.score === null) continue;
    const dateKey = new Date(s.finishedAt).toISOString().slice(0, 10);
    const sleep = checkinByDate.get(dateKey);
    if (sleep !== undefined) {
      const score = Number(s.score);
      if (sleep >= 7) {
        wellRestedSum += score;
        wellRestedCount += 1;
      } else if (sleep < 6) {
        underRestedSum += score;
        underRestedCount += 1;
      }
    }
  }

  const sleepComparison = wellbeingConsent
    ? {
        hasData: wellRestedCount > 0 || underRestedCount > 0,
        wellRested: {
          count: wellRestedCount,
          avgAccuracy:
            wellRestedCount > 0
              ? Math.round(wellRestedSum / wellRestedCount)
              : null,
        },
        underRested: {
          count: underRestedCount,
          avgAccuracy:
            underRestedCount > 0
              ? Math.round(underRestedSum / underRestedCount)
              : null,
        },
      }
    : null;

  const hasEnoughCheckins = checkins.length >= RULES.insights.minCheckins;

  return {
    hasEnoughCheckins,
    totalCheckins: checkins.length,
    minRequired: RULES.insights.minCheckins,
    wellbeingConsent,
    checkins,
    errorSpread,
    topicMastery,
    tryoutScores,
    sleepComparison,
  };
});

export type InsightDashboardData = Awaited<
  ReturnType<typeof getInsightDashboardData>
>;
