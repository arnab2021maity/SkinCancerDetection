import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import userLoginSchema from "../validators/userLogin";

export const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(userLoginSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const userLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/login", data);
      const { accessToken, refreshToken, username, success, message } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userName", username);

      if (success) {
        toast.success(message);
        reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests, please try again later.");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Try again.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4">
        <h1 className="font-man text-[24px] xs:text-[30px] font-semibold mb-[40px] text-center">
          Welcome to Skin Cancer Detection
        </h1>

        <form
          className="w-full max-w-[354px]"
          onSubmit={handleSubmit(userLogin)}
          noValidate
        >
          <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            aria-label="Email"
            className="w-full pt-[18px] pb-[19px] pl-[25px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
            placeholder="Enter email address"
            {...register("email")}
          />
          <p className="text-xs text-red-600 font-semibold h-6">
            {errors.email?.message}
          </p>

          <label className="font-man text-[16px] font-semibold text-[#52575C] flex items-center gap-1 mb-[8px] mt-[20px]">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              aria-label="Password"
              className="w-full pt-[18px] pb-[19px] pl-[25px] pr-[40px] rounded-[10px] border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#EC2F79]"
              placeholder="Enter password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-[10px] transform -translate-y-1/2"
              aria-label="Toggle Password Visibility"
            >
              {passwordVisible ? <FaEye color="#EC2F79" /> : <FaEyeSlash color="#EC2F79" />}
            </button>
          </div>
          <p className="text-xs text-red-600 font-semibold h-6">
            {errors.password?.message}
          </p>

          <button
            type="submit"
            className="bg-[#EC2F79] text-white rounded-[10px] w-full mt-[21px] pt-[13px] pb-[17.5px] font-man text-[14px]"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col items-center md:flex-row md:items-end gap-2 mt-[25px]">
          <p className="text-center">Don't have an account?</p>
          <Link className="text-blue-500" to="/register">
            Register
          </Link>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
};
