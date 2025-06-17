import React from "react";

const features = [
  {
    title: "Image-Based Detection",
    desc: "Upload dermatology images for instant AI analysis."
  },
  {
    title: "Gene Data Analysis",
    desc: "Submit gene expression files to get deeper insight."
  },
  {
    title: "Fusion Model",
    desc: "Combine both data types for maximum accuracy."
  },
  {
    title: "Real-time Results",
    desc: "Get immediate prediction feedback."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white text-gray-800" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}