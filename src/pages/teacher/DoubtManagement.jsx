import React, { useState } from 'react';
import { ChevronLeft, Send, Check, Clock, Globe } from 'lucide-react';

const ACCENT = '#4F8EF7';

const MOCK_DOUBTS = [
  { id: 'd1', student: 'Priya Rajesh', studentId: 'STU001', subject: 'Maths', class: '10', board: 'CBSE', chapter: 'Quadratic Equations', question: 'How to solve quadratic equation by completing the square method? I don\'t understand step 2 where we add the square of half the coefficient.', language: 'Tamil', time: '3 hours ago', status: 'pending' },
  { id: 'd2', student: 'Arun Kumar', studentId: 'STU002', subject: 'Science', class: '10', board: 'CBSE', chapter: 'Chemical Bonding', question: 'What is the difference between ionic and covalent bonds? Can you give examples from our textbook?', language: 'English', time: '5 hours ago', status: 'pending' },
  { id: 'd3', student: 'Karthik Raj', studentId: 'STU003', subject: 'Maths', class: '10', board: 'CBSE', chapter: 'Algebra', question: 'I don\'t understand how to factorize x² - 5x + 6. Teacher please explain the method.', language: 'Tamil', time: '1 day ago', status: 'pending' },
  { id: 'd4', student: 'Meena S', studentId: 'STU004', subject: 'English', class: '8', board: 'State', chapter: 'Grammar', question: 'What is the difference between simple past and past perfect tense? When do we use each?', language: 'English', time: '2 days ago', status: 'pending' },
  { id: 'd5', student: 'Divya M', studentId: 'STU006', subject: 'Science', class: '8', board: 'State', chapter: 'Photosynthesis', question: 'Why do plants need sunlight for photosynthesis? Can they survive in artificial light?', language: 'English', time: '3 days ago', status: 'pending' },
  { id: 'd6', student: 'Ravi K', studentId: 'STU005', subject: 'Maths', class: '8', board: 'State', chapter: 'Fractions', question: 'How to divide fractions? I get confused when both numerator and denominator change.', language: 'Tamil', time: '4 days ago', status: 'pending' },
  { id: 'd7', student: 'Priya Rajesh', studentId: 'STU001', subject: 'Maths', class: '10', board: 'CBSE', chapter: 'Algebra', question: 'What is the discriminant formula and what does it tell us about roots?', language: 'English', time: '5 days ago', status: 'answered', answer: 'The discriminant is b² - 4ac from the quadratic formula. If D > 0, two distinct real roots. If D = 0, two equal real roots. If D < 0, no real roots (imaginary).' },
];

