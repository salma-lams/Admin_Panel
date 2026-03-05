import { Router } from "express";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit.middleware";
import { createUserSchema, updateUserSchema, getUserSchema } from "../validations/user.validation";

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.use(authorize("admin"));

usersRouter.get("/", listUsers);
usersRouter.get("/:id", validate(getUserSchema), getUser);
usersRouter.post("/", validate(createUserSchema), auditLog("create", "user"), createUser);
usersRouter.put("/:id", validate(updateUserSchema), auditLog("update", "user"), updateUser);
usersRouter.delete("/:id", validate(getUserSchema), auditLog("delete", "user"), deleteUser);
