import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Search, Filter, Bookmark, History, Languages, Keyboard, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const VoiceDoubtSolver = lazy(() =>
  import('../../components/student/voice/VoiceDoubtSolver').catch(() => ({
    default: () => (
      <div className="text-center py-16 text-white/40">
        <p className="text-lg mb-2">🎤</p>
        <p>Voice mode is not available on this device.</p>
      </div>
    )
  }))
);

const DoubtSolver = () => {
  const { user } = useAuth();
  const location = useLocation();
  const classLevel = (() => {
    if (!user?.class) return 10;
    const num = parseInt(user.class.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 10 : num;
  })();
  
  const [mode, setMode] = useState('type'); // 'type' | 'voice'
  const isSpeechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isTamil, setIsTamil] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Handle ?mode=voice from URL
  useEffect(() => {
    if (location.search.includes('mode=voice') && isSpeechSupported) {
      setMode('voice');
    }
  }, [location, isSpeechSupported]);
  
  // Load search history
  useEffect(() => {
    const saved = localStorage.getItem('achievers_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('achievers_search_history', JSON.stringify(newHistory));
    
    // Trigger mock search (in a real app, you'd fetch from DB)
  };

  const ALL_QA = [
    { id: 1, subject: 'Science', class: 'Class 10', tags: ['photosynthesis','plants','chlorophyll','food'],
      q: 'What is photosynthesis?',
      qTa: 'ஒளிச்சேர்க்கை என்றால் என்ன?',
      a: 'Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen. It occurs in chloroplasts.',
      aTa: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, தண்ணீர், CO₂ ஆகியவற்றைப் பயன்படுத்தி குளுக்கோஸ் மற்றும் ஆக்சிஜன் தயாரிக்கும் முறை.' },
    { id: 2, subject: 'Maths', class: 'Class 10', tags: ['quadratic','equations','algebra','formula','roots'],
      q: 'How do I solve quadratic equations?',
      qTa: 'இருமடி சமன்பாடுகளை எப்படி தீர்க்கலாம்?',
      a: 'Use the quadratic formula: x = (-b ± √(b²−4ac)) / 2a. First identify a, b, c from ax² + bx + c = 0.',
      aTa: 'சூத்திரம்: x = (-b ± √(b²−4ac)) / 2a. முதலில் ax² + bx + c = 0 இல் a, b, c அடையாளம் காணவும்.' },
    { id: 3, subject: 'Physics', class: 'Class 9', tags: ['newton','motion','law','force','inertia'],
      q: "What is Newton's First Law of Motion?",
      a: 'An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force.' },
    { id: 4, subject: 'Chemistry', class: 'Class 10', tags: ['periodic','table','elements','atomic','number'],
      q: 'What is the Periodic Table?',
      a: 'The Periodic Table organises all known elements in order of increasing atomic number. Elements in the same column (group) share similar properties.' },
    { id: 5, subject: 'Maths', class: 'Class 10', tags: ['pythagoras','theorem','triangle','hypotenuse','right'],
      q: 'State the Pythagorean Theorem.',
      a: 'In a right-angled triangle: a² + b² = c², where c is the hypotenuse (longest side) and a, b are the other two sides.' },
    { id: 6, subject: 'Biology', class: 'Class 9', tags: ['cell','membrane','nucleus','mitochondria','organelle'],
      q: 'What are the main parts of a cell?',
      a: 'Key parts: Cell membrane (boundary), Nucleus (control center with DNA), Mitochondria (energy producer), Ribosomes (protein makers), Endoplasmic Reticulum.' },
    { id: 7, subject: 'History', class: 'Class 10', tags: ['french','revolution','1789','liberty','equality'],
      q: 'When did the French Revolution begin?',
      a: 'The French Revolution began in 1789. Key causes included inequality between the Three Estates, heavy taxation of commoners, and the influence of Enlightenment ideas.' },
    { id: 8, subject: 'Maths', class: 'Class 8', tags: ['fraction','decimal','percentage','convert'],
      q: 'How do I convert fractions to decimals?',
      a: 'Divide the numerator by the denominator. Example: 3/4 = 3 ÷ 4 = 0.75. To convert to percentage, multiply by 100: 0.75 × 100 = 75%.' },
  ];

  const filteredResults = searchQuery.trim()
    ? ALL_QA.filter(qa => {
        const q = searchQuery.toLowerCase();
        return (
          qa.q.toLowerCase().includes(q) ||
          qa.subject.toLowerCase().includes(q) ||
          (qa.tags && qa.tags.some(t => t.includes(q))) ||
          (qa.a && qa.a.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Doubt Solver</h1>
          <p className="text-white/60 text-sm">Find instant answers to your questions</p>
        </div>
        
        {isSpeechSupported && (
          <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
            <button 
              onClick={() => setMode('type')}
              className={`px-4 py-2 rounded-lg flex items-center text-sm font-bold transition-colors ${mode === 'type' ? 'bg-gold text-dark-bg' : 'text-white/50 hover:text-white'}`}
            >
              <Keyboard size={16} className="mr-2" /> Type
            </button>
            <button 
              onClick={() => setMode('voice')}
              className={`px-4 py-2 rounded-lg flex items-center text-sm font-bold transition-colors ${mode === 'voice' ? 'bg-gold text-dark-bg' : 'text-white/50 hover:text-white'}`}
            >
              <Mic size={16} className="mr-2" /> Voice
            </button>
          </div>
        )}
      </header>

      {mode === 'voice' ? (
        <div className="mt-8">
          <Suspense fallback={<div className="text-white/50 text-center py-8 text-sm">Loading voice mode...</div>}>
            <VoiceDoubtSolver classLevel={classLevel} />
          </Suspense>
        </div>
      ) : (
        <>
          {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-white/40" />
        </div>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-lg"
          placeholder="Ask a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-gold transition-colors">
          <Filter size={20} />
        </button>
      </form>

      {/* Language Toggle */}
      <div className="flex items-center justify-end space-x-3">
        <span className="text-sm text-white/60 font-medium">English</span>
        <button 
          onClick={() => setIsTamil(!isTamil)}
          className={`w-12 h-6 rounded-full p-1 transition-colors ${isTamil ? 'bg-gold' : 'bg-white/20'}`}
        >
          <motion.div 
            className="w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: isTamil ? 24 : 0 }}
          />
        </button>
        <span className="text-sm text-white/60 font-medium">தமிழ்</span>
      </div>

      {/* History */}
      {history.length > 0 && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white/50 text-sm font-medium">
            <History size={16} />
            <span>Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((term, i) => (
              <button 
                key={i} 
                onClick={() => setSearchQuery(term)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searchQuery && filteredResults.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <p className="text-white/60 mb-2 text-sm">No results found for "<span className="text-white">{searchQuery}</span>"</p>
          <button className="btn-primary py-2 text-sm max-w-xs mx-auto">Ask a Teacher</button>
        </div>
      ) : searchQuery ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {filteredResults.map(res => (
            <div key={res.id} className="glass-card p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold bg-white/10 text-white/80 px-2 py-1 rounded">
                  {res.subject} • {res.class}
                </span>
                <button className="text-white/30 hover:text-gold transition-colors"><Bookmark size={20} /></button>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{isTamil && res.qTa ? res.qTa : res.q}</h3>
              <p className="text-white/70 leading-relaxed text-sm">{isTamil && res.aTa ? res.aTa : res.a}</p>
            </div>
          ))}
        </motion.div>
      ) : null}
      </>
      )}
    </div>
  );
};

export default DoubtSolver;
