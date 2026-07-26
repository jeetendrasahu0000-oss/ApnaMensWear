import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL Index
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Otp", otpSchema);