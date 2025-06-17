import React, { useState } from 'react';
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import axios from "axios";

const GenePage = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please upload a gene Excel file first!");

        const formData = new FormData();
        formData.append("file", file);

        toast.loading("Analyzing gene expression data...");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/predict/gene", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.dismiss();
            setResult(response.data);
            toast.success("Prediction complete!", {
                icon: "✅",
                style: { background: "#d1fae5", color: "#065f46" }
            });
        } catch (error) {
            toast.dismiss();
            toast.error("Prediction failed. Please try again.");
            console.error("Gene prediction error:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderResult = () => (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Prediction:</h3>
            <p><strong>Result:</strong> {result.label}</p>
            <p><strong>Confidence:</strong> {result.confidence}</p>
            {result.warning && (
                <p className="text-yellow-700 mt-2">⚠️ {result.warning}</p>
            )}
        </div>
    );

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Gene Expression Analysis
                    </h1>

                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Let's Start</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Upload your gene expression Excel file (.xlsx or .xls). Ensure the format matches the model's requirements.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Upload Excel File <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2563EB] hover:opacity-90"}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>

                    {result && renderResult()}
                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </section>
        </>
    );
};

export default GenePage;
