import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import userSchema from "../validators/userRegistartion.js";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";

export default function Registration() {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(userSchema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/register", data);
      if (res.data.success) {
        toast.success(res.data?.message || "Registration successful!");
        reset();
        navigate("/login");
      } else {
        toast.error(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests, please try again later.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto md:h-screen">
          {/* <h2 className="text-gray-800 text-3xl font-semibold mb-6 text-center">
            Create Account
          </h2> */}
          <div className="w-full bg-white rounded-xl shadow-lg md:mt-0 sm:max-w-md xl:p-0  ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900  text-center">
                Register
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Name
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    placeholder="Enter Your Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                      "
                    {...register("userName")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.userName?.message}
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                    {...register("email")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.email?.message}
                  </p>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                        "
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[40px] text-gray-600  cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.password?.message}
                  </p>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-blue-400 
                    "
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-500 ">
                    I accept the <a href="#" className="font-medium text-blue-500 hover:underline">Terms and Conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-[#2563EB] hover:opacity-90 w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500  text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-blue-500 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    <Toaster />
    </>
  );
}