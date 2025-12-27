import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppRoutes from "./Routes/Allroutes.js";
import path from "path";
import { connectDB } from "./DataBase/MongoDB.js";
dotenv.config();

let PORT = process.env.PORT;
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/Doctorspic", express.static(path.join(process.cwd(), "Doctorspic")));
app.use("/API", AppRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`The server is running on Port ${PORT}`);
});
