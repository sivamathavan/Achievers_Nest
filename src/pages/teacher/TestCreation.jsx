import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Trash2, Search, Check, X, Eye, Rocket, FileText, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ACCENT = '#4F8EF7';

const MOCK_QB = [
  { id: 'q1', text: 'Solve x² + 5x + 6 = 0', type: 'MCQ', marks: 2, chapter: 'Quadratic Equations', options: ['x = -2, -3', 'x = 2, 3', 'x = -2, 3', 'x = 2, -3'], answer: 'A' },
  { id: 'q2', text: 'Factorize x² - 4', type: 'MCQ', marks: 2, chapter: 'Quadratic Equations', options: ['(x-2)(x-2)', '(x+2)(x-2)', '(x+4)(x-1)', '(x-4)(x+1)'], answer: 'B' },
  { id: 'q3', text: 'If α and β are roots of x² - 5x + 6 = 0, find α + β', type: 'MCQ', marks: 3, chapter: 'Quadratic Equations', options: ['5', '6', '-5', '-6'], answer: 'A' },
  { id: 'q4', text: 'The discriminant of 2x² - 3x + 1 = 0 is', type: 'MCQ', marks: 2, chapter: 'Quadratic Equations', options: ['1', '2', '3', '4'], answer: 'A' },
  { id: 'q5', text: 'Nature of roots when D < 0 is', type: 'MCQ', marks: 2, chapter: 'Quadratic Equations', options: ['Real & equal', 'Real & distinct', 'Imaginary', 'Rational'], answer: 'C' },
];

const STEP_LABELS = ['Info', 'Questions', 'Schedule', 'Publish'];

