import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react';

const mockLeaderboard = [
  { id: 'STU004', name: 'Arjun M.', xp: 2150, rank: 1, streak: 12 },
  { id: 'STU002', name: 'Priya P.', xp: 1980, rank: 2, streak: 5 },
  { id: 'STU011', name: 'Rohan K.', xp: 1840, rank: 3, streak: 21 },
  { id: 'STU001', name: 'Rahul Sharma', xp: 1450, rank: 4, streak: 7 }, // Current User
  { id: 'STU005', name: 'Neha G.', xp: 1320, rank: 5, streak: 3 },
  { id: 'STU009', name: 'Vikram S.', xp: 1200, rank: 6, streak: 1 },
];

const PodiumStep = ({ student, position }) => {
  const isFirst = position === 1;
  const isSecond = position === 2;
  
  const height = isFirst ? 'h-40' : isSecond ? 'h-32' : 'h-24';
  const color = isFirst ? 'from-yellow-400 to-gold' : isSecond ? 'from-gray-300 to-gray-400' : 'from-orange-400 to-orange-600';
  const shadow = isFirst ? 'shadow-[0_0_30px_rgba(255,215,0,0.4)]' : '';

  if (!student) return null;

  return (
    <div className="flex flex-col items-center justify-end z-10 w-1/3 px-1">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.2 }}
        className="flex flex-col items-center mb-2"
      >
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1A1A24] border-2 border-white/20 flex items-center justify-center text-white/50 font-bold mb-1">
            {student.name.charAt(0)}
          </div>
          {isFirst && <Crown size={24} className="absolute -top-5 left-1/2 -translate-x-1/2 text-gold drop-shadow-lg" />}
        </div>
        <p className="text-xs md:text-sm font-bold text-white truncate max-w-[80px]">{student.name}</p>
        <p className="text-[10px] text-white/60">{student.xp} XP</p>
      </motion.div>

      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.8, type: 'spring' }}
        className={`w-full bg-gradient-to-t ${color} rounded-t-xl ${height} ${shadow} flex justify-center pt-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <span className="text-3xl font-black text-black/40 relative z-10">{position}</span>
      </motion.div>
    </div>
  );
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Weekly');
  const [data, setData] = useState(mockLeaderboard);
  const currentUserRank = mockLeaderboard.find(s => s.id === 'STU001');

  // Simulate real-time rank shifting
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        // Randomly swap some ranks for simulation
        if (Math.random() > 0.7) {
          const idx = Math.floor(Math.random() * (newData.length - 3)) + 3; // swap 4th, 5th, 6th
          const temp = newData[idx];
          newData[idx] = newData[idx - 1];
          newData[idx - 1] = temp;
          // fix ranks
          newData.forEach((d, i) => d.rank = i + 1);
        }
        return [...newData];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
          <Trophy className="text-gold mr-2" /> Global Leaderboard
        </h1>
        
        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl w-64 mx-auto mt-4">
          {['Weekly', 'Monthly', 'All-Time'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Podium */}
      <div className="flex items-end justify-center h-64 mt-8 px-4 border-b border-white/10 pb-6">
        <PodiumStep student={data[1]} position={2} />
        <PodiumStep student={data[0]} position={1} />
        <PodiumStep student={data[2]} position={3} />
      </div>

      {/* List */}
      <div className="space-y-2 px-2">
        <AnimatePresence>
          {data.slice(3).map((student) => (
            <motion.div 
              key={student.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-4 rounded-xl border ${student.id === 'STU001' ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/10'}`}
            >
              <div className="flex items-center space-x-4">
                <span className={`font-bold w-6 text-center ${student.id === 'STU001' ? 'text-gold' : 'text-white/40'}`}>
                  #{student.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#1A1A24] flex items-center justify-center text-white/50 text-sm font-bold shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-bold ${student.id === 'STU001' ? 'text-gold' : 'text-white'}`}>{student.name}</p>
                  <p className="text-[10px] text-white/50 flex items-center">
                    <Flame size={10} className="text-orange-500 mr-1" /> {student.streak} Day Streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{student.xp} <span className="text-[10px] text-white/40">XP</span></p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Current User Rank if not visible (Mocking for now as visible) */}
      <div className="fixed bottom-[72px] md:bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[#1A1A24]/90 backdrop-blur-lg border border-gold/30 p-3 rounded-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.5)] flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <span className="text-gold font-black w-8 text-center text-lg">#{currentUserRank?.rank}</span>
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">You</div>
          <div>
            <p className="font-bold text-white">{currentUserRank?.name}</p>
            <p className="text-xs text-gold">{currentUserRank?.xp} XP to Rank #{currentUserRank?.rank - 1}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
