// import { Schema, model, Types } from "mongoose";

// const tripSchema = Schema(
//   {
//     passenger: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     driver: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     startLocation: {
//       type: {
//         type: String,
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     endLocation: {
//       type: {
//         type: String,
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     status: {
//       type: String,
//       enum: ["pending", "active", "completed", "canceled"],
//       default: "pending",
//     },
//     startedAt: Date,
//     completedAt: Date,
//     fare: Number,
//     distance: Number,
//   },
//   {
//     timestamps: true,
//   }
// );

// tripSchema.index({ startLocation: "2dsphere" });
// tripSchema.index({ endLocation: "2dsphere" });

// const Trip = model("Trip", tripSchema);
// export default Trip;
// ________________________________________________

import { Schema, model, Types } from "mongoose";

const tripSchema = Schema(
  {
    passenger: {
      type: Types.ObjectId,
      ref: "User",
      // required: true,
    },
    driver: {
      type: Types.ObjectId,
      ref: "User",
      // required: true,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    endLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted","in_progress", "completed", "canceled"],
      default: "pending",
    },
    tripRoom:String,
    startedAt: Date,  
    completedAt: Date,
    fare: Number,
    distance: Number,
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ startLocation: "2dsphere" });
tripSchema.index({ endLocation: "2dsphere" });

const Trip = model("Trip", tripSchema);
export default Trip;