import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["admin", "user"]).optional(),
        isActive: z.boolean().optional(),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    }),
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
        role: z.enum(["admin", "user"]).optional(),
        isActive: z.boolean().optional(),
    }),
});

export const getUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    }),
});
