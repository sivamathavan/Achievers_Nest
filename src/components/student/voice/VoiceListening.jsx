import React from 'react';
import { Square, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceListening = ({ transcript, onStopListening, classLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full max-w-sm mx-auto">
      
      {/* Sound wave visualization */}
      <div className="relative mb-8 flex justify-center items-center h-32 w-32">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute w-24 h-24 bg-red-500/20 rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
          className="absolute w-20 h-20 bg-red-500/40 rounded-full"
        />
        <div className="absolute w-16 h-16 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center z-10">
          <div className="flex space-x-1 items-end h-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ['4px', `${Math.random() * 20 + 8}px`, '4px'] }}
                transition={{ repeat: Infinity, duration: 0.4 + (i * 0.1), ease: "easeInOut" }}
                className="w-1 bg-white rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-red-400 font-bold mb-8 animate-pulse flex items-center">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
        Listening... Speak now
      </p>

      {/* Transcript Box */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 min-h-[120px] flex flex-col relative overflow-hidden">
        <p className="text-white/40 text-xs font-bold uppercase mb-2">🎙️ You said:</p>
        <p className="text-white text-lg leading-relaxed flex-1 italic">
          {transcript ? `"${transcript}"` : <span className="text-white/30">...</span>}
        </p>
      </div>

      <div className="flex space-x-4 w-full">
        <button 
          onClick={onStopListening}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors"
        >
          <Square size={18} className="mr-2 fill-current" /> Stop
        </button>
      </div>
    </div>
  );
};

export default VoiceListening;
