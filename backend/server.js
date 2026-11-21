import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/venderRoute.js";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const App = express();
const port = process.env.PORT || 5000;

// middlewares (routes se pehle)
App.use(
  cors({
    origin: process.env.VITE_API_URL,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
App.use(express.json());
App.use(cookieParser());
App.use("*", cloudinaryConfig);

// routes
App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin", adminRoute);
App.use("/api/vendor", vendorRoute);

// error handler (sabse last mein)
App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// DB connect hone ke baad hi server start karein
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected Successfully");
    App.listen(port, () => {
      console.log(`server listening at port ${port}!`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });