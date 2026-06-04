import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft, HelpCircle } from 'lucide-react';
import useSEO from '../../hooks/useSEO';

const NotFound = ({ type = '404' }) => {
  const navigate = useNavigate();

  const isUnderConstruction = type === 'construction';
  useSEO(isUnderConstruction ? 'Coming Soon' : 'Page Not Found');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-inter flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full glass-card border border-white/10 rounded-[28px] p-8 md:p-10 text-center relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
        
        {/* Animated Icon container */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6 text-gold relative group">
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-md group-hover:scale-110 transition-transform duration-300"></div>
          {isUnderConstruction ? (
            <Compass className="w-10 h-10 relative z-10 animate-[spin_8s_linear_infinite]" />
          ) : (
            <HelpCircle className="w-10 h-10 relative z-10 animate-bounce" />
          )}
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-white font-space tracking-tight mb-2">
          {isUnderConstruction ? 'Under Construction' : 'Page Not Found'}
        </h1>
        
        {/* Subtitle */}
        <p className="text-white/40 text-[13px] font-bold uppercase tracking-widest mb-4">
          {isUnderConstruction ? 'Coming Soon' : 'Error 404'}
        </p>

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed mb-8">
          {isUnderConstruction 
            ? "We are currently building this feature to make your learning experience even more seamless. Check back soon!" 
            : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-semibold text-sm"
          >
            <ArrowLeft size={16} className="mr-2" /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-yellow-400 text-dark-bg font-bold text-sm shadow-[0_4px_15px_rgba(255,215,0,0.2)] hover:scale-[1.02] transition-all"
          >
            <Home size={16} className="mr-2" /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