// ─── STEP INDICATOR ────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
  <div className="flex items-center w-full mb-8">
    {STEP_LABELS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            i < current ? 'bg-[#00FF88] text-[#0A0A0F]' :
            i === current ? 'text-[#0A0A0F]' :
            'bg-white/10 text-white/40'
          }`} style={i === current ? { background: ACCENT } : {}}>
            {i < current ? <Check size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] mt-1.5 font-medium ${i === current ? 'text-white' : 'text-white/40'}`}>{label}</span>
        </div>
        {i < STEP_LABELS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-2 mt-[-14px] transition-all duration-300 ${i < current ? 'bg-[#00FF88]' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── CREATE QUESTION MODAL ─────────────────────────────────────────────────
const CreateQuestionModal = ({ onAdd, onClose }) => {
  const [qType, setQType] = useState('MCQ');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('A');
  const [marks, setMarks] = useState(2);
  const [explanation, setExplanation] = useState('');
  const [saveToDb, setSaveToDb] = useState(true);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ id: 'custom_' + Date.now(), text, type: qType, marks, options, answer, explanation, saveToDb });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#12121A] border border-[#4F8EF7]/25 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-white">Create New Question</h3>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs text-white/60 mb-2 block">Question Type</label>
            <div className="flex gap-2 flex-wrap">
              {['MCQ', 'True/False', 'Short Answer', 'Fill Blank'].map(t => (
                <button key={t} onClick={() => setQType(t)}
                  className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                  style={qType === t ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F', fontWeight: 'bold' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="text-xs text-white/60 mb-2 block">Question Text *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
              placeholder="Type the question..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] resize-none placeholder:text-white/30" />
          </div>

          {/* MCQ Options */}
          {qType === 'MCQ' && (
            <div className="space-y-2">
              <label className="text-xs text-white/60">Options *</label>
              {['A', 'B', 'C', 'D'].map((opt, i) => (
                <div key={opt} className="flex items-center space-x-3">
                  <button onClick={() => setAnswer(opt)}
                    className="w-9 h-9 rounded-xl border-2 text-sm font-bold flex-shrink-0 transition-all"
                    style={answer === opt ? { background: '#00FF88', borderColor: '#00FF88', color: '#0A0A0F' } : { borderColor: '#444', color: '#888' }}>
                    {opt}
                  </button>
                  <input value={options[i]} onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }}
                    placeholder={`Option ${opt}`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4F8EF7] placeholder:text-white/30" />
                </div>
              ))}
            </div>
          )}

          {/* Marks */}
          <div>
            <label className="text-xs text-white/60 mb-2 block">Marks *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5].map(m => (
                <button key={m} onClick={() => setMarks(m)}
                  className="w-12 h-10 rounded-xl border text-sm font-bold transition-all"
                  style={marks === m ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: '#444', color: '#888' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="text-xs text-white/60 mb-2 block">Explanation (shown after test)</label>
            <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2}
              placeholder="Optional explanation..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] resize-none placeholder:text-white/30" />
          </div>

          {/* Save to DB */}
          <label className="flex items-start space-x-3 bg-[#4F8EF7]/5 border border-[#4F8EF7]/20 rounded-xl p-3 cursor-pointer">
            <input type="checkbox" checked={saveToDb} onChange={e => setSaveToDb(e.target.checked)} className="mt-0.5 accent-blue-500" />
            <div>
              <p className="text-sm font-medium text-white">Save to Q&A Database</p>
              <p className="text-xs text-white/40 mt-0.5">Help future students by adding this to the shared question bank</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={handleAdd} disabled={!text.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: ACCENT, color: '#0A0A0F' }}>Add Question</button>
        </div>
      </div>
    </div>
  );
};

// ─── TEST RESULTS VIEW ─────────────────────────────────────────────────────
const TestResultsView = ({ test, onBack }) => {
  const results = [
    { name: 'Priya R.', score: 48, total: 50, grade: 'A+' },
    { name: 'Arun K.', score: 45, total: 50, grade: 'A' },
    { name: 'Meena S.', score: 43, total: 50, grade: 'A' },
    { name: 'Divya M.', score: 40, total: 50, grade: 'B+' },
    { name: 'Suresh P.', score: 37, total: 50, grade: 'B' },
    { name: 'Karthik R.', score: 24, total: 50, grade: 'F' },
    { name: 'Ravi K.', score: 21, total: 50, grade: 'F' },
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${test?.title || 'Test'} — Results`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
    doc.autoTable({
      startY: 36,
      head: [['Rank', 'Student Name', 'Score', 'Total', 'Grade']],
      body: results.map((r, i) => [
        i + 1,
        r.name,
        r.score,
        r.total,
        r.grade,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 142, 247], textColor: [255, 255, 255] },
    });
    doc.save(`${(test?.title || 'Results').replace(/\s+/g, '_')}.pdf`);
  };

  const exportExcel = () => {
    const data = results.map((r, i) => ({
      Rank: i + 1,
      Name: r.name,
      Score: r.score,
      Total: r.total,
      Percentage: `${Math.round((r.score / r.total) * 100)}%`,
      Grade: r.grade,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `${(test?.title || 'Results').replace(/\s+/g, '_')}.xlsx`);
  };

  const distData = [
    { range: '0-40', count: 2, color: '#FF4444' },
    { range: '40-60', count: 1, color: '#FFD700' },
    { range: '60-80', count: 2, color: '#4F8EF7' },
    { range: '80-100', count: 2, color: '#00FF88' },
  ];

  const avg = Math.round(results.reduce((s, r) => s + (r.score / r.total * 100), 0) / results.length);

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h2 className="text-lg font-bold text-white">{test?.title || 'Test'} — Results</h2>
      </div>

      {/* Summary */}
      <div className="bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Attempted', value: `${results.length}/${results.length}`, color: '#00FF88' },
            { label: 'Average', value: `${avg}%`, color: ACCENT },
            { label: 'Highest', value: '96%', color: '#00FF88', sub: 'Priya R.' },
            { label: 'Lowest', value: '42%', color: '#FF4444', sub: 'Ravi K.' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
              {s.sub && <div className="text-[10px] text-white/30">{s.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Score distribution */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Score Distribution</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <RTooltip contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '12px' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4">
        <h3 className="font-bold text-red-400 text-sm mb-2">⚠️ Needs Attention (Below 50%)</h3>
        {results.filter(r => r.score / r.total < 0.5).map(r => (
          <div key={r.name} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
            <span className="text-white/70">• {r.name}</span>
            <span className="text-red-400 font-bold">{r.score}/{r.total}</span>
          </div>
        ))}
      </div>

      {/* Results table (cards on mobile) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">All Results</h3>
        {results.map((r, idx) => {
          const pct = Math.round((r.score / r.total) * 100);
          return (
            <div key={r.name} className="bg-[#12121A] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-400 text-[#0A0A0F]' : 'bg-white/10 text-white/60'}`}>#{idx + 1}</div>
                <span className="font-medium text-white text-sm">{r.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white/50 text-sm">{r.score}/{r.total}</span>
                <span className="font-bold text-sm px-2 py-0.5 rounded-lg" style={{
                  background: pct >= 80 ? '#00FF88' + '20' : pct >= 60 ? '#FFD700' + '20' : '#FF4444' + '20',
                  color: pct >= 80 ? '#00FF88' : pct >= 60 ? '#FFD700' : '#FF4444',
                }}>{r.grade}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export */}
      <div className="flex space-x-3">
        <button
          onClick={exportPDF}
          className="flex-1 flex items-center justify-center py-3 bg-[#12121A] border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
        >
          <FileText size={16} className="mr-2" /> Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="flex-1 flex items-center justify-center py-3 bg-[#12121A] border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
        >
          <BarChart2 size={16} className="mr-2" /> Export Excel
        </button>
      </div>
    </div>
  );
};

