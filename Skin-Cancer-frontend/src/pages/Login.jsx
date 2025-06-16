import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import userLoginSchema from "../validators/userLogin";
import Navbar from "../components/Navbar";

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
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
           <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Log In
          </h1>
          <form onSubmit={handleSubmit(userLogin)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                {...register("email")}
              />
              <p className="text-xs text-red-600 font-medium mt-1">{errors.email?.message}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  aria-label="Toggle Password Visibility"
                >
                  {passwordVisible ? <FaEyeSlash color="#2563EB" /> : <FaEye color="#2563EB" />}
                </button>
              </div>
              <p className="text-xs text-red-600 font-medium mt-1">{errors.password?.message}</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-[#2563EB] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </section>
    </>
  );
};