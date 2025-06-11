import users from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import sessionSchema from "../models/sessionSchema.js";

config();

const generateToken = (user_id, expire_time) => {
  const generatedToken = jwt.sign({ user_id }, process.env.TOKEN_SECRET, {
    expiresIn: expire_time,
  });
  return generatedToken;
};

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existing_user = await users.findOne({ email }, { password: 1 });

    if (!existing_user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // Compare passwords
    const compare = await bcrypt.compare(
      req.body.password,
      existing_user.password
    );

    if (!compare) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
     
        // generate tokens
        const accessToken = generateToken(
          existing_user._id,
          process.env.EXPIRE_TIME
        );
        const refreshToken = generateToken(
          existing_user._id,
          process.env.REFRESH_TOKEN_TiME
        );

        const userId = existing_user._id;
        await sessionSchema.findOneAndDelete({ userId: existing_user._id });
        const sessionModel = await sessionSchema.create({
          userId,
        });
        sessionModel.save();

        if (!sessionModel) {
          throw new Error("session creation failed ");
        }
        const nowUser = await users.findOne({ email });
        
        res.status(201).json({
          username: nowUser.userName,
          accessToken: accessToken,
          refreshToken: refreshToken,
          success: true,
          file:nowUser.file,
          message: "user loggedin successfully.",
        });
      
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: "Internal server error",
    });
  }
};