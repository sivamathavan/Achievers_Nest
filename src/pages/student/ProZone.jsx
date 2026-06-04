import React from 'react';
import { Flame, Target, Zap, Clock, BookOpen, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProZone = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 pb-20">
      
      {/* Header with Streak */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Good Morning,</h1>
          <p className="text-[#00FF88] text-xl font-mono">{user?.name}</p>
        </div>
        <div className="flex items-center bg-[#00FF88]/10 border border-[#00FF88]/30 px-3 py-1.5 rounded-lg">
          <Flame className="text-[#00FF88] mr-2" size={18} />
          <span className="text-[#00FF88] font-mono font-bold">14 Day Streak</span>
        </div>
      </header>

      {/* Neon Quote */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#00FF88] blur-xl opacity-10 rounded-xl"></div>
        <div className="bg-dark-bg border border-[#00FF88]/20 rounded-xl p-4 relative z-10 text-center">
          <p className="text-white/80 font-mono text-sm tracking-wide uppercase">"Consistency is the weapon of the Pro."</p>
          <p className="text-white/40 text-xs mt-1">"தொடர்ச்சியே ஒரு வெற்றியாளரின் ஆயுதம்."</p>
        </div>
      </div>

      {/* Brain Battle & Focus Timer */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/student/battle')} className="bg-[#00FF88] hover:bg-[#00FF88]/90 text-dark-bg rounded-xl p-4 flex flex-col items-center justify-center transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] cursor-pointer">
          <BrainCircuit size={28} className="mb-2" />
          <span className="font-bold uppercase tracking-wider text-sm">Brain Battle</span>
          <span className="text-xs opacity-70">Live Now</span>
        </button>
        <button className="bg-dark-bg border border-[#00FF88]/40 hover:bg-[#00FF88]/10 text-[#00FF88] rounded-xl p-4 flex flex-col items-center justify-center transition-all">
          <Clock size={28} className="mb-2" />
          <span className="font-bold uppercase tracking-wider text-sm">Focus Mode</span>
          <span className="text-xs opacity-70 text-white/50">25:00</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <p className="text-white/40 text-xs uppercase mb-1">Rank</p>
          <p className="text-white font-mono text-xl">#42</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <p className="text-white/40 text-xs uppercase mb-1">Accuracy</p>
          <p className="text-[#00FF88] font-mono text-xl">88%</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <p className="text-white/40 text-xs uppercase mb-1">Tests</p>
          <p className="text-white font-mono text-xl">12</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/student/tests')} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-center space-x-2 text-white hover:bg-white/10 transition-colors cursor-pointer">
          <Zap size={16} className="text-[#00FF88]" />
          <span className="text-sm font-medium">Quick Test</span>
        </button>
        <button onClick={() => navigate('/student/doubts')} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-center space-x-2 text-white hover:bg-white/10 transition-colors cursor-pointer">
          <BookOpen size={16} className="text-[#00FF88]" />
          <span className="text-sm font-medium">Solve Doubts</span>
        </button>
      </div>

      {/* Schedule */}
      <div className="glass-card p-5 border-l-2 border-[#00FF88]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Today's Schedule</h2>
          <Target size={16} className="text-[#00FF88]" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="text-white font-medium">Physics - Optics</span>
            <span className="text-[#00FF88] font-mono text-sm">18:00</span>
          </div>
        </div>
      </div>

      {/* Upcoming Test */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-white/60 text-xs uppercase">Upcoming</p>
          <p className="text-white font-medium">Math Weekly Assessment</p>
        </div>
        <div className="text-right">
          <p className="text-[#00FF88] font-mono font-bold">Tomorrow</p>
        </div>
      </div>

    </div>
  );
};

export default ProZone;
