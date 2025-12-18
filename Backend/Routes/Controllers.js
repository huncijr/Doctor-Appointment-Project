import express from "express";
import { generateToken } from "../utils/GenerateToken.js";
import bcrypt from "bcryptjs";
import { Appointment, User, Doctor } from "../DataBase/Schemas.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redis from "../DataBase/Redis.js";
import rateLimit from "../DataBase/Upstash.js";

export const Protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);
  if (!token)
    return res.status(401).json({ loggedIn: false, message: "Unathorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    req.user = await User.findById(decoded.userId).select("-password");
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const GetDoctors = async (req, res) => {
  try {
    const cacheKey = "alldoctors";
    const cached = await redis.get(cacheKey);
    //console.log(cached);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const doctors = await Doctor.find();
    await redis.set(cacheKey, JSON.stringify(doctors), "EX", 60);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "error", error });
    console.log(error);
  }
};
export const GetDoctorsById = async (req, res) => {
  try {
    const { occupation } = req.query;
    const doctors = await Doctor.find({ occupation: occupation });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
};
export const GetADoctor = async (req, res) => {
  try {
    const { doctorid } = req.query;
    const finddoctor = await Doctor.findOne({ _id: doctorid });
    if (!finddoctor) {
      return res.status(404).json({ message: "Doctor was not found" });
    }
    res.status(200).json(finddoctor);
  } catch (error) {
    console.error(error);
  }
};

export const GetRegistration = async (req, res) => {
  try {
    const { fullname, age, username, password, gender, registered, role } =
      req.body;
    const UserExists = await User.findOne({ username });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      fullname,
      password,
      gender,
      age,
      registered,
      role,
    });
    const token = generateToken(user);
    console.log(token);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      age: user.age,
      fullname: user.fullname,
      gender: user.gender,
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid fullname or password" });
    }
    if (user.role === "doctor") {
      return res
        .status(200)
        .json({ requiresDoctorCode: true, userId: user._id });
    }
    const token = generateToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      age: user.age,
      fullname: user.fullname,
      gender: user.gender,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const verifyDoctorCode = async (req, res) => {
  const { userid, doctorCode } = req.body;
  try {
    const user = await User.findById(userid);
    if (!user || user.role !== "doctor")
      return res.status(401).json({ message: "Unathorized" });
    const isMatch = await bcrypt.compare(doctorCode, user.doctorCode);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = generateToken(user);
    console.log(token);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      age: user.age,
      fullname: user.fullname,
      gender: user.gender,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(userId);
    await Appointment.deleteMany({ userid: user._id });
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Account has been deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

export const SignOutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out succesfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error " });
  }
};
export const rateLimiterMiddleware = async (req, res, next) => {
  const id = req.body;
  try {
    const result = await rateLimit.limit(id);
    if (!result.success) {
      return res.status(429).json({
        message: "Too many requests!",
      });
    }
    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next();
  }
};

