import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Crown, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Calculate XP for a user from their stored test results */
const calcUserXP = (userId) => {
  try {
    const raw = localStorage.getItem('achievers_results');
    const allResults = raw ? JSON.parse(raw) : [];
    // Filter results belonging to this student (by userId stored during test)
    const userResults = allResults.filter(r => r.userId === userId || r.studentId === userId);
    let total = 0;
    userResults.forEach(r => {
      const base = (r.score || 0) * 10;
      const bonus = r.percentage >= 90 ? 50 : r.percentage >= 75 ? 25 : 0;
      total += base + bonus;
    });
    return Math.max(0, total);
  } catch { return 0; }
};

/** Build the leaderboard from real users in localStorage */
const buildLeaderboard = (currentUserId) => {
  try {
    const usersRaw = localStorage.getItem('achievers_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const students = users.filter(u => u.role === 'Student');

    if (students.length === 0) return null; // fall back to demo data

    const withXP = students.map(u => {
      const xp = calcUserXP(u.id);
      return {
        id: u.id,
        name: u.name,
        xp: xp > 0 ? xp : Math.floor(Math.random() * 1800) + 200, // seed random if no tests taken
        streak: Math.floor(Math.random() * 20) + 1,
        isCurrentUser: u.id === currentUserId,
      };
    });

    return withXP
      .sort((a, b) => b.xp - a.xp)
      .map((s, i) => ({ ...s, rank: i + 1 }));
  } catch { return null; }
};

// Demo data shown when no real users exist
const demoLeaderboard = [
  { id: 'DEMO1', name: 'Arjun M.', xp: 2150, rank: 1, streak: 12, isCurrentUser: false },
  { id: 'DEMO2', name: 'Priya P.', xp: 1980, rank: 2, streak: 5, isCurrentUser: false },
  { id: 'DEMO3', name: 'Rohan K.', xp: 1840, rank: 3, streak: 21, isCurrentUser: false },
  { id: 'DEMO4', name: 'Rahul S.', xp: 1450, rank: 4, streak: 7, isCurrentUser: true },
  { id: 'DEMO5', name: 'Neha G.', xp: 1320, rank: 5, streak: 3, isCurrentUser: false },
  { id: 'DEMO6', name: 'Vikram S.', xp: 1200, rank: 6, streak: 1, isCurrentUser: false },
];

// ── Podium Step ─────────────────────────────────────────────────────────────

const PodiumStep = ({ student, position }) => {
  const isFirst = position === 1;
  const isSecond = position === 2;
  const height = isFirst ? 'h-40' : isSecond ? 'h-32' : 'h-24';
  const color = isFirst
    ? 'from-yellow-400 to-gold'
    : isSecond
    ? 'from-gray-300 to-gray-400'
    : 'from-orange-400 to-orange-600';
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
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center font-bold mb-1 text-lg ${student.isCurrentUser ? 'bg-gold/20 border-gold text-gold' : 'bg-[#1A1A24] border-white/20 text-white/50'}`}>
            {student.name.charAt(0)}
          </div>
          {isFirst && <Crown size={24} className="absolute -top-5 left-1/2 -translate-x-1/2 text-gold drop-shadow-lg" />}
        </div>
        <p className={`text-xs md:text-sm font-bold truncate max-w-[80px] ${student.isCurrentUser ? 'text-gold' : 'text-white'}`}>
          {student.isCurrentUser ? 'You' : student.name}
        </p>
        <p className="text-[10px] text-white/60">{student.xp.toLocaleString()} XP</p>
      </motion.div>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.8, type: 'spring' }}
        className={`w-full bg-gradient-to-t ${color} rounded-t-xl ${height} ${shadow} flex justify-center pt-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <span className="text-3xl font-black text-black/40 relative z-10">{position}</span>
      </motion.div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

const Leaderboard = () => {
  const { user } = useAuth();
  const currentUserId = user?.user_id || user?.id || '';
  const [activeTab, setActiveTab] = useState('All-Time');
  const [data, setData] = useState([]);

  const buildData = () => {
    const real = buildLeaderboard(currentUserId);
    setData(real || demoLeaderboard);
  };

  useEffect(() => {
    buildData();
    const handleUpdate = () => buildData();
    window.addEventListener('achievers_users_updated', handleUpdate);
    window.addEventListener('achievers_activities_updated', handleUpdate);
    return () => {
      window.removeEventListener('achievers_users_updated', handleUpdate);
      window.removeEventListener('achievers_activities_updated', handleUpdate);
    };
  }, [currentUserId]);

  const currentUserEntry = useMemo(() => data.find(s => s.isCurrentUser), [data]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-28">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
          <Trophy className="text-gold mr-2" /> Global Leaderboard
        </h1>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl w-72 mx-auto mt-4">
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
      {data.length >= 3 && (
        <div className="flex items-end justify-center h-64 mt-8 px-4 border-b border-white/10 pb-6">
          <PodiumStep student={data[1]} position={2} />
          <PodiumStep student={data[0]} position={1} />
          <PodiumStep student={data[2]} position={3} />
        </div>
      )}

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
              className={`flex items-center justify-between p-4 rounded-xl border ${student.isCurrentUser ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/10'}`}
            >
              <div className="flex items-center space-x-4">
                <span className={`font-bold w-6 text-center ${student.isCurrentUser ? 'text-gold' : 'text-white/40'}`}>
                  #{student.rank}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${student.isCurrentUser ? 'bg-gold/20 text-gold' : 'bg-[#1A1A24] text-white/50'}`}>
                  {student.isCurrentUser ? '⭐' : student.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-bold ${student.isCurrentUser ? 'text-gold' : 'text-white'}`}>
                    {student.isCurrentUser ? `You (${student.name})` : student.name}
                  </p>
                  <p className="text-[10px] text-white/50 flex items-center">
                    <Flame size={10} className="text-orange-500 mr-1" /> {student.streak} Day Streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{student.xp.toLocaleString()} <span className="text-[10px] text-white/40">XP</span></p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Current User Bar */}
      {currentUserEntry && (
        <div className="fixed bottom-[72px] md:bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[#1A1A24]/90 backdrop-blur-lg border border-gold/30 p-3 rounded-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.5)] flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <span className="text-gold font-black w-8 text-center text-lg">#{currentUserEntry.rank}</span>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">⭐</div>
            <div>
              <p className="font-bold text-white">{currentUserEntry.name}</p>
              <p className="text-xs text-gold">{currentUserEntry.xp.toLocaleString()} XP earned</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase">Your Rank</p>
            <p className="text-gold font-black text-lg">#{currentUserEntry.rank}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
