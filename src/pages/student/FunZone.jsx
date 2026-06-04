import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FunZone = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20 relative overflow-hidden rounded-2xl p-4 bg-gradient-to-b from-[#4ECDC4]/20 to-transparent">
      
      {/* Floating Stars Background */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-4 right-4 text-4xl"
      >
        ⭐
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute top-20 left-4 text-3xl opacity-50"
      >
        🚀
      </motion.div>

      <header className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-[#FFE66D] rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white/20">
          🦉
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Hi, {user?.name.split(' ')[0]}!</h1>
          <p className="text-[#FFE66D] font-bold text-lg">Let's have fun learning!</p>
        </div>
      </header>
      
      {/* Motivational Quote */}
      <div className="bg-[#FF6B6B] rounded-2xl p-5 shadow-lg border-2 border-white/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="font-bold text-white text-xl mb-1 text-center">"You are a superstar!"</p>
          <p className="font-bold text-white/90 text-md text-center">"நீ ஒரு நட்சத்திரம்!"</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/tests')}
          className="bg-[#4ECDC4] rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center border-4 border-white/10 cursor-pointer outline-none"
        >
          <Sparkles className="text-white mb-2" size={40} />
          <span className="text-white font-black text-xl">Quizzes</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/doubts')}
          className="bg-[#FFE66D] rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center border-4 border-white/10 cursor-pointer outline-none"
        >
          <HelpCircle className="text-[#0A0A0F] mb-2" size={40} />
          <span className="text-[#0A0A0F] font-black text-xl">Ask Owl</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/planner')}
          className="bg-[#FF6B6B] rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center border-4 border-white/10 cursor-pointer outline-none"
        >
          <Calendar className="text-white mb-2" size={40} />
          <span className="text-white font-black text-xl">My Day</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/leaderboard')}
          className="bg-[#9B5DE5] rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center border-4 border-white/10 cursor-pointer outline-none"
        >
          <Star className="text-white mb-2" size={40} />
          <span className="text-white font-black text-xl">Badges</span>
        </motion.button>
      </div>

      {/* Today's Schedule Card */}
      <div className="bg-white/10 rounded-3xl p-6 border-4 border-white/5 backdrop-blur-md">
        <h2 className="text-xl font-black text-[#FFE66D] mb-4 flex items-center">
          <Calendar className="mr-2" size={24} /> 
          Today's Magic Class
        </h2>
        <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-white text-lg">Math Magic</p>
            <p className="text-white/70 font-medium">with Teacher Ali</p>
          </div>
          <div className="bg-[#FF6B6B] text-white px-4 py-2 rounded-xl font-black text-lg">
            4:00 PM
          </div>
        </div>
      </div>

    </div>
  );
};

export default FunZone;
