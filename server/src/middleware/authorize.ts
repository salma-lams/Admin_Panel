import type { Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import type { AuthRequest } from "./authenticate";

export function authorize(...roles: ("admin" | "user")[]) {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new ApiError(401, "Not authenticated"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, "Forbidden – insufficient permissions"));
        }
        next();
    };
}
