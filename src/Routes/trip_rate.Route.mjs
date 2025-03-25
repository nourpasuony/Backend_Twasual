import { Router } from "express";
import { passengerSendTripRate , getAllTripRatesforDriver } from "../Controllers/trip_rate.controller.mjs";
// import { auth, authorize } from "../Middleware/auth.middleware.mjs";

const Route = Router();

Route.post("/passenger/rate", passengerSendTripRate);
Route.get("/driver/rates", getAllTripRatesforDriver);

export default Route;
