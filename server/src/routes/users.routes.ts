import { Router } from "express";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.use(authorize("admin"));

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", createUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);
