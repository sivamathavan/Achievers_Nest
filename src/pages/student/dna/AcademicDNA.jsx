import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { generateMockDNAData, getGeneColor, getGeneColorHex } from '../../../utils/dnaDataGenerator';
import { Activity, X, Play, HelpCircle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Visual Components
import DNAHelix from './DNAHelix';
import BrainMatrix from './BrainMatrix';
import PowerMap from './PowerMap';
import MagicGarden from './MagicGarden';

const AcademicDNA = ({ forcedClassLevel = null }) => {
  const { user } = useAuth();
  const [dnaData, setDnaData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGene, setSelectedGene] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const classLevel = forcedClassLevel !== null ? forcedClassLevel : (() => {
    if (!user?.class) return 10;
    const num = parseInt(user.class.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 10 : num;
  })();

  useEffect(() => {
    // Simulate fetching DNA data
    setDnaData(generateMockDNAData(classLevel));
  }, [classLevel]);

  // Filter data
  const filteredData = useMemo(() => {
    if (selectedSubject === 'All') return dnaData;
    return dnaData.filter(d => d.subject_name === selectedSubject);
  }, [dnaData, selectedSubject]);

  // Calculate Health Score
  const healthScore = useMemo(() => {
    if (dnaData.length === 0) return 0;
    const attempted = dnaData.filter(d => d.attempts > 0);
    if (attempted.length === 0) return 0;
    const total = attempted.reduce((acc, curr) => acc + curr.score_percentage, 0);
    return Math.round(total / attempted.length);
  }, [dnaData]);

  const handleGeneClick = (gene) => {
    setSelectedGene(gene);
    setIsPaused(true);
  };

  const closeGene = () => {
    setSelectedGene(null);
    setIsPaused(false);
  };

  const renderVisual = () => {
    if (classLevel >= 10) {
      return <DNAHelix data={filteredData} onGeneClick={handleGeneClick} isPaused={isPaused} />;
    } else if (classLevel >= 7) {
      return <BrainMatrix data={filteredData} onGeneClick={handleGeneClick} />;
    } else if (classLevel >= 4) {
      return <PowerMap data={filteredData} onGeneClick={handleGeneClick} />;
    } else {
      return <MagicGarden data={filteredData} onGeneClick={handleGeneClick} />;
    }
  };

  const getTitle = () => {
    if (classLevel >= 10) return "Your Academic DNA";
    if (classLevel >= 7) return "Your Brain Matrix";
    if (classLevel >= 4) return "Your Power Map";
    return "Your Magic Garden";
  };

  const healthColor = healthScore >= 70 ? 'text-[#00FF88]' : healthScore >= 40 ? 'text-yellow-400' : 'text-red-500';

  return (
    <div className="pb-24 max-w-2xl mx-auto h-full flex flex-col relative">
      
      {/* Top Section */}
      <div className="bg-[#1A1A24]/90 backdrop-blur-md p-4 sticky top-0 z-20 border-b border-white/10">
        <h1 className="text-xl font-bold text-white flex items-center mb-2">
          <Activity className={`mr-2 ${healthColor}`} /> {getTitle()}
        </h1>
        <div className="flex justify-between items-center text-sm">
          <p className="text-white/60">Health Score: <span className={`font-bold ${healthColor}`}>{healthScore}%</span></p>
          <p className="text-white/40 text-xs">Updated: Today</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 mt-4 pb-2 hide-scrollbar">
          {['All', 'Maths', 'Science', 'English', 'Social'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubject === sub 
                  ? 'bg-gold text-dark-bg' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Middle Section: Main Visual */}
      <div className="flex-1 overflow-y-auto relative">
        {renderVisual()}
      </div>

      {/* Gene Popup Bottom Sheet */}
      <AnimatePresence>
        {selectedGene && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGene}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-[#1A1A24] border-t border-white/10 rounded-t-3xl p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
              <button onClick={closeGene} className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 transition-colors">
                <X size={18} />
              </button>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-1">{selectedGene.subject_name}</p>
                <h2 className="text-xl font-black text-white">{selectedGene.chapter_name}</h2>
                <h3 className="text-sm font-medium text-white/60 mt-0.5 font-tamil">{selectedGene.name_tamil}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Mastery Score</p>
                  <p className="text-3xl font-black" style={{ color: getGeneColorHex(getGeneColor(selectedGene.score_percentage, selectedGene.attempts)) }}>
                    {selectedGene.attempts > 0 ? `${selectedGene.score_percentage}%` : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col justify-end">
                  <p className="text-xs text-white/50 mb-2">Recent Trend</p>
                  <div className="flex items-end space-x-2 h-10">
                    {selectedGene.recent_scores.length > 0 ? selectedGene.recent_scores.map((score, i) => (
                      <div key={i} className="flex-1 bg-white/20 rounded-t-sm relative group" style={{ height: `${Math.max(10, score)}%` }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover:opacity-100">{score}</div>
                      </div>
                    )) : (
                      <p className="text-xs text-white/30 italic pb-1">No attempts yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 rounded-xl flex items-center justify-center transition-transform active:scale-95">
                  <Play size={18} className="mr-2 fill-current" /> Practice Now
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-transform active:scale-95">
                  <HelpCircle size={18} className="mr-2" /> View Doubts
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AcademicDNA;
