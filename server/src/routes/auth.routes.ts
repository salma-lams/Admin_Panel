import { Router } from "express";
import { register, login, refreshToken, logout, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validations/auth.validation";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshTokenSchema), refreshToken);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/me", authenticate, getMe);
