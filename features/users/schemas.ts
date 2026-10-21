import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .email("Format alamat email tidak valid.")
    .max(255, "Email maksimal 255 karakter."),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter.")
    .max(100, "Kata sandi maksimal 100 karakter."),
  role: z.enum(["student", "admin"], {
    message: "Peran harus berupa Siswa atau Admin.",
  }),
  targetUniversity: z.string().trim().max(150).optional().nullable(),
  targetMajor: z.string().trim().max(150).optional().nullable(),
  examDate: z.string().optional().nullable(),
  wellbeingConsent: z
    .preprocess((val) => val === "true" || val === true || val === "on", z.boolean())
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .email("Format alamat email tidak valid.")
    .max(255, "Email maksimal 255 karakter."),
  emailVerified: z
    .preprocess((val) => val === "true" || val === true || val === "on", z.boolean())
    .optional(),
  targetUniversity: z.string().trim().max(150).optional().nullable(),
  targetMajor: z.string().trim().max(150).optional().nullable(),
  examDate: z.string().optional().nullable(),
  wellbeingConsent: z
    .preprocess((val) => val === "true" || val === true || val === "on", z.boolean())
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const changeRoleSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
  role: z.enum(["student", "admin"], {
    message: "Peran harus berupa Siswa atau Admin.",
  }),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;

export const resetPasswordSchema = z
  .object({
    id: z.string().uuid("ID pengguna tidak valid."),
    password: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter.")
      .max(100, "Kata sandi maksimal 100 karakter."),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi kata sandi minimal 8 karakter."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const deleteUserSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
