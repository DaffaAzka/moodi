export interface ReframedThoughtResult {
  thought: string;
  validation: string;
  distortion: string;
  fact: string;
  smallStep: string;
  source: "local";
}

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(?:^|\\P{L})${escaped}(?:$|\\P{L})`, "iu");
  return regex.test(text);
}

const CBT_THEMES = [
  {
    name: "social_comparison",
    keywords: ["teman", "orang lain", "banding", "rajin", "tertinggal", "semua temanku"],
    result: {
      validation: "Melihat progres orang lain sering kali membuat kita merasa berjalan terlalu lambat, padahal setiap orang punya ritme belajar yang berbeda.",
      distortion: "Perbandingan Sosial Tidak Seimbang",
      fact: "Durasi belajar orang lain yang tampak di luar tidak mencerminkan tingkat pemahaman mereka. Belajar 1 jam secara tenang dan fokus jauh lebih bermakna daripada berjam-jam dalam kondisi cemas.",
      smallStep: "Abaikan lini masa orang lain hari ini. Tentukan 1 konsep kecil yang ingin kamu kuasai untuk kemajuan dirimu sendiri.",
    },
  },
  {
    name: "family_expectations",
    keywords: ["orang tua", "ibu", "ayah", "mama", "papa", "keluarga", "ekspektasi"],
    result: {
      validation: "Rasa takut mengecewakan orang terdekat menunjukkan betapa kamu menghargai dan menyayangi mereka.",
      distortion: "Mind Reading (Menebak Reaksi Orang Lain)",
      fact: "Keluarga dan orang yang peduli padamu lebih mengutamakan kesehatan dan keteguhan perjuanganmu dibanding sekadar angka ujian. Menjaga ritme fisik tetap sehat adalah bagian dari ikhtiar terbaik.",
      smallStep: "Katakan pada diri sendiri bahwa kamu sedang melangkah sesuai kapasitas energi hari ini.",
    },
  },
  {
    name: "score_anxiety",
    keywords: ["skor", "nilai", "turun", "anjlok", "drastis", "jelek", "hasil tryout"],
    result: {
      validation: "Sangat wajar merasa kecewa saat skor tryout menurun setelah kamu mencurahkan tenaga untuk mempersiapkannya.",
      distortion: "Katastrofisasi Hasil Sementara",
      fact: "Skor tryout berfluktuasi mengikuti tingkat kesulitan paket soal. Penurunan skor bukan vonis kelulusan, melainkan petunjuk materi mana yang perlu diperdalam.",
      smallStep: "Buka ulasan hasil tryout terakhirmu, lalu pilih 2 nomor salah untuk dipelajari pembahasannya secara tenang.",
    },
  },
  {
    name: "shortcuts",
    keywords: ["bocoran", "jalan pintas", "kunci jawaban", "instan", "cepat lulus"],
    result: {
      validation: "Wajar sekali merasa ingin cara instan saat energimu terkuras dan tumpukan materi terasa membebani.",
      distortion: "Pencarian Jalan Pintas Impulsif",
      fact: "Mencari kunci jawaban instan tidak melatih daya nalar di hari ujian sesungguhnya. Memahami 1 konsep kecil secara mandiri jauh lebih menenangkan dan menumbuhkan rasa percaya diri.",
      smallStep: "Tutup target belajar besar untuk hari ini. Cukup pelajari ulasan 1 materi pendek dengan santai.",
    },
  },
  {
    name: "time_pressure",
    keywords: ["waktu", "terlambat", "sempat", "buru-buru", "kejar", "sisa hari", "tinggal sedikit"],
    result: {
      validation: "Melihat sisa hari menjelang ujian sering kali memicu rasa sesak dan kekhawatiran waktu tidak cukup.",
      distortion: "Katastrofisasi Waktu (Semua atau Tidak Sama Sekali)",
      fact: "Kamu tidak perlu menguasai seluruh materi dalam satu malam. Menguasai 2 sampai 3 konsep penting yang sering diujikan akan memberi dampak nyata pada hasil skormu.",
      smallStep: "Pilih 1 topik spesifik untuk diulas hari ini, lalu kesampingkan topik lainnya sejenak.",
    },
  },
  {
    name: "helplessness",
    keywords: ["gagal", "bodoh", "tidak bisa", "sia-sia", "menyerah", "putus asa", "hancur"],
    result: {
      validation: "Rasa lelah dan perasaan bahwa usahamu sia-sia adalah sinyal tubuh butuh jeda istirahat, bukan bukti kamu tidak mampu.",
      distortion: "Labeling Diri Negatif",
      fact: "Hasil latihan yang belum sesuai target adalah data belajar objektif, bukan ukuran kecerdasan atau masa depanmu. Dari jawaban salah, kita tahu bagian mana yang butuh penguatan.",
      smallStep: "Lakukan latihan napas kotak 4-4-4-4 selama 2 menit, lalu beri waktu tubuhmu rehat sejenak dari layar.",
    },
  },
];

const DEFAULT_CBT_RESULT = {
  validation: "Wajar sekali merasa cemas atau terbebani. Mempersiapkan UTBK adalah perjalanan maraton yang menuntut ketahanan mental.",
  distortion: "Beban Ekspektasi Berlebih",
  fact: "Kecemasan adalah reaksi alami saat kita menghadapi hal yang kita anggap bermakna. Yang menentukan adalah langkah kecil konsisten setiap hari, bukan kekhawatiran yang kamu bayangkan saat ini.",
  smallStep: "Tarik napas dalam, minum segelas air, dan tentukan 1 tugas kecil berdurasi 10 menit untuk diselesaikan hari ini.",
};

export function reframeThoughtLocally(studentThought: string): ReframedThoughtResult {
  const clean = studentThought.trim().toLowerCase();

  for (const theme of CBT_THEMES) {
    if (theme.keywords.some((kw) => matchesKeyword(clean, kw))) {
      return {
        thought: studentThought.trim(),
        ...theme.result,
        source: "local",
      };
    }
  }

  return {
    thought: studentThought.trim(),
    ...DEFAULT_CBT_RESULT,
    source: "local",
  };
}
