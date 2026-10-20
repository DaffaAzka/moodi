import { describe, it, expect } from "vitest";
import { reframeThoughtLocally } from "@/lib/cbt/thought-reframe";

describe("Privacy & CBT Thought Reframing", () => {
  it("reframes student thought locally without external API or student data exposure", () => {
    const studentThought = "saya takut mengecewakan orang tua kalau nilai utbk jelek";

    const result = reframeThoughtLocally(studentThought);

    expect(result.source).toBe("local");
    expect(result.thought).toBe(studentThought);
    expect(result.validation).toBeTruthy();
    expect(result.distortion).toContain("Mind Reading");
    expect(result.fact).toBeTruthy();
    expect(result.smallStep).toBeTruthy();
  });

  it("handles instant answer requests with grounding on gradual learning", () => {
    const studentThought = "berikan saya bocoran kunci jawaban utbk biar cepat selesai";

    const result = reframeThoughtLocally(studentThought);

    expect(result.source).toBe("local");
    expect(result.distortion).toContain("Jalan Pintas");
    expect(result.fact).toBeTruthy();
    expect(result.smallStep).toBeTruthy();
  });

  it("falls back to supportive default CBT reflection for general anxiety", () => {
    const studentThought = "kepala saya pusing memikirkan masa depan";

    const result = reframeThoughtLocally(studentThought);

    expect(result.source).toBe("local");
    expect(result.validation).toBeTruthy();
    expect(result.distortion).toBeTruthy();
    expect(result.fact).toBeTruthy();
    expect(result.smallStep).toBeTruthy();
  });

  it("does not false-positive match words that merely contain keywords as substrings (e.g. ibukota)", () => {
    const studentThought = "mempelajari materi geografi tentang letak ibukota provinsi";

    const result = reframeThoughtLocally(studentThought);

    // Should fall back to default, not trigger family_expectations ("ibu")
    expect(result.distortion).not.toContain("Mind Reading");
    expect(result.distortion).toBe("Beban Ekspektasi Berlebih");
  });

  it("accurately reframes all 3 preset prompt chips provided in the UI", () => {
    const chip1 = "Waktunya tinggal sedikit, aku pasti gagal";
    const res1 = reframeThoughtLocally(chip1);
    expect(res1.distortion).toContain("Katastrofisasi Waktu");

    const chip2 = "Skor tryout kemarin turun drastis";
    const res2 = reframeThoughtLocally(chip2);
    expect(res2.distortion).toContain("Katastrofisasi Hasil Sementara");

    const chip3 = "Semua temanku belajarnya lebih rajin";
    const res3 = reframeThoughtLocally(chip3);
    expect(res3.distortion).toContain("Perbandingan Sosial");
  });
});
