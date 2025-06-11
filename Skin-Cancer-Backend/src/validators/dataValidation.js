import { z } from "zod";


const userName = z.string().trim().min(1, { message: "Username is Required." });

const email = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1, { message: "Email is Required" });


export const signupUser = z
  .object({
    userName: userName,
    email: email,
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message:
          "Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
      }),
  })
