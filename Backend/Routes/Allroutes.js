import express from "express";
import {
  GetDoctors,
  GetDoctorsById,
  GetRegistration,
  GetLogin,
  DeleteUser,
  SignOutUser,
  Protect,
  MakeAnAppointment,
  GetAppointment,
  GetDoctorAppointments,
  DeleteAppointment,
} from "./Controllers.js";

const AppRoutes = express.Router();
AppRoutes.get("/AllDoctor", GetDoctors);
AppRoutes.get("/Doctor", GetDoctorsById);
AppRoutes.post("/Signup", GetRegistration);
AppRoutes.post("/Login", GetLogin);
AppRoutes.delete("/Delete/:id", DeleteUser);
AppRoutes.post("/SignOut", SignOutUser);
AppRoutes.post("/Appointment", MakeAnAppointment);
AppRoutes.get("/GetAppointment", GetAppointment);
AppRoutes.get("/GetAllappointment", GetDoctorAppointments);
AppRoutes.delete("/DeleteAppointment", DeleteAppointment);
AppRoutes.get("/checkAuth", Protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
export default AppRoutes;
