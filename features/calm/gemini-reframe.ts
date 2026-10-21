import "server-only";

import { getGenAiClient, getGeminiModel } from "@/features/ai/client";
import { reframeThoughtLocally } from "@/lib/cbt/thought-reframe";

export interface CurhatAiResult {
  thought: string;
  distortion: string;
  validation: string;
  fact: string;
  smallStep: string;
  source: "ai" | "local";
}

const CBT_SYSTEM_INSTRUCTION = `Kamu adalah Teman Bicara MOODI, rekan belajar UTBK yang hangat, bijak, empatik, dan suportif.
Tugasmu adalah mendengarkan curhatan siswa yang sedang cemas, tertekan, atau overthinking menghadapi persiapan UTBK atau tekanan akademik/sosial, lalu membantunya membedah beban pikiran tersebut menggunakan prinsip Cognitive Behavioral Therapy (CBT) non-klinis yang menenangkan.

Pedoman Sikap:
1. Bersikaplah seperti teman sebaya yang suportif dan pengertian, bukan psikolog klinis yang kaku atau menghakimi.
2. Gunakan sapaan "kamu", nada santai, suportif, dan kalimat aktif dalam bahasa Indonesia.
3. JANGAN PERNAH memberikan diagnosis klinis (seperti "kamu depresi", "kamu bipolar", "kamu anxiety disorder").
4. JANGAN gunakan karakter em-dash atau tanda hubung panjang (--). Gunakan tanda titik, koma, atau tanda hubung biasa bila perlu.
5. Jika siswa menunjukkan tanda bahaya akut (seperti ingin menyakiti diri sendiri atau keputusasaan darurat), berikan respons empati yang mengutamakan keselamatan dan ingatkan untuk segera menghubungi orang terdekat atau layanan darurat 119 ext 8.

Keluarkan HANYA dokumen JSON valid dengan struktur persis berikut:
{
  "distortion": "Nama dan ringkasan pola pikir/jebakan kognitif dalam 2-5 kata (misal: 'Beban Standar Ganda', 'Berpikir Hitam-Putih', 'Kecemasan Bencana Masa Depan', 'Membaca Pikiran Orang Lain', atau 'Generalisasi Berlebihan')",
  "validation": "1-2 kalimat empati hangat yang memvalidasi perasaan siswa tanpa membenarkan asumsi buruknya",
  "fact": "2-3 kalimat penjelasan fakta objektif dan sudut pandang penyeimbang yang logis, realistis, dan menenangkan",
  "smallStep": "1 langkah tindakan kecil (mikro) yang sangat konkret dan bisa dilakukan dalam 5 menit ke depan untuk menyegarkan pikiran"
}`;

export async function reframeWithGemini(
  thought: string,
): Promise<CurhatAiResult> {
  const clean = thought.trim();
  const fallback = reframeThoughtLocally(clean);

  // If no Gemini API key configured, use local CBT fallback immediately
  if (!process.env.GEMINI_API_KEY?.trim()) {
    return {
      ...fallback,
      source: "local",
    };
  }

  const primaryModel = getGeminiModel();
  // Ensure we try fast and available models if the primary model hangs or fails
  const candidateModels = Array.from(
    new Set([primaryModel, "gemini-3-flash-preview", "gemini-3.5-flash"])
  );

  let ai: ReturnType<typeof getGenAiClient>;
  try {
    ai = getGenAiClient();
  } catch (clientErr) {
    console.error("Gemini client initialization error:", clientErr);
    return { ...fallback, source: "local" };
  }

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Berikut adalah curhatan dan pikiran cemas yang sedang kurasakan:\n"${clean}"\n\nTolong dengarkan dan bedah menggunakan prinsip CBT terstruktur.`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: CBT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          abortSignal: AbortSignal.timeout(10000),
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) continue;

      const parsed = JSON.parse(responseText);

      return {
        thought: clean,
        distortion:
          typeof parsed.distortion === "string" && parsed.distortion.trim()
            ? parsed.distortion.trim().replace(/—|--/g, "-")
            : fallback.distortion,
        validation:
          typeof parsed.validation === "string" && parsed.validation.trim()
            ? parsed.validation.trim().replace(/—|--/g, "-")
            : fallback.validation,
        fact:
          typeof parsed.fact === "string" && parsed.fact.trim()
            ? parsed.fact.trim().replace(/—|--/g, "-")
            : fallback.fact,
        smallStep:
          typeof parsed.smallStep === "string" && parsed.smallStep.trim()
            ? parsed.smallStep.trim().replace(/—|--/g, "-")
            : fallback.smallStep,
        source: "ai",
      };
    } catch (err: any) {
      console.warn(`Gemini reframing with model '${model}' failed:`, err?.message || err);
      // Continue to next candidate model
    }
  }

  console.error("All Gemini reframing attempts failed; falling back to local CBT.");
  return {
    ...fallback,
    source: "local",
  };
}
