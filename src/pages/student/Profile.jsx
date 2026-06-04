import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Award, Book, LogOut, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const avatars = ['🧑‍🎓', '👩‍🎓', '🦸‍♂️', '🦸‍♀️', '🥷', '🧑‍🚀', '🦁', '🦊', '🦉', '🦄'];

const Profile = () => {
  const { user, logout } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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
            className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-5xl border-4 border-dark-bg shadow-xl mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            {selectedAvatar}
          </motion.div>
          <button 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-dark-bg shadow-lg hover:scale-110 transition-transform"
          >
            <ImageIcon size={16} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
        <p className="text-white/60 mb-6">ID: {user?.user_id}</p>

        {showAvatarPicker && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/5 p-4 rounded-xl mb-6 flex flex-wrap justify-center gap-2"
          >
            {avatars.map((av, i) => (
              <button 
                key={i}
                onClick={() => { setSelectedAvatar(av); setShowAvatarPicker(false); }}
                className={`text-2xl p-2 rounded-lg transition-colors ${selectedAvatar === av ? 'bg-gold/30' : 'hover:bg-white/10'}`}
              >
                {av}
              </button>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Class</p>
            <p className="font-semibold text-white mt-1">{user?.class || 'N/A'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Board</p>
            <p className="font-semibold text-white mt-1">{user?.board || 'N/A'}</p>
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
          <span className="text-white/60 text-sm bg-white/5 px-3 py-1 rounded-full">{user?.medium || 'English'}</span>
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
