import { Router } from "express";
import { auth , authorize } from "../Middleware/auth.middleware.mjs";

import { deleteLegalMsg, getAllLegalMsg, storeLegalMsg, updateLegalMsg } from "../Controllers/legalAndPolices.controller.mjs";

const Route = Router();
// , auth , authorize("admin") 
// , auth , authorize("passenger")
// Admin
Route.post( "/dashboard/legal-polices" , storeLegalMsg);
Route.get("/legal-polices" , getAllLegalMsg);
// Admin
Route.put("/dashboard/legal-polices/:id" , updateLegalMsg);
// Admin
Route.delete('/dashboard/legal-polices/:id' , deleteLegalMsg );

export default Route;
