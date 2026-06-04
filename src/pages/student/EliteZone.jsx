import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, BookOpen, Clock, TrendingUp, Search, Layers } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const weaknessData = [
  { subject: 'Physics', A: 85, fullMark: 100 },
  { subject: 'Chemistry', A: 65, fullMark: 100 },
  { subject: 'Math', A: 90, fullMark: 100 },
  { subject: 'Biology', A: 75, fullMark: 100 },
  { subject: 'English', A: 88, fullMark: 100 },
];

const EliteZone = ({ user }) => {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Sleek Header */}
      <header className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl text-white/70 font-light">Good Morning,</h1>
          <p className="text-white text-2xl font-semibold">{user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Target 2027</p>
          <div className="bg-gold text-dark-bg px-3 py-1 rounded font-bold text-sm">
            214 Days Left
          </div>
        </div>
      </header>

      {/* Professional Quote */}
      <div className="px-2">
        <p className="text-white/80 font-medium italic">"Excellence is not an act, but a habit."</p>
        <p className="text-white/40 text-sm mt-1">"சிறப்பு என்பது ஒரு செயல் அல்ல, அது ஒரு பழக்கம்."</p>
      </div>

      {/* Predictive Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center text-white/50 text-xs uppercase mb-2">
            <TrendingUp size={14} className="mr-1" /> Expected Percentile
          </div>
          <div className="text-3xl font-light text-white">96.5<span className="text-lg text-white/40">%</span></div>
          <div className="mt-2 text-xs text-emerald-400 font-medium">+1.2% from last mock</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center text-white/50 text-xs uppercase mb-2">
            <Layers size={14} className="mr-1" /> Rank Predictor
          </div>
          <div className="text-3xl font-light text-white">4.2<span className="text-lg text-white/40">k</span></div>
          <div className="mt-2 text-xs text-white/50 font-medium">Based on current trajectory</div>
        </div>
      </div>

      {/* Weakness Radar */}
      <div className="glass-card p-5">
        <h2 className="text-sm uppercase text-white/50 font-medium mb-4">Performance Analysis</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={weaknessData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Student" dataKey="A" stroke="#FFD700" fill="#FFD700" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <div className="w-2 h-2 rounded-full bg-gold"></div>
          <span className="text-xs text-white/60">Your Mastery Level</span>
        </div>
      </div>

      {/* Quick Actions (Minimal) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => window.location.href='/student/planner'} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-colors">
          <BookOpen size={20} className="text-gold mb-2" />
          <span className="text-sm font-medium text-white/90">Smart Planner</span>
        </button>
        <button onClick={() => window.location.href='/student/battle'} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-colors">
          <Search size={20} className="text-red-500 mb-2" />
          <span className="text-sm font-medium text-white/90">Brain Battle</span>
        </button>
      </div>

      {/* Schedule / Upcoming */}
      <div className="space-y-4">
        <h2 className="text-sm uppercase text-white/50 font-medium px-1">Today's Agenda</h2>
        
        <div className="glass-card p-4 flex justify-between items-center border-l-2 border-l-white">
          <div>
            <p className="text-white font-medium">Advanced Calculus</p>
            <p className="text-sm text-white/50">Revision Batch</p>
          </div>
          <div className="flex items-center text-white/70 text-sm">
            <Clock size={14} className="mr-1" /> 18:30
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarIcon size={16} className="text-red-400 mr-3" />
            <div>
              <p className="text-white font-medium text-sm">Full Length Mock Test 4</p>
              <p className="text-xs text-red-400/80">Sunday, 09:00 AM</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EliteZone;
