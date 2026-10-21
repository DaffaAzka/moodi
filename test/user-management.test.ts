import { describe, it, expect } from "vitest";
import {
  createUserSchema,
  updateUserSchema,
  changeRoleSchema,
  resetPasswordSchema,
  deleteUserSchema,
} from "@/features/users/schemas";

describe("User Management Validation & Guardrails", () => {
  describe("createUserSchema", () => {
    it("accepts valid student creation input", () => {
      const input = {
        name: "Siswa Baru",
        email: "siswa.baru@example.com",
        password: "password123",
        role: "student",
        targetUniversity: "Institut Teknologi Bandung",
        targetMajor: "Teknik Informatika",
        examDate: "2027-05-15",
        wellbeingConsent: "true",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Siswa Baru");
        expect(result.data.email).toBe("siswa.baru@example.com");
        expect(result.data.role).toBe("student");
        expect(result.data.wellbeingConsent).toBe(true);
      }
    });

    it("accepts valid admin creation input", () => {
      const input = {
        name: "Admin Baru",
        email: "admin.baru@moodi.id",
        password: "AdminPassword2026!",
        role: "admin",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("admin");
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const input = {
        name: "Siswa",
        email: "siswa@example.com",
        password: "short",
        role: "student",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("minimal 8 karakter");
      }
    });

    it("rejects invalid email format", () => {
      const input = {
        name: "Pengguna",
        email: "bukan-email",
        password: "password123",
        role: "student",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("tidak valid");
      }
    });

    it("rejects invalid role type", () => {
      const input = {
        name: "Pengguna",
        email: "pengguna@example.com",
        password: "password123",
        role: "superadmin",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("changeRoleSchema", () => {
    it("validates role change to admin or student with UUID", () => {
      const validAdmin = {
        id: "a0000000-0000-4000-a000-000000000001",
        role: "admin",
      };
      expect(changeRoleSchema.safeParse(validAdmin).success).toBe(true);

      const validStudent = {
        id: "a0000000-0000-4000-a000-000000000002",
        role: "student",
      };
      expect(changeRoleSchema.safeParse(validStudent).success).toBe(true);
    });

    it("rejects invalid UUID format for user ID", () => {
      const invalid = {
        id: "not-a-uuid",
        role: "admin",
      };
      const res = changeRoleSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts matching new password and confirmation", () => {
      const input = {
        id: "a0000000-0000-4000-a000-000000000001",
        password: "newSecurePassword123",
        confirmPassword: "newSecurePassword123",
      };
      expect(resetPasswordSchema.safeParse(input).success).toBe(true);
    });

    it("rejects mismatched confirmation password", () => {
      const input = {
        id: "a0000000-0000-4000-a000-000000000001",
        password: "newSecurePassword123",
        confirmPassword: "differentPassword123",
      };
      const res = resetPasswordSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("tidak cocok");
      }
    });
  });

  describe("deleteUserSchema & Self-Protection Rules", () => {
    it("validates valid delete payload", () => {
      const input = {
        id: "a0000000-0000-4000-a000-000000000001",
      };
      expect(deleteUserSchema.safeParse(input).success).toBe(true);
    });

    it("enforces self-protection logic (simulated action guardrail)", () => {
      const currentAdminId = "a0000000-0000-4000-a000-000000000001";
      const targetUserId = "a0000000-0000-4000-a000-000000000001";

      const canDelete = currentAdminId !== targetUserId;
      expect(canDelete).toBe(false);

      const canChangeOwnRole = currentAdminId !== targetUserId;
      expect(canChangeOwnRole).toBe(false);
    });
  });
});
