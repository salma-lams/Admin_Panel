import { productRepository } from "../repositories/ProductRepository";
import { ApiError } from "../utils/ApiError";

export class ProductService {
    async getProducts(options: { page?: number; limit?: number; search?: string }) {
        const filter: any = {};
        if (options.search) {
            filter.$or = [
                { name: { $regex: options.search, $options: "i" } },
            ];
        }
        return productRepository.find(filter, options);
    }

    async getProductByFriendlyId(id: number) {
        const product = await productRepository.findByFriendlyId(id);
        if (!product) throw new ApiError(404, "Product not found");
        return product;
    }

    async createProduct(data: any) {
        return productRepository.create(data);
    }

    async updateProduct(id: string, data: any) {
        const product = await productRepository.update(id, data);
        if (!product) throw new ApiError(404, "Product not found");
        return product;
    }

    async deleteProduct(id: string) {
        const product = await productRepository.delete(id);
        if (!product) throw new ApiError(404, "Product not found");
        return product;
    }
}

export const productService = new ProductService();
