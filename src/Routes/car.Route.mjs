import { Router } from "express";
import {
  createCar,
  updateCar,
  deleteCar,
//   getAllCars,
//   getCarById,
} from "../Controllers/car.controller.mjs";
import { auth, authorize } from "../Middleware/auth.middleware.mjs";
import { upload, getUploadedPath } from "../Middleware/multer.mjs";

const Route = Router();

Route.post(
  "/upload/car",
  auth,
  authorize("driver"),
  upload.array("images", 4),
  getUploadedPath,
  createCar
);
Route.patch(
  "/update/car/:carId",
  auth,
  authorize("driver"),
  upload.array("images", 4),
  getUploadedPath,
  updateCar
);
Route.delete("/delete/car/:carId", auth, authorize("driver"), deleteCar);
// Route.get("/get/cars", getAllCars);
// Route.get("/get/car/:id", getCarById);

export default Route;
