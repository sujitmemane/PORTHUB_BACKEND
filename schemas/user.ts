import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const quickIntroSchema = z.object({
  icon: z.string().nonempty("Icon is required"),
  text: z.string().nonempty("Text is required"),
});

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  aboutMe: z.string().optional(),
  quickIntros: z
    .array(quickIntroSchema)
    .min(1, "At least one quick intro is required")
    .optional(),
});

export type UpdateUser = z.infer<typeof UserUpdateSchema>;
export type User = z.infer<typeof UserSchema>;
