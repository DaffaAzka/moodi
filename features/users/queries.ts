import "server-only";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import type { UserListItem, UserStats, UserFilterParams } from "./types";

export async function getUsersList({
  role = "all",
  search = "",
  page = 1,
  pageSize = 10,
}: UserFilterParams = {}): Promise<{
  users: UserListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(50, Math.max(5, pageSize));
  const skip = (safePage - 1) * safePageSize;

  const where: Prisma.UserWhereInput = {};

  if (role && role !== "all" && (role === "student" || role === "admin")) {
    where.role = role;
  }

  const query = search?.trim();
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: safePageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: {
          select: {
            targetUniversity: true,
            targetMajor: true,
            examDate: true,
            wellbeingConsent: true,
          },
        },
        _count: {
          select: {
            tryoutSessions: true,
            checkins: true,
            lessonProgress: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    users,
    totalCount,
    totalPages,
    currentPage: safePage,
  };
}

export async function getUserStats(): Promise<UserStats> {
  const [totalUsers, totalStudents, totalAdmins, totalConsents] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.studentProfile.count({ where: { wellbeingConsent: true } }),
    ]);

  return {
    totalUsers,
    totalStudents,
    totalAdmins,
    totalConsents,
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      studentProfile: {
        select: {
          targetUniversity: true,
          targetMajor: true,
          examDate: true,
          wellbeingConsent: true,
        },
      },
      _count: {
        select: {
          tryoutSessions: true,
          checkins: true,
          lessonProgress: true,
        },
      },
    },
  });
}
