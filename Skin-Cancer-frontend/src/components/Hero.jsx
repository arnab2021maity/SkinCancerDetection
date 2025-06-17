import React from 'react';
import home from '../assets/home.jpg';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${home})` }}
    >
      <div className="flex flex-col h-full bg-black bg-opacity-60 px-4 sm:px-8 md:px-12 lg:px-20 py-10 justify-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
          Detect Skin Cancer Early.
        </h1>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          Save Lives
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl max-w-4xl leading-relaxed mt-4 mb-6">
          Skin cancer is one of the most common forms of cancer in the world. Early detection is crucial for effective treatment and can significantly increase survival rates. Our platform uses advanced machine learning algorithms to analyze skin images and genomic data to provide accurate predictions, helping you take proactive steps towards your health.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <button
            onClick={() => navigate("/image")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Upload Image
          </button>
          <button
            onClick={() => navigate("/gene")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Upload Genomic Data
          </button>
          <button
            onClick={() => navigate("/fusion")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded transition"
          >
            Fusion Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
