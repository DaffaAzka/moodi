"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-session";
import type { CalmTool, CalmTrigger } from "@/app/generated/prisma/enums";
import { reframeThoughtLocally, type ReframedThoughtResult } from "@/lib/cbt/thought-reframe";

export async function saveCalmSessionAction({
  tool,
  triggerSource = "manual",
  durationSeconds = 60,
  note = null,
  tryoutSessionId = null,
}: {
  tool: CalmTool;
  triggerSource?: CalmTrigger;
  durationSeconds?: number;
  note?: string | null;
  tryoutSessionId?: string | null;
}) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      select: { wellbeingConsent: true },
    });

    // Only record sensitive calm session if consent is on (AGENTS.md section 8 & 9)
    if (profile?.wellbeingConsent) {
      await prisma.calmSession.create({
        data: {
          userId: session.user.id,
          tool,
          triggerSource,
          durationSeconds,
          note: note?.trim() || null,
          tryoutSessionId: tryoutSessionId || null,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/calm");
    return { success: true };
  } catch (err) {
    console.error("Failed to save calm session:", err);
    return { error: "Gagal menyimpan sesi tenang." };
  }
}

export async function deleteCalmSessionAction(id: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const existing = await prisma.calmSession.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { error: "Catatan tidak ditemukan atau kamu tidak memiliki akses." };
    }

    await prisma.calmSession.delete({
      where: { id },
    });

    revalidatePath("/dashboard/calm");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete calm session:", err);
    return { error: "Gagal menghapus catatan refleksi." };
  }
}

import {
  reframeWithGemini,
  type CurhatAiResult,
} from "./gemini-reframe";

export async function reframeThoughtAction(
  thought: string,
): Promise<{ ok: boolean; data?: CurhatAiResult; error?: string }> {
  const session = await getAuthSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const clean = thought?.trim();
  if (!clean || clean.length < 3) {
    return {
      ok: false,
      error: "Tuliskan sedikit pikiran atau hal yang sedang membuatmu cemas.",
    };
  }

  if (clean.length > 1000) {
    return {
      ok: false,
      error: "Curhatan terlalu panjang (maksimal 1.000 karakter).",
    };
  }

  try {
    const result = await reframeWithGemini(clean);
    return { ok: true, data: result };
  } catch (err) {
    console.error("Reframing action error:", err);
    const fallback = reframeThoughtLocally(clean);
    return { ok: true, data: { ...fallback, source: "local" } };
  }
}
