import React from 'react';
import { motion } from 'framer-motion';
import { Map, Shield, Sword, Navigation, Trophy, Clock } from 'lucide-react';

const AdventureZone = ({ user }) => {
  return (
    <div className="space-y-6 pb-20">
      
      {/* XP Header */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-400">
            <span className="text-2xl">🧙‍♂️</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-wide">Lvl 12 Explorer</h1>
            <p className="text-purple-300 text-xs font-semibold">{user?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gold font-bold">2,450 XP</p>
          <div className="w-24 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1 }}
              className="h-full bg-gold"
            />
          </div>
        </div>
      </div>

      {/* Motivational Scroll */}
      <div className="bg-amber-900/40 rounded-xl p-5 border border-amber-500/30 shadow-inner relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <p className="text-center font-serif italic text-amber-100 text-lg">"Every great quest begins with a single step."</p>
        <p className="text-center font-serif text-amber-200/70 text-sm mt-1">"ஒவ்வொரு பெரிய தேடலும் ஒரு சிறிய அடியிலிருந்து தொடங்குகிறது."</p>
      </div>

      {/* Quick Quests (Actions) */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Sword className="text-blue-400 mb-2" size={28} />
          <span className="text-blue-100 font-medium">Daily Trial (Test)</span>
        </button>
        <button className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Map className="text-emerald-400 mb-2" size={28} />
          <span className="text-emerald-100 font-medium">Seek Wisdom</span>
        </button>
        <button className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Navigation className="text-rose-400 mb-2" size={28} />
          <span className="text-rose-100 font-medium">Quest Map</span>
        </button>
        <button className="bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Trophy className="text-gold mb-2" size={28} />
          <span className="text-gold font-medium">Trophy Room</span>
        </button>
      </div>

      {/* Today's Schedule - "Current Missions" */}
      <div className="glass-card p-5 border-l-4 border-l-purple-500">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center">
          <Shield className="mr-2 text-purple-400" size={20} />
          Active Missions
        </h2>
        
        <div className="space-y-3">
          <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/5">
            <div>
              <p className="font-semibold text-white">Chapter 4: The Fractions Enigma</p>
              <p className="text-xs text-white/50">Mathematics Guild</p>
            </div>
            <div className="flex items-center text-purple-300 text-sm font-medium">
              <Clock size={14} className="mr-1" /> 5:00 PM
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Test Alert */}
      <motion.div 
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between"
      >
        <div>
          <h3 className="font-bold text-red-400">Boss Battle Approaching!</h3>
          <p className="text-sm text-red-200/70">Science Unit Test in 2 Days</p>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-500/20">
          Prepare
        </button>
      </motion.div>

    </div>
  );
};

export default AdventureZone;
