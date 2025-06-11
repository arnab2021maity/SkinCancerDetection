import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import userSchema from "../validators/userRegistartion.js";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

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

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex text-left items-start mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Create Account
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Register
              </h1>
              <form className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    placeholder="Enter Your Name"

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("userName")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.userName?.message}
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("email")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.email?.message}
                  </p>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[50px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.password?.message}
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                      I accept the{" "}
                      <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a href="login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Login here
                  </a>
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
