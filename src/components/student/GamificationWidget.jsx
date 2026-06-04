import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Award, Zap, Shield, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/** Calculate total XP from real test results in localStorage */
const calcXPFromResults = () => {
  try {
    const raw = localStorage.getItem('achievers_results');
    const results = raw ? JSON.parse(raw) : [];
    // Each correct answer = 10 XP base; bonus for high scores
    let total = 0;
    results.forEach(r => {
      const base = (r.score || 0) * 10;
      const bonus = r.percentage >= 90 ? 50 : r.percentage >= 75 ? 25 : 0;
      total += base + bonus;
    });
    // Add Battle XP
    const battleRaw = localStorage.getItem('achievers_battle_xp');
    if (battleRaw) total += parseInt(battleRaw, 10) || 0;
    return Math.max(0, total);
  } catch { return 1450; }
};

/** Calculate streak: how many consecutive days the user had any activity */
const calcStreak = () => {
  try {
    const raw = localStorage.getItem('achievers_streak');
    if (!raw) return 7; // default
    const data = JSON.parse(raw);
    return data.streak || 7;
  } catch { return 7; }
};

const LEVEL_THRESHOLDS = [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6500, 8000, 10000, 13000];
const getLevel = (xp) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 13);
};

const LEVEL_TITLES = ['Beginner', 'Explorer', 'Seeker', 'Learner', 'Student', 'Scholar', 'Thinker', 'Analyst', 'Expert', 'Master', 'Champion', 'Legend', 'Elite'];

const GamificationWidget = ({ user }) => {
  const navigate = useNavigate();
  const [xp, setXp] = useState(calcXPFromResults);
  const [streak, setStreak] = useState(calcStreak);

  // Re-sync whenever test results or tasks change
  useEffect(() => {
    const sync = () => setXp(calcXPFromResults());
    window.addEventListener('achievers_activities_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('achievers_activities_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const level = getLevel(xp);
  const levelTitle = LEVEL_TITLES[level - 1] || 'Scholar';
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000;
  const progress = Math.min(100, ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  useEffect(() => {
    if (streak > 0 && streak % 7 === 0) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.3 },
          colors: ['#FFD700', '#FF6B6B', '#00FF88']
        });
      }, 500);
    }
  }, [streak]);

  const badges = useMemo(() => {
    const earned = [];
    if (streak >= 7) earned.push({ id: 1, icon: '🔥', name: '7-Day Streak', color: 'from-orange-500 to-red-500' });
    if (xp >= 2000) earned.push({ id: 2, icon: '🏆', name: 'Batch Topper', color: 'from-yellow-400 to-gold' });
    if (level >= 8) earned.push({ id: 3, icon: '💯', name: 'Perfect Score', color: 'from-emerald-400 to-green-500' });
    if (xp >= 500) earned.push({ id: 4, icon: '⚡', name: 'Speed Solver', color: 'from-blue-400 to-indigo-500' });

    // Always show at least 4 badges (locked ones if not earned)
    const locked = [
      { id: 5, icon: '🌟', name: 'Star Scholar', color: 'from-white/20 to-white/10', locked: true },
      { id: 6, icon: '🧠', name: 'Brain Battle', color: 'from-white/20 to-white/10', locked: true },
      { id: 7, icon: '📚', name: 'Bookworm', color: 'from-white/20 to-white/10', locked: true },
      { id: 8, icon: '🎯', name: 'Sharpshooter', color: 'from-white/20 to-white/10', locked: true },
    ];
    const needed = 4 - earned.length;
    return [...earned, ...locked.slice(0, needed)];
  }, [xp, streak, level]);

  return (
    <div className="space-y-4 mb-6">
      {/* XP & Streak Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-white/5 to-gold/5 border-gold/20 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[10px] uppercase text-white/50 font-bold tracking-wider">
                Level {level} — {levelTitle}
              </p>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-white">{xp.toLocaleString()}</span>
                <span className="text-xs text-gold font-bold">XP</span>
              </div>
            </div>
            <span className="text-xs text-white/50">{nextThreshold.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-gold rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto md:border-l border-white/10 md:pl-6">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-500 text-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Flame size={24} className="fill-orange-500" />
            </motion.div>
          </div>
          <div>
            <div className="text-lg font-bold text-white flex items-center">
              {streak} Day Streak
            </div>
            <p className="text-[10px] text-white/50 flex items-center">
              <Shield size={10} className="mr-1 text-emerald-400" /> 1 Freeze Available
            </p>
          </div>
        </div>
      </div>

      {/* Badges Shelf */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase text-white/50 font-bold tracking-wider flex items-center">
            <Award size={14} className="mr-1" /> Trophy Cabinet
          </h3>
          <button
            onClick={() => navigate('/student/leaderboard')}
            className="text-[10px] text-gold flex items-center hover:underline"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} p-[1px] mb-2 relative ${badge.locked ? 'grayscale opacity-40' : ''}`}>
                <div className="absolute inset-0 bg-black/20 rounded-2xl" />
                <div className="w-full h-full bg-[#1A1A24] rounded-2xl flex items-center justify-center text-2xl relative z-10 group-hover:scale-110 transition-transform">
                  {badge.locked ? '🔒' : badge.icon}
                </div>
              </div>
              <span className="text-[10px] font-bold text-white/70 max-w-[60px] text-center leading-tight">
                {badge.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
