import express from "express";
import {
  Protect,
  GetDoctors,
  GetDoctorsById,
  GetRegistration,
  GetLogin,
  verifyDoctorCode,
  DeleteUser,
  SignOutUser,
  rateLimiterMiddleware,
  MakeAnAppointment,
  GetAppointment,
  GetDoctorAppointments,
  DeleteAppointment,
  GetTimes,
  doctorOnly,
  GetforDoctorsAppointment,
} from "./Controllers.js";

const AppRoutes = express.Router();
AppRoutes.get("/AllDoctor", GetDoctors);
AppRoutes.get("/Doctor", GetDoctorsById);
AppRoutes.post("/Signup", GetRegistration);
AppRoutes.post("/Login", GetLogin);
AppRoutes.post("/Doctor-verify", verifyDoctorCode);
AppRoutes.delete("/Delete/:id", DeleteUser);
AppRoutes.post("/SignOut", SignOutUser);
AppRoutes.post("/Appointment", rateLimiterMiddleware, MakeAnAppointment);
AppRoutes.get("/GetAppointment", GetAppointment);
AppRoutes.get("/GetAllappointment", GetDoctorAppointments);
AppRoutes.delete("/DeleteAppointment", DeleteAppointment);
AppRoutes.get("/GetTimes", GetTimes);

AppRoutes.get(
  "/Doctor/Appointments",
  Protect,
  doctorOnly,
  GetforDoctorsAppointment
);
// AppRoutes.post("/doctor/register", createDoctor);

AppRoutes.get("/checkAuth", Protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
export default AppRoutes;
