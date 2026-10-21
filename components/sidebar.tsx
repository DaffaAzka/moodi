"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PixelIcon, type PixelIconName } from "@/components/pixel";
import { siteCopy } from "@/lib/copy/id";
import type { UserRole } from "@/lib/user-role";

function NavigationIcon({ icon }: { icon: string }) {
  const iconNameMap: Record<string, PixelIconName> = {
    home: "home",
    book: "book",
    timer: "timer",
    chart: "chart",
    calm: "calm",
    grid: "table",
    list: "list",
    user: "user",
  };

  const name = iconNameMap[icon] ?? "home";
  return <PixelIcon name={name} size={20} className="shrink-0" />;
}

function DashboardNavigation({
  role,
  mobile = false,
}: {
  role: UserRole;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const navigation = siteCopy.dashboard.roles[role].navigation;

  return (
    <ul
      className={mobile ? "grid auto-cols-fr grid-flow-col" : "flex flex-col gap-2"}
    >
      {navigation.map((item) => (
        <li className={mobile ? "min-w-0" : ""} key={item.label}>
          {item.available ? (
            (() => {
              const href = ("href" in item ? item.href : undefined) ?? "/dashboard";
              // Exact match for the question-bank overview to avoid lighting up when
              // visiting /subtests, /topics, or /questions.
              const isExactRoute = href === "/dashboard/question-bank";
              const isCurrent = isExactRoute
                ? pathname === href
                : pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(`${href}/`));

              return (
                <Link
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? mobile
                        ? "flex min-h-16 flex-col items-center justify-center gap-1 border-t-4 border-moodi-sky bg-muted px-1 text-center text-xs font-semibold text-foreground"
                        : "flex min-h-12 items-center gap-3 border-2 border-border bg-moodi-sky px-3 font-semibold text-ink shadow-[2px_2px_0_var(--border)]"
                      : mobile
                        ? "flex min-h-16 flex-col items-center justify-center gap-1 border-t-4 border-transparent px-1 text-center text-xs font-semibold text-muted-foreground hover:bg-muted"
                        : "flex min-h-12 items-center gap-3 border-2 border-border px-3 font-semibold hover:bg-muted"
                  }
                  href={href}
                >
                  <NavigationIcon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })()
          ) : (
            <div
              aria-disabled="true"
              className={
                mobile
                  ? "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-center text-xs text-muted-foreground"
                  : "flex min-h-12 items-center gap-3 border-2 border-transparent px-3 text-muted-foreground"
              }
              title={siteCopy.dashboard.comingSoon}
            >
              <NavigationIcon icon={item.icon} />
              <span className={mobile ? "leading-none" : "flex-1"}>
                {item.label}
              </span>
              {!mobile && (
                <span className="text-xs">
                  {siteCopy.dashboard.comingSoon}
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Sidebar({ role }: { role: UserRole }) {
  const roleCopy = siteCopy.dashboard.roles[role];

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r-2 border-border bg-card px-5 py-6 lg:flex">
        <Link
          className="font-pixelify text-2xl font-bold tracking-wide"
          href="/dashboard"
        >
          {siteCopy.brand}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{roleCopy.label}</p>

        <div className="mt-9">
          <nav aria-label={siteCopy.dashboard.navigationLabel}>
            <DashboardNavigation role={role} />
          </nav>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-5">
          <Link
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            href="/dashboard/support"
          >
            <PixelIcon name="support" size={16} className="text-foreground shrink-0" />
            <span>Bantuan & Dukungan</span>
          </Link>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </aside>

      <nav
        aria-label={siteCopy.dashboard.navigationLabel}
        className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <DashboardNavigation mobile role={role} />
      </nav>
    </>
  );
}
