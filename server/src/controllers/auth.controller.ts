import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import type { AuthRequest } from "../middleware/authenticate";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, email, password, role } = req.body as {
            name: string;
            email: string;
            password: string;
            role?: "admin" | "user";
        };

        if (!name || !email || !password) {
            return next(new ApiError(400, "name, email and password are required"));
        }

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return next(new ApiError(409, "Email already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: role ?? "user",
        });

        const payload = { id: user._id.toString(), email: user.email, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // persist refresh token
        user.refreshToken = await bcrypt.hash(refreshToken, 8);
        await user.save();

        res.status(201).json(
            new ApiResponse("Registration successful", {
                accessToken,
                refreshToken,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            })
        );
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body as { email: string; password: string };

        if (!email || !password) {
            return next(new ApiError(400, "email and password are required"));
        }

        const user = await UserModel.findOne({ email }).select("+password +refreshToken");
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new ApiError(401, "Invalid credentials"));
        }

        if (!user.isActive) {
            return next(new ApiError(403, "Account is disabled"));
        }

        const payload = { id: user._id.toString(), email: user.email, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        user.refreshToken = await bcrypt.hash(refreshToken, 8);
        await user.save();

        res.json(
            new ApiResponse("Login successful", {
                accessToken,
                refreshToken,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
            })
        );
    } catch (err) {
        next(err);
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.body.refreshToken as string | undefined;
        if (!token) {
            return next(new ApiError(400, "Refresh token required"));
        }

        let payload;
        try {
            payload = verifyRefreshToken(token);
        } catch {
            return next(new ApiError(401, "Invalid or expired refresh token"));
        }

        const user = await UserModel.findById(payload.id).select("+refreshToken");
        if (!user || !user.refreshToken) {
            return next(new ApiError(401, "Refresh token not found"));
        }

        const accessToken = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
        const newRefreshToken = signRefreshToken({ id: user._id.toString(), email: user.email, role: user.role });

        user.refreshToken = await bcrypt.hash(newRefreshToken, 8);
        await user.save();

        res.json(new ApiResponse("Token refreshed", { accessToken, refreshToken: newRefreshToken }));
    } catch (err) {
        next(err);
    }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (req.user) {
            await UserModel.findByIdAndUpdate(req.user.id, { refreshToken: undefined });
        }
        res.json(new ApiResponse("Logged out successfully"));
    } catch (err) {
        next(err);
    }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await UserModel.findById(req.user?.id);
        if (!user) return next(new ApiError(404, "User not found"));
        res.json(new ApiResponse("OK", { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt }));
    } catch (err) {
        next(err);
    }
}
