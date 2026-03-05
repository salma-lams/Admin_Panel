import type { FilterQuery } from "mongoose";
import { userRepository } from "../repositories/UserRepository";
import { ApiError } from "../utils/ApiError";
import { type IUser } from "../models/User";
import bcrypt from "bcryptjs";

// ─── Input Types ──────────────────────────────────────────────────────────────

interface GetUsersOptions {
    page?: number;
    limit?: number;
    search?: string;
    role?: "admin" | "user";
}

interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user";
}

interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
    isActive?: boolean;
}

// ─── UserService ──────────────────────────────────────────────────────────────

export class UserService {

    /**
     * List users with optional filtering, search, and pagination.
     */
    async getUsers(options: GetUsersOptions) {
        const filter: FilterQuery<IUser> = {};

        if (options.search) {
            filter.$or = [
                { name: { $regex: options.search, $options: "i" } },
                { email: { $regex: options.search, $options: "i" } },
            ];
        }

        // Validate role against allowed values before using in DB query
        if (options.role && ["admin", "user"].includes(options.role)) {
            filter.role = options.role;
        }

        return userRepository.find(filter, options);
    }

    /**
     * Get a single user by their MongoDB ID.
     * Password and refreshToken are excluded by default (select: false in schema).
     */
    async getUserById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) throw new ApiError(404, "User not found");
        return user;
    }

    /**
     * Create a new user (admin action).
     * - Role defaults to "user" — never trusts arbitrary input.
     * - Password is always hashed before storing.
     */
    async createUser(data: CreateUserInput) {
        const existing = await userRepository.findOne({ email: data.email });
        if (existing) throw new ApiError(409, "Email already taken");

        const hashed = await bcrypt.hash(data.password, 12);

        return userRepository.create({
            name: data.name,
            email: data.email,
            password: hashed,
            // Only allow valid roles; default to "user"
            role: data.role === "admin" ? "admin" : "user",
        } as Partial<IUser>);
    }

    /**
     * Update an existing user by ID.
     * - If a new password is provided, it is hashed before storing.
     * - Role changes are validated against the allowed enum.
     */
    async updateUser(id: string, data: UpdateUserInput) {
        const update: Partial<IUser> & Record<string, unknown> = {};

        if (data.name !== undefined) update.name = data.name;
        if (data.email !== undefined) update.email = data.email;
        if (data.isActive !== undefined) update.isActive = data.isActive;

        // Hash password only if a new one is being set
        if (data.password) {
            update.password = await bcrypt.hash(data.password, 12);
        }

        // Validate role against enum before applying
        if (data.role && (["admin", "user"] as string[]).includes(data.role)) {
            update.role = data.role;
        }

        const user = await userRepository.update(id, update);
        if (!user) throw new ApiError(404, "User not found");
        return user;
    }

    /**
     * Soft-delete a user by ID.
     */
    async deleteUser(id: string) {
        const user = await userRepository.delete(id);
        if (!user) throw new ApiError(404, "User not found");
        return user;
    }
}

export const userService = new UserService();
