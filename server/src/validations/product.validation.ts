import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        id: z.number().int().positive(),
        name: z.string().min(2),
        price: z.number().min(0),
        stock: z.number().int().min(0),
    }),
});

export const updateProductSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    }),
    body: z.object({
        name: z.string().min(2).optional(),
        price: z.number().min(0).optional(),
        stock: z.number().int().min(0).optional(),
    }),
});

export const getProductSchema = z.object({
    params: z.object({
        id: z.string().min(1), // Accept any string (number or objectid) and let controller handle it
    }),
});
