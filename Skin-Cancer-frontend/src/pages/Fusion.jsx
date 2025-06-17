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

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-200 flex items-center justify-center px-4">
                <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Fusion Analysis: Gene Expression + Image
                    </h1>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Required Files</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Upload your gene expression file (Excel) and a skin lesion image. Both inputs are required for fusion analysis.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Upload Gene File (.xlsx / .xls) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) => setGeneFile(e.target.files[0])}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Upload Skin Image (.jpg / .jpeg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:opacity-90"}`}
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
                                "Submit for Analysis"
                            )}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200 animate-fade-in">
                            <h3 className="text-lg font-semibold text-purple-800 mb-2">Fusion Result:</h3>
                            <h2 className="text-lg text-center bg-purple-300 rounded-md py-2 m-4"><strong>Final Decision:</strong> {result.final_decision}</h2>
                            <p><strong>Trusted Model:</strong> {result.trusted_model}</p>

                            <p><strong>Gene Prediction:</strong> {result.gene_prediction} ({result.gene_confidence})</p>
                            <p><strong>Image Prediction:</strong> {result.image_prediction} ({result.image_confidence})</p>
                            <p>
                                <strong>Fused Confidence:</strong>
                                <span className={
                                    result.fused_confidence >= 0.75 ? "text-green-600" :
                                        result.fused_confidence >= 0.5 ? "text-yellow-600" : "text-red-600"
                                }> {result.fused_confidence}</span>
                            </p>
                        </div>
                    )}

                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </section>
        </>
    );
};

export default Fusion;