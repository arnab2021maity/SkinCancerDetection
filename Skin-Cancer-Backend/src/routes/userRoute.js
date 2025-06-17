import express from "express";
import { registerUser } from "../controllers/registerUser.js";
import { signupUser } from "../validators/dataValidation.js";
import { validate } from "../middleware/validate.js";
import { loginUser } from "../controllers/loginUser.js";
import { logoutUser } from "../controllers/logoutUser.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/register",validate(signupUser), registerUser);
userRoutes.post("/login",loginUser)
userRoutes.post("/logout", authMiddleware, isLoggedIn, logoutUser);


export default userRoutes;