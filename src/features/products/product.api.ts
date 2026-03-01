import type { Product } from "./product.types";
import { api } from "../../services/api";

export const getProducts = async (): Promise<Product[]> =>
  api.get<Product[]>("/products");

export const createProduct = async (product: Partial<Product>): Promise<Product> =>
  api.post<Product>("/products", product);

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => api.put<Product>(`/products/${id}`, product);

export const deleteProduct = async (id: number): Promise<void> =>
  api.delete(`/products/${id}`);
