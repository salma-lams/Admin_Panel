import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }
    // Mongoose duplicate key
    if ((err as { code?: number }).code === 11000) {
        res.status(409).json({ success: false, message: "Duplicate value – resource already exists" });
        return;
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
}
