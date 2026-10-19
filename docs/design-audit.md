# Audit Desain & Rencana Perbaikan MOODI

> **Tujuan:** Menghilangkan visual tell bahwa MOODI dibuat oleh AI, mengganti seluruh icon dengan HackerNoon Pixel Icon Library (`@hackernoon/pixel-icon-library`), menghapus badge/pill/chip yang berlebihan, memecah layout simetris repetitif (grid 3 kartu), dan menulis ulang copy dengan suara tutor/senior UTBK yang tenang, otentik, dan bebas jargon template.

---

## 1. Referensi Desain Non-AI (Phase 2)

*Catatan terkait `[LINK]`: Prompt menyertakan placeholder `[LINK]` tanpa URL tujuan. Sesuai instruksi untuk tidak menebak tampilan situs yang tidak dapat dibuka, kami menganalisis 5 produk dan situs nyata yang merepresentasikan prinsip visual human-crafted, editorial-retro, dan indie learning:*

### 1.1 Playdate by Panic (`play.date`)
- **Hirarki tanpa pill:** Menggunakan kontras skala tipografi ekstrem dan garis pembatas tegas (divider) alih-alih membungkus setiap kategori dalam kapsul warna.
- **Status & informasi:** Ditampilkan sebagai label teks biasa yang menyatu dengan narasi atau ditempatkan di posisi struktural tertentu (misal: di sudut kanan atas layout tanpa background kapsul).
- **Asimetri:** Menggabungkan kolom lebar untuk storytelling perangkat dengan kolom sempit untuk spesifikasi teknis, menghindari baris 3 kartu identik.
- **Suara copy:** Santai, percaya diri, jujur tentang keterbatasan layar monokrom 1-bit tanpa bahasa promosi berlebihan.

### 1.2 Teenage Engineering (`teenage.engineering`)
- **Hirarki tanpa pill:** Mengandalkan tipografi monospaced, label sebaris (*inline metadata*), dan struktur grid yang terinspirasi diagram sirkuit fisik.
- **Status & indikator:** Menggunakan posisi dan indikator diskret (garis atau titik kecil) alih-alih chip rounded.
- **Asimetri:** Menampilkan hero produk berukuran masif dengan modul navigasi minimalis di sisi tepi.
- **Suara copy:** Dingin, faktual, teknis, dan tanpa klaim bombastis.

### 1.3 Poolsuite FM (`poolsuite.net`)
- **Hirarki tanpa pill:** Memanfaatkan metafora antarmuka sistem operasi klasik (window chrome, frame tegas, panel inset/outset).
- **Status & indikator:** Informasi trek dan status pemutar ditampilkan dalam teks monospaced di dalam status bar horizontal, bukan badge mengambang.
- **Asimetri:** Komponen widget memiliki ukuran bervariasi sesuai konten aslinya (player musik panjang, video retro kompak).
- **Suara copy:** Penuh karakter, konsisten dengan narasi santai tanpa terdengar seperti template SaaS.

### 1.4 WaniKani by Tofugu (`wanikani.com`)
- **Hirarki tanpa pill:** Walaupun menggunakan warna tema per tipe (radikal, kanji, kosakata), pembedaan dilakukan pada latar belakang seluruh bidang atau teks tebal, bukan menimbun pill badge kecil di atas kartu.
- **Status & progres:** Progres ditampilkan lewat angka polos terstruktur ("14 items ready") dan urutan antrean, bukan tumpukan stiker status.
- **Asimetri:** Antarmuka sesi belajar mengosongkan seluruh distraksi visual dan memusatkan hanya satu fokus pengerjaan.
- **Suara copy:** Suara tutor manusia yang akrab, sedikit sarkastik, memahami frustrasi murid saat menghafal, dan tidak pernah memakai frasa klise korporat seperti "optimalkan potensimu".