// ─── ANSWER DOUBT SCREEN ───────────────────────────────────────────────────
const AnswerDoubt = ({ doubt, onBack, onAnswered }) => {
  const [answer, setAnswer] = useState('');
  const [language, setLanguage] = useState('English');
  const [saveToDb, setSaveToDb] = useState(true);
  const [boards, setBoards] = useState(['CBSE']);
  const [classes, setClasses] = useState(['10']);
  const [submitting, setSubmitting] = useState(false);

  const toggleBoard = (b) => setBoards(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleClass = (c) => setClasses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    onAnswered(doubt.id, answer, saveToDb, boards, classes);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h2 className="text-lg font-bold text-white">Answer Doubt</h2>
      </div>

      {/* Question Card */}
      <div className="bg-[#12121A] border border-[#4F8EF7]/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xs bg-[#4F8EF7]/10 border border-[#4F8EF7]/25 text-[#4F8EF7] px-2 py-0.5 rounded-full">{doubt.subject}</span>
          <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">Class {doubt.class} {doubt.board}</span>
          <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">{doubt.chapter}</span>
        </div>
        <p className="text-white font-medium leading-relaxed">"{doubt.question}"</p>
        <div className="flex items-center mt-3 text-xs text-white/40">
          <span className="font-medium text-white/60 mr-1">{doubt.student}</span>
          <span>• {doubt.studentId} • {doubt.time}</span>
        </div>
      </div>

      {/* Answer area */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-white">Your Answer *</label>
          <div className="flex gap-2">
            {[
              { label: 'Bold', syntax: '**text**', icon: 'B' },
              { label: 'List', syntax: '- List item', icon: '• List' },
              { label: 'Code', syntax: '`code`', icon: '</>' },
              { label: 'Formula', syntax: '$x^2$', icon: 'f(x)' }
            ].map(btn => (
              <button
                key={btn.label}
                type="button"
                onClick={() => {
                  const textarea = document.getElementById('doubt-answer-textarea');
                  if (!textarea) return;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const selected = text.substring(start, end) || btn.label;
                  const replacement = btn.syntax.replace('text', selected);
                  const newValue = text.substring(0, start) + replacement + text.substring(end);
                  setAnswer(newValue);
                  setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
                  }, 100);
                }}
                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/10 transition-all font-bold cursor-pointer"
                title={btn.label}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
        <textarea
          id="doubt-answer-textarea"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your detailed answer here (supports Markdown: **bold**, - list, `code`, $formula$)..."
          rows={8}
          style={{ minHeight: '200px' }}
          className="w-full bg-[#12121A] border border-white/10 rounded-2xl px-4 py-4 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7] resize-none placeholder:text-white/30 leading-relaxed"
        />

        {/* Live Preview Panel */}
        {answer.trim() && (
          <div className="bg-[#12121A]/50 border border-white/5 rounded-2xl p-5 mt-2 animate-in fade-in">
            <h4 className="text-xs text-white/40 uppercase font-bold mb-3 tracking-wider">Live Preview</h4>
            <div className="text-[14px] text-white/80 space-y-2 leading-relaxed">
              {answer.split('\n').map((line, idx) => {
                let html = line;
                // Bold
                html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Code
                html = html.replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">$1</code>');
                // Formulas
                html = html.replace(/\$(.*?)\$/g, '<span class="text-gold font-mono">$1</span>');
                
                if (html.startsWith('- ')) {
                  return <li key={idx} className="list-disc ml-5 text-white/70" dangerouslySetInnerHTML={{ __html: html.substring(2) }} />;
                }
                return <p key={idx} className="min-h-[1.2em]" dangerouslySetInnerHTML={{ __html: html }} />;
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm pt-2">
          <span className="text-white/50">Answer Language:</span>
          {['English', 'Tamil', 'Both'].map(l => (
            <button key={l} onClick={() => setLanguage(l)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
              style={language === l ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              <Globe size={12} /><span>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save to DB */}
      <div className="bg-[#4F8EF7]/5 border border-[#4F8EF7]/20 rounded-2xl p-5">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input type="checkbox" checked={saveToDb} onChange={e => setSaveToDb(e.target.checked)} className="mt-0.5 accent-blue-500 w-4 h-4" />
          <div className="flex-1">
            <p className="font-bold text-white text-sm">💡 Save to Q&A Database</p>
            <p className="text-xs text-white/40 mt-0.5">Help future students by adding this to the shared knowledge base</p>
          </div>
        </label>

        {saveToDb && (
          <div className="mt-4 space-y-3 pt-3 border-t border-white/5">
            <div>
              <p className="text-xs text-white/60 mb-2">Tag Boards</p>
              <div className="flex gap-2 flex-wrap">
                {['CBSE', 'State', 'Matric', 'ICSE'].map(b => (
                  <button key={b} onClick={() => toggleBoard(b)}
                    className="px-3 py-1.5 rounded-lg text-xs border font-medium transition-all"
                    style={boards.includes(b) ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {boards.includes(b) ? '✓ ' : ''}{b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-2">Tag Classes</p>
              <div className="flex gap-2 flex-wrap">
                {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                  <button key={c} onClick={() => toggleClass(c)}
                    className="w-10 h-8 rounded-lg text-xs border font-medium transition-all"
                    style={classes.includes(c) ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
        <button onClick={handleSubmit} disabled={!answer.trim() || submitting}
          className="flex-2 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center transition-all disabled:opacity-40 hover:scale-[1.02]"
          style={{ background: ACCENT, color: '#0A0A0F' }}>
          {submitting ? (
            <><svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</>
          ) : (
            <><Send size={16} className="mr-2" />Submit Answer</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN DOUBT MANAGEMENT ─────────────────────────────────────────────────
const DoubtManagement = () => {
  const [tab, setTab] = useState('pending');
  const [doubts, setDoubts] = useState(MOCK_DOUBTS);
  const [answering, setAnswering] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [justAnswered, setJustAnswered] = useState(null);

  const pending = doubts.filter(d => d.status === 'pending');
  const answered = doubts.filter(d => d.status === 'answered');

  const handleAnswered = (id, answer, saveToDb) => {
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, status: 'answered', answer } : d));
    setAnswering(null);
    setJustAnswered(id);
    setTab('answered');
    setTimeout(() => setJustAnswered(null), 3000);
  };

  if (answering) {
    return <AnswerDoubt doubt={answering} onBack={() => setAnswering(null)} onAnswered={handleAnswered} />;
  }

  const subjects = ['All', ...new Set(doubts.map(d => d.subject))];
  const displayList = (tab === 'pending' ? pending : answered).filter(d => subjectFilter === 'All' || d.subject === subjectFilter);

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-white">Doubt Queue</h1>
          <p className="text-sm text-white/50 mt-0.5">{pending.length} pending answers</p>
        </div>
        {justAnswered && (
          <div className="flex items-center space-x-2 bg-[#00FF88]/10 border border-[#00FF88]/25 text-[#00FF88] rounded-xl px-3 py-2 text-xs font-medium">
            <Check size={14} /> Answered & saved!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[#12121A] rounded-xl p-1 border border-white/5">
        <button onClick={() => setTab('pending')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${tab === 'pending' ? 'text-white' : 'text-white/40'}`}
          style={tab === 'pending' ? { background: ACCENT } : {}}>
          Pending
          {pending.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'pending' ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{pending.length}</span>
          )}
        </button>
        <button onClick={() => setTab('answered')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${tab === 'answered' ? 'text-white' : 'text-white/40'}`}
          style={tab === 'answered' ? { background: '#00FF88', color: '#0A0A0F' } : {}}>
          Answered ✅
        </button>
      </div>

      {/* Subject Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
        {subjects.map(s => (
          <button key={s} onClick={() => setSubjectFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border`}
            style={subjectFilter === s ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Doubt Cards */}
      <div className="space-y-3">
        {displayList.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <div className="text-5xl mb-3">{tab === 'pending' ? '🎉' : '📭'}</div>
            <p className="font-medium text-white/60">{tab === 'pending' ? 'All doubts answered!' : 'No answered doubts yet'}</p>
          </div>
        ) : displayList.map(doubt => (
          <div key={doubt.id} className={`bg-[#12121A] border rounded-2xl p-5 transition-all hover:border-[#4F8EF7]/30 ${
            doubt.status === 'pending' ? 'border-white/5' : 'border-[#00FF88]/15'
          }`}>
            {/* Header badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {doubt.status === 'pending' ? (
                <span className="text-[11px] bg-red-500/15 border border-red-500/25 text-red-400 px-2 py-0.5 rounded-full font-bold">❓ UNANSWERED</span>
              ) : (
                <span className="text-[11px] bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] px-2 py-0.5 rounded-full font-bold">✅ ANSWERED</span>
              )}
              <span className="text-[11px] text-white/30 flex items-center"><Clock size={10} className="mr-1" />{doubt.time}</span>
            </div>

            {/* Subject info */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="text-xs bg-[#4F8EF7]/10 text-[#4F8EF7] px-2 py-0.5 rounded-full border border-[#4F8EF7]/20">{doubt.subject}</span>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">Class {doubt.class} • {doubt.board}</span>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{doubt.chapter}</span>
            </div>

            {/* Student */}
            <p className="text-xs text-white/50 mb-2">
              <span className="font-medium text-white/70">{doubt.student}</span> ({doubt.studentId})
            </p>

            {/* Question */}
            <p className="text-white text-sm leading-relaxed mb-3">"{doubt.question}"</p>

            {/* Language badge */}
            <div className="flex items-center gap-2 mb-4">
              <Globe size={12} className="text-white/30" />
              <span className="text-xs text-white/40">Language: {doubt.language}</span>
            </div>

            {/* Answer (if answered) */}
            {doubt.status === 'answered' && doubt.answer && (
              <div className="bg-[#00FF88]/5 border border-[#00FF88]/15 rounded-xl p-3 mb-3">
                <p className="text-xs font-bold text-[#00FF88] mb-1">Your Answer:</p>
                <p className="text-sm text-white/80 leading-relaxed">{doubt.answer}</p>
              </div>
            )}

            {/* Action */}
            {doubt.status === 'pending' && (
              <button onClick={() => setAnswering(doubt)}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all hover:scale-[1.02]"
                style={{ background: ACCENT, color: '#0A0A0F' }}>
                Answer This Doubt →
              </button>
            )}
            {doubt.status === 'answered' && (
              <button onClick={() => setAnswering(doubt)}
                className="w-full py-2.5 rounded-xl text-sm border border-white/10 text-white/50 hover:bg-white/5 transition-colors font-medium">
                Edit Answer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubtManagement;
