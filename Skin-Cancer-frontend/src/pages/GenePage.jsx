import React from 'react';
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

const GenePage = () => {
    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Gene Expression Analysis
                    </h1>
                    <h2 className="text-lg text-left font-semibold text-gray-700 mb-2">Let's Start</h2>
                    <p className="text-left text-sm text-gray-600 mb-6 font">
                        Upload your gene expression Excel file (.xlsx or .xls or .pdf). Make sure your data is in the correct format.
                    </p>

                    <form>
                        <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-700 mb-6">
                                Upload Excel File <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.pdf"
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:opacity-90 transition"
                        // onClick={handleSubmit(onSubmit)}
                        >
                            Submit
                        </button>
                    </form>

                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </section>
        </>
    );
};

export default GenePage;