### 1.5 Low-tech Magazine (`solar.lowtechmagazine.com`)
- **Hirarki tanpa pill:** Mengandalkan tata letak zine cetak murni: judul artikel besar, tanggal dan penulis sebagai baris teks biasa, garis horizontal sederhana.
- **Status:** Status baterai server surya ditulis dalam satu kalimat ringkas di header.
- **Suara copy:** Esai mendalam, langsung ke inti masalah, tanpa basa-basi marketing.

---

## 2. Inventaris & Audit Komprehensif (Phase 3)

### (a) Inventaris Semua Ikon

| Kategori | File Lokasi | Temuan Saat Ini | Masalah | Rencana Perbaikan (Phase 4) |
|---|---|---|---|---|
| **lucide-react** | `components/ui/checkbox.tsx` | `CheckIcon` | Dependensi Lucide pada primitive shadcn | Ganti dengan `PixelIcon` (`name="check"`) |
| **lucide-react** | `components/ui/dropdown-menu.tsx` | `CheckIcon`, `ChevronRightIcon`, `CircleIcon` | Dependensi Lucide | Ganti dengan `PixelIcon` (`check`, `chevron-right`, `circle`) |
| **lucide-react** | `components/ui/dialog.tsx` | `XIcon` | Dependensi Lucide untuk tombol close | Ganti dengan `PixelIcon` (`name="close"`) |
| **lucide-react** | `components/ui/command.tsx` | `SearchIcon` | Dependensi Lucide | Ganti dengan `PixelIcon` (`name="search"`) |
| **lucide-react** | `components/editor/plugins/component-picker/*.tsx` (10 files) | `List`, `ListTodo`, `CodeXml`, `ListCollapse`, `Minus`, `Heading1/2/3`, `ListOrdered`, `Pilcrow`, `TextQuote`, `Table` | Menu insert rich-text Lexical mengimpor lucide-react langsung | Ganti dengan mapping `PixelIcon` yang relevan |
| **Custom SVG Icons** | `components/icons.tsx` | 25 custom SVG functions (`CheckIcon`, `CloseIcon`, `HeartIcon`, `SproutIcon`, `WindIcon`, `BulbIcon`, `PencilIcon`, dsb.) | Ikon SVG buatan tangan yang tidak seragam ukurannya dan tersebar di mana-mana | Hapus/deprecate `components/icons.tsx`, arahkan seluruh pemanggil ke `components/pixel/PixelIcon` |
| **Private SVG Paths** | `components/sidebar.tsx` | Fungsi `NavigationIcon` dengan path string internal (`home`, `book`, `timer`, `chart`, `calm`, `grid`, `list`) | Path SVG hardcoded internal | Ganti pemanggilan ke `PixelIcon` |
| **Private SVG Glyphs** | `app/page.tsx` | `FeatureGlyph` (`sun`, `grid`, `breath`) | Hardcoded SVG glyphs di landing page | Hapus glyph custom, ganti dengan layout editorial berkarakter dan `PixelIcon` |
| **Emoji sebagai Ikon** | `features/learn/components/admin-lessons-list.tsx` | `✨ {siteCopy.questionBank.draftWithAi}`, `✨ AI` | Emoji digunakan sebagai penanda fitur / status | Ganti emoji dengan label teks biasa atau `PixelIcon` |
| **Emoji sebagai Ikon** | `features/ai/components/ai-draft-dialog.tsx` | `✨ Buat Draf dengan AI` | Emoji bintang sebagai penanda AI | Ganti dengan teks tenang tanpa emoji |
| **Emoji sebagai Ikon** | `features/ai/blocks-to-lexical.ts` | `💡 Contoh Soal`, `🔍 Petunjuk Konsep` | Emoji di dalam blok konten materi hasil generasi | Hapus prefix emoji, gunakan tipografi tebal / heading bersih |
| **Simbol Unicode** | `components/theme-toggle.tsx` | `◐` (Unicode U+25D0 circle half) | Simbol unicode teks digunakan sebagai pengganti ikon tema | Ganti dengan `PixelIcon` (`name="theme"` atau `name="sun"`/`name="moon"`) |
| **Simbol Unicode** | `features/practice/components/session-runner.tsx` | `←`, `→` pada navigasi soal dan tombol footer | Simbol unicode teks digunakan sebagai panah aksi | Ganti dengan `PixelIcon` panah atau teks tombol alami |
| **Simbol Unicode** | `features/learn/components/lesson-view.tsx` | `←`, `→`, `✓`, `ℹ` | Simbol unicode teks untuk status & navigasi | Ganti `✓` dengan teks status, ganti panah dengan `PixelIcon` |
| **Simbol Unicode** | `features/learn/components/study-hub.tsx` | `→` pada link materi | Simbol unicode panah | Ganti dengan styling link atau `PixelIcon` |
| **Simbol Unicode** | `features/learn/components/check-questions.tsx` | `✓`, `ℹ` pada umpan balik cek pemahaman | Simbol unicode teks sebagai ikon feedback | Ganti dengan `PixelIcon` atau penataan teks kontekstual |
| **Simbol Unicode** | `features/question-bank/components/page-header.tsx` | `←` pada tombol kembali | Simbol panah | Ganti dengan `PixelIcon` panah kiri |
| **Chart Markers** | `features/insight/components/insight-dashboard.tsx` | Kotak penanda warna legenda | Penanda visual grafik | Dipertahankan sebagai elemen data chart murni dengan token warna |
| **Public Assets** | `public/*.svg` | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | File SVG bawaan create-next-app yang tidak terpakai | Hapus seluruh file SVG default Next.js tersebut |
| **Favicon** | `public/mow/mow.ico`, `mow.png` | Ikon maskot pixel asli MOODI | Sudah berupa pixel art | Pertahankan |

