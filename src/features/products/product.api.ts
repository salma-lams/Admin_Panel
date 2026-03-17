import type { Product } from "./product.types";
import { api } from "../../services/api";

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get<any>("/products");
  return res.data?.data || [];
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const res = await api.post<any>("/products", product);
  return res.data;
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  const res = await api.put<any>(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
