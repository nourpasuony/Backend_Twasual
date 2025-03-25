import { Schema, model, Types } from "mongoose";

const licenceSchema = new Schema({
  driverId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  licenseImages: [{
    type: String,
    required: true,
  }],
  issuedDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String
  },
  verifiedBy: {
    type: Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update timestamps
licenceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Licence = model("Licence", licenceSchema);

export default Licence;
