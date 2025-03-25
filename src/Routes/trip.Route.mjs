import { Router } from "express";

import { createTrip } from "../Controllers/trip.controller.mjs";
import { auth, authorize } from "../Middleware/auth.middleware.mjs";

const Route = Router();

Route.post("/passenger/trip-Request", auth, authorize("passenger"), createTrip);
// Route.post("/trip/rate", rateATrip);

export default Route;
