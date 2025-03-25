// import helmet from 'helmet';
import express from "express";
const app = express();

import { config } from "dotenv";
config();

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { createServer } from "http";
const httpServer = createServer(app);

import {initializeSocketServer} from "./src/gateway/index.mjs";
initializeSocketServer(httpServer);

import "./src/Models/db.js";
import bodyParser from "body-parser";
import errorHandler from "./src/Middleware/errorHandler.mjs";

// middlewares
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
// app.use(helmet());

// main route
app.get("/", function (req, res) {
  res.json({
    data: "home",
    status: "200",
  });
});

// routes
import {authRoute,userRoute,driverLicense,helpAndSupport,legalAndPolices,trip, car} from "./src/Routes/index.mjs";
app.use("/api/v1/",authRoute,userRoute,helpAndSupport,legalAndPolices,trip);
app.use("/api/v1/driver",driverLicense , car);

httpServer.listen(process.env.PORT, () => {
  console.log(`server is run in : http://localhost:${process.env.PORT}`);
});
