import type { Product } from "./product.types";

export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Laptop", price: 1200, stock: 10 },
        { id: 2, name: "Phone", price: 800, stock: 25 },
        { id: 3, name: "Keyboard", price: 100, stock: 50 },
        { id: 4, name: "Mouse", price: 50, stock: 70 },
        { id: 5, name: "Monitor", price: 400, stock: 15 },
      ]);
    }, 500);
  });
};
