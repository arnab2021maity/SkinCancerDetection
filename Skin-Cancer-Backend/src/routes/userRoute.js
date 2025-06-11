import express from "express";
import { registerUser } from "../controllers/registerUser.js";
import { signupUser } from "../validators/dataValidation.js";
import { validate } from "../middleware/validate.js";
import { loginUser } from "../controllers/loginUser.js";

const userRoutes = express.Router();

userRoutes.post("/register",validate(signupUser), registerUser);
userRoutes.post("/login",loginUser)

export default userRoutes;