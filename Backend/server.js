import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppRoutes from "./Routes/Allroutes.js";
import path from "path";
import { connectDB } from "./DataBase/MongoDB.js";
dotenv.config();

let PORT = process.env.PORT || 5001;
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/Doctorspic", express.static(path.join(process.cwd(), "Doctorspic")));
app.use("/API", AppRoutes);

if (process.env.MODE_ENV === "production") {
  app.use(express.static(path.join(cwd(), "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`The server is running on Port ${PORT}`);
});
