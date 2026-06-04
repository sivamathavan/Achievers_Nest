import React, { useState } from 'react';
import { Mic, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceReady = ({ onStartListening, classLevel, language, setLanguage, error }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleMicClick = () => {
    // Check if we need to show the permission modal first
    const hasPrompted = localStorage.getItem('achievers_mic_prompted');
    if (!hasPrompted) {
      setShowPermissionModal(true);
    } else {
      onStartListening();
    }
  };

  const handleAllow = () => {
    localStorage.setItem('achievers_mic_prompted', 'true');
    setShowPermissionModal(false);
    onStartListening();
  };

  const renderContent = () => {
    if (classLevel <= 3) {
      // Magic Garden / Fun Theme
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={handleMicClick}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all"
          >
            <Mic size={40} className="text-white drop-shadow-md" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Tell me your question! 🦉
            </h2>
          </div>
        </div>
      );
    } else if (classLevel <= 6) {
      // Adventure Theme
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={handleMicClick}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_4px_0_#991b1b,0_10px_20px_rgba(239,68,68,0.3)] flex items-center justify-center transform hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <Mic size={32} className="text-white" />
          </button>
          <h2 className="text-xl font-black text-orange-400 uppercase tracking-widest">
            Activate Voice Search! ⚡
          </h2>
        </div>
      );
    } else {
      // Sleek Theme
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={handleMicClick}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/20 hover:border-gold hover:bg-gold/10 shadow-lg flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all group"
          >
            <Mic size={32} className="text-white group-hover:text-gold transition-colors" />
          </button>
          <div className="text-center">
            <p className="text-white/60 font-medium">Tap & Speak Your Doubt</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 w-full max-w-sm mx-auto">
      
      {/* Language Toggle */}
      <div className="flex items-center justify-center space-x-3 mb-12 bg-white/5 rounded-full p-1 border border-white/10">
        <button
          onClick={() => setLanguage('en-IN')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            language === 'en-IN' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ta-IN')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            language === 'ta-IN' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
          }`}
        >
          தமிழ்
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-8 flex items-start space-x-3 w-full">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
          <p className="text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {renderContent()}

      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#1A1A24] border border-white/10 p-6 rounded-3xl z-50 shadow-2xl"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mic size={24} className="text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Enable Voice Search</h3>
              <p className="text-white/70 text-sm text-center mb-6 leading-relaxed">
                Achievers Nest needs your microphone to hear your questions. Your voice is processed on your device only. Nothing is recorded.
              </p>
              <div className="flex space-x-3">
                <button onClick={() => setShowPermissionModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors">
                  Skip
                </button>
                <button onClick={handleAllow} className="flex-1 py-3 rounded-xl font-bold bg-gold hover:bg-gold-hover text-dark-bg transition-colors">
                  Allow Mic
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceReady;
