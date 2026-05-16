import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: String,
    quantity: Number,
    price: Number,
    total: Number
  },
  { timestamps: true }
);

export default mongoose.model("OrderItem", orderItemSchema);
