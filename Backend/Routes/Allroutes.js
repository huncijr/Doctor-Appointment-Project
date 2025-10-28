import express from "express";
import {
  GetRegistration,
  GetLogin,
  DeleteUser,
  Protect,
} from "./Controllers.js";

const AppRoutes = express.Router();

AppRoutes.post("/Signup", GetRegistration);
AppRoutes.post("/Login", GetLogin);
AppRoutes.delete("/Delete/:id", DeleteUser);
AppRoutes.get("/checkAuth", Protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});
export default AppRoutes;
