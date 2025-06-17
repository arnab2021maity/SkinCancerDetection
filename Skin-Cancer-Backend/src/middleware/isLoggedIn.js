import sessionSchema from "../models/sessionSchema.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request",
      });
    }

    const session = await sessionSchema.findOne({ userId });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session not found or expired. Please login again.",
      });
    }

    next(); // session valid
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error in session validation",
    });
  }
};
