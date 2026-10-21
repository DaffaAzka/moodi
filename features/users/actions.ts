"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getAuthSession } from "@/lib/auth-session";
import { getUserRole } from "@/lib/user-role";
import {
  createUserSchema,
  updateUserSchema,
  changeRoleSchema,
  resetPasswordSchema,
  deleteUserSchema,
} from "./schemas";
import type { ActionState } from "./types";

async function requireAdminSession() {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
  }
  const role = getUserRole(session.user.role);
  if (role !== "admin") {
    throw new Error("Akses ditolak. Tindakan ini hanya dapat dilakukan oleh Admin.");
  }
  return session;
}

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession();

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      targetUniversity: formData.get("targetUniversity") || null,
      targetMajor: formData.get("targetMajor") || null,
      examDate: formData.get("examDate") || null,
      wellbeingConsent: formData.get("wellbeingConsent"),
    };

    const parsed = createUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Data pengguna baru tidak valid.",
      };
    }

    const {
      name,
      email,
      password,
      role,
      targetUniversity,
      targetMajor,
      examDate,
      wellbeingConsent,
    } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: `Alamat email "${email}" sudah digunakan oleh akun lain.` };
    }

    // Create user via Better Auth Server API
    try {
      await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });
    } catch (authErr: any) {
      console.error("Better Auth signUpEmail error:", authErr);
      return {
        error:
          authErr?.message ||
          "Gagal mendaftarkan akun ke sistem autentikasi. Coba lagi.",
      };
    }

    const createdUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!createdUser) {
      return { error: "Gagal memverifikasi akun pengguna yang baru dibuat." };
    }

    // If role is admin, promote role
    if (role === "admin") {
      await prisma.user.update({
        where: { id: createdUser.id },
        data: { role: "admin" },
      });
    } else {
      // Create student profile
      await prisma.studentProfile.upsert({
        where: { userId: createdUser.id },
        create: {
          userId: createdUser.id,
          targetUniversity: targetUniversity || null,
          targetMajor: targetMajor || null,
          examDate: examDate ? new Date(examDate) : null,
          wellbeingConsent: wellbeingConsent ?? false,
          consentedAt: wellbeingConsent ? new Date() : null,
        },
        update: {
          targetUniversity: targetUniversity || null,
          targetMajor: targetMajor || null,
          examDate: examDate ? new Date(examDate) : null,
          wellbeingConsent: wellbeingConsent ?? false,
          consentedAt: wellbeingConsent ? new Date() : null,
        },
      });
    }

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard");
    return { success: `Pengguna "${name}" berhasil ditambahkan.` };
  } catch (err: any) {
    console.error("createUserAction error:", err);
    return { error: err?.message || "Terjadi kesalahan saat menambahkan pengguna." };
  }
}

export async function updateUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession();

    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      email: formData.get("email"),
      emailVerified: formData.get("emailVerified"),
      targetUniversity: formData.get("targetUniversity") || null,
      targetMajor: formData.get("targetMajor") || null,
      examDate: formData.get("examDate") || null,
      wellbeingConsent: formData.get("wellbeingConsent"),
    };

    const parsed = updateUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Data pengguna tidak valid.",
      };
    }

    const {
      id,
      name,
      email,
      emailVerified,
      targetUniversity,
      targetMajor,
      examDate,
      wellbeingConsent,
    } = parsed.data;

    // Check email conflict
    const emailConflict = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
      select: { id: true },
    });

    if (emailConflict) {
      return { error: `Alamat email "${email}" sudah digunakan oleh akun lain.` };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!existingUser) {
      return { error: "Pengguna tidak ditemukan." };
    }

    // Update user basic profile
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        emailVerified: emailVerified ?? false,
      },
    });

    // If student, update or create StudentProfile
    if (existingUser.role === "student") {
      await prisma.studentProfile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          targetUniversity: targetUniversity || null,
          targetMajor: targetMajor || null,
          examDate: examDate ? new Date(examDate) : null,
          wellbeingConsent: wellbeingConsent ?? false,
          consentedAt: wellbeingConsent ? new Date() : null,
        },
        update: {
          targetUniversity: targetUniversity || null,
          targetMajor: targetMajor || null,
          examDate: examDate ? new Date(examDate) : null,
          wellbeingConsent: wellbeingConsent ?? false,
          consentedAt: wellbeingConsent ? new Date() : null,
        },
      });
    }

    revalidatePath("/dashboard/users");
    return { success: `Data pengguna "${name}" berhasil diperbarui.` };
  } catch (err: any) {
    console.error("updateUserAction error:", err);
    return { error: err?.message || "Terjadi kesalahan saat memperbarui pengguna." };
  }
}