---

### (b) Inventaris Badge, Pill, Chip, dan Label Status

| Lokasi Komponen | Elemen yang Ditemukan | Masalah | Rencana Perbaikan (Phase 5) |
|---|---|---|---|
| `app/page.tsx:161` | `<div className="... border-2 bg-moodi-butter ..."><span>{copy.eyebrow}</span></div>` | Eyebrow badge di atas H1 hero ("Persiapan UTBK Berbasis Ritme") = visual tell AI paling kentara | Hapus badge. Jadikan baris pembuka editorial atau lebur ke dalam judul utama. |
| `features/checkin/components/daily-plan-view.tsx:102` | `<span className="... border bg-card px-2 py-0.5 text-xs font-bold ...">Ruang Dukungan</span>` | Eyebrow pill di atas heading banner rujukan | Hapus pill. Banner rujukan langsung dibuka dengan kalimat empati. |
| `features/checkin/components/daily-plan-view.tsx:130` | `<span className="... border-2 px-3 py-1 font-pixelify text-xs font-bold ...">{modeConfig.title}</span>` | Pill badge "Mode Pemulihan / Seimbang / Tantangan" | Hapus pill. Nama mode tampil sebagai judul atau sub-judul struktural yang memengaruhi surface/warna kartu. |
| `features/checkin/components/daily-plan-view.tsx:136` | `<span className="border border-border bg-card px-2.5 py-1 text-xs ...">{daysUntilExam} hari menuju UTBK</span>` | Badge countdown mandiri | Tampilkan sebagai informasi kontekstual biasa: "14 hari menuju UTBK" di samping target prodi. |
| `features/checkin/components/daily-plan-view.tsx:243` | `<span className="border border-border px-2.5 py-0.5 text-[11px] font-bold ...">{typeConfig.label}</span>` | Pill kategori di setiap kartu tugas harian (Materi, Latihan, Simulasi, dll.) | Hapus pill. Kategori tugas cukup terlihat dari judul tugas dan kata kerja aksinya ("Pelajari:", "Latihan:"). |
| `features/practice/components/active-session-card.tsx:39` | `<span className="inline-block border border-border bg-moodi-butter px-2 py-0.5 text-xs font-semibold uppercase ...">{levelLabels[session.mode]}</span>` | Mode pill badge pada sesi aktif ("SANTAI", "LATIHAN WAKTU") | Tampilkan sebagai teks biasa dalam kalimat: "Sesi latihan waktu yang belum selesai". |
| `features/practice/components/session-runner.tsx:245` | `<span className="inline-block border border-border bg-muted px-2.5 py-0.5 text-xs ...">Soal {currentIndex + 1}</span>` | Pill badge nomor soal di dalam soal tryout | Jadikan label teks heading polos: "Soal 1 dari 20". |
| `features/practice/components/session-runner.tsx:366` | `<span className="... border border-border bg-muted px-2.5 py-1 text-xs ...">{answeredIndices.size}/{questions.length} terjawab</span>` | Count bubble pill di sticky footer | Ubah menjadi teks progres inline tanpa border kapsul. |
| `features/practice/components/review-list.tsx:46` | `<span className="inline-block border border-border bg-muted px-3 py-1 text-xs ...">Mode: ...</span>` | Pill mode pada header review tryout | Tampilkan sebagai teks biasa: "Simulasi Penuh · 20 Soal". |
| `features/practice/components/review-list.tsx:137-149` | `<span className="inline-flex items-center gap-1.5 border ...">Benar / Perlu dicek lagi / Belum dijawab</span>` | Status badge pill di atas setiap nomor pembahasan | Tampilkan status langsung pada nomor atau teks penjelasan, tanpa pill tebal berulang. |
| `features/learn/components/study-hub.tsx:33` | `<span className="border border-border bg-moodi-sky px-2 py-0.5 text-xs font-bold ...">Lanjutkan belajar</span>` | Eyebrow pill pada kartu resume | Hapus pill. Judul section langsung "Lanjutkan belajar". |
| `features/learn/components/lesson-view.tsx:59` | `<span className="border-2 border-border bg-muted px-2.5 py-0.5 text-xs ...">{lesson.estMinutes} menit baca</span>` | Chip durasi estimasi baca | Satukan sebagai metadata teks biasa di bawah judul materi. |
| `features/learn/components/lesson-view.tsx:66` | `<span className="inline-flex items-center gap-1.5 border-2 ...">Selesai dipelajari</span>` | Status pill materi selesai | Tampilkan sebagai teks status inline dengan centang pixel, bukan badge. |
| `features/learn/components/lesson-view.tsx:85` | `<div className="border-2 border-border bg-moodi-sky/15 p-3 ..."><span>ℹ</span><span>{siteCopy.learn.aiAssistedNotice}</span></div>` | Badge banner AI disclosure yang mencolok | Jadikan satu baris teks sunyi (*quiet line of text*) tepat di bawah judul/ringkasan materi sesuai mandat AGENTS.md. |
| `features/learn/components/check-questions.tsx:102` | `<span className="border border-border bg-muted px-2.5 py-1 text-xs ...">{currentIndex + 1} / {questions.length}</span>` | Pill bubble counter soal cek pemahaman | Jadikan teks biasa ("Pertanyaan 1 dari 3"). |
| `features/calm/components/breathing-overlay.tsx:61` | `<span className="inline-block border border-border bg-moodi-peach px-2.5 py-0.5 text-xs ...">Napas dulu</span>` | Eyebrow pill di atas popup latihan pernapasan | Hapus pill badge. Heading "Tarik Napas Sejenak" sudah jelas. |
| `features/calm/components/calm-room.tsx:277` | `<span className="text-xs font-bold uppercase tracking-wider ...">Langkah {step} dari 5</span>` | Eyebrow label uppercase di grounding | Tampilkan sebagai teks santai biasa ("Langkah 1 dari 5"). |
| `features/calm/components/calm-room.tsx:336` | Prompt chips buttons | Kumpulan chip pill pilihan pikiran cemas | Susun sebagai daftar tombol pilihan yang ramah, bukan tumpukan tag chip. |
| `features/support/components/support-directory.tsx:118` | `<span className="border border-border bg-moodi-sky/30 px-2 py-0.5 text-[10px] ...">Hotline Resmi</span>` | Pill badge pada setiap kontak bantuan | Hapus badge. Seluruh kontak di halaman ini sudah merupakan layanan resmi terverifikasi. |
| `features/question-bank/components/question-bank-overview.tsx:62` | `<span className="inline-block border border-border px-3 py-1 font-pixelify text-2xl font-bold ...">{action.count}</span>` | Angka counter dibungkus kotak badge warna | Tampilkan angka besar langsung tanpa bingkai badge ganda. |

