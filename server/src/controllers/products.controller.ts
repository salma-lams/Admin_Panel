import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/ProductService";
import { ApiResponse } from "../utils/ApiResponse";

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, search } = req.query as { page?: string; limit?: string; search?: string };
    const result = await productService.getProducts({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search
    });
    res.json(new ApiResponse("OK", result));
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productService.getProductByFriendlyId(parseInt(id));
    res.json(new ApiResponse("OK", product));
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(new ApiResponse("Product created", product));
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productService.updateProduct(id, req.body);
    res.json(new ApiResponse("Product updated", product));
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await productService.deleteProduct(id);
    res.json(new ApiResponse("Product deleted"));
  } catch (err) {
    next(err);
  }
}
