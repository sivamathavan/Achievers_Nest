import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Zap, Clock, Brain, Star, RefreshCw, ChevronRight, Shield, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Derive age group from class string e.g. "Class 10" → 15 */
const classToAge = (classStr) => {
  if (!classStr) return 14;
  const num = parseInt(classStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return 14;
  return num + 5; // Class 1 → 6 yrs, Class 10 → 15 yrs, Class 12 → 17 yrs
};

/** Get today's date string "YYYY-MM-DD" */
const todayKey = () => new Date().toISOString().split('T')[0];

/** LocalStorage helpers */
const STORAGE_KEY = 'achievers_battle_questions';

const loadTodayQuestions = (userId) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayKey()) return null; // expired
    return parsed.questions;
  } catch { return null; }
};

const saveTodayQuestions = (userId, questions) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify({
      date: todayKey(),
      questions,
    }));
  } catch {}
};

const loadBattleHistory = (userId) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_history_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveBattleHistory = (userId, history) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_history_${userId}`, JSON.stringify(history.slice(0, 30)));
  } catch {}
};

// ─────────────────────────────────────────────
// Gemini AI Question Generator
// ─────────────────────────────────────────────

const generateQuestionsViaAI = async (age, pastTopics) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const avoidTopics = pastTopics.length > 0
    ? `Avoid these topics already used this week: ${pastTopics.join(', ')}.`
    : '';

  const prompt = `You are a fun quiz master for Indian school students.
Generate exactly 10 unique General Knowledge questions suitable for a ${age}-year-old Indian student.
These should be OUT OF SYLLABUS — about world records, science facts, history, sports, geography, famous personalities, technology, animals, space, inventions, or current affairs.
${avoidTopics}

Rules:
- Each question must have exactly 4 options.
- Only one correct answer.
- Make it engaging and age-appropriate for a ${age} year old.
- Vary the categories across all 10 questions.
- DO NOT include any syllabus topics (no algebra, no grammar rules, no textbook content).

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "category": "Space",
    "explanation": "Brief one-sentence fun fact explaining the answer."
  }
]

