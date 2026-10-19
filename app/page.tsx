import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PixelIcon } from "@/components/pixel";
import { siteCopy } from "@/lib/copy/id";

function PixelStudyScene() {
  return (
    <figure
      aria-label={siteCopy.landing.illustrationLabel}
      className="relative mx-auto w-full max-w-lg border-2 border-border bg-card p-3 shadow-[8px_8px_0_var(--border)] sm:p-5"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="block h-auto w-full"
        shapeRendering="crispEdges"
        viewBox="0 0 400 320"
      >
        <rect width="400" height="320" className="fill-muted" />
        <rect x="32" y="24" width="192" height="144" className="fill-foreground" />
        <rect
          x="44"
          y="36"
          width="168"
          height="120"
          className="scene-sky"
        />
        <g className="scene-sun">
          <rect x="152" y="60" width="32" height="32" className="fill-moodi-butter" />
          <rect x="160" y="52" width="16" height="8" className="fill-moodi-butter" />
          <rect x="160" y="92" width="16" height="8" className="fill-moodi-butter" />
          <rect x="144" y="68" width="8" height="16" className="fill-moodi-butter" />
        </g>
        <g className="scene-moon">
          <rect x="156" y="56" width="32" height="32" className="fill-moodi-butter" />
          <rect x="172" y="48" width="16" height="8" className="fill-moodi-butter" />
          <rect x="172" y="88" width="16" height="8" className="fill-moodi-butter" />
          <rect x="180" y="56" width="16" height="24" className="scene-moon-cutout" />
        </g>
        <g className="scene-stars fill-foreground">
          <rect x="72" y="56" width="8" height="8" />
          <rect x="112" y="96" width="8" height="8" />
          <rect x="72" y="124" width="8" height="8" />
          <rect x="132" y="44" width="8" height="8" />
        </g>
        <rect x="44" y="128" width="168" height="28" className="scene-hill" />
        <rect x="28" y="176" width="216" height="12" className="fill-foreground" />
        <rect x="44" y="188" width="16" height="92" className="fill-foreground" />
        <rect x="212" y="188" width="16" height="92" className="fill-foreground" />
        <rect x="84" y="188" width="104" height="8" className="fill-foreground" />
        <rect x="108" y="112" width="104" height="56" className="fill-moodi-peach" />
        <rect x="124" y="128" width="72" height="32" className="fill-card" />
        <rect x="132" y="136" width="56" height="8" className="fill-moodi-sky" />
        <rect x="156" y="152" width="8" height="8" className="fill-foreground" />
        <rect x="276" y="124" width="72" height="12" className="fill-foreground" />
        <rect x="284" y="136" width="56" height="48" className="fill-moodi-pink" />
        <rect x="292" y="144" width="40" height="32" className="fill-moodi-butter" />
        <rect x="300" y="104" width="24" height="20" className="fill-moodi-sky" />
        <rect x="272" y="188" width="80" height="12" className="fill-foreground" />
        <rect x="280" y="200" width="16" height="64" className="fill-foreground" />
        <rect x="328" y="200" width="16" height="64" className="fill-foreground" />
        <rect x="52" y="248" width="56" height="16" className="fill-moodi-butter" />
        <rect x="60" y="232" width="40" height="16" className="fill-moodi-butter" />
        <rect x="68" y="216" width="24" height="16" className="fill-moodi-butter" />
        <rect x="68" y="200" width="8" height="16" className="fill-moodi-butter" />
        <rect x="216" y="224" width="40" height="40" className="fill-moodi-sky" />
        <rect x="224" y="216" width="24" height="8" className="fill-moodi-sky" />
      </svg>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>{siteCopy.landing.illustrationLabel}</span>
        <span aria-hidden="true" className="grid grid-cols-2 gap-1">
          <i className="size-2 bg-moodi-sky" />
          <i className="size-2 bg-moodi-butter" />
          <i className="size-2 bg-moodi-pink" />
          <i className="size-2 bg-moodi-peach" />
        </span>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const copy = siteCopy.landing;

  return (
    <>
      <header className="sticky top-0 z-20 border-b-2 border-border bg-background/95 backdrop-blur">
        <nav
          aria-label={siteCopy.brand}
          className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <Link
            className="shrink-0 font-pixelify text-2xl font-bold tracking-wide"
            href="/"
          >
            {siteCopy.brand}
          </Link>
          <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a className="hover:text-link" href="#alur">
              Alur Belajar
            </a>
            <a className="hover:text-link" href="#fitur">
              Fitur
            </a>
            <a className="hover:text-link" href="#bantuan">
              Bantuan
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              className="min-h-10 border-2 border-border bg-card px-4 py-2 text-sm font-semibold shadow-[2px_2px_0_var(--border)] hover:bg-muted"
              href="/login"
            >
              {siteCopy.navigation.signIn}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.eyebrow}
            </p>
            <h1 className="font-pixelify text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              {copy.headlineFirst}{" "}
              <span className="block text-link">{copy.headlineSecond}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {copy.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="pixel-press inline-flex min-h-12 items-center justify-center gap-2 border-2 border-border bg-moodi-sky px-6 font-semibold text-ink shadow-[4px_4px_0_var(--border)]"
                href="/register"
              >
                <span>{copy.primaryAction}</span>
                <PixelIcon name="arrow-right" size={16} />
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center border-2 border-border bg-card px-6 font-semibold hover:bg-muted"
                href="#alur"
              >
                {copy.secondaryAction}
              </a>
            </div>
          </div>
          <PixelStudyScene />
        </section>

        {/* Steps / Flow Section */}
        <section
          className="border-t-2 border-border bg-card py-14 sm:py-20"
          id="alur"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {copy.aboutLabel}
              </p>
              <h2 className="mt-1 font-pixelify text-3xl leading-tight sm:text-4xl">
                {copy.stepsTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                {copy.stepsIntro}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.steps.map((step, index) => (
                <div
                  className="flex flex-col justify-between border-2 border-border bg-background p-5 shadow-[4px_4px_0_var(--border)]"
                  key={step.title}
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-border/30 pb-3">
                      <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                        Langkah 0{index + 1}
                      </span>
                      <PixelIcon
                        name={index === 0 ? "sun" : index === 1 ? "target" : "chart"}
                        size={18}
                        className="text-foreground"
                      />
                    </div>
                    <h3 className="mt-4 font-pixelify text-xl font-bold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section: Asymmetrical Editorial Showcase */}
        <section className="border-t-2 border-border bg-muted py-14 sm:py-20" id="fitur">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {copy.featuresLabel}
              </p>
              <h2 className="mt-1 font-pixelify text-3xl sm:text-4xl">
                {copy.featuresTitle}
              </h2>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Lead Feature: Error Autopsy */}
              <article className="flex flex-col justify-between border-2 border-border bg-card p-6 shadow-[4px_4px_0_var(--border)] sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                      Pembedahan Jawaban
                    </span>
                    <PixelIcon name="chart" size={24} className="text-foreground" />
                  </div>
                  <h3 className="mt-4 font-pixelify text-2xl font-bold sm:text-3xl">
                    Error Autopsy
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                    Membedakan apakah kamu salah karena materi memang belum paham atau karena waktu mepet dan panik saat tryout berlangsung.
                  </p>

                  {/* Concrete Error Cause Tags Demonstration */}
                  <div className="mt-6 border-2 border-border/40 bg-background p-4">
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      Label penyebab salah yang dievaluasi:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="border border-border p-2 bg-card">
                        <span className="font-semibold block">Belum paham</span>
                        <span className="text-muted-foreground text-xs">Materi perlu diulas</span>
                      </div>
                      <div className="border border-border p-2 bg-card">
                        <span className="font-semibold block">Kehabisan waktu</span>
                        <span className="text-muted-foreground text-xs">Pacing belum terbiasa</span>
                      </div>
                      <div className="border border-border p-2 bg-card">
                        <span className="font-semibold block">Panik / tegang</span>
                        <span className="text-muted-foreground text-xs">Tekanan waktu ujian</span>
                      </div>
                      <div className="border border-border p-2 bg-card">
                        <span className="font-semibold block">Kurang teliti</span>
                        <span className="text-muted-foreground text-xs">Salah baca opsi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Side Features: Check-in & Calm Room */}
              <div className="flex flex-col gap-6">
                <article className="border-2 border-border bg-card p-6 shadow-[4px_4px_0_var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                      Adaptif Harian
                    </span>
                    <PixelIcon name="sun" size={22} className="text-foreground" />
                  </div>
                  <h3 className="mt-3 font-pixelify text-xl font-bold">
                    Check-in Harian
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Catat tidur, energi, mood, dan beban pikiran dalam 30 detik. Mode belajar otomatis menyesuaikan kapasitasmu: Pemulihan, Seimbang, atau Tantangan.
                  </p>
                </article>

                <article className="border-2 border-border bg-card p-6 shadow-[4px_4px_0_var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                      Dukungan Regulasi
                    </span>
                    <PixelIcon name="breathe" size={22} className="text-foreground" />
                  </div>
                  <h3 className="mt-3 font-pixelify text-xl font-bold">
                    Ruang Tenang
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Latihan pernapasan kotak 4-4-4-4, teknik grounding 5-4-3-2-1, dan reframing pikiran lokal saat cemas datang menjelang hari ujian.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Support Banner */}
        <section
          className="border-t-2 border-border bg-card py-14 sm:py-20"
          id="bantuan"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="font-pixelify text-3xl leading-tight sm:text-4xl">
                {copy.closingTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                {copy.closingDescription}
              </p>
            </div>
            <Link
              className="pixel-press inline-flex min-h-12 shrink-0 items-center justify-center border-2 border-border bg-moodi-pink px-6 font-semibold text-ink shadow-[4px_4px_0_var(--border)]"
              href="/register"
            >
              {copy.primaryAction}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border bg-background" id="privasi">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <Link className="font-pixelify text-2xl font-bold" href="/">
              {siteCopy.brand}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.footerTagline}
            </p>
            <p className="mt-4 max-w-2xl text-xs leading-5 text-muted-foreground">
              {copy.sdg}
            </p>
            <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-muted-foreground">
              {copy.disclaimer}
            </p>
            <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
              {copy.iconCredit}
            </p>
          </div>
          <nav
            aria-label={copy.privacy}
            className="flex gap-5 text-sm font-semibold"
          >
            <a className="hover:underline underline-offset-4" href="#alur">
              Alur
            </a>
            <a className="hover:underline underline-offset-4" href="#fitur">
              Fitur
            </a>
            <a className="hover:underline underline-offset-4" href="#bantuan">
              Bantuan
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
