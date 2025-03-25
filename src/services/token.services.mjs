import jwt from "jsonwebtoken";
import { tokenKeys } from "../Config/token.mjs";

export const generateToken = (payload) => {
  const options = {
    expiresIn: "168h", // Token expiration time
  };

  const token = jwt.sign(payload, tokenKeys.secretKey, options);
  return token;
};

export const verifyToken = async (token) => {
  return jwt.verify(token, tokenKeys.secretKey);
};
