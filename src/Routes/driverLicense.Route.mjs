import { Router } from "express";
import {
  createLicense,
  updateLicense,
  deleteLicense,
  specificLinceseById,
  AllPendingDriverLicenses,
  approveLicense,
  rejectLicense
} from "../Controllers/license.controller.mjs";
import { upload, getUploadedPath } from "../Middleware/multer.mjs";
import { auth, authorize } from "../Middleware/auth.middleware.mjs";

const Route = Router();

Route.post( "/upload/license", auth, authorize("driver"), upload.array("images", 4), getUploadedPath, createLicense );
Route.patch("/update/license/:LicenseId",auth, authorize("driver"),upload.array("images", 4), getUploadedPath, updateLicense);
Route.delete("/delete/lincese/:LicenseId",auth, authorize("driver"), deleteLicense);

Route.get("/get/license", auth, authorize("driver"), specificLinceseById);
Route.get("/get/linceses/pending",auth, AllPendingDriverLicenses);
Route.patch("/approve/lincese/:LicenseId",auth, approveLicense);
Route.patch("/reject/lincese/:LicenseId",auth, rejectLicense);

export default Route;
