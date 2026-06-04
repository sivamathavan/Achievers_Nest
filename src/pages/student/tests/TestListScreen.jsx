import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Play, Clock, CheckCircle, BookOpen, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getTestsForClass = (classLevel) => {
  const n = parseInt(classLevel) || 10;
  if (n <= 3) {
    // Primary / Fun Zone (Classes 1–3)
    return {
      upcoming: [
        { id: 'test-1', title: 'Fun with Numbers 1-100 Quiz', subject: 'Maths', timer: 15, marks: 20 },
        { id: 'test-2', title: 'Animal Kingdom & Nature Identification', subject: 'Science', timer: 10, marks: 15 }
      ],
      completed: [
        { id: 'test-3', title: 'Shapes & Colors Match Puzzle', subject: 'Maths', score: '18/20', date: 'Yesterday' }
      ],
      chapter: [
        { id: 'chapter-1', title: 'Plants and Environmental Science (EVS) basics', subject: 'Science', chapters: 2 }
      ]
    };
  }
  if (n <= 6) {
    // Adventure Zone (Classes 4–6)
    return {
      upcoming: [
        { id: 'test-1', title: 'Fractions & Decimals Adventure', subject: 'Maths', timer: 30, marks: 30 },
        { id: 'test-2', title: 'Ancient Civilizations Quest', subject: 'Social Science', timer: 20, marks: 25 }
      ],
      completed: [
        { id: 'test-3', title: 'Food & Health Review', subject: 'Science', score: '22/25', date: 'Yesterday' }
      ],
      chapter: [
        { id: 'chapter-1', title: 'Sentence Structures & Prose Comprehension', subject: 'English', chapters: 3 }
      ]
    };
  }
  if (n <= 9) {
    // Pro Zone (Classes 7–9)
    return {
      upcoming: [
        { id: 'test-1', title: 'Ratio and Proportion Exam', subject: 'Maths', timer: 45, marks: 50 },
        { id: 'test-2', title: 'Force and Pressure Concept Quiz', subject: 'Science', timer: 30, marks: 40 }
      ],
      completed: [
        { id: 'test-3', title: 'Delhi Sultanate & Indian History Review', subject: 'Social Science', score: '42/50', date: 'Yesterday' }
      ],
      chapter: [
        { id: 'chapter-1', title: 'Direct and Indirect Speech Mastery', subject: 'English', chapters: 4 }
      ]
    };
  }
  // Elite Zone (Classes 10–12)
  return {
    upcoming: [
      { id: 'test-1', title: 'Optics Weekly Test (Light Ray Diagrams)', subject: 'Science', timer: 45, marks: 50 },
      { id: 'test-2', title: 'Algebra Fundamentals & Quadratic Equations', subject: 'Math', timer: 60, marks: 60 }
    ],
    completed: [
      { id: 'test-3', title: 'Chemical Reactions & Bonding Quiz', subject: 'Science', score: '44/50', date: '2 days ago' }
    ],
    chapter: [
      { id: 'chapter-1', title: 'Trigonometry & Coordinate Geometry', subject: 'Maths', chapters: 2 }
    ]
  };
};

const TestListScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [syllabusModal, setSyllabusModal] = useState(null);

  const SYLLABUS_DATA = {
    'chapter-1': [
      'Chapter 1: Introduction to Algebra',
      'Chapter 2: Linear Equations in One Variable',
      'Chapter 3: Quadratic Equations & Discriminant',
      'Chapter 4: Coordinate Geometry Basics',
    ],
  };

  const classLevel = (() => {
    if (!user?.class) return 10;
    const num = parseInt(user.class.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 10 : num;
  })();

  const mockTests = getTestsForClass(classLevel);

  const completedTests = React.useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('achievers_results') || '[]');
      if (stored.length > 0) {
        return stored.map(r => ({
          id: r.id,
          title: r.testName || 'Physics Mock Test',
          subject: r.subject || 'Physics',
          score: `${r.score}/${r.total}`,
          date: new Date(r.date).toLocaleDateString('en-IN')
        }));
      }
    } catch (e) {}
    return mockTests.completed;
  }, [mockTests.completed]);

  const handleStartClick = (test) => {
    setSelectedTest(test);
    setShowConfirm(true);
  };

  const startLiveTest = () => {
    setShowConfirm(false);
    navigate(`/student/tests/live/${selectedTest.id}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-white">Mock Tests</h1>
        <p className="text-white/60 text-sm">Board: {user?.board || 'CBSE'}</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-xl">
        {['upcoming', 'completed', 'chapter'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              activeTab === tab ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && mockTests.upcoming.map(test => (
          <div key={test.id} className="glass-card p-5 border-l-4 border-l-gold relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold bg-white/10 text-white/80 px-2 py-1 rounded">
                {test.subject}
              </span>
              <div className="flex items-center text-white/50 text-xs font-medium">
                <Clock size={12} className="mr-1" /> {test.timer} mins
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{test.title}</h3>
            <p className="text-white/50 text-sm mb-4">Total Marks: {test.marks}</p>
            
            <button 
              onClick={() => handleStartClick(test)}
              className="w-full bg-gold/10 hover:bg-gold hover:text-dark-bg text-gold border border-gold/30 rounded-xl py-2 flex items-center justify-center font-bold transition-all"
            >
              <Play size={16} className="mr-2" /> Start Test
            </button>
          </div>
        ))}

        {activeTab === 'completed' && completedTests.map(test => (
          <div
            key={test.id}
            onClick={() => navigate(`/student/tests/results/${test.id}`)}
            className="glass-card p-5 border-l-4 border-l-emerald-500 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                {test.subject}
              </span>
              <div className="flex items-center text-emerald-400 text-xs font-medium">
                <CheckCircle size={12} className="mr-1" /> Completed
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">{test.title}</h3>
            <div className="mt-4 flex justify-between items-end">
              <p className="text-white/40 text-xs">{test.date}</p>
              <div className="text-right">
                <p className="text-xl font-bold text-white">{test.score}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">View Analysis →</p>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'chapter' && mockTests.chapter.map(test => (
          <div key={test.id} className="glass-card p-5 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                {test.subject}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{test.title}</h3>
            <p className="text-white/50 text-sm flex items-center mb-4">
              <BookOpen size={14} className="mr-1" /> {test.chapters} Chapters
            </p>
            <button
              onClick={() => setSyllabusModal(test)}
              className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-2 font-medium transition-colors"
            >
              View Syllabus
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1A24] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gold/20 p-3 rounded-full text-gold">
                  <AlertCircle size={24} />
                </div>
                <button onClick={() => setShowConfirm(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">Ready to begin?</h2>
              <p className="text-white/60 text-sm mb-6">
                You are about to start <span className="text-white font-medium">{selectedTest?.title}</span>. 
                Once started, the timer of {selectedTest?.timer} minutes cannot be paused.
              </p>
              
              <div className="space-y-3">
                <button onClick={startLiveTest} className="w-full bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 rounded-xl transition-colors">
                  Yes, Start Now
                </button>
                <button onClick={() => setShowConfirm(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {syllabusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-sm flex items-end"
            onClick={() => setSyllabusModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-[#1A1A24] border-t border-white/10 w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <h3 className="text-lg font-bold text-white mb-1">{syllabusModal.title}</h3>
              <p className="text-white/50 text-sm mb-5">
                <BookOpen size={14} className="inline mr-1" />
                {syllabusModal.chapters} Chapter{syllabusModal.chapters > 1 ? 's' : ''} · {syllabusModal.subject}
              </p>
              <div className="space-y-2">
                {(SYLLABUS_DATA[syllabusModal.id] || ['Syllabus details coming soon.']).map((topic, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-white/80 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSyllabusModal(null)}
                className="w-full mt-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestListScreen;
