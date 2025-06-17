import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [userName, setUserName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser);
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post("http://localhost:8000/logout", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
      setUserName(null);
      setShowModal(false);
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="bg-slate-800 border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4 mx-auto px-10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-white">AI Dermatologist</span>
              <p className="text-gray-400 text-sm">Skin Cancer</p>
            </div>
          </Link>

          <div className="hidden md:flex md:items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
            <a href="#features" className="text-white hover:text-blue-400 transition">Features</a>
            <a href="#how-it-works" className="text-white hover:text-blue-400 transition">How it Works</a>

            {userName ? (
              <>
                {/* Tools Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-white hover:text-green-400 transition focus:outline-none"
                  >
                    Analyse ▾
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50">
                      <Link
                        to="/gene"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Gene Analysis
                      </Link>
                      <Link
                        to="/image"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Image Analysis
                      </Link>
                      <Link
                        to="/fusion"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Fusion Analysis
                      </Link>
                    </div>
                  )}
                </div>

                <span className="text-blue-400 font-medium">Hi, {userName}</span>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-white hover:text-pink-400 transition">Register</Link>
                <Link to="/login" className="text-white hover:text-pink-400 transition">Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
