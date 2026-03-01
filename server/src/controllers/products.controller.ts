import type { Request, Response } from "express";
import { ProductModel } from "../models/Product";
import { parseNumericId } from "../utils/ids";

function normalizeParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  throw new Error("Missing id param");
}

async function getNextProductId(): Promise<number> {
  const last = await ProductModel.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return (last?.id ?? 0) + 1;
}

export async function listProducts(_req: Request, res: Response): Promise<void> {
  const products = await ProductModel.find().sort({ id: 1 }).lean();
  res.json(products);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const payload = req.body as Partial<{
    id: number;
    name: string;
    price: number;
    stock: number;
  }>;

  if (!payload.name) {
    res.status(400).json({ message: "name is required" });
    return;
  }

  const id = Number.isInteger(payload.id) && payload.id! > 0 ? payload.id! : await getNextProductId();
  const product = await ProductModel.create({
    id,
    name: payload.name,
    price: payload.price ?? 0,
    stock: payload.stock ?? 0,
  });

  res.status(201).json(product.toObject());
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  let id: number;
  try {
    id = parseNumericId(normalizeParam(req.params.id));
  } catch {
    res.status(400).json({ message: "Invalid product id" });
    return;
  }

  const payload = req.body as Partial<{
    name: string;
    price: number;
    stock: number;
  }>;

  const product = await ProductModel.findOneAndUpdate(
    { id },
    {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.price !== undefined ? { price: payload.price } : {}),
      ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  let id: number;
  try {
    id = parseNumericId(normalizeParam(req.params.id));
  } catch {
    res.status(400).json({ message: "Invalid product id" });
    return;
  }

  const deleted = await ProductModel.findOneAndDelete({ id }).lean();
  if (!deleted) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(204).send();
}
