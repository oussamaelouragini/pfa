import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import transaction from "./routes/transRoute";
import goalRoutes from "./routes/goalRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import aiRoutes from "./routes/aiRoutes";
import { MulterError } from "./middleware/upload";
dotenv.config();
const app = express();
const PORT = parseInt(process.env.DB_PORT || "5000", 10);
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

connectDB(); // call connectDB

app.use(cookieParser());
const ALLOWED_ORIGINS = [
  "http://localhost:8081",
  "http://localhost:8082",
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:8081$/,
  /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$/,
  /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = ALLOWED_ORIGINS.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin),
      );
      if (allowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Allowing non-whitelisted origin: ${origin}`);
        callback(null, true);
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transaction);
app.use("/goal", goalRoutes);
app.use("/categories", categoryRoutes);
app.use("/ai", aiRoutes);
// Global error handler — runs after all routes to catch multer and other errors
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const logMeta = { method: req.method, url: req.url, origin: req.headers.origin };

  if (err instanceof MulterError) {
    console.error(`[MulterError] code=${err.code} field=${err.field}`, logMeta, err.message);
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ success: false, message: "Image size exceeds 5 MB limit" });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err instanceof Error) {
    console.error(`[UploadError] ${err.message}`, logMeta, err.stack);
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  console.error(`[UnknownError]`, logMeta, err);
  res.status(500).json({ success: false, message: "Server error" });
});

mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});
