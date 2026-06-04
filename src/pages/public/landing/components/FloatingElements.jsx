import React, { useState, useEffect } from 'react';
import { Phone, X, ArrowUp } from 'lucide-react';

// Using an SVG for WhatsApp since it's not a standard lucide-react icon
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const FloatingElements = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top after scrolling 50% of viewport height
      setShowScrollTop(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollClick = () => {
    const element = document.getElementById('enroll');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setShowBanner(false);
    }
  };

  return (
    <>
      {/* Top Enrollment Banner */}
      <div 
        className={`fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-gold to-yellow-400 text-dark-bg font-bold py-2 px-4 shadow-lg transition-transform duration-500 flex justify-center items-center ${
          showBanner ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <p className="text-center text-sm sm:text-base mr-8">
          🎉 Admissions Open for 2025-26! Limited seats available.{' '}
          <button onClick={handleEnrollClick} className="underline decoration-dark-bg/50 hover:decoration-dark-bg underline-offset-2 ml-1">
            Enroll now &rarr;
          </button>
        </p>
        <button 
          onClick={() => setShowBanner(false)}
          className="absolute right-4 p-1 hover:bg-dark-bg/10 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Adjust Nav padding if banner is visible - handled by sticky positioning but good to note */}

      {/* Floating Buttons Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-4">
        
        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className={`w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>

        {/* Call Button */}
        <a
          href="tel:+916382987874"
          className="w-12 h-12 bg-gradient-to-tr from-gold to-yellow-300 text-dark-bg rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(255,215,0,0.4)] hover:scale-110 transition-transform"
          aria-label="Call us"
        >
          <Phone size={22} fill="currentColor" />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/916381169124"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform relative group animate-[pulse_2s_infinite]"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={28} />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 bg-white text-dark-bg text-sm font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Chat with us!
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
          </div>
        </a>

      </div>
    </>
  );
};

export default FloatingElements;
