import { Router } from "express";
const Route = Router();

import {asyncMiddleware} from "../Middleware/asyncMiddleware.mjs";
import { login, logout, register,verifyOtpAndRegister} from "../Controllers/auth.controller.mjs";

// passenger
Route.post("/register" ,asyncMiddleware(register));
Route.post("/verify-otp" ,asyncMiddleware(verifyOtpAndRegister));
Route.post("/login",asyncMiddleware(login));
Route.post("/logout" ,asyncMiddleware(logout));

// driver
Route.post("/driver/register" ,asyncMiddleware(register));
Route.post("/driver/verify-otp" ,asyncMiddleware(verifyOtpAndRegister));
Route.post("/driver/login",asyncMiddleware(login));
Route.post("/driver/logout" ,asyncMiddleware(logout));



export default Route;
