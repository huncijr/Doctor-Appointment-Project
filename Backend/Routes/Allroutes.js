import express from "express";
import {
  Protect,
  VerifyTurnstile,
  GetDoctors,
  GetDoctorsById,
  GetADoctor,
  GetRegistration,
  GetLogin,
  verifyDoctorCode,
  DeleteUser,
  SignOutUser,
  rateLimiterMiddleware,
  MakeAnAppointment,
  GetAppointment,
  UpdatedAppointment,
  ReviewAppointments,
  GetDoctorAppointments,
  DeleteAppointment,
  GetTimes,
  doctorOnly,
  GetforDoctorsAppointment,
  GetPageAppointments,
  AppointmentsCompleted,
} from "./Controllers.js";

const AppRoutes = express.Router();
AppRoutes.get("/AllDoctor", GetDoctors);
AppRoutes.get("/Doctor", GetDoctorsById);
AppRoutes.get("/ADoctor", GetADoctor);
AppRoutes.post("/Signup", VerifyTurnstile, GetRegistration);
AppRoutes.post("/Login", VerifyTurnstile, GetLogin);
AppRoutes.post("/Doctor-verify", verifyDoctorCode);
AppRoutes.delete("/Delete/:id", DeleteUser);
AppRoutes.post("/SignOut", SignOutUser);
AppRoutes.post(
  "/Appointment",
  Protect,
  (req, res, next) => {
    if (req.body.reason !== "Reserved") {
      return doctorOnly(req, res, next);
    }
    next();
  },
  MakeAnAppointment
);
AppRoutes.get("/GetAppointment", GetAppointment);
AppRoutes.put("/UpdatedAppointment", UpdatedAppointment);
AppRoutes.put(
  "/ReviewUpdateAppointments",
  rateLimiterMiddleware,
  ReviewAppointments
);
AppRoutes.get("/GetAllappointment", GetDoctorAppointments);
AppRoutes.delete("/DeleteAppointment", DeleteAppointment);
AppRoutes.get("/GetTimes", GetTimes);
AppRoutes.put("/AddCompleted", AppointmentsCompleted);

AppRoutes.get(
  "/Doctor/Appointments",
  Protect,
  doctorOnly,
  GetforDoctorsAppointment
);
AppRoutes.get(
  "/Doctor/GetPageAppointments",
  Protect,
  doctorOnly,
  GetPageAppointments
);

AppRoutes.get("/checkAuth", Protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
export default AppRoutes;