---

### (c) Pola Visual AI Lainnya

| Pola AI yang Ditemukan | File Lokasi | Detail Masalah | Rencana Perbaikan (Phase 5) |
|---|---|---|---|
| **Template Hero Klasik AI** | `app/page.tsx:159-189` | Eyebrow pill -> H1 -> Subjudul -> 2 tombol sejajar berdampingan -> SVG di sebelah kanan. Formula standar landing page template generator. | Pecah simetrinya. Buat komposisi asimetris: headline yang lebih berani dan personal, satu tombol aksi utama yang dominan, disusul ringkasan alur kerja tanpa sekat kaku. |
| **Grid 3 Kartu Identik (Steps)** | `app/page.tsx:206-235` | Tiga kartu sama lebar berjejer horizontal (01, 02, 03) dengan ukuran, padding, dan struktur yang seragam. | Ubah menjadi alur vertikal-horizontal asimetris yang menunjukkan keterhubungan langkah harian (check-in memandu rencana, rencana memandu tryout). |
| **Grid 3 Kartu Identik (Fitur)** | `app/page.tsx:245-267` | Tiga kartu sama lebar (Check-in, Error Autopsy, Ruang Tenang) dengan glyph kotak di atas dan teks identik. | Hapus repetisi 3 kartu. Integrasikan langsung ke dalam narasi bagaimana MOODI bekerja untuk siswa UTBK. |
| **Grid 3 Kartu Tugas Seragam** | `features/checkin/components/daily-plan-view.tsx:208-310` | Tugas harian (Materi, Latihan, Tenang) dirender dalam `grid sm:grid-cols-2 lg:grid-cols-3` yang identik bentuk dan tingginya. | Berikan hirarki: satu tugas utama hari ini dibuat dominan (lebar penuh / kartu primer), tugas pendukung dibuat lebih ramping di bawahnya. |
| **Duplikasi 3 Kartu Admin** | `features/question-bank/components/question-bank-overview.tsx:53` dan `features/dashboard/components/dashboard-home.tsx:87` | Halaman ikhtisar admin dan ringkasan bank soal mengulang struktur 3 kartu KPI + aksi yang persis sama. | Rancang tata letak manajemen yang fungsional: daftar ringkas subtes dan status publikasi langsung dalam tabel/list kerja, bukan kartu KPI berulang. |
| **Kartu di dalam Kartu** | `features/checkin/components/daily-plan-view.tsx:126` | Card besar mode membungkus card status kondisi, yang membungkus target prodi. | Ratakan hierarki: kurangi nested card berbingkai tebal. Gunakan spasi dan border pemisah tunggal. |
| **Hard Shadow Berlebihan** | Berbagai komponen | Penggunaan utility `pixel-shadow` (`box-shadow: 4px 4px 0 0 var(--border)`) di hampir setiap kartu, tombol, badge, dan modal. | Gunakan bayangan tebal hanya pada 1 elemen interaktif utama per layar (focal point); elemen sekunder cukup dengan `pixel-border` tanpa bayangan offset. |