Return the JSON array only. No markdown, no extra text.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid response format');
  return parsed.slice(0, 10); // ensure max 10
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const CategoryBadge = ({ category }) => {
  const colors = {
    Space: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Science: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Sports: 'bg-green-500/20 text-green-300 border-green-500/30',
    History: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Geography: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    Technology: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Animals: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    default: 'bg-white/10 text-white/60 border-white/10',
  };
  const cls = colors[category] || colors.default;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cls}`}>
      {category}
    </span>
  );
};

const TimerBar = ({ timeLeft, total }) => {
  const pct = (timeLeft / total) * 100;
  const color = timeLeft > 10 ? '#00FF88' : timeLeft > 5 ? '#FFD700' : '#EF4444';
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full transition-colors duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'linear' }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const BrainBattle = () => {
  const { user } = useAuth();
  const userId = user?.user_id || user?.id || 'guest';
  const age = classToAge(user?.class);

  // Game states
  const [gameState, setGameState] = useState('lobby'); // lobby | loading | countdown | active | result
  const [countdown, setCountdown] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Score tracking
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [answers, setAnswers] = useState([]); // { correct: bool, timeTaken: number }

  const timerRef = useRef(null);
  const QUESTION_TIME = 20;

  // ── Load or Generate Questions ──
  const loadQuestions = useCallback(async () => {
    setGameState('loading');
    setAiError(null);
    setAiLoading(true);

    // Try cache first
    const cached = loadTodayQuestions(userId);
    if (cached && cached.length === 10) {
      setQuestions(cached);
      setAiLoading(false);
      setGameState('countdown');
      setCountdown(3);
      return;
    }

    // Load history to avoid topic repetition
    const history = loadBattleHistory(userId);
    const pastTopics = [...new Set(history.flatMap(h => h.categories || []))].slice(0, 15);

    try {
      const qs = await generateQuestionsViaAI(age, pastTopics);
      saveTodayQuestions(userId, qs);
      setQuestions(qs);
      setGameState('countdown');
      setCountdown(3);
    } catch (err) {
      console.error('AI generation failed:', err);
      setAiError(err.message || 'Failed to generate questions. Check your API key or internet connection.');
      setGameState('lobby');
    } finally {
      setAiLoading(false);
    }
  }, [userId, age]);

  // ── Countdown ──
  useEffect(() => {
    if (gameState !== 'countdown') return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setGameState('active');
      setCurrentQ(0);
      setPlayerScore(0);
      setOpponentScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [gameState, countdown]);

  // ── Question Timer ──
  useEffect(() => {
    if (gameState !== 'active') return;
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer(null);
    setShowExplanation(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentQ]);

  // ── Opponent simulation ──
  useEffect(() => {
    if (gameState !== 'active') return;
    const delay = 4000 + Math.random() * 8000;
    const t = setTimeout(() => {
      if (Math.random() > 0.4) setOpponentScore(s => s + 10);
    }, delay);
    return () => clearTimeout(t);
  }, [gameState, currentQ]);

  const handleTimeout = () => {
    setSelectedAnswer(-1); // -1 means timed out
    setShowExplanation(true);
    setAnswers(prev => [...prev, { correct: false, timeTaken: QUESTION_TIME }]);
    setTimeout(advanceQuestion, 2500);
  };

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    clearInterval(timerRef.current);

    const q = questions[currentQ];
    const correct = idx === q.correctIndex;
    const timeTaken = QUESTION_TIME - timeLeft;

    setSelectedAnswer(idx);
    setShowExplanation(true);

    if (correct) {
      const bonus = Math.max(10, Math.round((timeLeft / QUESTION_TIME) * 20)); // 10–20 pts based on speed
      setPlayerScore(s => s + bonus);
    }

    setAnswers(prev => [...prev, { correct, timeTaken }]);
    setTimeout(advanceQuestion, 2000);
  };

  const advanceQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState('result');
    setPlayerScore(ps => {
      if (ps > opponentScore) {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
      }
      // Save session to history
      const categories = [...new Set(questions.map(q => q.category))];
      const history = loadBattleHistory(userId);
      saveBattleHistory(userId, [
        { date: todayKey(), score: ps, categories },
        ...history,
      ]);
      return ps;
    });
  };

  const resetGame = () => {
    setGameState('lobby');
    setCurrentQ(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const playAgain = () => {
    // Force fresh questions tomorrow, but allow replay today
    setQuestions([]);
    loadQuestions();
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-[85vh] items-center justify-center p-4 w-full">

      {/* ── LOBBY ── */}
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-center w-full max-w-md"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)] border border-red-500/20">
              <Swords size={56} className="text-red-400" />
            </div>

            <h1 className="text-4xl font-black text-white mb-1 uppercase tracking-widest">Brain Battle</h1>
            <p className="text-white/50 mb-2 text-sm">Daily AI-Generated General Knowledge Quiz</p>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center text-xs text-gold font-medium">
                <Brain size={14} className="mr-1.5" /> Age-adapted for {age} yrs
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center text-xs text-[#00FF88] font-medium">
                <Star size={14} className="mr-1.5" /> 10 Fresh Questions Daily
              </div>
            </div>

            {aiError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 text-left">
                <p className="font-bold mb-1">⚠️ Could not load AI questions</p>
                <p className="text-xs text-red-400/70">{aiError}</p>
              </div>
            )}

            <div className="space-y-3 mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
              {[
                { icon: Clock, label: '20 seconds per question' },
                { icon: Zap, label: 'Speed bonus — faster = more points' },
                { icon: Shield, label: 'Compete against a virtual opponent' },
                { icon: RefreshCw, label: 'Fresh new questions every day' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center text-sm text-white/70 space-x-3">
                  <Icon size={16} className="text-gold shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={loadQuestions}
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(239,68,68,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {aiLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  AI Generating Questions...
                </span>
              ) : '⚔️ Start Battle'}
            </button>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {gameState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full border-4 border-gold border-t-transparent animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Generating Your Battle...</h2>
            <p className="text-white/50 text-sm">AI is crafting 10 unique GK questions for age {age}+</p>
          </motion.div>
        )}

        {/* ── COUNTDOWN ── */}
        {gameState === 'countdown' && (
          <motion.div
            key={`cd-${countdown}`}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] mb-4">
              {countdown === 0 ? '🚀' : countdown}
            </div>
            <p className="text-white/60 font-medium">{countdown > 0 ? 'Get Ready!' : 'GO!'}</p>
          </motion.div>
        )}

        {/* ── ACTIVE BATTLE ── */}
        {gameState === 'active' && questions.length > 0 && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {/* Score Bar */}
            <div className="flex justify-between items-center bg-[#1A1A24] p-4 rounded-2xl border border-white/10 mb-5">
              <div className="text-center">
                <p className="text-xs text-white/40 uppercase font-bold mb-0.5">You</p>
                <p className="text-2xl font-black text-gold">{playerScore}</p>
              </div>

              <div className="flex flex-col items-center flex-1 px-4">
                <div className="flex items-center mb-2">
                  <Clock size={12} className="text-white/40 mr-1" />
                  <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <TimerBar timeLeft={timeLeft} total={QUESTION_TIME} />
                <p className="text-[10px] text-white/30 mt-1">Q {currentQ + 1} / {questions.length}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-white/40 uppercase font-bold mb-0.5">Opp</p>
                <p className="text-2xl font-black text-red-400">{opponentScore}</p>
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <CategoryBadge category={questions[currentQ]?.category} />
                  <span className="text-xs text-white/30 font-mono">#{currentQ + 1}</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                  {questions[currentQ]?.question}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions[currentQ]?.options.map((opt, idx) => {
                const isCorrect = idx === questions[currentQ]?.correctIndex;
                const isSelected = idx === selectedAnswer;
                const isTimedOut = selectedAnswer === -1;
                let cls = 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
                if (selectedAnswer !== null) {
                  if (isCorrect) cls = 'bg-[#00FF88]/20 border-[#00FF88]/50 text-[#00FF88]';
                  else if (isSelected && !isCorrect) cls = 'bg-red-500/20 border-red-500/50 text-red-400';
                  else cls = 'bg-white/5 border-white/5 text-white/30';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`border rounded-xl p-4 text-left font-medium transition-all duration-200 flex items-center space-x-3 ${cls} disabled:cursor-default`}
                  >
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm leading-snug">{opt}</span>
                    {selectedAnswer !== null && isCorrect && <CheckCircle size={16} className="ml-auto shrink-0 text-[#00FF88]" />}
                    {isSelected && !isCorrect && <XCircle size={16} className="ml-auto shrink-0 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && questions[currentQ]?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gold/10 border border-gold/20 rounded-xl p-4 text-sm text-gold/90"
                >
                  <p className="font-bold text-xs text-gold/60 uppercase mb-1">💡 Fun Fact</p>
                  {selectedAnswer === -1
                    ? `⏰ Time's up! ${questions[currentQ].explanation}`
                    : questions[currentQ].explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-[#1A1A24] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-gold/20 text-5xl">
                {playerScore > opponentScore ? '🏆' : playerScore === opponentScore ? '🤝' : '💪'}
              </div>

              <h2 className="text-3xl font-black text-white mb-1">
                {playerScore > opponentScore ? 'VICTORY!' : playerScore === opponentScore ? 'DRAW!' : 'GOOD TRY!'}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {playerScore > opponentScore
                  ? "You outsmarted your opponent!"
                  : playerScore === opponentScore
                  ? "It's a tie — well matched!"
                  : "Better luck tomorrow. Keep learning!"}
              </p>

              {/* Score comparison */}
              <div className="flex justify-around mb-6">
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Your Score</p>
                  <p className="text-3xl font-black text-gold">{playerScore}</p>
                </div>
                <div className="border-l border-white/10" />
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Opponent</p>
                  <p className="text-3xl font-black text-red-400">{opponentScore}</p>
                </div>
              </div>

              {/* Answer summary */}
              <div className="flex justify-center gap-1.5 mb-6">
                {answers.map((a, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                      a.correct
                        ? 'bg-[#00FF88]/20 border-[#00FF88]/40 text-[#00FF88]'
                        : 'bg-red-500/20 border-red-500/40 text-red-400'
                    }`}
                  >
                    {a.correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 text-[#00FF88] font-black text-xl mb-8">
                +{Math.max(10, playerScore > opponentScore ? 50 : 20)} XP
              </div>

              <div className="space-y-3">
                <button
                  onClick={playAgain}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
                >
                  🔄 Play Again (New AI Questions)
                </button>
                <button
                  onClick={() => (window.location.href = '/student')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrainBattle;
