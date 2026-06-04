import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Target, BookOpen } from 'lucide-react';

const trendData = [
  { test: 'Mock 1', score: 65 },
  { test: 'Mock 2', score: 68 },
  { test: 'Mock 3', score: 75 },
  { test: 'Mock 4', score: 72 },
  { test: 'Mock 5', score: 85 },
  { test: 'Mock 6', score: 90 },
];

const radarData = [
  { subject: 'Physics', score: 80, fullMark: 100 },
  { subject: 'Chemistry', score: 65, fullMark: 100 },
  { subject: 'Math', score: 95, fullMark: 100 },
  { subject: 'Biology', score: 75, fullMark: 100 },
  { subject: 'English', score: 85, fullMark: 100 },
];

const suggestions = [
  { chapter: 'Organic Chemistry: Aldehydes', priority: 'High', impact: '+5 Marks' },
  { chapter: 'Physics: Thermodynamics', priority: 'Medium', impact: '+3 Marks' },
];

const AnalyticsDashboard = () => {
  const storedResults = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('achievers_results');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, []);

  const dynamicTrendData = React.useMemo(() => {
    if (storedResults.length === 0) return trendData;
    const chronological = [...storedResults].reverse().slice(-6);
    return chronological.map((r, i) => ({
      test: r.testName ? r.testName.replace(' Test', '').replace('Mock ', 'M') : `Mock ${i + 1}`,
      score: r.percentage
    }));
  }, [storedResults]);

  const avgScore = React.useMemo(() => {
    if (storedResults.length === 0) return '75.8%';
    const totalPct = storedResults.reduce((acc, r) => acc + r.percentage, 0);
    return `${(totalPct / storedResults.length).toFixed(1)}%`;
  }, [storedResults]);

  const improvement = React.useMemo(() => {
    if (storedResults.length <= 1) return '+12.5%';
    const latest = storedResults[0].percentage;
    const oldest = storedResults[storedResults.length - 1].percentage;
    const diff = latest - oldest;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  }, [storedResults]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white font-space">Performance Analytics</h1>
        <p className="text-white/60 text-sm">Detailed breakdown of your progress</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center text-white/50 text-xs font-semibold uppercase mb-2">
            <TrendingUp size={14} className="mr-1 text-[#00FF88]" /> Improvement
          </div>
          <div className="text-3xl font-bold text-white font-space">{improvement}</div>
          <p className="text-xs text-white/40 mt-1">Over last 30 days</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center text-white/50 text-xs font-semibold uppercase mb-2">
            <Target size={14} className="mr-1 text-gold" /> Avg Score
          </div>
          <div className="text-3xl font-bold text-white font-space">{avgScore}</div>
          <p className="text-xs text-white/40 mt-1">Across all subjects</p>
        </div>
      </div>

      {/* Trend Line Graph */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold uppercase text-white/60 mb-6">Recent Test Scores (Last 6)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="test" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#FFD700" 
                strokeWidth={3}
                dot={{ fill: '#0A0A0F', stroke: '#FFD700', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFD700' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart for Subject Mastery */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold uppercase text-white/60 mb-2">Subject Mastery</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#00FF88" fill="#00FF88" fillOpacity={0.3} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#00FF88' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase text-white/60 px-1">Suggested for Revision</h2>
        
        {suggestions.map((item, idx) => (
          <div key={idx} className="glass-card p-4 border-l-4 border-l-red-500 flex justify-between items-center">
            <div className="flex items-start">
              <BookOpen size={18} className="text-red-400 mt-0.5 mr-3" />
              <div>
                <p className="text-white font-medium">{item.chapter}</p>
                <p className="text-xs text-white/50 mt-1">{item.priority} Priority</p>
              </div>
            </div>
            <div className="bg-[#00FF88]/10 text-[#00FF88] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
              {item.impact}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
