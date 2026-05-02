import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    email: String,
    phone: String,
    logo: String,
    status: { type: String, enum: ["pending", "approved", "blocked"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
