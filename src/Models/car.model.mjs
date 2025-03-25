import { Schema, model, Types } from "mongoose";

const carSchema = new Schema(
  {
    driverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    model: {
      type: String,
      required: [true, "Model car is required!"],
      trim: true,
      minlength: [2, "Model name must be at least 2 characters long!"]
    },
    year: {
      type: Number,
      required: [true, "Year for car is required!"],
      min: [1886, "Year must be after the first car was invented!"],
      max: [new Date().getFullYear(), "Year cannot be in the future!"]
    },
    color: {
      type: String,
      required: [true, "Color for car is required!"],
      trim: true
    },
    numCar: {
      type: String,
      required: [true, "Number of car is required!"],
      unique: true,
      trim: true
    },
    photoCar: [
      {
        type: String,
        required: [true, "Photo of car is required!"],
      }
    ],
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Car = model("Car", carSchema);

export default Car;