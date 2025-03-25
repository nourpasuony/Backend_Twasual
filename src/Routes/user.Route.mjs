import { Router } from "express";
import {
  storeUserLocation,
  specificUserById,
  driverAvailability,
} from "../Controllers/user.controller.mjs";
// import uploadSingleImage from "../Middleware/uploadFile.mjs";
import { auth, authorize } from "../Middleware/auth.middleware.mjs";

const Route = Router();

Route.put("/driver/location/:userId", storeUserLocation);
// Route.put("/passenger/location/:userId", storeUserLocation);
Route.get("/user/:userId", specificUserById);

Route.put("/driver/avaliable", auth, authorize("driver"), driverAvailability);

// update user info (name or phone or about)
// Route.put("/user", auth , uploadSingleImage("userPhoto"), userModification);

export default Route;
