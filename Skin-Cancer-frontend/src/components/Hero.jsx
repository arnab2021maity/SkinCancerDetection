import React from 'react';
import home from '../assets/home.jpg';

export default function Hero() {
  return (
    <>
    <div
      className="w-full h-[87.3vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${home}) `}}
      >
     
      <div className=" flex flex-col h-full bg-black bg-opacity-50 mg-4 p-8">
        <h1 className="text-white text-4xl mb-4 font-bold">Detect Skin Cancer Early.</h1>
        <h1 className="text-white text-4xl mb-4 font-bold">Save Lives</h1>
        <p className=" max-w-xl text-left mb-6 text-white text-[1.375rem] mt-8">
          Skin cancer is one of the most common form of cancer in the world. Early detection is crucial for effective treatment and can significantly increase survival rates.Our platform uses advanced machine learning algorithms to analyze skin images and genomic data provide accurate predictions, helping you take proactive steps towards your health.
        </p>
        <div className='p-4 flex justify-start items-start'>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-8">
           Upload Image
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ml-4">
            Upload Genomic Data
          </button>
        </div>
      </div>
     
    </div>
      </>
  );
}
