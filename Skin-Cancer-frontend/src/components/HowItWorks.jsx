import React from 'react';

const Work = () => {
return (
    <section className="bg-gradient-to-br from-white to-blue-50 py-20 px-6" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-900 mb-16">
          How Our AI Detection Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 cursor-pointer">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Step 1: Choose Detection Type</h3>
            <p className="text-gray-700">
              Start by selecting one of three detection modes: <span className="font-medium text-blue-600">Image-Based</span>,
              <span className="font-medium text-blue-600"> Gene-Based</span>, or <span className="font-medium text-blue-600">Fusion</span> (combines both for higher accuracy).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Step 2: Upload & Submit</h3>
            <p className="text-gray-700">
              Upload a dermoscopic image or gene expression file (CSV format). Our system instantly processes your input using advanced AI models.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Step 3: Get Prediction</h3>
            <p className="text-gray-700">
              Instantly receive the predicted <span className="font-semibold">type of skin cancer</span>, such as <span className="text-blue-700">Melanoma</span>, <span className="text-blue-700">Basal Cell Carcinoma</span>, or <span className="text-blue-700">Benign Lesion</span>, along with a <span className="font-semibold">confidence score</span> .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;