---

### (d) Copywriting & Gaya Bahasa

| String Saat Ini | File / Lokasi | Masalah | Usulan Teks Baru (Bahas Tutor/Senior UTBK) |
|---|---|---|---|
| `"Gas Pol, Seimbang, atau Pemulihan"` | `lib/copy/id.ts:53` dan `features/checkin/components/checkin-form.tsx:96` | Menggunakan "Gas Pol" yang tidak sesuai terminologi AGENTS.md (`challenge` = Mode Tantangan) | `"Mode Pemulihan, Seimbang, atau Tantangan"` |
| `"Fitur belajar masih disiapkan."` / `"Dashboard MOODI masih kosong..."` | `lib/copy/id.ts:95, 97, 136, 177` | Sisa teks placeholder awal MVP. Fitur belajar, tryout, dan ruang tenang sebenarnya sudah berfungsi penuh. | Hapus klaim bahwa fitur belum ada. Tuliskan panduan awal yang jelas bagi siswa baru. |
| `"Bagaimana kondisimu hari ini?"` | `features/checkin/components/checkin-form.tsx:92` | Formal dan berjarak | `"Hari ini kamu gimana?"` (sesuai aturan suara AGENTS.md) |
| `"Nafas dulu"` / `"Tarik Nafas"` / `"Nafas panjang"` | `lib/copy/id.ts:414-425` dan `features/calm/components/breathing-overlay.tsx:61` | Ejaan tidak baku ("nafas" dengan f) | `"Napas dulu"`, `"Tarik napas"`, `"Ambil napas panjang"` |
| `"Tidur cukup dan energimu prima hari ini. Waktu yang tepat untuk simulasi penuh atau mengerjakan target soal menantang!"` | `lib/rules/daily-mode.ts:92` | Ada tanda seru `!`, gaya bahasa promosi berlebihan | `"Tidurmu 7 jam lebih dan energimu penuh. Hari ini pas buat coba simulasi penuh atau bab yang menantang."` |
| `"Evaluasi jawabanmu dan kenali pola kesalahan tanpa rasa bersalah."` | `lib/copy/id.ts:433` | Frasa klise self-help generator | `"Cek mana nomor yang terburu-buru atau konsepnya memang perlu dibuka lagi."` |
| `"Tandai penyebab jawaban yang belum tepat agar kamu tahu apakah masalahnya di pemahaman materi atau tekanan waktu."` | `lib/copy/id.ts:444` | Kalimat panjang dan kaku | `"Pilih alasan jawabanmu belum tepat: materi belum paham, kehabisan waktu, panik, atau kurang teliti."` |
| `"Tepat sekali!"` / `"Jawabanmu tepat!"` | `lib/copy/id.ts:428, 527` | Tanda seru dan nada gamifikasi berlebihan | `"Jawabanmu tepat."` |
| `"Perlu dicek lagi!"` | `lib/copy/id.ts:429` | Tanda seru pada koreksi salah | `"Perlu dicek lagi."` (tanpa tanda seru, tenang) |
| `"Cek pemahaman selesai!"` | `lib/copy/id.ts:524` | Tanda seru | `"Cek pemahaman selesai."` |
| `"Persiapan UTBK Berbasis Ritme"` | `lib/copy/id.ts:22` | Slogan korporat | `"Latihan UTBK yang menyesuaikan energimu hari ini"` |
| `"Belajar UTBK, tanpa lupa bernafas."` | `lib/copy/id.ts:23-24` | Klise metafora dan salah eja ("bernafas") | `"Persiapan UTBK tetap jalan, kondisi fisik dan pikiran tetap dijaga."` |
| `"Kenapa ini? Tidurmu 4 jam, jadi hari ini kita ringan dulu."` | `lib/rules/daily-mode.ts:71` | Perlu konsisten di seluruh alasan mode | Format: `"Kenapa ini? Tidurmu {n} jam, jadi hari ini porsi materi diringankan."` |

