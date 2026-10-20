import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface JournalEntryItem {
  id: string;
  note: string;
  tool: "breathing" | "grounding" | "reframing";
  durationSeconds: number;
  createdAt: Date;
}

export interface CalmRoomData {
  hasConsent: boolean;
  journalEntries: JournalEntryItem[];
}

export const getCalmRoomData = cache(async (userId: string): Promise<CalmRoomData> => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { wellbeingConsent: true },
  });

  const hasConsent = profile?.wellbeingConsent ?? false;

  // Sensitive wellbeing data gated by consent (AGENTS.md section 6 & 9)
  if (!hasConsent) {
    return {
      hasConsent: false,
      journalEntries: [],
    };
  }

  const entriesRaw = await prisma.calmSession.findMany({
    where: {
      userId,
      note: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      note: true,
      tool: true,
      durationSeconds: true,
      createdAt: true,
    },
  });

  const journalEntries: JournalEntryItem[] = entriesRaw
    .filter((e) => e.note !== null)
    .map((e) => ({
      id: e.id,
      note: e.note!,
      tool: e.tool,
      durationSeconds: e.durationSeconds,
      createdAt: e.createdAt,
    }));

  return {
    hasConsent: true,
    journalEntries,
  };
});
