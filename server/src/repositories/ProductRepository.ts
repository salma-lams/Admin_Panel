import { BaseRepository } from "./BaseRepository";
import { type ProductDocument, ProductModel } from "../models/Product";

export class ProductRepository extends BaseRepository<ProductDocument> {
    constructor() {
        super(ProductModel as any);
    }

    async findByFriendlyId(id: number) {
        return this.model.findOne({ id, isDeleted: { $ne: true } }).lean();
    }
}

export const productRepository = new ProductRepository();
