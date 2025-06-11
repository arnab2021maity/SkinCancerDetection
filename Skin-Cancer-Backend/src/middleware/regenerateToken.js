import jwt from "jsonwebtoken";
import users from "../models/users";


// verify refresh token

export const verifyRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let refreshToken;

    if (authHeader.includes("Bearer")) {
      refreshToken = authHeader.split(" ")[1];
    } else {
      refreshToken = authHeader;
    }

    if (!refreshToken) {
      console.log("refresh token not availbale")
      return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          res.status(401).json({
            message: "refresh token expired",
            error: error.message,
          });
        } else {
          const { user_id } = decoded;
          const user = await users.findById(user_id);

          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          } else {
            req.userId = user_id;
            next();
          }
        }
      }
    );
  } catch (error) {
    return { success: false, error: error.message };
  }
};