export const MakeAnAppointment = async (req, res) => {
  try {
    const {
      fullname,
      username,
      id,
      age,
      doctorid,
      doctorname,
      date,
      time,
      message,
      reason,
      completed,
      disabled,
    } = req.body;
    let user = await User.findOne({ username });
    let userappointments = await Appointment.countDocuments({ userid: id });
    if (userappointments > 5) {
      return res
        .status(409)
        .json({ message: "You cannot create more than 5 appointments" });
    }
    if (!user) return res.status(404).json({ Message: "User was not found" });
    const selecteddoctor = await Doctor.findById(doctorid);
    if (!selecteddoctor)
      return res.status(4040).json({ Message: "Doctor was not found!" });
    const appointment = await Appointment.create({
      userid: id,
      doctorid,
      doctorname,
      fullname,
      age,
      date,
      time,
      message,
      reason,
      completed,
      disabled,
    });
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const GetAppointment = async (req, res) => {
  try {
    const { userid } = req.query;
    // console.log(userid);
    // const cacheKey = `Appointmentids:${userid}`;
    // console.log(cacheKey);
    // const cached = await redis.get(cacheKey);
    // console.log(cached);
    // if (cached) {
    //   return res.json(JSON.parse(cached));
    // }
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User was NOT found" });
    }
    const appointments = await Appointment.find({
      userid,
    });

    //console.log(appointments);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "Appointment was NOT found" });
    }
    // await redis.set(cacheKey, JSON.stringify(appointments), "EX", 120);
    return res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const UpdatedAppointment = async (req, res) => {
  let { appointmentid } = req.body;
  try {
    const findappointment = await Appointment.find({ _id: appointmentid });
    if (!findappointment) {
      return res.status(404).json({ message: "appointment was not found" });
    }
    console.log(findappointment._id);
    const updateappointment = findappointment
      ? await Appointment.findByIdAndUpdate(
          findappointment[0]._id,
          { $set: { disabled: true } },
          { new: true }
        )
      : null;

    console.log(updateappointment);
    return res.status(200).json(updateappointment);
  } catch (error) {
    console.error(error);
  }
};
export const ReviewAppointments = async (req, res) => {
  let { appointmentid, message, rating } = req.body;
  const findappointment = await Appointment.find({ _id: appointmentid });
  if (!findappointment) {
    return res
      .status(404)
      .json({ succes: false, message: "Appointment was not found" });
  }
  const updateappointment = findappointment
    ? await Appointment.findByIdAndUpdate(
        findappointment[0]._id,
        { $set: { review: message, rating: rating, disabled: true } },
        { new: true }
      )
    : null;
  console.log(updateappointment);
  res.status(200).json({ succes: true });
  try {
  } catch (error) {
    console.error(error);
  }
};

export const GetDoctorAppointments = async (req, res) => {
  try {
    let { doctorIds } = req.query;
    const cacheKey = "Doctorids";
    const cached = await redis.get(cacheKey);
    //console.log(cached);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    let appointments;
    if (!doctorIds) {
      return res.json({ message: "No ids found" });
    }
    if (doctorIds.includes(",")) {
      let ids = doctorIds.split(",");
      appointments = [];
      for (let id of ids) {
        let result = await Appointment.find(
          { doctorid: id },
          { date: 1, time: 1, reason: 1, _id: 0 }
        );
        appointments = [...appointments, ...result];
      }
      //console.log(appointments);
    } else {
      appointments = await Appointment.find(
        { doctorid: { $in: doctorIds } },
        { date: 1, time: 1, reason: 1, _id: 0 }
      );
      //console.log(appointments);
    }

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "appointment was NOT found" });
    }
    await redis.set(cacheKey, JSON.stringify(appointments), "EX", 20);
    return res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error(error);
  }
};
export const DeleteAppointment = async (req, res) => {
  try {
    const { appointmentid } = req.body;
    console.log(appointmentid);
    const appointment = await Appointment.findById(appointmentid);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment wasnt found" });
    }
    if (appointment) {
      await Appointment.findByIdAndDelete(appointmentid);
    }
    res.status(200).json({ message: "Appointment was succesfully deleted" });
  } catch (error) {
    console.error(error);
  }
};
export const GetTimes = async (req, res) => {
  try {
    const { doctorid, date } = req.query;
    let results;
    // console.log(doctorid, date);
    const findappointments = await Appointment.find({
      doctorid: doctorid,
      date: date,
    });
    if (findappointments) {
      results = findappointments.map((a) => ({
        time: a.time,
        reason: a.reason,
      }));
    } else {
      res.status(404).json({ message: "No appointments found" });
    }
    // console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

export const doctorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "doctor") {
    return res.status(403).json({ message: "Doctors only" });
  }
  next();
};

export const GetforDoctorsAppointment = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ fullname: req.user.fullname });
    const findappointments = await Appointment.find({
      doctorid: doctorProfile._id,
    })
      .sort({ date: 1, time: 1 })
      .limit(10);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor Profile not found!" });
    }
    res.status(200).json({
      findappointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const AppointmentsCompleted = async (req, res) => {
  const { appointmentid } = req.body;
  try {
    const findAppointment = await Appointment.findOne({ _id: appointmentid });
    if (!findAppointment) {
      return res.status(404).json({ message: "appointment was not found" });
    }
    let updatedAppointment = findAppointment
      ? await Appointment.findByIdAndUpdate(
          { _id: findAppointment._id },
          { $set: { completed: true } },
          { new: true }
        )
      : null;
    console.log(updatedAppointment);
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// export const createDoctor = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: "doctor" });
//     console.log("Doctors found:", doctors.length);
//     let appointmentCounter = 1;
//     const result = [];

//     for (let doc of doctors) {
//       const token = generateToken(doc);
//       console.log(doc._id);
//       let user = await User.findByIdAndUpdate(
//         doc._id,
//         { $set: { appointmentID: appointmentCounter } },
//         { new: true, strict: false }
//       );
//       console.log("After update:", user.appointmentID);
//       result.push({
//         user,
//         token,
//         appointmentID: appointmentCounter,
//       });

//       appointmentCounter += 1;
//     }

//     return res
//       .status(200)
//       .json({ message: "Doctors updated", doctors: result });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
