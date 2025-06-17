import React from 'react'
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Hero";
import Hero from "../components/Navbar";
import Footer from '../components/Footer';
import FeaturesSection from '../components/Features';
import Work from '../components/HowItWorks';

const Landing = () => {
    return (
        <>
            <Hero />
            <Navbar />
            <FeaturesSection/>
            <Work/>
            <Footer/>
            <Toaster></Toaster>
        </>
    )
}

export default Landing;