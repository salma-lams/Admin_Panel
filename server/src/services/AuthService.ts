import bcrypt from "bcryptjs";
import type { FlattenMaps } from "mongoose";
import { userRepository } from "../repositories/UserRepository";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import type { IUser } from "../models/User";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface TokenPayload {
    id: string;
    email: string;
    role: "user" | "admin";
}

interface AuthTokensResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin";
        isActive: boolean;
    };
}

// Covers both lean query results (FlattenMaps) and newly created Documents
type AnyUser = (FlattenMaps<IUser> & { _id: { toString(): string } }) | IUser;

// ─── AuthService ──────────────────────────────────────────────────────────────

export class AuthService {

    /**
     * Register a new user.
     * Role is NOT accepted from client input to prevent privilege escalation.
     */
    async register(data: RegisterData): Promise<AuthTokensResponse> {
        const { name, email, password } = data;

        const existing = await userRepository.findOne({ email });
        if (existing) {
            throw new ApiError(409, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: "user", // Never accept role from client input
        } as Partial<IUser>);

        return this.generateTokens(user);
    }

    /**
     * Login with email and password.
     */
    async login(email: string, password: string): Promise<AuthTokensResponse> {
        const user = await userRepository.findByEmail(email);

        // Check password even if user not found to prevent timing attacks
        const isValid = user?.password
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!user || !isValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is disabled");
        }

        return this.generateTokens(user);
    }

    /**
     * Rotate refresh token using stored hash comparison.
     */
    async refresh(oldRefreshToken: string): Promise<AuthTokensResponse> {
        let payload: TokenPayload;

        try {
            payload = verifyRefreshToken(oldRefreshToken) as TokenPayload;
        } catch {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const user = await userRepository.findByIdWithSecrets(payload.id);
        if (!user || !user.refreshToken) {
            throw new ApiError(401, "Refresh token not found or revoked");
        }

        // Token Rotation: verify against the stored bcrypt hash
        const isValid = await bcrypt.compare(oldRefreshToken, user.refreshToken);
        if (!isValid) {
            // Possible token theft — revoke immediately
            await userRepository.update(user._id.toString(), { refreshToken: undefined });
            throw new ApiError(401, "Refresh token reuse detected - Security Alert");
        }

        return this.generateTokens(user);
    }

    /**
     * Logout by revoking the stored refresh token.
     */
    async logout(userId: string): Promise<void> {
        await userRepository.update(userId, { refreshToken: undefined });
    }

    /**
     * Get the currently authenticated user (safe fields only, no password/token).
     */
    async getMe(userId: string): Promise<AuthTokensResponse["user"]> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        };
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private async generateTokens(user: AnyUser): Promise<AuthTokensResponse> {
        const payload: TokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // Store hashed refresh token for rotation validation
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await userRepository.update(user._id.toString(), { refreshToken: hashedRefreshToken });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        };
    }
}

export const authService = new AuthService();
