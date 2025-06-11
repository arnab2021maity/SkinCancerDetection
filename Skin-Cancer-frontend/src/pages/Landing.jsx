import React from 'react'
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Hero";
import Hero from "../components/Navbar";
import Footer from '../components/Footer';

const Landing = () => {
    return (
        <>
            <Hero />
            <Navbar />
            <Footer/>
            <Toaster></Toaster>
        </>
    )
}

export default Landing;