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
    // Check both Authorization header and cookies for the access token
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
    } else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return next(new ApiError(401, "No token provided"));
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        next(new ApiError(401, "Invalid or expired token"));
    }
}
