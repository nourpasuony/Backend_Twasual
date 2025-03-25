import { Schema, model } from "mongoose";

const otpSchema = Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model("Otp", otpSchema);
export default Otp;