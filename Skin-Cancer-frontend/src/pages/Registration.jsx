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
  const [showTermsModal, setShowTermsModal] = useState(false);

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
          <div className="w-full bg-white rounded-xl shadow-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center">
                Register
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    placeholder="Enter Your Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    {...register("userName")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.userName?.message}
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    {...register("email")}
                  />
                  <p className="text-xs text-red-600 font-semibold h-4">
                    {formState.errors.email?.message}
                  </p>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[50px] text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash color="#2563EB"/> : <FaEye color="#2563EB"/>}
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
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-blue-400"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                    I accept the{" "}
                    <span
                      onClick={() => setShowTermsModal(true)}
                      className="font-medium text-blue-500 hover:underline cursor-pointer"
                    >
                      Terms and Conditions
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-[#2563EB] hover:opacity-90 w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500 text-center">
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

      {/* Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg p-6 space-y-4 relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Terms & Conditions</h2>
            <p className="text-sm text-gray-600">
              By using this website, you agree to the following terms. All images and genomic data
              uploaded by users are treated as private and confidential. We do not store, share, or
              misuse any user data, and everything remains secure during the prediction process. By
              creating an account, you are responsible for keeping your login credentials safe and
              secure.
              <br /><br />
              Any misuse of the platform, including uploading harmful or unrelated content, is
              strictly prohibited. We reserve the right to modify or update these terms at any time.
              Continued use of the site indicates your acceptance of any future changes.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </>
  );
}
