import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Share2, BookOpen, ChevronLeft, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Result Data
const resultData = {
  score: 36,
  totalMarks: 40,
  timeTaken: '12:45',
  rank: 3,
  totalStudents: 45,
  chapters: [
    { name: 'Optics', score: 80 },
    { name: 'Waves', score: 100 },
    { name: 'Modern', score: 60 }
  ]
};

const donutData = [
  { name: 'Correct', value: 9, color: '#00FF88' },
  { name: 'Wrong', value: 1, color: '#FF6B6B' },
];

const TestResultsScreen = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const scoreCardRef = useRef(null);
  
  const percentage = Math.round((resultData.score / resultData.totalMarks) * 100);
  const isHighScore = percentage >= 80;

  // Grade Calculation
  let grade = { letter: 'C', color: 'text-orange-400' };
  if (percentage >= 90) grade = { letter: 'A+', color: 'text-gold' };
  else if (percentage >= 80) grade = { letter: 'A', color: 'text-emerald-400' };
  else if (percentage >= 70) grade = { letter: 'B', color: 'text-blue-400' };

  // Score Count Up Animation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setAnimatedScore(current);
      if (current >= resultData.score) {
        clearInterval(interval);
      }
    }, 20); // ms per tick
    
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    if (!scoreCardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(scoreCardRef.current, {
        backgroundColor: '#0A0A0F',
        scale: 2, // higher res
      });
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `achievers-nest-score-${resultId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      {isHighScore && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}
      
      <header className="p-4 flex items-center bg-white/5 border-b border-white/10">
        <button onClick={() => navigate('/student/tests')} className="text-white/70 hover:text-white mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Test Analysis</h1>
      </header>

      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Shareable Score Card */}
        <div 
          ref={scoreCardRef} 
          className="relative bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-3xl p-8 overflow-hidden"
        >
          {/* Decorative background for card */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-white/60 uppercase tracking-widest text-sm font-semibold mb-2">Physics Mock Test</h2>
            
            <div className="flex justify-center items-end my-8">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-8xl font-black text-white leading-none"
              >
                {animatedScore}
              </motion.div>
              <div className="text-3xl font-medium text-white/40 mb-2 ml-1">/ {resultData.totalMarks}</div>
            </div>

            <div className="flex justify-center items-center space-x-6 mb-8">
              <div className="text-center">
                <p className="text-white/40 text-xs uppercase mb-1">Grade</p>
                <p className={`text-3xl font-bold ${grade.color}`}>{grade.letter}</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <p className="text-white/40 text-xs uppercase mb-1">Rank</p>
                <div className="flex items-center justify-center">
                  <Award size={20} className="text-gold mr-1" />
                  <p className="text-2xl font-bold text-white">#{resultData.rank}</p>
                </div>
                <p className="text-[10px] text-white/40 mt-1">out of {resultData.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button 
            onClick={handleShare}
            disabled={isGenerating}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 flex items-center justify-center font-medium transition-colors"
          >
            {isGenerating ? 'Generating...' : <><Share2 size={18} className="mr-2" /> Share Score</>}
          </button>
          <button className="flex-1 bg-gold hover:bg-gold-hover text-dark-bg rounded-xl py-3 flex items-center justify-center font-bold transition-colors">
            <BookOpen size={18} className="mr-2" /> Solutions
          </button>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card p-6">
            <h3 className="text-white/60 text-sm font-semibold uppercase mb-4 text-center">Accuracy</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#00FF88] mr-2"></span> Correct</div>
              <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2"></span> Wrong</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-white/60 text-sm font-semibold uppercase mb-4">Chapter Performance</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultData.chapters} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" fill="#FFD700" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default TestResultsScreen;
