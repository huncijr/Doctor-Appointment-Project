import express from "express";
import {
  GetDoctors,
  GetDoctorsById,
  GetRegistration,
  GetLogin,
  DeleteUser,
  Protect,
  MakeAnAppointment,
  GetAppointment,
} from "./Controllers.js";

const AppRoutes = express.Router();
AppRoutes.get("/AllDoctor", GetDoctors);
AppRoutes.get("/Doctor", GetDoctorsById);
AppRoutes.post("/Signup", GetRegistration);
AppRoutes.post("/Login", GetLogin);
AppRoutes.delete("/Delete/:id", DeleteUser);
AppRoutes.post("/Appointment", MakeAnAppointment);
AppRoutes.get("/GetAppointment", GetAppointment);
AppRoutes.get("/checkAuth", Protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
export default AppRoutes;
