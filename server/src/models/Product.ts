import { Schema, model, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { versionKey: false }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const ProductModel = model("Product", productSchema);
