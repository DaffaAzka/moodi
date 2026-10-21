import type { UserRole } from "@/app/generated/prisma/client";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  studentProfile: {
    targetUniversity: string | null;
    targetMajor: string | null;
    examDate: Date | null;
    wellbeingConsent: boolean;
  } | null;
  _count: {
    tryoutSessions: number;
    checkins: number;
    lessonProgress: number;
  };
}

export interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalConsents: number;
}

export interface UserFilterParams {
  role?: UserRole | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ActionState {
  error?: string;
  success?: string;
}
