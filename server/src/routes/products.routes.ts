import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  getProduct,
} from "../controllers/products.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit.middleware";
import { createProductSchema, updateProductSchema, getProductSchema } from "../validations/product.validation";

export const productsRouter = Router();

productsRouter.use(authenticate);

productsRouter.get("/", listProducts);
productsRouter.get("/:id", validate(getProductSchema), getProduct);
productsRouter.post("/", authorize("admin"), validate(createProductSchema), auditLog("create", "product"), createProduct);
productsRouter.put("/:id", authorize("admin"), validate(updateProductSchema), auditLog("update", "product"), updateProduct);
productsRouter.delete("/:id", authorize("admin"), validate(getProductSchema), auditLog("delete", "product"), deleteProduct);
