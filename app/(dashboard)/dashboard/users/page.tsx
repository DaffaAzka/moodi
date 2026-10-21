import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { getUserRole } from "@/lib/user-role";
import { siteCopy } from "@/lib/copy/id";
import { getUsersList, getUserStats } from "@/features/users/queries";
import { UserManagementView } from "@/features/users/components/user-management-view";
import type { UserRole } from "@/app/generated/prisma/client";

const copy = siteCopy.userManagement;

export const metadata = {
  title: `${copy.title} | ${siteCopy.brand}`,
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    role?: string;
    search?: string;
  }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (getUserRole(session.user.role) !== "admin") redirect("/dashboard");

  const { page: rawPage, role: rawRole, search } = await searchParams;

  const requestedPage = Number(rawPage ?? 1);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const validRole: UserRole | "all" =
    rawRole === "student" || rawRole === "admin" ? rawRole : "all";

  const [{ users, totalCount, totalPages, currentPage }, stats] =
    await Promise.all([
      getUsersList({
        page,
        role: validRole,
        search: search ?? "",
        pageSize: 10,
      }),
      getUserStats(),
    ]);

  return (
    <main className="min-w-0 flex-1 px-4 pb-24 py-8 sm:px-6 lg:px-10 lg:pb-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-pixelify text-3xl font-bold leading-tight sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            {copy.description}
          </p>
        </div>

        {/* User Management Content */}
        <UserManagementView
          currentAdminId={session.user.id}
          currentPage={currentPage}
          stats={stats}
          totalCount={totalCount}
          totalPages={totalPages}
          users={users}
        />
      </div>
    </main>
  );
}
