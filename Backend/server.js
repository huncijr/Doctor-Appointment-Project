import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AppRoutes from "./Routes/Allroutes.js";
import { connectDB } from "./DataBase/MongoDB.js";
dotenv.config();

let PORT = process.env.PORT || 5001;
const app = express();
connectDB();

if (process.env.MODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json());
app.use("/API", AppRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on Port ${PORT}`);
});
