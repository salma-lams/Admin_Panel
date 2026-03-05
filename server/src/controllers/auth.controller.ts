import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/AuthService";
import { ApiResponse } from "../utils/ApiResponse";
import { setAuthCookies, clearAuthCookies } from "../utils/cookie";
import type { AuthRequest } from "../middleware/authenticate";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await authService.register(req.body);
        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(201).json(
            new ApiResponse("Registration successful", {
                user: result.user,
            })
        );
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.json(
            new ApiResponse("Login successful", {
                user: result.user,
            })
        );
    } catch (err) {
        next(err);
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Preference for cookie-based refresh
        const token = req.cookies.refreshToken || req.body.refreshToken;

        const result = await authService.refresh(token);
        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.json(new ApiResponse("Token refreshed", { user: result.user }));
    } catch (err) {
        // On refresh error, clear cookies as the session is compromised/invalid
        clearAuthCookies(res);
        next(err);
    }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (req.user) {
            await authService.logout(req.user.id);
        }
        clearAuthCookies(res);
        res.json(new ApiResponse("Logged out successfully"));
    } catch (err) {
        next(err);
    }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await authService.getMe(req.user?.id!);
        res.json(new ApiResponse("OK", user));
    } catch (err) {
        next(err);
    }
}
