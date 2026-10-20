import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/features/practice/queries";

import { checkReferralTriggered } from "@/lib/rules/daily-mode";
import {
  evaluateRestSuggestion,
  type DailyPracticeSummary,
} from "@/lib/rules/rest-suggestion";

function getStartOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
}

export const getStudentDashboardData = cache(async (userId: string) => {
  const today = getStartOfToday();

  const [user, todayCheckinRaw, todayPlan, recentCheckinsRaw, activeSession] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          studentProfile: {
            select: {
              targetUniversity: true,
              targetMajor: true,
              examDate: true,
              wellbeingConsent: true,
              consentedAt: true,
            },
          },
        },
      }),
      prisma.checkin.findUnique({
        where: {
          userId_checkinDate: {
            userId,
            checkinDate: today,
          },
        },
      }),
      prisma.dailyPlan.findUnique({
        where: {
          userId_planDate: {
            userId,
            planDate: today,
          },
        },
        include: {
          tasks: {
            orderBy: { sortOrder: "asc" },
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
          },
        },
      }),
      prisma.checkin.findMany({
        where: { userId },
        orderBy: { checkinDate: "desc" },
        take: 14,
      }),
      getActiveSession(userId),
    ]);

  const wellbeingConsent = user?.studentProfile?.wellbeingConsent ?? false;

  const todayCheckin =
    wellbeingConsent && todayCheckinRaw
      ? {
          ...todayCheckinRaw,
          sleepHours: Number(todayCheckinRaw.sleepHours),
        }
      : null;

  const recentCheckins = wellbeingConsent
    ? recentCheckinsRaw.map((c) => ({
        ...c,
        sleepHours: Number(c.sleepHours),
      }))
    : [];

  // Calculate days left to exam
  let daysUntilExam: number | null = null;
  if (user?.studentProfile?.examDate) {
    const examTime = new Date(user.studentProfile.examDate).getTime();
    const nowTime = today.getTime();
    const diffDays = Math.ceil((examTime - nowTime) / (1000 * 60 * 60 * 24));
    daysUntilExam = diffDays > 0 ? diffDays : 0;
  }

  // Calculate referral trigger via rule engine
  const pastCheckins = recentCheckins.filter(
    (c) => new Date(c.checkinDate).getTime() < today.getTime(),
  );

  const isReferralTriggered =
    wellbeingConsent && todayCheckin
      ? checkReferralTriggered(
          { mood: todayCheckin.mood, stress: todayCheckin.stress },
          pastCheckins,
          today,
        )
      : false;

  // Calculate rest suggestion via rule engine if consent given
  let restSuggestion = {
    isTriggered: false,
    ruleKey: null,
    reason: null,
  } as ReturnType<typeof evaluateRestSuggestion>;

  if (wellbeingConsent) {
    const recentCompletedSessions = await prisma.tryoutSession.findMany({
      where: {
        userId,
        finishedAt: { not: null },
        score: { not: null },
      },
      orderBy: { finishedAt: "desc" },
      take: 15,
      select: {
        startedAt: true,
        finishedAt: true,
        score: true,
      },
    });

    const dayMap = new Map<
      string,
      { seconds: number; scoreSum: number; count: number; date: Date }
    >();

    for (const s of recentCompletedSessions) {
      if (!s.finishedAt) continue;
      const dateKey = s.finishedAt.toISOString().slice(0, 10);
      const seconds = Math.max(
        0,
        Math.round((s.finishedAt.getTime() - s.startedAt.getTime()) / 1000),
      );
      const score = Number(s.score ?? 0);
      const existing = dayMap.get(dateKey);
      if (existing) {
        existing.seconds += seconds;
        existing.scoreSum += score;
        existing.count += 1;
      } else {
        dayMap.set(dateKey, {
          seconds,
          scoreSum: score,
          count: 1,
          date: new Date(dateKey),
        });
      }
    }

    const summaries: DailyPracticeSummary[] = Array.from(dayMap.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((d) => ({
        date: d.date,
        secondsSpent: d.seconds,
        accuracy: d.count > 0 ? d.scoreSum / d.count : 0,
      }));

    restSuggestion = evaluateRestSuggestion(summaries);
  }

  return {
    user,
    profile: user?.studentProfile ?? null,
    todayCheckin,
    todayPlan,
    recentCheckins,
    activeSession,
    daysUntilExam,
    isReferralTriggered,
    restSuggestion,
  };
});

export type StudentDashboardData = Awaited<
  ReturnType<typeof getStudentDashboardData>
>;
