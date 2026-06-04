import React from 'react';
import { getGeneColor } from '../../../utils/dnaDataGenerator';
import { Sprout, Leaf, Flower2, Cloud, Sun } from 'lucide-react';

const MagicGarden = ({ data, onGeneClick }) => {
  return (
    <div className="w-full max-w-md mx-auto relative px-4 py-8 bg-gradient-to-b from-[#1a237e]/20 to-[#0A0A0F] rounded-t-3xl overflow-hidden min-h-[600px]">
      
      {/* Decorative Sky */}
      <div className="absolute top-4 right-8 opacity-50 animate-pulse">
        <Sun size={48} className="text-yellow-400" />
      </div>
      <div className="absolute top-12 left-4 opacity-30 animate-bounce" style={{ animationDuration: '4s' }}>
        <Cloud size={32} className="text-white" />
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-20 relative z-10">
        {data.map((chapter, idx) => {
          const colorName = getGeneColor(chapter.score_percentage, chapter.attempts);
          
          let IconComponent = Flower2;
          let iconColor = '';
          let bgColor = '';
          let animation = '';

          if (colorName === 'red') {
            IconComponent = Sprout;
            iconColor = 'text-red-400';
            bgColor = 'bg-red-500/20';
            animation = 'animate-pulse';
          } else if (colorName === 'yellow') {
            IconComponent = Leaf;
            iconColor = 'text-yellow-400';
            bgColor = 'bg-yellow-500/20';
          } else if (colorName === 'green') {
            IconComponent = Flower2;
            iconColor = 'text-pink-400'; // Make flowers pink/colorful
            bgColor = 'bg-pink-500/20';
            animation = 'animate-bounce';
          } else {
            IconComponent = Sprout;
            iconColor = 'text-blue-400';
            bgColor = 'bg-blue-500/20';
          }

          return (
            <div 
              key={`garden-node-${idx}`}
              className="flex flex-col items-center cursor-pointer group w-24"
              onClick={() => onGeneClick(chapter)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-125 ${bgColor} ${animation}`} style={colorName === 'green' ? { animationDuration: '3s' } : {}}>
                <IconComponent className={iconColor} size={32} />
              </div>
              
              {/* Soil / Ground */}
              <div className="w-8 h-2 bg-amber-900/50 rounded-full mt-1 blur-[1px]"></div>
              
              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-tight">
                  {chapter.chapter_name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicGarden;