---

## 3. Rencana Eksekusi Bertahap (Setelah Persetujuan)

### Langkah 1: Phase 4 — Instalasi & Refaktor Ikon
1. Install `@hackernoon/pixel-icon-library` (sudah disetujui pengguna).
2. Tambahkan import `'@hackernoon/pixel-icon-library/fonts/iconfont.css'` pada `app/layout.tsx`.
3. Periksa file `node_modules/@hackernoon/pixel-icon-library/fonts/iconfont.css` untuk mendapatkan daftar class `hn hn-*` yang valid dan variannya.
4. Buat komponen sentral `components/pixel/pixel-icon.tsx` (`PixelIcon`) dengan semantic keys (`as const`):
   - `sleep`, `energy`, `mood`, `stress`, `breathe`, `check`, `close`, `arrow-right`, `arrow-left`, `book`, `timer`, `chart`, `sun`, `moon`, `warning`, `info`, `search`, `edit`, `copy`, `phone`, `trash`, `plus`, dsb.
5. Ganti seluruh icon SVG di `components/icons.tsx`, `components/sidebar.tsx`, dan `components/ui/*`.
6. Hapus dependensi `lucide-react` dari `package.json` dan ubah `components.json`.
7. Hapus file SVG default Next.js dari `public/`.
8. Tambahkan atribusi lisensi CC BY 4.0 di footer (`lib/copy/id.ts`) dan `README.md`.

