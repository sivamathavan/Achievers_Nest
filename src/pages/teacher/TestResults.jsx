import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Trash2, BarChart2, Search, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ACCENT = '#4F8EF7';

const initialMockTests = [
  { id: 't1', title: 'Algebra Chapter 3 Test', batch: 'Class 10 CBSE', questions: 20, timer: 45, status: 'Scheduled', date: '5 June 2025, 4:00 PM' },
  { id: 't2', title: 'Optics Weekly Test', batch: 'Class 10 CBSE', questions: 15, timer: 30, status: 'Completed', date: '28 May 2025' },
  { id: 't3', title: 'Algebra Basics Draft', batch: 'Class 9 State', questions: 8, timer: 20, status: 'Draft', date: '—' },
];

const mockResults = [
  { name: 'Priya R.', score: 48, total: 50, grade: 'A+' },
  { name: 'Arun K.', score: 45, total: 50, grade: 'A' },
  { name: 'Meena S.', score: 43, total: 50, grade: 'A' },
  { name: 'Divya M.', score: 40, total: 50, grade: 'B+' },
  { name: 'Suresh P.', score: 37, total: 50, grade: 'B' },
  { name: 'Karthik R.', score: 24, total: 50, grade: 'F' },
  { name: 'Ravi K.', score: 21, total: 50, grade: 'F' },
];

const TestResultsView = ({ test, onBack }) => {
  // Load real student results from localStorage if they exist, or fallback
  const results = React.useMemo(() => {
    try {
      const storedResults = JSON.parse(localStorage.getItem('achievers_results') || '[]');
      if (storedResults.length > 0) {
        // Map student results to teacher layout
        return storedResults.map((r, idx) => ({
          name: `Student Attempt ${idx + 1}`,
          score: r.score,
          total: r.total,
          grade: r.percentage >= 90 ? 'A+' : r.percentage >= 80 ? 'A' : r.percentage >= 70 ? 'B+' : r.percentage >= 60 ? 'B' : 'F'
        }));
      }
    } catch (e) {}
    return mockResults;
  }, []);

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

  const distData = React.useMemo(() => {
    let ranges = { '0-40': 0, '40-60': 0, '60-80': 0, '80-100': 0 };
    results.forEach(r => {
      const pct = (r.score / r.total) * 100;
      if (pct < 40) ranges['0-40']++;
      else if (pct < 60) ranges['40-60']++;
      else if (pct < 80) ranges['60-80']++;
      else ranges['80-100']++;
    });
    return [
      { range: '0-40', count: ranges['0-40'], color: '#FF4444' },
      { range: '40-60', count: ranges['40-60'], color: '#FFD700' },
      { range: '60-80', count: ranges['60-80'], color: '#4F8EF7' },
      { range: '80-100', count: ranges['80-100'], color: '#00FF88' },
    ];
  }, [results]);

  const avg = Math.round(results.reduce((s, r) => s + (r.score / r.total * 100), 0) / results.length);
  const highest = Math.max(...results.map(r => Math.round(r.score / r.total * 100)));
  const lowest = Math.min(...results.map(r => Math.round(r.score / r.total * 100)));

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8 animate-in fade-in">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
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
            { label: 'Highest', value: `${highest}%`, color: '#00FF88' },
            { label: 'Lowest', value: `${lowest}%`, color: '#FF4444' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
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
        {results.filter(r => r.score / r.total < 0.5).length === 0 ? (
          <p className="text-xs text-white/40">No students are currently below 50%. Keep it up!</p>
        ) : (
          results.filter(r => r.score / r.total < 0.5).map(r => (
            <div key={r.name} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
              <span className="text-white/70">• {r.name}</span>
              <span className="text-red-400 font-bold">{r.score}/{r.total}</span>
            </div>
          ))
        )}
      </div>

      {/* Results table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">All Results</h3>
        {results.map((r, idx) => {
          const pct = Math.round((r.score / r.total) * 100);
          return (
            <div key={r.name} className="bg-[#12121A] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
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
      <div className="flex space-x-3 pt-4">
        <button
          onClick={exportPDF}
          className="flex-1 flex items-center justify-center py-3 bg-[#12121A] border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
        >
          <FileText size={16} className="mr-2" /> Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="flex-1 flex items-center justify-center py-3 bg-[#12121A] border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
        >
          <BarChart2 size={16} className="mr-2" /> Export Excel
        </button>
      </div>
    </div>
  );
};

const TestResults = () => {
  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('achievers_tests');
    return saved ? JSON.parse(saved) : initialMockTests;
  });
  const [filter, setFilter] = useState('All');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    localStorage.setItem('achievers_tests', JSON.stringify(tests));
  }, [tests]);

  const filteredTests = filter === 'All' ? tests : tests.filter(t => t.status === filter);

  const handleDeleteTest = (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      setTests(prev => prev.filter(t => t.id !== id));
    }
  };

  if (selectedTest) {
    return <TestResultsView test={selectedTest} onBack={() => setSelectedTest(null)} />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Test Results & Analytics</h1>
        <p className="text-white/60 mt-1">Review student performance reports and metrics.</p>
      </div>

      <div className="flex gap-2 bg-[#12121A] rounded-xl p-1 border border-white/5">
        {['All', 'Scheduled', 'Completed', 'Draft'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === t ? 'text-[#0A0A0F] font-bold' : 'text-white/50 hover:text-white'
            }`}
            style={filter === t ? { background: '#4F8EF7' } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTests.length === 0 ? (
          <div className="text-center py-10 text-white/40">No tests found under this category.</div>
        ) : (
          filteredTests.map(test => (
            <div key={test.id} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white">{test.title}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{test.batch} • {test.questions} Qs • {test.timer} min</p>
                  {test.date && <p className="text-xs text-white/40 mt-1">{test.date}</p>}
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${
                  test.status === 'Scheduled' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  test.status === 'Completed' ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20' :
                  'bg-white/5 text-white/40 border-white/10'
                }`}>{test.status}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTest(test)}
                  className="flex-1 py-2.5 text-xs rounded-lg font-bold transition-all hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                  style={{ background: ACCENT, color: '#0A0A0F' }}
                >
                  View Performance <ArrowRight size={14} className="ml-1" />
                </button>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="py-2 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestResults;
