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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/Doctorspic", express.static(path.join(process.cwd(), "Doctorspic")));
app.use("/API", AppRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on Port ${PORT}`);
});
