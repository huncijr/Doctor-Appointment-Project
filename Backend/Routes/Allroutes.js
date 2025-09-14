import express from "express";
import { GetRegistration, GetLogin } from "./Controllers.js";

const AppRoutes = express.Router();

AppRoutes.post("/Signup", GetRegistration);
AppRoutes.get("/Login", GetLogin);
export default AppRoutes;