// ─── MAIN TEST CREATION COMPONENT ─────────────────────────────────────────
const TestCreation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0-3 = create wizard
  const [showModal, setShowModal] = useState(false);
  const [qSearch, setQSearch] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [published, setPublished] = useState(false);

  // Step 1 form state
  const [form, setForm] = useState({ title: '', subject: '', chapter: '', batch: '', timer: '45', marks: '50', type: 'Chapter-wise', instructions: '' });
  // Step 3 state
  const [schedule, setSchedule] = useState({ date: '', time: '16:00', until: '', attempts: 'once', answers: 'immediately' });

  const addQuestion = (q) => {
    if (!selectedQuestions.find(s => s.id === q.id)) {
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };
  const removeQuestion = (id) => setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));

  const filteredQB = MOCK_QB.filter(q => q.text.toLowerCase().includes(qSearch.toLowerCase()));

  const [tests, setTests] = useState([
    { id: 't1', title: 'Algebra Chapter 3 Test', batch: 'Class 10 CBSE', questions: 20, timer: 45, status: 'Scheduled', date: '5 June 2025, 4:00 PM' },
    { id: 't2', title: 'Optics Weekly Test', batch: 'Class 10 CBSE', questions: 15, timer: 30, status: 'Completed', date: '28 May 2025' },
    { id: 't3', title: 'Algebra Basics Draft', batch: 'Class 9 State', questions: 8, timer: 20, status: 'Draft', date: '—' },
  ]);
  const [testsFilter, setTestsFilter] = useState('All');
  const [draftSaved, setDraftSaved] = useState(false);
  const DRAFT_KEY = 'achievers_test_draft';

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.form) setForm(draft.form);
        if (draft.selectedQuestions) setSelectedQuestions(draft.selectedQuestions);
        if (draft.schedule) setSchedule(draft.schedule);
      } catch (e) {
        // ignore corrupted draft
      }
    }
  }, []);

  const saveAsDraft = () => {
    const draft = { form, selectedQuestions, schedule, savedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handlePublish = () => {
    const newTest = {
      id: 't-' + Date.now(),
      title: form.title || 'Untitled Test',
      batch: form.batch || 'Class 10 CBSE - Morning',
      questions: selectedQuestions.length,
      timer: parseInt(form.timer) || 45,
      status: 'Scheduled',
      date: schedule.date ? `${new Date(schedule.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}, ${schedule.time}` : 'Scheduled'
    };
    const prevTests = JSON.parse(localStorage.getItem('achievers_tests') || '[]');
    const currentTests = prevTests.length > 0 ? prevTests : [
      { id: 't1', title: 'Algebra Chapter 3 Test', batch: 'Class 10 CBSE', questions: 20, timer: 45, status: 'Scheduled', date: '5 June 2025, 4:00 PM' },
      { id: 't2', title: 'Optics Weekly Test', batch: 'Class 10 CBSE', questions: 15, timer: 30, status: 'Completed', date: '28 May 2025' },
      { id: 't3', title: 'Algebra Basics Draft', batch: 'Class 9 State', questions: 8, timer: 20, status: 'Draft', date: '—' },
    ];
    localStorage.setItem('achievers_tests', JSON.stringify([newTest, ...currentTests]));
    setPublished(true);
  };

  const filteredTests = testsFilter === 'All'
    ? tests
    : tests.filter(t => t.status === testsFilter);

  const handleDeleteTest = (testId) => {
    if (!window.confirm('Delete this test? This cannot be undone.')) return;
    setTests(prev => prev.filter(t => t.id !== testId));
  };

  // List/Results views
  if (step === -2) return <TestResultsView test={selectedTest} onBack={() => setStep(-1)} />;

  if (step === -1) {
    return (
      <div className="space-y-5 max-w-2xl mx-auto pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Test Management</h1>
            <p className="text-sm text-white/50 mt-0.5">{tests.length} tests created</p>
          </div>
          <button onClick={() => setStep(0)} className="flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]" style={{ background: ACCENT, color: '#0A0A0F' }}>
            <Plus size={16} className="mr-2" /> New Test
          </button>
        </div>

        <div className="flex gap-2 bg-[#12121A] rounded-xl p-1 border border-white/5">
          {['All', 'Scheduled', 'Completed', 'Draft'].map(t => (
            <button
              key={t}
              onClick={() => setTestsFilter(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                testsFilter === t
                  ? 'text-[#0A0A0F] font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
              style={testsFilter === t ? { background: '#4F8EF7' } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTests.map(test => (
            <div key={test.id} className="bg-[#12121A] border border-white/5 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white">{test.title}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{test.batch} • {test.questions} Qs • {test.timer} min</p>
                  <p className="text-xs text-white/40 mt-0.5">{test.date}</p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${
                  test.status === 'Scheduled' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  test.status === 'Completed' ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' :
                  'bg-white/5 text-white/40 border-white/10'
                }`}>{test.status}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm(f => ({ ...f, title: test.title, batch: test.batch }));
                    setStep(0);
                  }}
                  className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Edit
                </button>
                <button onClick={() => { setSelectedTest(test); setStep(-2); }}
                  className="flex-1 py-2 text-xs rounded-lg font-medium transition-colors" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                  View Results
                </button>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="py-2 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (published) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
          <Rocket size={48} style={{ color: ACCENT }} />
        </div>
        <h2 className="text-2xl font-bold text-white">Test Published!</h2>
        <p className="text-white/60">Students can now see the test in their portal.</p>
        <div className="flex gap-3">
          <button onClick={() => { navigate('/teacher/results'); }}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#12121A] border border-white/10 text-white hover:bg-white/5 transition-colors">
            View All Tests
          </button>
          <button onClick={() => { setPublished(false); setStep(0); setSelectedQuestions([]); setForm({ title: '', subject: '', chapter: '', batch: '', timer: '45', marks: '50', type: 'Chapter-wise', instructions: '' }); }}
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: ACCENT, color: '#0A0A0F' }}>
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step === 0 ? navigate('/teacher/results') : setStep(s => s - 1)}
          className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h1 className="text-base font-bold text-white">Create Test</h1>
        <div className="w-9" />
      </div>

      <StepIndicator current={step} />

      {/* STEP 1 — INFO */}
      {step === 0 && (
        <div className="space-y-4">
          {[
            { label: 'Test Title *', key: 'title', placeholder: 'e.g. Algebra Chapter 3 Test', type: 'text' },
            { label: 'Subject *', key: 'subject', placeholder: 'e.g. Maths', type: 'text' },
            { label: 'Chapter', key: 'chapter', placeholder: 'e.g. Chapter 3', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/60 mb-1.5 block">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7] placeholder:text-white/30" />
            </div>
          ))}

          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Target Batch *</label>
            <select value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7]">
              <option value="">Select batch...</option>
              <option>Class 10 CBSE - Morning</option>
              <option>Class 8 State - Evening</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-2 block">Test Type</label>
            <div className="space-y-2">
              {['Chapter-wise', 'Full Syllabus', 'Previous Year Paper'].map(t => (
                <label key={t} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.type === t ? 'border-[#4F8EF7]' : 'border-white/30'}`}
                    onClick={() => setForm({ ...form, type: t })}>
                    {form.type === t && <div className="w-2.5 h-2.5 rounded-full bg-[#4F8EF7]" />}
                  </div>
                  <span className="text-white text-sm">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Timer (minutes) *</label>
              <input type="number" value={form.timer} onChange={e => setForm({ ...form, timer: e.target.value })}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7]" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Total Marks *</label>
              <input type="number" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7]" />
            </div>
          </div>

          <button onClick={() => setStep(1)} disabled={!form.title || !form.batch}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center transition-all disabled:opacity-40 hover:scale-[1.02]"
            style={{ background: ACCENT, color: '#0A0A0F' }}>
            Next: Add Questions <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      )}

      {/* STEP 2 — QUESTIONS */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-white">Questions ({selectedQuestions.length} added)</h2>
            <button onClick={() => setShowModal(true)}
              className="flex items-center text-sm px-3 py-2 rounded-xl font-medium border transition-all" style={{ borderColor: `${ACCENT}40`, color: ACCENT, background: `${ACCENT}10` }}>
              <Plus size={15} className="mr-1.5" /> Create New
            </button>
          </div>

          {/* Question Bank Search */}
          <div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={qSearch} onChange={e => setQSearch(e.target.value)}
                placeholder="Search question bank..."
                className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] placeholder:text-white/30" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredQB.map(q => {
                const isAdded = selectedQuestions.some(s => s.id === q.id);
                return (
                  <div key={q.id} className={`p-3.5 rounded-xl border transition-all ${isAdded ? 'bg-[#4F8EF7]/5 border-[#4F8EF7]/25' : 'bg-[#12121A] border-white/5'}`}>
                    <p className="text-sm text-white mb-1.5">{q.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 text-[11px] text-white/40">
                        <span>{q.type}</span><span>•</span><span>{q.marks} marks</span>
                      </div>
                      <button onClick={() => addQuestion(q)} disabled={isAdded}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${isAdded ? 'text-[#4F8EF7] bg-[#4F8EF7]/10' : 'text-[#0A0A0F] hover:scale-105'}`}
                        style={!isAdded ? { background: ACCENT } : {}}>
                        {isAdded ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Added Questions */}
          {selectedQuestions.length > 0 && (
            <div>
              <h3 className="text-xs text-white/60 uppercase tracking-wider font-bold mb-2">Added ({selectedQuestions.length})</h3>
              <div className="space-y-2">
                {selectedQuestions.map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-[#12121A] border border-white/5 rounded-xl">
                    <span className="text-sm text-white/80 flex-1 mr-3">{i + 1}. {q.text.substring(0, 50)}{q.text.length > 50 ? '...' : ''}</span>
                    <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium transition-colors">← Back</button>
            <button onClick={() => setStep(2)} disabled={selectedQuestions.length === 0}
              className="flex-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-40 hover:scale-[1.02]" style={{ background: ACCENT, color: '#0A0A0F' }}>
              Next: Schedule →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — SCHEDULE */}
      {step === 2 && (
        <div className="space-y-5">
          {[
            { label: 'Publish Date *', key: 'date', type: 'date' },
            { label: 'Start Time *', key: 'time', type: 'time' },
            { label: 'Available Until', key: 'until', type: 'date' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/60 mb-1.5 block">{f.label}</label>
              <input type={f.type} value={schedule[f.key]} onChange={e => setSchedule({ ...schedule, [f.key]: e.target.value })}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7]" />
            </div>
          ))}

          <div>
            <label className="text-xs text-white/60 mb-2 block">Attempts Allowed</label>
            <div className="space-y-2">
              {['Once only', 'Multiple attempts'].map(opt => (
                <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${schedule.attempts === (opt === 'Once only' ? 'once' : 'multi') ? 'border-[#4F8EF7]' : 'border-white/30'}`}
                    onClick={() => setSchedule({ ...schedule, attempts: opt === 'Once only' ? 'once' : 'multi' })}>
                    {schedule.attempts === (opt === 'Once only' ? 'once' : 'multi') && <div className="w-2.5 h-2.5 rounded-full bg-[#4F8EF7]" />}
                  </div>
                  <span className="text-sm text-white">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-2 block">Show Answers After Submit?</label>
            <div className="space-y-2">
              {['Immediately', 'After deadline', 'Never (teacher grades)'].map(opt => (
                <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${schedule.answers === opt.toLowerCase().split(' ')[0] ? 'border-[#4F8EF7]' : 'border-white/30'}`}
                    onClick={() => setSchedule({ ...schedule, answers: opt.toLowerCase().split(' ')[0] })}>
                    {schedule.answers === opt.toLowerCase().split(' ')[0] && <div className="w-2.5 h-2.5 rounded-full bg-[#4F8EF7]" />}
                  </div>
                  <span className="text-sm text-white">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium transition-colors">← Back</button>
            <button onClick={() => setStep(3)} className="flex-2 py-3.5 px-6 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all" style={{ background: ACCENT, color: '#0A0A0F' }}>
              Next: Preview →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — PREVIEW */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="bg-[#12121A] border border-[#4F8EF7]/20 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-white flex items-center"><Eye size={16} className="mr-2 text-[#4F8EF7]" />Test Summary</h3>
            {[
              ['Title', form.title || '—'],
              ['Batch', form.batch || '—'],
              ['Questions', selectedQuestions.length],
              ['Total Marks', form.marks],
              ['Timer', `${form.timer} minutes`],
              ['Date', schedule.date ? new Date(schedule.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—'],
              ['Time', schedule.time || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0">
                <span className="text-white/50">{k}</span>
                <span className="font-medium text-white">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="py-3.5 px-5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm font-medium transition-colors">← Back</button>
            <button
              onClick={saveAsDraft}
              className={`flex-1 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                draftSaved
                  ? 'border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]'
                  : 'border-white/10 text-white hover:bg-white/5'
              }`}
            >
              {draftSaved ? '✓ Draft Saved!' : 'Save as Draft'}
            </button>
            <button onClick={handlePublish}
               className="flex-2 py-3.5 px-6 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center" style={{ background: ACCENT, color: '#0A0A0F' }}>
               <Rocket size={16} className="mr-2" /> Publish
             </button>
          </div>
        </div>
      )}

      {showModal && <CreateQuestionModal onAdd={addQuestion} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default TestCreation;
