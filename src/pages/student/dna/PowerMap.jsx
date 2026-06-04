import React from 'react';
import { getGeneColor } from '../../../utils/dnaDataGenerator';
import { Map, Gem } from 'lucide-react';

const PowerMap = ({ data, onGeneClick }) => {
  return (
    <div className="w-full max-w-md mx-auto relative px-4 py-8">
      {/* Curved path SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <path 
          d="M 50 50 Q 200 150 150 300 T 250 500 T 100 700" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="4" 
          strokeDasharray="10 10" 
        />
      </svg>
      
      <div className="flex flex-col space-y-12 relative z-10">
        {data.map((chapter, idx) => {
          const colorName = getGeneColor(chapter.score_percentage, chapter.attempts);
          
          let gemColor = '';
          let glowColor = '';
          if (colorName === 'red') {
            gemColor = 'text-red-500'; glowColor = 'shadow-[0_0_20px_rgba(239,68,68,0.6)]';
          } else if (colorName === 'yellow') {
            gemColor = 'text-yellow-400'; glowColor = 'shadow-[0_0_20px_rgba(250,204,21,0.6)]';
          } else if (colorName === 'green') {
            gemColor = 'text-emerald-400'; glowColor = 'shadow-[0_0_20px_rgba(52,211,153,0.6)]';
          } else {
            gemColor = 'text-blue-400'; glowColor = 'shadow-[0_0_20px_rgba(96,165,250,0.6)]';
          }

          // Alternate left and right alignment for path feel
          const alignment = idx % 2 === 0 ? 'items-start ml-8' : 'items-end mr-8 text-right';
          const flexDirection = idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse';
          
          return (
            <div 
              key={`power-node-${idx}`}
              className={`flex flex-col ${alignment} cursor-pointer group`}
              onClick={() => onGeneClick(chapter)}
            >
              <div className={`flex items-center ${flexDirection}`}>
                <div className={`w-12 h-12 bg-[#1A1A24] rounded-xl border border-white/10 flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-all duration-300 ${glowColor} ${colorName === 'red' ? 'animate-bounce' : ''}`}>
                  <div className="transform -rotate-45 group-hover:rotate-0 transition-all duration-300">
                    <Gem className={gemColor} size={24} />
                  </div>
                </div>
                
                <div className={`mt-2 ${idx % 2 === 0 ? 'ml-4' : 'mr-4'}`}>
                  <p className="text-xs font-bold text-white group-hover:text-gold transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 inline-block">
                    {chapter.chapter_name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PowerMap;
