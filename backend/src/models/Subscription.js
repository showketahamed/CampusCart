import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    quantity: { type: Number, default: 1 },
    nextOrderDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "paused", "cancelled"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
