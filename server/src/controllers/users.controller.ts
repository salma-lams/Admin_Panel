import type { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { userService } from "../services/UserService";
import { ApiResponse } from "../utils/ApiResponse";

// ─── Typed Query Params ──────────────────────────────────────────────────────

interface ListUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: "admin" | "user";
}

// ─── Safe Integer Parser ─────────────────────────────────────────────────────

function safeInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? "", 10);
  return isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /users
 * List all users with optional pagination, search, and role filter.
 * Admin only.
 */
export async function listUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page, limit, search, role } = req.query as ListUsersQuery;

    const result = await userService.getUsers({
      page: safeInt(page, 1),
      limit: safeInt(limit, 10),
      search: search?.trim(),
      role,
    });

    res.json(new ApiResponse("OK", result));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:id
 * Get a single user by ID.
 */
export async function getUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id as string);
    res.json(new ApiResponse("OK", user));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /users
 * Create a new user (admin action). Body is validated by middleware before reaching here.
 */
export async function createUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(new ApiResponse("User created", user));
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/:id
 * Update a user by ID.
 */
export async function updateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.updateUser(req.params.id as string, req.body);
    res.json(new ApiResponse("User updated", user));
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /users/:id
 * Soft-delete a user by ID.
 */
export async function deleteUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.deleteUser(req.params.id as string);
    res.json(new ApiResponse("User deleted"));
  } catch (err) {
    next(err);
  }
}
