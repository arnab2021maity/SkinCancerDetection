import React, { useState } from 'react';
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import axios from "axios";

const ImagePage = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please upload an image first!");

        const formData = new FormData();
        formData.append("file", file);

        toast.loading("Analyzing image...");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/predict/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.dismiss();
            setResult(response.data);
            toast.success("Prediction complete!");
        } catch (error) {
            toast.dismiss();
            toast.error("Prediction failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Image Analysis
                    </h1>

                    <h2 className="text-lg text-left font-semibold text-gray-700 mb-2">Let's Start</h2>
                    <p className="text-left text-sm text-gray-600 mb-6">
                        Upload your image file (.jpeg or .jpg). Ensure the image is clear and correctly formatted.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Upload Image <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".jpeg,.jpg"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
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
                                    Loading...
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Prediction Result:</h3>
                            <p><strong>Label:</strong> {result.label || result.prediction}</p>
                            <p>
                                <strong>Confidence:</strong>{" "}
                                <span className={`font-semibold ${result.confidence >= 0.8
                                    ? "text-green-700"
                                    : result.confidence >= 0.7
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}>
                                    {result.confidence}
                                </span>
                            </p>
                            {result.top_3_predictions && (
                                <div className="mt-2">
                                    <p className="font-semibold text-gray-700">Top 3 Predictions:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {Object.entries(result.top_3_predictions).map(([label, conf]) => (
                                            <li key={label}><strong>{label}:</strong> {conf}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {result.entropy_score && (
                                <p className="mt-2"><strong>Entropy:</strong> {result.entropy_score}</p>
                            )}
                            {result.warnings && result.warnings.map((w, idx) => (
                                <p key={idx} className="text-yellow-700 mt-2">⚠️ {w}</p>
                            ))}
                            {result.recommendation && (
                                <p className="mt-2 text-red-600 font-semibold">{result.recommendation}</p>
                            )}
                        </div>
                    )}

                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </section>
        </>
    );
};

export default ImagePage;