export async function changeUserRoleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminSession();

    const rawData = {
      id: formData.get("id"),
      role: formData.get("role"),
    };

    const parsed = changeRoleSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Data perubahan peran tidak valid.",
      };
    }

    const { id, role } = parsed.data;

    // Self-demotion guardrail
    if (session.user.id === id) {
      return { error: "Kamu tidak dapat mengubah peran akunmu sendiri." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, role: true },
    });

    if (!targetUser) {
      return { error: "Pengguna tidak ditemukan." };
    }

    if (targetUser.role === role) {
      return { success: "Peran pengguna sudah sesuai." };
    }

    await prisma.user.update({
      where: { id },
      data: { role },
    });

    // If role changed to student, ensure a profile exists
    if (role === "student") {
      await prisma.studentProfile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          wellbeingConsent: false,
        },
        update: {},
      });
    }

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard");
    return {
      success: `Peran untuk "${targetUser.name}" berhasil diubah menjadi ${
        role === "admin" ? "Admin" : "Siswa"
      }.`,
    };
  } catch (err: any) {
    console.error("changeUserRoleAction error:", err);
    return { error: err?.message || "Terjadi kesalahan saat mengubah peran pengguna." };
  }
}

export async function resetUserPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession();

    const rawData = {
      id: formData.get("id"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const parsed = resetPasswordSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Kata sandi baru tidak valid.",
      };
    }

    const { id, password } = parsed.data;

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return { error: "Pengguna tidak ditemukan." };
    }

    // Hash new password using Better Auth crypto
    const passwordHash = await hashPassword(password);

    // Update credential account
    const existingCredentialAccount = await prisma.account.findFirst({
      where: { userId: id, providerId: "credential" },
    });

    if (existingCredentialAccount) {
      await prisma.account.update({
        where: { id: existingCredentialAccount.id },
        data: { password: passwordHash },
      });
    } else {
      await prisma.account.create({
        data: {
          userId: id,
          providerId: "credential",
          accountId: id,
          password: passwordHash,
        },
      });
    }

    // Invalidate active sessions of this user so they must re-login with the new password
    await prisma.session.deleteMany({
      where: { userId: id },
    });

    revalidatePath("/dashboard/users");
    return {
      success: `Kata sandi untuk "${targetUser.name}" berhasil direset. Semua sesi aktif pengguna telah dihentikan.`,
    };
  } catch (err: any) {
    console.error("resetUserPasswordAction error:", err);
    return { error: err?.message || "Terjadi kesalahan saat mereset kata sandi pengguna." };
  }
}

export async function deleteUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminSession();

    const rawData = {
      id: formData.get("id"),
    };

    const parsed = deleteUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "ID pengguna tidak valid.",
      };
    }

    const { id } = parsed.data;

    // Self-deletion guardrail
    if (session.user.id === id) {
      return { error: "Kamu tidak dapat menghapus akunmu sendiri." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      return { error: "Pengguna tidak ditemukan atau sudah terhapus." };
    }

    // Cascade delete user
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard");
    return { success: `Pengguna "${targetUser.name}" (${targetUser.email}) berhasil dihapus.` };
  } catch (err: any) {
    console.error("deleteUserAction error:", err);
    return { error: err?.message || "Terjadi kesalahan saat menghapus pengguna." };
  }
}
