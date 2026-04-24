import { z } from "zod";

export const identifySchema = z.object({
  identifier: z.string().min(3, "Enter email or username"),
});

export const verifySchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type IdentifyFormValues = z.infer<typeof identifySchema>;
export type VerifyFormValues = z.infer<typeof verifySchema>;

export const registerSchema = z
  .object({
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().optional(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;