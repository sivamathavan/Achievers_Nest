import React from 'react';
import { getGeneColor, getGeneColorHex } from '../../../utils/dnaDataGenerator';
import { Cpu } from 'lucide-react';

const BrainMatrix = ({ data, onGeneClick }) => {
  return (
    <div className="w-full max-w-md mx-auto relative px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      <div className="grid grid-cols-3 gap-6 relative z-10 py-10">
        {data.map((chapter, idx) => {
          const colorName = getGeneColor(chapter.score_percentage, chapter.attempts);
          const colorHex = getGeneColorHex(colorName);
          const isWeak = colorName === 'red';
          
          return (
            <div 
              key={`matrix-node-${idx}`}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onGeneClick(chapter)}
            >
              <div 
                className={`w-14 h-14 border-2 flex items-center justify-center relative overflow-hidden transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 ${isWeak ? 'animate-pulse' : ''}`}
                style={{
                  borderColor: colorHex,
                  backgroundColor: `${colorHex}20`,
                  boxShadow: `0 0 15px ${colorHex}40`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              >
                {/* Circuit lines */}
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(45deg, transparent 48%, ${colorHex} 49%, ${colorHex} 51%, transparent 52%)` }} />
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(-45deg, transparent 48%, ${colorHex} 49%, ${colorHex} 51%, transparent 52%)` }} />
                
                <span className="text-[10px] font-mono font-bold z-10" style={{ color: colorHex }}>
                  {chapter.score_percentage}%
                </span>
              </div>
              
              <div className="mt-2 text-center w-24">
                <p className="text-[9px] uppercase tracking-widest text-white/50 truncate font-mono">{chapter.chapter_id}</p>
                <p className="text-[10px] font-bold text-white truncate group-hover:text-[#00FF88] transition-colors">{chapter.chapter_name}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Decorative center glowing orb */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00FF88] opacity-5 blur-[100px] pointer-events-none z-0" />
    </div>
  );
};

export default BrainMatrix;
