import { Schema, model, type InferSchemaType, type Document } from "mongoose";

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export type ProductDocument = InferSchemaType<typeof productSchema> & Document;
export const ProductModel = model<ProductDocument>("Product", productSchema);
