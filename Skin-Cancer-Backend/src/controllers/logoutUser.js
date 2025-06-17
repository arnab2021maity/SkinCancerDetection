// controllers/logoutController.js
import sessionSchema from "../models/sessionSchema.js";
import { statusCode } from "../config/constant.js";

export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId; // extracted from verified token
    console.log("user Id",userId);

    const result = await sessionSchema.findOneAndDelete({ userId });

    if (!result) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No active session found.",
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      message: "User logged out and session removed.",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Logout failed. Try again.",
    });
  }
};
