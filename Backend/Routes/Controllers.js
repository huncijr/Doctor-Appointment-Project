import express from "express";
import generateToken from "../utils/GenerateToken.js";
import bcrypt from "bcryptjs";
import { Appointment, User } from "../DataBase/Schemas.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
export const GetRegistration = async (req, res) => {
  try {
    const { fullname, age, username, password, gender, registered } = req.body;
    console.log("sikerult");
    const UserExists = await User.findOne({ fullname });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
      console.log("alr created");
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
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
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
    console.log("hello");
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid fullname or password" });
    }
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
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

export const Protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Not authorized," });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
