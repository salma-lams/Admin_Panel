import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authenticate(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "No token provided"));
    }
    const token = authHeader.slice(7);
    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        next(new ApiError(401, "Invalid or expired token"));
    }
}
