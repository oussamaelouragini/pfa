import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transaction from "./routes/transRoute";
import goalRoutes from "./routes/goalRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import aiRoutes from "./routes/aiRoutes";
dotenv.config();
const app = express();
const PORT = parseInt(process.env.DB_PORT || "5000", 10);
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

connectDB(); // call connectDB

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.1.192:8081", "http://172.20.10.3:8081"],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.use("/auth", authRoutes);
app.use("/transactions", transaction);
app.use("/goal", goalRoutes);
app.use("/categories", categoryRoutes);
app.use("/ai", aiRoutes);
mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});