### Langkah 2: Phase 5 — Restrukturisasi Layout & Pembersihan Badge
1. **Landing Page:** Rombak `app/page.tsx`. Hilangkan eyebrow badge, pecah simetri 3-card grid menjadi tata letak editorial asimetris dengan ritme visual yang dinamis.
2. **Beranda Siswa (`daily-plan-view.tsx`):**
   - Hapus badge/pill mode; jadikan nama mode sebagai header struktural yang membawahi surface warna.
   - Buat satu tugas utama menjadi kartu dominan (*hero task*), sementara tugas pendukung tampil sebagai daftar terstruktur rapi di bawahnya.
   - Hapus pill durasi dan kategori task, ganti dengan tipografi monospaced tenang dan label sebaris.
3. **Materi & Belajar (`lesson-view.tsx` & `study-hub.tsx`):**
   - Hapus status pill materi dan chip durasi baca.
   - Pindahkan AI disclosure menjadi satu baris teks sunyi di bawah judul.
   - Hapus semua panah dan centang unicode (`→`, `←`, `✓`, `ℹ`).
4. **Tryout & Review (`session-runner.tsx` & `review-list.tsx`):**
   - Bersihkan badge nomor soal dan status badge per soal.
   - Ganti tombol navigasi unicode dengan ikon pixel dan teks jelas.
5. **Calm Room & Support:**
   - Ubah grounding steps dan kontak bantuan menjadi daftar rapi tanpa badge "Hotline Resmi" atau "Langkah X".

### Langkah 3: Phase 6 — Penulisan Ulang Copy (Tone Human Tutor)
1. Perbarui `lib/copy/id.ts` secara menyeluruh: hilangkan semua kata promosi, placeholder lawas, tanda seru `!`, em-dash `—`, dan ejaan "nafas".
2. Harmoniskan alasan generator di `lib/rules/daily-mode.ts` dan `lib/rules/plan-generator.ts`.
3. Pastikan seluruh copy berbahasa Indonesia informal ("kamu"), active voice, bernada tenang, dan spesifik untuk siswa pejuang UTBK.

### Langkah 4: Validasi & Definition of Done
1. Jalankan `npm run lint`, `npm run test`, dan `npm run build` hingga seluruhnya lolos 100%.
2. Uji visual di browser pada 3 breakpoint (375px, 768px, 1280px) di ketiga tema (Terang, Malam, Gelap).
3. Buat laporan akhir perubahan.
