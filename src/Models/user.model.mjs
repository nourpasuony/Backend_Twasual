// import { compare, hash } from "bcrypt";
import { Schema, model ,Types} from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { roles } from "../Config/roles.mjs";
const userSchema = Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"], // the message error is not specific (modifay)
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone is required"], // the message error is not specific (modifay)
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "ar-EG");
        },
        message: (props) => `${props.value} is not a valid phone!`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 9,
    },
    photo: {
      type: String,
    },
    dateOfBirth: Date,
    token: String,
    role: {
      type: String,
      enum: roles,
      default: "passenger",
    },
    status: {
      type: String,
      enum: ["available", "onRide", "offline"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        // default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    cars: { type: Types.ObjectId, ref: "Car" },
    license: { type: Types.ObjectId, ref: "Licence" },
    socketId: { String },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;

  // && !user.facebookId && !user.googleId && !user.appleId

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.index({ location: "2dsphere" });

const User = model("User", userSchema);

export default User;
