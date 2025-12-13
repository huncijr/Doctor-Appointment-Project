import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role || "user",
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};
