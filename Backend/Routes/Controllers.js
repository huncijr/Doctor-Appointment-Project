import express from "express";
import generateToken from "../utils/GenerateToken.js";
import bcrypt from "bcryptjs";
import { Appointment, User, Doctor } from "../DataBase/Schemas.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export const GetDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "error", error });
    console.log(error);
  }
};
export const GetDoctorsById = async (req, res) => {
  try {
    const { occupation } = req.query;
    console.log("lefutottam");
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
    console.log("az ev:", age);
    const UserExists = await User.findOne({ username });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
      console.log("User already has been created");
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

export const MakeAnAppointment = async (req, res) => {
  try {
    const { fullname, username, id, age, doctor, date, time, message } =
      req.body;
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ Message: "User was not found" });
    const appointment = Appointment.create({
      userid: id,
      fullname,
      age,
      doctor,
      date,
      time,
      message,
    });
    res.status(201).json({
      date,
      doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
