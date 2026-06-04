import React from 'react';
import { Mic, Edit3, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceNoResults = ({ transcript, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full max-w-sm mx-auto">
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl mb-6"
      >
        😕
      </motion.div>

      <h2 className="text-xl font-bold text-white mb-2 text-center">No answer found</h2>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-8 text-center">
        <p className="text-white/40 text-xs uppercase mb-1">For your question:</p>
        <p className="text-white italic">"{transcript}"</p>
      </div>

      <p className="text-white/60 mb-6 text-sm">What would you like to do?</p>

      <div className="space-y-3 w-full">
        <button 
          onClick={onRetry}
          className="w-full bg-gold text-dark-bg font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors hover:bg-gold-hover"
        >
          <Mic size={18} className="mr-2" /> Try Again
        </button>
        
        <button className="w-full bg-white/10 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors hover:bg-white/20">
          <Edit3 size={18} className="mr-2" /> Edit Text & Search
        </button>
        
        <button className="w-full bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors hover:bg-[#00FF88]/30">
          <Send size={18} className="mr-2" /> Send to Teacher
        </button>
      </div>
      
      <p className="text-white/40 text-xs mt-6 flex items-center">
        Teacher will answer within 24 hours ⏱️
      </p>

    </div>
  );
};

export default VoiceNoResults;
