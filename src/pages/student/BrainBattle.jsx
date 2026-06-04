import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, User, Trophy, ShieldAlert, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const questions = [
  { q: "What is the SI unit of Electric Current?", options: ["Volt", "Ampere", "Coulomb", "Ohm"], ans: 1 },
  { q: "Which of the following is a scalar quantity?", options: ["Force", "Velocity", "Mass", "Acceleration"], ans: 2 },
  { q: "The value of g at the center of the earth is?", options: ["Zero", "Maximum", "Same as surface", "Negative"], ans: 0 },
];

const BrainBattle = () => {
  const [gameState, setGameState] = useState('matchmaking'); // matchmaking | countdown | active | result
  const [countdown, setCountdown] = useState(3);
  const [currentQ, setCurrentQ] = useState(0);
  
  // Game scores
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const startMatch = () => {
    setGameState('countdown');
  };

  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('active');
      }
    }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'active') {
      // Simulate opponent answering randomly
      const timer = setTimeout(() => {
        if (Math.random() > 0.3) setOpponentScore(s => s + 10);
      }, 2500 + Math.random() * 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentQ]);

  const handleAnswer = (idx) => {
    if (idx === questions[currentQ].ans) {
      setPlayerScore(s => s + 10);
    }
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setTimeout(() => {
        setGameState('result');
        if (playerScore >= opponentScore) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh] items-center justify-center p-4">
      
      {/* MATCHMAKING */}
      {gameState === 'matchmaking' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-md">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Swords size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Brain Battle</h1>
          <p className="text-white/60 mb-8">Challenge a batchmate to a 3-question rapid fire. Winner takes the XP.</p>
          
          <button onClick={startMatch} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105">
            Find Opponent
          </button>
        </motion.div>
      )}

      {/* COUNTDOWN */}
      {gameState === 'countdown' && (
        <motion.div 
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        >
          {countdown === 0 ? 'GO!' : countdown}
        </motion.div>
      )}

      {/* ACTIVE BATTLE */}
      {gameState === 'active' && (
        <div className="w-full max-w-2xl flex flex-col h-full animate-in fade-in">
          
          {/* Top Score Bar */}
          <div className="flex justify-between items-center bg-[#1A1A24] p-4 rounded-2xl border border-white/10 mb-8">
            <div className="flex items-center space-x-3 w-1/3">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">You</div>
              <div>
                <p className="text-white font-bold text-lg">{playerScore}</p>
                <div className="w-full h-1 bg-white/10 mt-1"><div className="h-full bg-gold transition-all" style={{width: `${(playerScore/30)*100}%`}}></div></div>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 shrink-0">
              <Swords size={20} />
            </div>

            <div className="flex items-center space-x-3 w-1/3 justify-end text-right">
              <div>
                <p className="text-white font-bold text-lg">{opponentScore}</p>
                <div className="w-full h-1 bg-white/10 mt-1 flex justify-end"><div className="h-full bg-red-500 transition-all" style={{width: `${(opponentScore/30)*100}%`}}></div></div>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/50 font-bold">Opp</div>
            </div>
          </div>

          {/* Question Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-gold font-bold mb-4">Question {currentQ + 1} of 3</span>
            <h2 className="text-2xl font-bold text-white text-center mb-8">{questions[currentQ].q}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {questions[currentQ].options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium p-4 rounded-xl transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {gameState === 'result' && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md text-center bg-[#1A1A24] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-gold/20">
            <Trophy size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {playerScore > opponentScore ? 'VICTORY!' : playerScore === opponentScore ? 'DRAW' : 'DEFEAT'}
          </h2>
          <p className="text-white/60 mb-6">You scored {playerScore} points against your opponent's {opponentScore}.</p>
          
          <div className="flex items-center justify-center space-x-2 text-xl font-bold text-[#00FF88] mb-8">
            +{playerScore > opponentScore ? 50 : 10} XP
          </div>

          <button onClick={() => window.location.href='/student'} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-colors">
            Return to Dashboard
          </button>
        </motion.div>
      )}

    </div>
  );
};

export default BrainBattle;
