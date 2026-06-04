import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LayoutGrid, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const mockQuestions = [
  { id: 1, text: 'What is the speed of light in a vacuum?', options: ['3x10^8 m/s', '3x10^5 m/s', '3x10^2 m/s', '3x10^10 m/s'] },
  { id: 2, text: 'Which of the following lenses is converging?', options: ['Concave', 'Convex', 'Plano-concave', 'Cylindrical'] },
  { id: 3, text: 'Solve for x: 2x = 10', options: ['2', '5', '8', '12'] },
  { id: 4, text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'] },
];

const LiveTestScreen = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes mock timer
  const [showPalette, setShowPalette] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const timerRef = useRef(null);
  const submitTestRef = useRef(null);

  // Timer & Auto Submit Logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (submitTestRef.current) submitTestRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto Save every 30s
  useEffect(() => {
    const saveInterval = setInterval(() => {
      setIsAutoSaving(true);
      setTimeout(() => {
        setLastSaved(Date.now());
        setIsAutoSaving(false);
      }, 500); // simulate network
    }, 30000);
    return () => clearInterval(saveInterval);
  }, [answers]);

  const submitTest = () => {
    // Calculate score by matching answers to correct options
    const correctAnswers = { 0: 0, 1: 1, 2: 1, 3: 1 }; // Q1: 3x10^8, Q2: Convex, Q3: 5, Q4: Mitochondria
    const scored = Object.keys(answersRef.current).filter(
      (qIdx) => answersRef.current[qIdx] === correctAnswers[parseInt(qIdx)]
    ).length;

    const resultId = 'res-' + Date.now();
    const result = {
      id: resultId,
      testId: testId || 'physics-mock-01',
      testName: 'Physics Mock Test',
      subject: 'Physics',
      score: scored,
      total: mockQuestions.length,
      percentage: Math.round((scored / mockQuestions.length) * 100),
      timeTakenSecs: (15 * 60) - timeLeft,
      date: new Date().toISOString(),
      answers: answersRef.current,
      studentId: user?.user_id || 'STU2024001',
      studentName: user?.name || 'Rahul Sharma',
    };

    const prev = JSON.parse(localStorage.getItem('achievers_results') || '[]');
    localStorage.setItem('achievers_results', JSON.stringify([result, ...prev].slice(0, 50)));
    navigate(`/student/tests/results/${resultId}`, { replace: true });
  };
  submitTestRef.current = submitTest;

  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQ < mockQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  };

  const swipeHandlers = {
    onDragEnd: (e, { offset, velocity }) => {
      const swipe = swipePower(offset.x, velocity.x);
      if (swipe < -swipeConfidenceThreshold) {
        handleNext();
      } else if (swipe > swipeConfidenceThreshold) {
        handlePrev();
      }
    }
  };
  
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // Timer formatting
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const totalTime = 15 * 60;
  const progress = (timeLeft / totalTime) * 100;
  
  const isWarning = timeLeft <= 300; // 5 mins left

  // Get palette status color
  const getStatusColor = (idx) => {
    if (answers[idx] !== undefined) return 'bg-[#00FF88] text-dark-bg border-[#00FF88]'; // Answered
    if (idx < currentQ && answers[idx] === undefined) return 'bg-red-500 text-white border-red-500'; // Skipped
    return 'bg-white/10 text-white border-white/20'; // Unseen
  };

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col z-50 overflow-hidden">
      
      {/* Top Header & Timer */}
      <header className="p-4 flex items-center justify-between border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12">
            <CircularProgressbar 
              value={progress} 
              text={timeString} 
              styles={buildStyles({
                textSize: '24px',
                textColor: isWarning ? '#FF6B6B' : '#FFF',
                pathColor: isWarning ? '#FF6B6B' : '#FFD700',
                trailColor: 'rgba(255,255,255,0.1)'
              })}
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Physics Mock Test</h2>
            <div className="flex items-center text-xs text-white/50">
              {isAutoSaving ? (
                <span className="flex items-center text-gold"><Save size={10} className="mr-1 animate-pulse" /> Saving...</span>
              ) : (
                <span>Saved just now</span>
              )}
            </div>
          </div>
        </div>
        
        <button 
          onClick={submitTest}
          className="bg-gold hover:bg-gold-hover text-dark-bg px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Submit
        </button>
      </header>

      {/* Main Question Area (Swipeable) */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="px-6 py-4 flex justify-between items-center text-white/50 text-sm font-medium">
          <span>Question {currentQ + 1} of {mockQuestions.length}</span>
          <div className="flex space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
          </div>
        </div>

        <div className="flex-1 px-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={swipeHandlers.onDragEnd}
              className="absolute inset-0 px-6 h-full overflow-y-auto"
            >
              <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                {mockQuestions[currentQ].text}
              </h3>
              
              <div className="space-y-4">
                {mockQuestions[currentQ].options.map((opt, idx) => {
                  const isSelected = answers[currentQ] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-gold bg-gold/10 text-white' 
                          : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected ? 'border-gold bg-gold' : 'border-white/30'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-dark-bg" />}
                        </div>
                        <span className="text-lg">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="p-4 border-t border-white/10 flex items-center justify-between bg-dark-bg z-20 relative">
        <button 
          onClick={handlePrev}
          disabled={currentQ === 0}
          className={`p-3 rounded-full ${currentQ === 0 ? 'text-white/20' : 'text-white bg-white/10 hover:bg-white/20'}`}
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={() => setShowPalette(!showPalette)}
          className="flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-white/80 hover:text-white hover:bg-white/10"
        >
          <LayoutGrid size={20} />
          <span className="font-medium text-sm uppercase tracking-wider">Palette</span>
        </button>

        <button 
          onClick={handleNext}
          disabled={currentQ === mockQuestions.length - 1}
          className={`p-3 rounded-full ${currentQ === mockQuestions.length - 1 ? 'text-white/20' : 'text-white bg-gold/20 hover:bg-gold/30 text-gold'}`}
        >
          <ChevronRight size={24} />
        </button>
      </footer>

      {/* Question Palette Bottom Sheet */}
      <AnimatePresence>
        {showPalette && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPalette(false)}
              className="absolute inset-0 bg-black/60 z-30"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-[80px] left-0 right-0 bg-[#1A1A24] rounded-t-3xl p-6 border-t border-white/10 z-40"
            >
              <h3 className="text-white font-medium mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-3">
                {mockQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQ(idx);
                      setShowPalette(false);
                    }}
                    className={`h-12 rounded-xl flex items-center justify-center font-bold border ${getStatusColor(idx)} ${currentQ === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1A1A24]' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t border-white/10 text-xs text-white/60">
                <div className="flex items-center"><span className="w-3 h-3 bg-[#00FF88] rounded-full mr-2"></span> Answered</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> Skipped</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-white/20 rounded-full mr-2"></span> Unseen</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LiveTestScreen;
