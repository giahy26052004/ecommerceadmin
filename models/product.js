import mongoose, { Schema, model, models } from "mongoose";
const ProductSchema = new Schema({
  title: { type: String, require: true },
  description: String,
  price: { type: Number, require: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: Object },
  createdAt: {
    type: Date,
    default: () => moment().tz("Asia/Ho_Chi_Minh").format(),
  },
  updatedAt: {
    type: Date,
    default: () => moment().tz("Asia/Ho_Chi_Minh").format(),
  },
});
export const Product = models.Product || model("Product", ProductSchema);
