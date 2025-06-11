import React from 'react';
import home from '../assets/home.jpg';

export default function Hero() {
  return (
    <>
    <div
      className="w-full h-[87.3vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${home})` }}
      >
     
      <div className="w-full flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Welcome to Skin Cancer Detection</h1>
      </div>
    </div>
      </>
  );
}
