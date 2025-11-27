import express from "express";
import generateToken from "../utils/GenerateToken.js";
import bcrypt from "bcryptjs";
import { Appointment, User, Doctor } from "../DataBase/Schemas.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redis from "../DataBase/Redis.js";

export const GetDoctors = async (req, res) => {
  try {
    const cacheKey = "alldoctors";
    const cached = await redis.get(cacheKey);
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

export const GetRegistration = async (req, res) => {
  try {
    const { fullname, age, username, password, gender, registered, cookies } =
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
    });
    const token = generateToken(user._id);
    if (cookies) {
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
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
    const { username, password, cookies } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid fullname or password" });
    }
    const token = generateToken(user._id);
    if (cookies) {
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
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
export const DeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(userId);
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
    } = req.body;
    let user = await User.findOne({ username });
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
    });
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const GetAppointment = async (req, res) => {
  const { userid } = req.query;
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User was NOT found" });
    }

    const appointments = await Appointment.find({
      userid,
    });
    console.log(appointments);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "Appointment was NOT found" });
    }
    return res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const GetDoctorAppointments = async (req, res) => {
  try {
    let { doctorIds } = req.query;

    if (!doctorIds)
      return res.status(400).json({ message: "No doctor IDs provided" });

    if (typeof doctorIds === "string") {
      doctorIds = doctorIds.split(",");
    }

    if (!Array.isArray(doctorIds)) {
      doctorIds = [doctorIds];
    }

    const appointments = await Appointment.find(
      { doctorId: { $in: doctorIds } },
      { date: 1, time: 1, reason: 1, _id: 0 }
    );

    if (!appointments.length) {
      return res.status(404).json({ message: "appointment was NOT found" });
    }

    console.log(appointments);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const DeleteAppointment = async (req, res) => {
  try {
    const { appointmentid } = req.body;
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

export const Protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(200).json({ loggedIn: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
