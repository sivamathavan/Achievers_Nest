import React, { useEffect } from 'react';
import './landing/landing.css';
import NavBar from './landing/components/NavBar';
import HeroSection from './landing/sections/HeroSection';
import StatsCounter from './landing/sections/StatsCounter';
import WhatWeOffer from './landing/sections/WhatWeOffer';
import BoardsAndClasses from './landing/sections/BoardsAndClasses';
import TopScorers from './landing/sections/TopScorers';
import Testimonials from './landing/sections/Testimonials';
import EnquiryForm from './landing/sections/EnquiryForm';
import LocationContact from './landing/sections/LocationContact';
import Footer from './landing/components/Footer';
import FloatingElements from './landing/components/FloatingElements';

const LandingPage = () => {
  // Ensure scroll is at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-inter selection:bg-gold selection:text-dark-bg overflow-x-hidden max-w-[100vw]">
      <NavBar />
      
      <main>
        <HeroSection />
        <StatsCounter />
        <WhatWeOffer />
        <BoardsAndClasses />
        <TopScorers />
        <Testimonials />
        <EnquiryForm />
        <LocationContact />
      </main>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default LandingPage;
