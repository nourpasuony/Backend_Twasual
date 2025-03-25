import { Schema, model, Types } from "mongoose";
const tripRateSchema = Schema(
  {
    trip: {
      type: Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    passengerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    passengerComment: String,
    driverComment: String,
  },
  {
    timestamps: true,
  }
);

const TripRate = model("TripRate", tripRateSchema);
export default TripRate;
