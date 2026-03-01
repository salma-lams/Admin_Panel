import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = "1", limit = "10", search = "", role } = _req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page ?? "1", 10));
    const limitNum = Math.min(100, parseInt(limit ?? "10", 10));

    const filter: Record<string, unknown> = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
    if (role === "admin" || role === "user") filter.role = role;

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    res.json(new ApiResponse("OK", { users, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }));
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await UserModel.findById(req.params.id).lean();
    if (!user) return next(new ApiError(404, "User not found"));
    res.json(new ApiResponse("OK", user));
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role, isActive } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: "admin" | "user";
      isActive?: boolean;
    };

    if (!name || !email || !password) {
      return next(new ApiError(400, "name, email and password are required"));
    }

    const existing = await UserModel.findOne({ email });
    if (existing) return next(new ApiError(409, "Email already taken"));

    const hashed = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ name, email, password: hashed, role: role ?? "user", isActive: isActive ?? true });

    res.status(201).json(new ApiResponse("User created", {
      id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt,
    }));
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, role, isActive, password } = req.body as {
      name?: string;
      email?: string;
      role?: "admin" | "user";
      isActive?: boolean;
      password?: string;
    };

    const update: Record<string, unknown> = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;
    if (password) update.password = await bcrypt.hash(password, 12);

    const user = await UserModel.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
    if (!user) return next(new ApiError(404, "User not found"));

    res.json(new ApiResponse("User updated", user));
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return next(new ApiError(404, "User not found"));
    res.json(new ApiResponse("User deleted"));
  } catch (err) {
    next(err);
  }
}
