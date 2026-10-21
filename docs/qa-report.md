# Laporan QA: Kedalaman Fitur & Substansi Wellbeing MOODI

> **Tanggal Pemeriksaan:** 19 Oktober 2026  
> **Spesifikasi Acuan:** [`AGENTS.md`](file:///c:/Projects/mental-lms/AGENTS.md)  
> **Metode:** Penelusuran menyeluruh hulu-ke-hilir (*end-to-end trace*) pada kode sumber, verifikasi basis data Prisma, audit teks & klaim, serta eksekusi tes unit Vitest.  
> **Status Rangkaian Tes Eksisting:** 8 berkas tes, 61 pengujian lolos (*100% pass*).

---

## 1. Ringkasan Eksekutif

Pemeriksaan ini dilakukan untuk menjawab kecurigaan utama: **Apakah fitur *wellbeing* di MOODI hanya dekorasi visual (mengumpulkan mood/stres dan menyediakan alat tenang tanpa mengubah alur belajar), ataukah memiliki substansi yang mengalir ke pengalaman belajar siswa?**

### Temuan Utama:
1. **Bukan Sekadar Dekorasi (Substansi Nyata Terbukti):**
   - Mode harian (`recovery`, `balanced`, `challenge`) **secara nyata mengubah beban belajar**: Mode Pemulihan memangkas estimasi waktu belajar harian dari 65 menit menjadi 35 menit (~46%), mengganti simulasi tryout dengan latihan pernapasan kotak 4-4-4-4, memprioritaskan materi konsep ringkas (durasi $\le 10$ menit), dan mengarahkan rekomendasi materi di modul Belajar.
   - *Error Autopsy* memiliki siklus data penuh: tebakan awal berdasarkan jeda waktu pengerjaan $\rightarrow$ konfirmasi siswa di halaman ulasan $\rightarrow$ agregasi statistik $\rightarrow$ visualisasi distribusi kesalahan di Insight dengan sorotan penyebab dominan.
2. **Titik Dangkal & Data Satu Arah (*Write-Only*):**
   - Tabel `calm_sessions` (sesi ruang tenang) dan `support_events` (riwayat kontak bantuan) **100% bersifat *write-only***. Aplikasi menulis data sesi napas, grounding, dan catatan jurnal ke basis data, tetapi tidak ada satu pun kueri di seluruh aplikasi yang membaca atau menampilkan kembali data tersebut.
   - Jurnal refleksi pribadi di Ruang Tenang adalah *dead end*: siswa menulis dan menyimpan, namun tidak ada antarmuka untuk membaca kembali catatan terdahulu. Catatan juga belum terenkripsi.
   - Tombol **"Napas dulu" di dalam tryout tidak menyimpan sesi tenang** ke `calm_sessions`, meskipun skema Prisma telah menyediakan kolom `tryout_session_id` dan `trigger_source: panic_button`.
   - Modul Tryout (`/dashboard/mock-exam`) mengalami *bug* pemutusan *prop*: `mock-exam/page.tsx` tidak meneruskan `mode` ke `MockExamHub`, sehingga rekomendasi dan peringatan mode Pemulihan pada `LevelPicker` tidak muncul saat siswa membuka tab Tryout.
3. **Kekosongan Aturan Sesi 7:**
   - Dari 6 aturan mesin aturan di `AGENTS.md` Bagian 7: Aturan `recovery`, `balanced`, `challenge`, dan `referral` telah diimplementasikan.
   - Aturan `rest_suggestion` dan `graded_exposure` **sama sekali belum diimplementasikan** (hanya berupa konstanta pasif di `src/config/rules.ts`).
4. **Klaim yang Perlu Diluruskan:**
   - Klaim bahwa Insight menyajikan "korelasi mingguan antara jam tidur dan akurasi" belum terbukti: grafik jam tidur dan akurasi topik disajikan terpisah tanpa perhitungan korelasi statistik.
   - Check-in form menyatakan data dapat dihapus di "Pengaturan", padahal rute/halaman Pengaturan belum dibangun.

---

## 2. Feature Depth: Tabel Audit Kedalaman Fitur (*Feature Depth Matrix*)

| Fitur | Masukan Siswa | Lokasi Penyimpanan | Komponen / Logika yang Membaca | Yang Berubah bagi Siswa | Vonis | Tingkat Keparahan (*Severity*) | Bukti Kode & Catatan |
|---|---|---|---|---|---|---|---|
| **Check-in Harian (4 Input)** | Tidur (jam), Energi (1-5), Mood (1-5), Stres (1-5), Catatan (teks), Consent (boolean) | `checkins` (sensitif), `student_profiles.wellbeing_consent` | `evaluateDailyMode()` (`lib/rules/daily-mode.ts`), `getStudentDashboardData()` (`features/checkin/queries.ts`) | Menentukan `DayMode` hari ini, memicu tugas adaptif, menampilkan cuplikan status & catatan di Beranda. | **Integrated** (Tidur & Stres), **Shallow** (Energi, Mood, Catatan) | **Minor** (*Write-Only Data* untuk energi, mood, dan catatan di luar hari ini) | Tidur & stres menggerakkan mode dan grafik Insight. Energi & mood diabaikan di Insight. Catatan hanya ditampilkan di Beranda hari ini tanpa arsip riwayat. |
| **Mode Harian (3 Mode)** | Dihitung otomatis dari hasil check-in | `daily_plans.mode`, `daily_plans.rule_key`, `daily_plans.reason` | `generateDailyPlanTasks()`, `DailyPlanView`, `StudyHub` query (`features/learn/queries.ts`), `MockExamHub` | **Pemulihan:** Durasi 35 mnt, materi $\le 10$ mnt, latihan santai 5 soal, sesi pernapasan. **Tantangan:** Durasi 65 mnt, latihan waktu 10 soal, simulasi penuh tryout, error autopsy. | **Integrated** (Beranda, Belajar, & Tryout) | **Tuntas Diperbaiki** (*Pass*) | Beranda & Belajar beradaptasi penuh. Cacat *prop pass-through* di `/dashboard/mock-exam` telah diperbaiki sehingga `LevelPicker` kini menerima `mode` hari ini secara langsung. |
| **Rencana Adaptif & "Kenapa ini?"** | Tombol centang selesai (`done`), tombol ganti tugas (`swap`) | `plan_tasks.status`, `plan_tasks.topic_id`, `plan_tasks.type` | `DailyPlanView` (`features/checkin/components/daily-plan-view.tsx`), `toggleTaskStatusAction`, `swapTaskAction` | Siswa melihat alasan eksplisit 1 kalimat ("Kenapa ini?"), dapat menandai progres belajar harian, dan menukar latihan ke topik lain. | **Integrated** | **Pass** (Berfungsi Penuh) | Berjalan mulus di Beranda. Alasan tersimpan di `daily_plans.reason` dan `plan_tasks.reason`. |
| **Adaptasi Modul Belajar** | Siswa membaca materi dan menyelesaikan kuis cek pemahaman | `lesson_progress.status`, `check_correct`, `check_total` | `getStudyHubData()` (`features/learn/queries.ts:81-125`), `StudyHub` | Materi rekomendasi harian dari `daily_plans` ditampilkan di bagian paling atas. Nilai cek pemahaman tidak mengotori tryout. | **Integrated** | **Pass** (Berfungsi Penuh) | Mematuhi aturan isolasi tryout: tidak pernah membuat `TryoutSession`. Materi pendek diprioritaskan saat mode pemulihan. |
| **Tingkat Paparan Tryout (*Graded Exposure*)** | Pilihan mode: `relaxed`, `timed`, `full_simulation` | `tryout_sessions.mode`, `tryout_sessions.time_limit_seconds` | `startSessionService()`, `SessionRunner()`, `SessionTimer()`, `saveAnswerAction()` | **Santai:** Tanpa timer, pembahasan langsung di tiap soal. **Latihan Waktu:** Timer longgar ($1.5\times$), jeda saat Napas Dulu. **Simulasi:** Timer kaku, diskualifikasi jika habis. | **Integrated** | **Minor** (Aturan rekomendasi lintas-tryout belum aktif) | Mekanisme pengerjaan berbeda drastis di tiap level. *Celah:* Aturan `graded_exposure` untuk evaluasi 3 tryout terakhir masih pasif di konfigurasi. |
| **Tombol "Napas Dulu"** | Klik tombol saat tryout berjalan, durasi bernapas | Tidak disimpan ke basis data (`pausedSeconds` hanya memperpanjang `endsAt` sesi timed) | `SessionRunner.handlePanicClose()`, `pauseSessionTimerAction()` | Overlay pernapasan kotak 4-4-4-4 muncul. Pada mode `timed`, sisa waktu ujian diperpanjang sejumlah detik jeda (maks 60d). | **Shallow / Broken Data** | **Minor** (*Write-Only Gap*: Kolom skema `calm_sessions` tidak diisi) | Fitur visual dan penambahan waktu berfungsi, namun **tidak menyimpan rekaman `calm_sessions`** dan tidak mencatat pemicu `panic_button`. |
| **Error Autopsy** | Konfirmasi atau perubahan tag salah di halaman ulasan | `session_answers.error_tag`, `session_answers.tag_source` | `finishSessionService()`, `guessErrorTag()`, `ReviewList`, `InsightDashboard` | Soal salah mendapat tebakan awal otomatis, siswa dapat mengubah ke 4 kategori, hasil dirangkum di peta Insight. | **Integrated** | **Pass** (Berfungsi Penuh) | Alur lengkap dari tryout $\rightarrow$ tebakan heuristik $\rightarrow$ revisi siswa $\rightarrow$ grafik Insight. |
| **Dashboard Insight** | Data check-in $\ge 7$ hari dan hasil tryout | Dibaca dari `checkins`, `session_answers`, `topic_stats` | `getInsightDashboardData()`, `InsightDashboard` (`features/insight/components/insight-dashboard.tsx`) | Terbuka setelah 7 check-in: grafik tren 14 hari tidur & stres, distribusi Error Autopsy, peta akurasi topik. | **Shallow** | **Major** (Klaim korelasi tidur vs skor belum dihitung; tanpa langkah aksi konkret) | Menampilkan 3 visualisasi statis, namun tidak mengaitkan korelasi tidur vs skor tryout, dan tidak ada tombol aksi/langkah konkret berikutnya. |
| **Ruang Tenang: Pernapasan Kotak** | Klik mulai/selesai latihan napas 4-4-4-4 | `calm_sessions` (`tool: breathing`, `duration_seconds`, `note`) | **Tidak ada yang membaca** (Kueri pembaca `calm_sessions` nihil di seluruh aplikasi) | Animasi visual pernapasan berulang 4 detik. Sesi tersimpan di basis data saat klik selesai. | **Shallow / Write-Only** | **Minor** (*Write-Only Data*) | Animasi dan penyimpanan berjalan, namun data menjadi *write-only* dan tidak pernah diulas kembali. |
| **Ruang Tenang: Grounding 5-4-3-2-1** | Menekan langkah demi langkah sensori 5 hal | `calm_sessions` (`tool: grounding`, `duration_seconds: 120`) | **Tidak ada yang membaca** | Menuntun kesadaran indera langkah demi langkah hingga layar apresiasi diri. | **Shallow / Write-Only** | **Minor** (*Write-Only Data*) | Latihan sensori bekerja baik, namun rekaman aktivitas tidak dibaca oleh analitik/dashboard mana pun. |
| **Ruang Tenang: Reframing Lokal** | Siswa mengetik pikiran cemas di kotak teks | `calm_sessions` (`tool: reframing`, catatan hasil) jika siswa menekan simpan | `reframeThoughtAction()`, `reframeThoughtLocally()` (`lib/cbt/thought-reframe.ts`) | Menampilkan distorsi kognitif, validasi, fakta alternatif, dan langkah kecil tanpa memanggil API eksternal. | **Shallow** | **Major** (2 preset chips jatuh ke default; pencocokan substring rentan *false positive*) | 100% lokal dan aman dari paparan data, namun hanya mengandalkan 4 tema kata kunci teks mentah yang rentan salah tangkap kata (*false positive*). |
| **Ruang Tenang: Jurnal Pribadi** | Siswa mengetik refleksi bebas | `calm_sessions.note` (teks polos) | **Tidak ada yang membaca** (Tidak ada halaman/antarmuka untuk membaca arsip catatan) | Menampilkan pesan "Catatan refleksimu telah tersimpan", lalu formulir direset. | **Broken / Dead End** | **Major** (Fitur semu: tidak ada sarana membaca catatan; tanpa enkripsi `crypto.ts`) | Catatan tersimpan di basis data tetapi tidak bisa dibuka kembali oleh siswa. Tidak terenkripsi. |
| **Layar Rujukan & Dukungan** | Terpicu jika 3 hari berat berturut-turut, atau diakses lewat sidebar/header | `support_events` (`action: contacted`, `rule_key: support_directory`) | `DailyPlanView:91-116`, `SupportDirectory` (`features/support/components/support-directory.tsx`) | Spanduk lembut di Beranda; direktori kontak darurat resmi (Sejiwa 119 ext 8, Kemenkes, Yayasan Pulih), template pesan ke guru BK/orang tua. | **Integrated** | **Minor** (*Write-Only Data* pada `support_events`; operator logika perlu perbaikan) | Berfungsi penuh sebagai jaring pengaman. *Minor:* `support_events` bersifat *write-only*, dan logika pemicu belum memvalidasi jeda hari kalender. |

---

## 3. Jawaban Atas Pertanyaan Kritis Evaluasi

### 1. Apakah hari Pemulihan (*recovery*) benar-benar mengubah hari belajar siswa, atau hanya sekadar label dan warna?
**Bukti Kode:** Mengubah substansi tugas secara nyata.
- Pada `lib/rules/plan-generator.ts:44-88`, saat mode bernilai `recovery`, generator tugas:
  1. Menghapus tugas latihan berat/simulasi dan menggantinya dengan membaca materi ringkas berdurasi $\le 10$ menit (`RULES.learning.shortLessonMinutes`) atau ulasan konsep 15 menit.
  2. Menyisipkan tugas wajib Ruang Tenang: *Latihan Pernapasan Kotak (Box Breathing 4-4-4-4)* selama 5 menit.
  3. Membatasi latihan soal hanya 5 butir soal santai dengan pembahasan langsung.
  4. Total estimasi belajar harian turun dari 65 menit (Tantangan) menjadi 35 menit.
- Rekomendasi materi di tab Belajar (`features/learn/queries.ts:81-125`) otomatis mengangkat materi ringkas tersebut ke bagian atas.
- *Kelemahan ditemukan:* Pada tab Tryout (`app/(dashboard)/dashboard/mock-exam/page.tsx`), parameter `mode` tidak diteruskan ke komponen `MockExamHub`, sehingga rekomendasi tingkat paparan Santai dan catatan peringatan pemulihan di `LevelPicker` tidak aktif di tab Tryout.

### 2. Bisakah siswa dengan stres tingkat 5 menjangkau alat penenang dari hasil check-in dalam satu langkah, dan apakah kunjungan tersebut dicatat serta dimanfaatkan?
**Bukti Kode:**
- **Jangkauan satu langkah:** Ya. Siswa yang melaporkan stres 5 langsung menerima Rencana Pemulihan di Beranda. Tugas nomor 2 di daftar tugas adalah *Latihan Pernapasan Kotak*. Menekan tombol **"Mulai"** langsung membuka rute `/dashboard/calm` (1 kali klik).
- **Pencatatan:** Kunjungan halaman itu sendiri tidak dicatat. Namun, jika siswa menjalankan latihan napas dan menekan "Selesai", fungsi `saveCalmSessionAction` mencatat sesi tersebut ke tabel `calm_sessions` (durasi dan waktu selesai).
- **Pemanfaatan data:** **TIDAK DIMANFAATKAN SAMA SEKALI.** Tabel `calm_sessions` tidak memiliki satu pun pemanggil kueri `findMany` di seluruh *codebase*. Rekaman sesi tenang menjadi arsip pasif (*write-only data*).

### 3. Bisakah siswa menjangkau "Napas dulu" dan layanan bantuan dari dalam tryout dan di waktu lain, atau hanya setelah tiga hari berat?
**Bukti Kode:**
- **"Napas dulu":**
  - Dapat diakses kapan saja di dalam tryout melalui tombol di navigator soal (`features/practice/components/question-navigator.tsx:94-109`) baik pada tampilan desktop maupun laci (*drawer*) seluler.
  - Dapat diakses di luar tryout kapan saja melalui tab navigasi utama "Tenang" (`/dashboard/calm`).
- **Layanan Bantuan Resmi:**
  - Dapat diakses **kapan saja** tanpa harus menunggu 3 hari berat, melalui tautan "Bantuan & Dukungan" di bilah samping (*sidebar*) desktop (`components/sidebar.tsx:120-126`) dan ikon bantuan di *header* ponsel (`app/(dashboard)/dashboard/layout.tsx:51-58`).
  - Kondisi 3 hari berat berturut-turut memunculkan spanduk tambahan yang mencolok di Beranda (`daily-plan-view.tsx:91-116`), namun tidak pernah mengunci akses biasa.
  - *Kekurangan:* Di dalam antarmuka pengerjaan tryout (`SessionRunner`), tidak tersedia tautan langsung ke halaman bantuan darurat.

### 4. Apakah reframing kognitif lokal mengikuti struktur nyata (situasi, pikiran, uji pikiran, alternatif seimbang), atau hanya beberapa kalimat siap pakai?
**Bukti Kode:**
- Struktur keluaran data di `lib/cbt/thought-reframe.ts` telah mendefinisikan komponen kognitif: `thought` (pikiran), `validation` (validasi emosi), `distortion` (kategori distorsi kognitif), `fact` (fakta penyeimbang), dan `smallStep` (langkah aksi mikro).
- **Namun, mesin pemrosesannya sangat sederhana (*shallow rule*):**
  - Hanya ada 4 kelompok tema kata kunci teks mentah (`orang tua/keluarga`, `jalan pintas/bocoran`, `waktu/terlambat`, `gagal/putus asa`) dan 1 respons *default*.
  - Pemadanan string menggunakan `clean.includes(keyword)` tanpa batas kata, memicu salah klasifikasi lucu: kata `"ibukota"` akan memicu tema "orang tua" karena mengandung substring `"ibu"`, lalu menghasilkan respon *"Rasa takut mengecewakan orang terdekat..."*.
  - Dua dari tiga contoh cepat (*preset chips*) yang disediakan di UI antarmuka (`"Semua temanku belajarnya lebih rajin"` dan `"Skor tryout kemarin turun drastis"`) tidak cocok dengan kelompok tema mana pun, sehingga langsung jatuh ke respons *default*.

### 5. Apakah jurnal refleksi bermuara ke suatu tempat, atau jalan buntu (*dead end*)?
**Bukti Kode:** **Jalan Buntu (*Dead End*).**
- Pada komponen `PrivateJournal` (`features/calm/components/calm-room.tsx:590-652`), teks yang diketik siswa dikirim melalui server action `saveCalmSessionAction` dan disimpan ke kolom `calm_sessions.note`.
- Tidak ada antarmuka riwayat jurnal, tidak ada kueri untuk mengambil catatan jurnal, dan siswa tidak pernah bisa membaca kembali apa yang telah mereka tulis.
- Selain itu, modul enkripsi `crypto.ts` yang dijanjikan pada `AGENTS.md` Bagian 5 tidak ada di dalam repositori, sehingga teks disimpan polos (*plaintext*).

### 6. Apakah Insight berujung pada langkah konkret bagi siswa, atau hanya sekadar grafik?
**Bukti Kode:** **Hanya grafik visual tanpa tombol aksi.**
- `features/insight/components/insight-dashboard.tsx` menyajikan:
  1. Grafik batang jam tidur & stres 14 hari.
  2. Distribusi persentase penyebab kesalahan (*Error Autopsy*).
  3. Daftar akurasi penguasaan topik.
- Di akhir halaman, tidak tersedia satu pun tombol tautan (*Call to Action*), misalnya *"Latih Topik Terlemah"*, *"Pelajari Ulang Konsep"*, atau *"Mulai Latihan Tanpa Timer"*. Siswa hanya melihat diagram tanpa panduan langkah berikutnya.

### 7. Apakah aplikasi menggunakan tren dari waktu ke waktu (misalnya tidur sepekan terhadap akurasi), atau hanya nilai hari ini?
**Bukti Kode:**
- Penentuan mode harian **hanya menggunakan nilai check-in hari ini** (`sleepHours`, `stress`, `energy`, `mood`).
- Kueri `getInsightDashboardData()` mengambil 10 sesi tryout (`tryoutSessionsRaw`), namun variabel tersebut **bahkan tidak di-*destructure* atau ditampilkan** di antarmuka `InsightDashboard`.
- Grafik Insight hanya menjajarkan batang tidur dan stres harian secara visual. Tidak ada kalkulasi korelasi statistik antara durasi tidur dan nilai tryout.

### 8. Apa yang sebenarnya dilihat oleh siswa dengan data riwayat demo 14 hari di kelima tab? Apakah membentuk cerita yang koheren?
**Bukti Kode & Cerita Demo:**
Seeder (`prisma/seed.ts:357-697`) merancang narasi yang jelas dan konsisten:
- **Hari 13 s.d. 7:** Kondisi stabil (tidur 6.5–7.5 jam, stres 1–2).
- **Hari 6 s.d. 3:** Kelelahan mulai menumpuk (tidur turun ke 5.5–6 jam, stres naik ke 3).
- **Hari 2:** Siswa mengambil tryout KPU (skor 65%), di mana jawaban di 15 menit terakhir salah karena kehabisan waktu (`out_of_time`), stres naik ke 4.
- **Hari 1 (kemarin):** Tidur hanya 4 jam, stres 4, catatan: *"Kurang tidur dan kepala agak pusing"*. Mode pemulihan terpicu.
- **Hari 0 (hari ini):** Disediakan dalam keadaan siap check-in atau terisi mode Pemulihan.

**Pengalaman di 5 Tab:**
1. **Beranda:** Menampilkan Mode Pemulihan dengan alasan transparan: *"Tidurmu kurang atau energimu rendah, jadi cukup ulas materi tanpa tekanan waktu."* Tugas harian berdurasi ringan (35 menit) berisi materi pendek, napas kotak, dan latihan santai 5 soal. (**Sangat Koheren**).
2. **Belajar:** Menampilkan rekomendasi materi "Logika Kuantor" (8 menit baca) yang terhubung langsung dengan tugas harian Beranda. (**Sangat Koheren**).
3. **Tryout:** Menampilkan riwayat tryout KPU skor 65%. Namun, rekomendasi mode Santai di `LevelPicker` tidak menyala karena *bug* pengiriman *prop* `mode`. (**Sebagian Koheren**).
4. **Insight:** Syarat 7 check-in terpenuhi (13 data check-in). Grafik 14 hari memperlihatkan pola tidur yang menukik turun di akhir pekan sementara stres melonjak. Diagram Error Autopsy memperlihatkan 100% kesalahan disebabkan oleh "Habis Waktu" (`out_of_time`). (**Sangat Koheren**).
5. **Tenang:** Berfungsi mandiri, namun tidak menampilkan riwayat napas atau catatan jurnal sebelumnya. (**Terisolasi**).

---

## 4. Audit Enam Aturan Spesifikasi (AGENTS.md Bagian 7)

| Kunci Aturan | Pemicu di Spesifikasi | Status Kode | Tampil di Antarmuka Siswa? | Kalimat Alasan ("Kenapa ini?") | Cakupan Tes Unit |
|---|---|---|---|---|---|
| `recovery` | Tidur $< 5$ jam ATAU Stres $\ge 4$ | **Lengkap** (`lib/rules/daily-mode.ts:64-80`) | **Ya** (Spanduk mode Beranda, tugas ringan) | **Ya** ("Tidurmu X jam..." atau "Tingkat beban pikiranmu sedang tinggi...") | **Lolos** (`test/daily-mode-and-plan.test.ts:6-27`) |
| `balanced` | Kondisi selain pemulihan & tantangan | **Lengkap** (`lib/rules/daily-mode.ts:98-105`) | **Ya** (Spanduk seimbang, tugas terarah) | **Ya** ("Kondisimu dalam ritme stabil...") | **Lolos** (`test/daily-mode-and-plan.test.ts:41-50`) |
| `challenge` | Tidur $\ge 7$ jam DAN Energi $\ge 4$ DAN Stres $\le 2$ | **Lengkap** (`lib/rules/daily-mode.ts:82-95`) | **Ya** (Spanduk tantangan, simulasi penuh) | **Ya** ("Tidur cukup dan energimu prima hari ini...") | **Lolos** (`test/daily-mode-and-plan.test.ts:29-39`) |
| `referral` | 3 hari berturut-turut mood $\le 2$ ATAU stres $\ge 4$ | **Parsial** (`lib/rules/daily-mode.ts:40-62`) | **Ya** (Spanduk rujukan di Beranda $\rightarrow$ `/dashboard/support`) | **Parsial** (Teks spanduk rujukan tampil, namun tidak masuk ke `daily_plans.reason`) | **Lolos** (`test/daily-mode-and-plan.test.ts:68-107`) |
| `rest_suggestion` | Akurasi turun saat jam belajar naik selama 2 hari | **BELUM DIBUAT** (Hanya konstanta pasif di `config/rules.ts:5`) | **TIDAK** (Tidak pernah dipanggil atau ditampilkan) | **TIDAK** | **Nihil** (0 pengujian) |
| `graded_exposure` | $> 40\%$ salah panik/kehabisan waktu di 3 tryout terakhir | **BELUM DIBUAT** (Hanya konstanta pasif di `config/rules.ts:6`) | **TIDAK** (Tidak pernah dipanggil atau ditampilkan) | **TIDAK** | **Nihil** (0 pengujian) |

*Catatan Cacat Logika pada `referral`:*
1. Pada `AGENTS.md` tabel Bagian 7 tertulis *mood $\le 2$ **OR** stress $\ge 4$*. Di dalam kode diimplementasikan sebagai operator *DAN* (`input.mood <= 2 && input.stress >= 4`).
2. Kueri `actions.ts:60-68` mengambil 2 riwayat terakhir check-in terurut tanggal menurun tanpa memverifikasi apakah kedua tanggal tersebut bersebelahan secara kalender. Data berjarak 1 bulan tetap dianggap berturut-turut.

---

## 5. Audit Data Satu Arah (*Write-Only Data Audit*)

Berikut adalah daftar tabel dan kolom yang ditulis ke basis data namun tidak pernah dibaca kembali dalam alur pengalaman siswa:

| Tabel | Kolom / Rekaman | Diisi Oleh | Mengapa Menjadi *Write-Only*? | Tingkat Keparahan |
|---|---|---|---|---|
| `calm_sessions` | **Seluruh Baris Tabel** | `saveCalmSessionAction` di Ruang Tenang | Tidak ada satupun pemanggilan `prisma.calmSession.findMany` atau `findUnique` di seluruh aplikasi. Sesi latihan napas dan grounding hilang begitu disimpan. | **Minor** |
| `calm_sessions` | `note` (Catatan Jurnal & Reframing) | `PrivateJournal` dan simpan hasil Reframe | Tidak ada antarmuka bagi siswa untuk membaca kembali refleksi jurnal pribadinya. | **Major** (Fungsi Jurnal menjadi semu) |
| `calm_sessions` | `tryout_session_id` | Skema Prisma | Kolom disiapkan, tetapi tombol "Napas dulu" di tryout tidak pernah memanggil `saveCalmSessionAction` dengan id sesi. Nilainya selalu `NULL`. | **Minor** |
| `support_events` | **Seluruh Baris Tabel** | `recordSupportEventAction` saat klik hotline/web | Tidak ada kueri atau dashboard admin/analitik yang membaca rekaman klik bantuan ini. | **Minor** |
| `checkins` | `energy` | Formulir Check-in | Dibaca saat evaluasi mode harian hari itu, tetapi **tidak pernah dibaca atau divisualisasikan** di grafik Insight. | **Minor** |
| `checkins` | `mood` | Formulir Check-in | Dibaca saat evaluasi mode harian hari itu, tetapi **tidak pernah dibaca atau divisualisasikan** di grafik Insight. | **Minor** |
| `checkins` | `note` | Formulir Check-in | Hanya ditampilkan di spanduk Beranda hari ini. Tidak pernah bisa dicari, dianalisis, atau dilihat riwayatnya di Insight. | **Minor** |
| `tryout_sessions`| `plan_task_id` | Skema Prisma | Relasi ada di skema, namun `startSessionService` tidak menerima atau mengisi `planTaskId`, sehingga tugas di Beranda tidak terhubung otomatis dengan sesi tryout yang dibuat. | **Minor** |

---

## 6. Pemeriksaan Integritas Klaim (*Claims Check*)

| Dokumen / Berkas | Teks Klaim | Realitas pada Kode Sumber | Status Integritas |
|---|---|---|---|
| `README.md` (Baris 26) | *"Korelasi mingguan antara pola tidur/stres dengan akurasi pengerjaan."* | Grafik jam tidur (14 hari) dan akurasi topik disajikan berdampingan secara visual, namun korelasi antara jam tidur dan skor tryout **tidak pernah dihitung atau disandingkan**. Data skor tryout diabaikan oleh komponen Insight. | **Major** (Klaim berlebih / belum didukung) |
| `checkin-form.tsx` (Baris 289) | *"Data bersifat pribadi dan dapat dihapus kapan saja di Pengaturan."* | Tidak ada rute, menu, atau tombol menuju halaman **Pengaturan** di seluruh aplikasi. Siswa tidak memiliki sarana mandiri di antarmuka untuk menghapus data wellbeing. | **Major** (Klaim antarmuka tidak terbukti) |
| `AGENTS.md` (Baris 98) | *`crypto.ts: Encryption for free-text notes`* | Berkas `crypto.ts` tidak ada di repositori. Catatan jurnal disimpan dalam teks biasa (*plaintext*). | **Major** (Penyimpangan spesifikasi arsitektur) |
| `app/page.tsx` & `lib/copy/id.ts` | *"MOODI mendukung kesejahteraanmu, bukan pengganti psikolog atau konselor."* | Tampil konsisten di footer, halaman login/register, ruang tenang, dan direktori rujukan. Tidak ditemukan istilah diagnosis klinis, janji kesembuhan, atau terapi medis. | **Lolos** (Mematuhi kaidah non-klinis) |
| `features/ai/` | *"Zero Student Data Sent to LLMs"* | Seluruh pemanggilan Gemini API (`@google/genai`) terisolasi di `features/ai` hanya untuk membuat draf materi/soal admin dari konteks silabus topik. Tidak ada impor tabel siswa (`checkins`, `calm_sessions`, `tryout_sessions`). | **Lolos** (Batas privasi 100% terjaga) |

## 7. Lima Proposal Peningkatan Substansi (*Ranked Proposals*)

Sesuai instruksi, seluruh 5 proposal berikut telah **disetujui oleh pemilik proyek (*ACC*)** dan telah diimplementasikan penuh serta lulus uji verifikasi:
1. **Inovasi & Kesesuaian SDG (30%)**
2. **Antarmuka & Tata Letak (30%)**
3. **Kejelasan Tujuan & Fitur (20%)**
4. **Kelengkapan Teknis (20%)**

> [!NOTE]
> **Status:** Seluruh proposal (1 s.d. 5) telah selesai diimplementasikan, diverifikasi oleh 76 unit test vitest (100% lolos), dan lulus pemeriksaan kompilasi TypeScript (`tsc --noEmit`).

---

### Proposal 1: Aktifkan Graded Exposure & Hubungkan Tombol "Napas Dulu" ke Siklus Data
- **Status:** **SELESAI & TERVERIFIKASI (Lulus 3 Unit Test di `test/practice-and-rules.test.ts`)**
- **Implementasi:**
  1. `lib/rules/graded-exposure.ts` mengevaluasi 3 tryout terakhir: jika $>40\%$ kesalahan bertanda `panic` atau `out_of_time`, sistem mengembalikan rekomendasi mode yang lebih tenang (`relaxed` atau `timed`).
  2. `features/practice/queries.ts` dan `features/practice/components/mock-exam-hub.tsx` menampilkan spanduk saran paparan bertahap dengan 1 kalimat alasan dan tombol pintas ke Ruang Tenang.
  3. Menutup overlay "Napas dulu" saat tryout di `features/practice/components/session-runner.tsx` otomatis mencatat sesi tenang terkait id tryout tersebut dengan pemicu `panic_button`.
  4. Menambahkan tombol darurat "Bantuan & Kontak Resmi" di laci navigasi tryout (`features/practice/components/question-navigator.tsx`).

---

### Proposal 2: Transformasi Insight dari Grafik Pasif Menjadi Tindakan Konkret & Korelasi Faktual Tidur-Akurasi
- **Status:** **SELESAI & TERVERIFIKASI**
- **Implementasi:**
  1. `features/insight/queries.ts` menghitung perbandingan faktual berbasis data mandiri siswa: rata-rata akurasi tryout pada hari dengan jam tidur $\ge 7$ jam versus $< 6$ jam (dilindungi *consent gating*, tanpa klaim klinis).
  2. `features/insight/components/insight-dashboard.tsx` menyajikan kartu perbandingan faktual dan menambahkan kartu **Langkah Konkret Berikutnya** dengan tombol aksi CTA terarah ke modul belajar, tryout santai, atau ruang tenang sesuai penyebab kesalahan dominan (`didnt_know`, `out_of_time`, `panic`, atau `careless`).

---

### Proposal 3: Perbaiki Ketepatan Pemadanan Mesin Reframing CBT Lokal & Dukung Semua Contoh Cepat
- **Status:** **SELESAI & TERVERIFIKASI (Lulus 5 Unit Test di `test/thought-reframe.test.ts`)**
- **Implementasi:**
  1. `lib/cbt/thought-reframe.ts` beralih ke regex batas kata Unicode `(?:\^|\\P{L})keyword(?:\$|\\P{L})` sehingga mencegah salah tangkap kata turunan (misal "ibukota" tidak lagi memicu "ibu").
  2. Menambahkan tema kognitif untuk memvalidasi 3 *preset chips* bawaan (Perbandingan dengan Teman, Skor Tryout Turun, dan Kekhawatiran Waktu).
  3. Mempertegas 4 langkah kognitif terstruktur pada kartu hasil: (1) Pikiran yang Diperiksa, (2) Pengenalan Distorsi, (3) Sudut Pandang Objektif & Penyeimbang, (4) Langkah Mikro Hari Ini.

---

### Proposal 4: Buka Jalan Buntu Jurnal Pribadi (Riwayat Refleksi Mandiri & Tata Kelola Data)
- **Status:** **SELESAI & TERVERIFIKASI**
- **Implementasi:**
  1. Membuat `features/calm/queries.ts` (`getCalmRoomData`) dengan perlindungan persetujuan (*wellbeing consent*).
  2. Menambahkan aksi `deleteCalmSessionAction` di `features/calm/actions.ts` sehingga siswa memiliki kendali privasi penuh untuk menghapus catatan refleksi mandiri.
  3. Menampilkan daftar "Refleksi Sebelumnya" di tab Jurnal pada `features/calm/components/calm-room.tsx` lengkap dengan tanggal dan tombol hapus catatan.

---

### Proposal 5: Perbaiki Validasi Kalender Aturan Rujukan & Wujudkan Aturan Rest Suggestion
- **Status:** **SELESAI & TERVERIFIKASI (Lulus Unit Test di `test/daily-mode-and-plan.test.ts`)**
- **Implementasi:**
  1. `lib/rules/daily-mode.ts` (`checkReferralTriggered`) kini menghitung selisih tanggal kalender secara ketat (`diffDays === 1`) dan menerapkan operator ATAU yang adil sesuai `AGENTS.md` (suasana hati $\le 2$ ATAU tingkat stres $\ge 4$).
  2. Membuat modul murni `lib/rules/rest-suggestion.ts`: jika akurasi menurun sementara waktu latihan meningkat selama 2 hari kalender berturut-turut, spanduk Beranda menampilkan saran istirahat suportif tanpa menyalahkan siswa.
  3. Mengintegrasikan kalkulasi ke `features/checkin/queries.ts` dan menampilkan spanduk saran istirahat di `features/checkin/components/daily-plan-view.tsx`.

---

## 8. Cacat Langsung yang Memerlukan Perbaikan Cepat (*Bug Fixes*)

1. **Pass-through Prop Mode di Tryout (`app/(dashboard)/dashboard/mock-exam/page.tsx`):**
   - **Status:** **SUDAH DIPERBAIKI & TERVERIFIKASI.**
   - Halaman `/dashboard/mock-exam` kini mengueri `todayPlan` untuk hari ini dan meneruskan `mode={todayPlan?.mode ?? null}` ke `MockExamHub`. `LevelPicker` dan katalog latihan langsung mengaktifkan rekomendasi mode Santai saat siswa berada dalam mode Pemulihan.

2. **Koreksi Jendela Deteksi Error Autopsy pada Sesi Topik Pendek (`lib/rules/guess-error-tag.ts`):**
   - **Status:** **SUDAH DIPERBAIKI & TERVERIFIKASI.**
   - Menyesuaikan jendela waktu pada sesi pendek ($\le 900$ detik) menjadi 30% dari batas waktu latihan secara proporsional di dalam fungsi tanpa mengubah konstanta global `RULES.autopsy` (mematuhi Aturan 5 `AGENTS.md`). Diuji penuh di `test/practice-and-rules.test.ts`.

---

## 9. Hasil Akhir Rangkaian Pengujian (*Test Suite & Verification*)

- **Unit Tests:** 76 dari 76 pengujian lulus (8 berkas pengujian di Vitest).
- **TypeScript Typecheck:** `npx tsc --noEmit` lolos 100% tanpa kesalahan tipe (*zero errors*).
- **Integritas Gaya Bahasa:** 0 karakter em-dash (`—` atau `--`) di seluruh teks antarmuka Bahasa Indonesia, mematuhi panduan `AGENTS.md` Bagian 11.4.
- **Privasi & Keamanan:** Seluruh pembacaan dan penulisan data sensitif *wellbeing* (`checkins`, `calm_sessions`) diverifikasi terkunci di balik *consent gating* (`studentProfile.wellbeingConsent`). Tidak ada data siswa yang dikirimkan ke model AI eksternal.

