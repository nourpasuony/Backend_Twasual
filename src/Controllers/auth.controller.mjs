import User from "../Models/user.model.mjs";
import {
  generateOTP,
  // sendOTP,
  saveOTP,
  verifyOTP,
} from "../services/otp.services.mjs";

import Otp from "../Models/otp.model.mjs";

import {generateToken} from "../services/token.services.mjs";

const register = async (req, res, next) => {
  const { userName, phone, password } = req.body;

  const existingUser = await User.findOne({ phone }).lean();
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const otp = generateOTP();
  await saveOTP(phone, otp);
  // await sendOTP(phone, otp);

  res.status(200).json({
    message: "OTP sent to your phone",
    data: {
      phone,
      password,
      userName,
      otp, //i will remove it
    },
  });
};

const verifyOtpAndRegister = async (req, res, next) => {
  const { userName, phone, otp, password, role } = req.body;

  const isOtpValid = await verifyOTP(phone, otp);
  if (!isOtpValid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = new User({ userName, phone, password, role });
  const itemUser = await user.save();

  await Otp.deleteOne({ phone, otp });
  const token = generateToken({ _id: itemUser._id, role: itemUser.role });

  res.status(201).json({ message: "User registered successfully", token });
};

const login = async (req, res, next) => {
  const { ...credentialData } = req.body;

  // Check if the user exists
  const found = await User.findOne({ phone: credentialData.phone });
  if (!found) {
    return res.status(404).json({ msg: "User not found", success: false });
  }

  // Validate the password
  const validPassword = await found.isPasswordMatch(credentialData.password);
  if (!validPassword) {
    return res.status(401).json({ msg: "Invalid password", success: false });
  }
  // generate Token
  const token = generateToken({ _id: found._id, role: found.role });

  return res.status(200).json({
    data: {
      id: found._id,
      userName: found.userName,
      token,
    },
    success: true,
  });
};

const logout = async (req, res, next) => {
  req.headers["authorization"] = " ";

  res.status(200).json({
    message: "session out",
    success: true,
  });
};

export { register, verifyOtpAndRegister, login, logout };
