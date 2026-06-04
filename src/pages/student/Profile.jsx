import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Award, Book, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuth();

  // Load the dynamic user record from local storage to get the avatar set by the admin
  const liveUser = useMemo(() => {
    try {
      const saved = localStorage.getItem('achievers_users');
      if (saved) {
        const list = JSON.parse(saved);
        return list.find(u => u.id === user?.user_id) || user;
      }
    } catch {}
    return user;
  }, [user]);

  const selectedAvatar = liveUser?.avatar || localStorage.getItem(`avatar_${user?.user_id}`) || '🧑‍🎓';

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button className="text-white/50 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </header>

      {/* Main Profile Card */}
      <div className="glass-card p-6 text-center relative">
        <div className="relative inline-block mb-4">
          <motion.div 
            className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-5xl border-4 border-dark-bg shadow-xl mx-auto overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {selectedAvatar.startsWith('http') ? (
              <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              selectedAvatar
            )}
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-white">{liveUser?.name || user?.name}</h2>
        <p className="text-white/60 mb-6">ID: {liveUser?.id || user?.user_id}</p>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Class</p>
            <p className="font-semibold text-white mt-1">{liveUser?.class || user?.class || 'N/A'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Board</p>
            <p className="font-semibold text-white mt-1">{liveUser?.board || user?.board || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Achievements section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Award className="mr-2 text-gold" size={20} />
          Achievements
        </h3>
        <div className="glass-card p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl">
            🏆
          </div>
          <div>
            <h4 className="font-medium text-white">Fast Learner</h4>
            <p className="text-xs text-white/60">Completed 5 chapters this week</p>
          </div>
        </div>
      </div>

      {/* Settings / Preferences */}
      <div className="glass-card p-2 divide-y divide-white/10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Book className="text-white/50" size={20} />
            <span className="text-white">Medium</span>
          </div>
          <span className="text-white/60 text-sm bg-white/5 px-3 py-1 rounded-full">{liveUser?.medium || user?.medium || 'English'}</span>
        </div>
        
        <button 
          onClick={logout}
          className="w-full p-4 flex items-center space-x-3 text-red-400 hover:bg-red-400/10 transition-colors rounded-b-xl"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
