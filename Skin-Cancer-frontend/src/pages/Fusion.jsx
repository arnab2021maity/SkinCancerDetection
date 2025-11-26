import React, { useState } from 'react';
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import axios from "axios";

const Fusion = () => {
    const [geneFile, setGeneFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!geneFile || !imageFile) {
            return toast.error("Please upload both gene and image files!");
        }

        const formData = new FormData();
        formData.append("gene", geneFile);
        formData.append("image", imageFile);

        toast.loading("Running fusion analysis...");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/predict/fused", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.dismiss();
            setResult(response.data);
            toast.success("Fusion prediction complete!");
        } catch (error) {
            toast.dismiss();
            toast.error("Fusion prediction failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.75) return "text-green-600";
        if (confidence >= 0.5) return "text-yellow-600";
        return "text-red-600";
    };

    const getConfidenceBadge = (confidence) => {
        if (confidence >= 0.75) return "bg-green-100 text-green-800 border-green-300";
        if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 border-yellow-300";
        return "bg-red-100 text-red-800 border-red-300";
    };

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-200 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        🧬 Fuzzy Multimodal Fusion Analysis
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Advanced fusion using Fuzzy Logic with Domain Knowledge
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>How it works:</strong> Our system analyzes both gene expression data and skin lesion images,
                            then uses fuzzy logic with medical domain knowledge to provide the most accurate diagnosis.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    📄 Upload Gene File (.xlsx / .xls) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) => setGeneFile(e.target.files[0])}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                    file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                    file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                />
                                {geneFile && (
                                    <p className="text-xs text-green-600 mt-2">✓ {geneFile.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    🖼️ Upload Skin Image (.jpg / .jpeg) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                    file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                    file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                                />
                                {imageFile && (
                                    <p className="text-xs text-green-600 mt-2">✓ {imageFile.name}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
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
                                "🔬 Run Fusion Analysis"
                            )}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-8 space-y-6 animate-fade-in">
                            {/* Final Prediction Card */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-2 text-center">🎯 Final Diagnosis</h3>
                                <h2 className="text-3xl font-bold text-center uppercase tracking-wide">
                                    {result.final_prediction}
                                </h2>
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    <span className={`px-4 py-2 rounded-full font-semibold ${getConfidenceBadge(result.final_confidence)}`}>
                                        Confidence: {(result.final_confidence * 100).toFixed(1)}%
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm">
                                        {result.fusion_method}
                                    </span>
                                </div>
                                {result.fused_confidence !== undefined && (
                                    <p className="text-center text-white mt-2 text-sm opacity-90">
                                        Fused Score: {(result.fused_confidence * 100).toFixed(1)}%
                                    </p>
                                )}

                            </div>

                            {/* Warnings */}
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

                            {/* Top-3 Predictions Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Image Top-3 */}
                                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                        🖼️ Image Analysis - Top 3
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(result.image_top3).map(([label, conf], idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {idx + 1}. {label}
                                                </span>
                                                <span className={`text-sm font-semibold ${getConfidenceColor(conf)}`}>
                                                    {(conf * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gene Top-3 */}
                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                        🧬 Gene Expression - Top 3
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(result.gene_top3).map(([label, conf], idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {idx + 1}. {label}
                                                </span>
                                                <span className={`text-sm font-semibold ${getConfidenceColor(conf)}`}>
                                                    {(conf * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        ))}
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

export default Fusion;
