import { Router } from "express";
import { register, login, refreshToken, logout, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/me", authenticate, getMe);
