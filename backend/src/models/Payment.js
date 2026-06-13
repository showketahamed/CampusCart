import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: Number,
    method: String,
    status: String,
    transactionId: String
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
