import React from 'react'
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Hero";
import Hero from "../components/Navbar";

const Landing = () => {
    return (
        <>
            <Hero />
            <Navbar />
            <Toaster></Toaster>
        </>
    )
}

export default Landing;