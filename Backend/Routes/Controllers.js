import express from "express";
import generateToken from "../utils/GenerateToken.js";
import { Appointment, User } from "../DataBase/Schemas.js";

export const GetRegistration = async (req, res) => {
  try {
    const { username, fullname, password, gender, age } = req.body;
    const UserExists = await User.findOne({ fullname });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      fullname,
      password,
      gender,
      age,
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      gender: user.gender,
      registered: user.registered,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetLogin = async (req, res) => {
  try {
    const { fullname, password } = req.body;
    const user = await User.findOne({ fullname });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid e-mail or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
