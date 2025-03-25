import { Router } from "express";
import { auth , authorize } from "../Middleware/auth.middleware.mjs";

import { getAllHelpAndSupportMsg , updateHelpAndSupportMsg , storeHelpAndSupportMsg , deleteHelpAndSupportMsg } from "../Controllers/helpAndSupport.controller.mjs";

const Route = Router();

// Admin: Add new question and answer
// , auth , authorize("admin") 
// , auth , authorize("passenger")
Route.post( "/dashboard/help-support" , storeHelpAndSupportMsg);
Route.get("/help-support"  , getAllHelpAndSupportMsg);
// Admin: Update question and answer
Route.put("/dashboard/help-support/:id" , updateHelpAndSupportMsg);
// Admin route to delete a help item
Route.delete('/dashboard/help-support/:id' , deleteHelpAndSupportMsg );

export default Route;
