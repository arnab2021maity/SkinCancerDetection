import users from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { statusCode } from "../config/constant.js";
config();

const generateToken = (user_id, expire_time) => {
  const generatedToken = jwt.sign({ user_id }, process.env.TOKEN_SECRET, {
    expiresIn: expire_time,
  });
  return generatedToken;
};


export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "User already exists. Log in to continue.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = await users.create({
      userName,
      email,
      password: hashedPassword,
    });

    const generatedToken = generateToken(data._id, process.env.EXPIRE_TIME);

    await users.updateOne(
      { _id: data._id },
      { $set: { token: generatedToken } }
    );

    return res.status(statusCode.CREATED).json({
      success: true,
      id: data._id,
      message: "Registered successfully.",
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
    });
  }
};
