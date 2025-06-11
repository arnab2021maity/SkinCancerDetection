import * as yup from "yup";

const userSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(20, "Name must be at most 20 characters"),
  email: yup
    .string()
    .email("The email is not a valid one")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message:
        "Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
    }),
});

export default userSchema;
