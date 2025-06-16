import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4 mx-auto px-10">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex flex-col">
            <span className="self-center text-2xl font-semibold text-white whitespace-nowrap">
              AI Dermatologist
            </span>
            <p className="text-gray-400 text-sm">Skin Cancer</p>
          </div>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg bg-slate-700 md:flex-row md:space-x-8 md:mt-0 md:bg-transparent">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-white hover:text-blue-400 md:p-0 transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="block py-2 px-3 text-white hover:text-blue-400 md:p-0 transition"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="block py-2 px-3 text-white hover:text-blue-400 md:p-0 transition"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="block py-2 px-3 text-white hover:text-pink-400 md:p-0 transition"
              >
                Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}