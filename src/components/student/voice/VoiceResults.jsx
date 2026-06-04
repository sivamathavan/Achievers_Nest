import React from 'react';
import { Bookmark, Mic, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceResults = ({ results, transcript, onRetry, isTamil }) => {
  const bestMatch = results[0];
  const otherMatches = results.slice(1);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto py-6 space-y-6">
      
      {/* Search Header */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
        <p className="text-white/40 text-xs font-bold uppercase mb-1">You asked:</p>
        <p className="text-white font-medium italic">"{transcript}"</p>
      </div>

      {/* Best Match Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border-l-4 border-l-gold relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 bg-gold text-dark-bg text-[10px] font-bold px-3 py-1 rounded-bl-lg">
          BEST MATCH
        </div>
        
        <div className="flex justify-between items-start mb-3 mt-2">
          <span className="text-xs font-semibold bg-white/10 text-white/80 px-2 py-1 rounded">
            {bestMatch.subject} • {bestMatch.class}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 leading-tight">
          {isTamil && bestMatch.qTa ? bestMatch.qTa : bestMatch.q}
        </h3>
        
        <p className="text-white/70 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5">
          {isTamil && bestMatch.aTa ? bestMatch.aTa : bestMatch.a}
        </p>

        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-white/10">
          <button className="text-white/40 hover:text-gold flex items-center text-xs font-bold transition-colors">
            <Bookmark size={14} className="mr-1" /> Save
          </button>
          <button className="text-white/40 hover:text-white flex items-center text-xs font-bold transition-colors">
            <MessageCircle size={14} className="mr-1" /> Ask Teacher
          </button>
        </div>
      </motion.div>

      {/* Other Matches */}
      {otherMatches.length > 0 && (
        <div className="space-y-3">
          <p className="text-white/50 text-sm font-medium">Other possible matches:</p>
          {otherMatches.map((res, i) => (
            <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl cursor-pointer transition-colors flex justify-between items-center">
              <p className="text-white/80 text-sm">{isTamil && res.qTa ? res.qTa : res.q}</p>
            </div>
          ))}
        </div>
      )}

      {/* Retry Button */}
      <div className="pt-4 flex justify-center">
        <button 
          onClick={onRetry}
          className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full flex items-center transition-colors shadow-lg"
        >
          <Mic size={18} className="mr-2" /> Ask Another
        </button>
      </div>

    </div>
  );
};

export default VoiceResults;
