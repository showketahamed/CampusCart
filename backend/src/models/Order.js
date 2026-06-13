import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    orderNumber: { type: String, required: true, unique: true },
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
    paymentMethod: String,
    paymentStatus: { type: String, enum: ["unpaid", "pending", "paid", "failed"], default: "unpaid" },
    orderStatus: { type: String, default: "pending" },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
