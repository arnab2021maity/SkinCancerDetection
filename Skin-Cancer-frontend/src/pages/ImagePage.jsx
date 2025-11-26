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
        
        if (!file) {
            return toast.error("Please upload an image first!");
        }

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
            toast.success("Image prediction complete!");
        } catch (error) {
            toast.dismiss();
            toast.error("Prediction failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence) => {
        const conf = parseFloat(confidence);
        if (conf >= 0.75) return "text-green-600";
        if (conf >= 0.5) return "text-yellow-600";
        return "text-red-600";
    };

    const getConfidenceBadge = (confidence) => {
        const conf = parseFloat(confidence);
        if (conf >= 0.75) return "bg-green-100 text-green-800 border-green-300";
        if (conf >= 0.5) return "bg-yellow-100 text-yellow-800 border-yellow-300";
        return "bg-red-100 text-red-800 border-red-300";
    };

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        🖼️ Skin Lesion Image Analysis
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Advanced computer vision analysis for skin cancer detection
                    </p>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>How it works:</strong> Upload a clear image of the skin lesion in JPEG or JPG format. 
                            Our AI model analyzes visual features to identify potential skin cancer types.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                🖼️ Upload Skin Lesion Image (.jpg / .jpeg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".jpeg,.jpg,.png"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                            />
                            {file && (
                                <p className="text-xs text-green-600 mt-2">✓ {file.name}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
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
                                "🔬 Analyze Image"
                            )}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-8 space-y-6 animate-fade-in">
                            {/* Main Prediction Card */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-2 text-center">🎯 Image Analysis Result</h3>
                                <h2 className="text-3xl font-bold text-center uppercase tracking-wide">
                                    {result.label || result.prediction}
                                </h2>
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    <span className={`px-4 py-2 rounded-full font-semibold ${getConfidenceBadge(result.confidence)}`}>
                                        Confidence: {(parseFloat(result.confidence) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            {/* Warnings Section */}
                            {result.warnings && result.warnings.length > 0 && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex items-start">
                                        <span className="text-2xl mr-3">⚠️</span>
                                        <div>
                                            <h4 className="font-semibold text-yellow-800">Important Notices:</h4>
                                            <ul className="list-disc list-inside text-yellow-700 text-sm mt-2">
                                                {result.warnings.map((warning, idx) => (
                                                    <li key={idx}>{warning}</li>
                                                ))}
                                            </ul>
                                            {result.recommendation && (
                                                <p className="mt-2 text-sm font-semibold text-yellow-900">
                                                    📋 {result.recommendation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Analysis Details */}
                            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                    🖼️ Analysis Summary
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-white p-3 rounded">
                                        <span className="text-sm font-medium text-gray-700">
                                            Predicted Diagnosis
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {result.label || result.prediction}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-3 rounded">
                                        <span className="text-sm font-medium text-gray-700">
                                            Model Confidence
                                        </span>
                                        <span className={`text-sm font-semibold ${getConfidenceColor(result.confidence)}`}>
                                            {(parseFloat(result.confidence) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <p className="text-xs text-red-800">
                                    <strong>⚕️ Medical Disclaimer:</strong> This is an AI-assisted diagnostic tool and should NOT replace professional medical advice.
                                    Always consult with a qualified dermatologist or healthcare provider for proper diagnosis and treatment.
                                </p>
                            </div>
                        </div>
                    )}

                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </section>
        </>
    );
};

export default ImagePage;
