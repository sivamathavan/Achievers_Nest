import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown, BookOpen, MessageSquare, Send } from 'lucide-react';

const ACCENT = '#4F8EF7';

const MOCK_STUDENTS = [
  { id: 'STU001', name: 'Priya Rajesh', batch: 'Class 10 CBSE - Morning', attendance: 92, avgScore: 78, lastTest: 'Algebra (85%)', class: '10', board: 'CBSE', medium: 'English', weakChapters: ['Quadratic Equations', 'Chemical Bonding'], subjects: { Maths: 82, Science: 74, English: 88 }, remarks: ['Improving in maths — 2 June 2025', 'Needs more practice — 1 May 2025'], doubtsAsked: 8, testsCompleted: 12, totalTests: 12, attendedDays: 46, totalDays: 50 },
  { id: 'STU002', name: 'Arun Kumar', batch: 'Class 10 CBSE - Morning', attendance: 85, avgScore: 65, lastTest: 'Algebra (72%)', class: '10', board: 'CBSE', medium: 'English', weakChapters: ['Chemical Bonding', 'Photosynthesis'], subjects: { Maths: 65, Science: 60, English: 70 }, remarks: ['Needs improvement in Science — 30 May 2025'], doubtsAsked: 3, testsCompleted: 11, totalTests: 12, attendedDays: 43, totalDays: 50 },
  { id: 'STU003', name: 'Karthik Raj', batch: 'Class 10 CBSE - Morning', attendance: 68, avgScore: 52, lastTest: 'Algebra (48%)', class: '10', board: 'CBSE', medium: 'Tamil', weakChapters: ['Quadratic Equations', 'Algebra'], subjects: { Maths: 50, Science: 55, English: 62 }, remarks: [], doubtsAsked: 1, testsCompleted: 9, totalTests: 12, attendedDays: 34, totalDays: 50 },
  { id: 'STU004', name: 'Meena S', batch: 'Class 8 State - Evening', attendance: 71, avgScore: 70, lastTest: 'Science (66%)', class: '8', board: 'State', medium: 'Tamil', weakChapters: ['Algebra Basics'], subjects: { Maths: 72, Science: 68, English: 75 }, remarks: ['Good progress in English — 28 May 2025'], doubtsAsked: 5, testsCompleted: 10, totalTests: 12, attendedDays: 35, totalDays: 50 },
  { id: 'STU005', name: 'Ravi K', batch: 'Class 8 State - Evening', attendance: 74, avgScore: 58, lastTest: 'Science (42%)', class: '8', board: 'State', medium: 'Tamil', weakChapters: ['Fractions', 'Forces'], subjects: { Maths: 55, Science: 50, English: 68 }, remarks: [], doubtsAsked: 2, testsCompleted: 8, totalTests: 12, attendedDays: 37, totalDays: 50 },
  { id: 'STU006', name: 'Divya M', batch: 'Class 8 State - Evening', attendance: 96, avgScore: 91, lastTest: 'Science (94%)', class: '8', board: 'State', medium: 'English', weakChapters: [], subjects: { Maths: 94, Science: 90, English: 96 }, remarks: ['Exceptional student — 25 May 2025'], doubtsAsked: 12, testsCompleted: 12, totalTests: 12, attendedDays: 48, totalDays: 50 },
];

const BATCHES = ['All Batches', 'Class 10 CBSE - Morning', 'Class 8 State - Evening'];

const SubjectBar = ({ subject, pct }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-white/70">{subject}</span>
      <span className="font-bold" style={{ color: pct >= 80 ? '#00FF88' : pct >= 60 ? '#FFD700' : '#FF4444' }}>{pct}%</span>
    </div>
    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: pct >= 80 ? '#00FF88' : pct >= 60 ? '#FFD700' : '#FF4444' }} />
    </div>
  </div>
);

// ─── STUDENT DETAIL VIEW ───────────────────────────────────────────────────
const StudentDetail = ({ student, onBack }) => {
  const [tab, setTab] = useState('Overview');
  const [remark, setRemark] = useState('');
  const [remarks, setRemarks] = useState(student.remarks);
  const TABS = ['Overview', 'Tests', 'Attendance'];

  const saveRemark = () => {
    if (!remark.trim()) return;
    const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    setRemarks([remark + ' — ' + today, ...remarks]);
    setRemark('');
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      {/* Back */}
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h2 className="text-lg font-bold text-white">{student.name}</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-5 flex items-start space-x-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #6BA8FF)` }}>
          {student.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{student.name}</h3>
          <p className="text-xs text-white/50 mt-0.5">{student.id}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-[#4F8EF7]/10 border border-[#4F8EF7]/25 text-[#4F8EF7] px-2 py-0.5 rounded-full">Class {student.class}</span>
            <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">{student.board}</span>
            <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">{student.medium} Medium</span>
            <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">{student.batch.split(' - ')[1]} Batch</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#12121A] rounded-xl p-1 border border-white/5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            style={tab === t ? { background: ACCENT } : {}}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'Overview' && (
        <div className="space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Attendance', value: `${student.attendance}%`, sub: `${student.attendedDays}/${student.totalDays} days`, color: student.attendance >= 75 ? '#00FF88' : '#FF4444' },
              { label: 'Avg Score', value: `${student.avgScore}%`, sub: `Across all tests`, color: student.avgScore >= 70 ? '#00FF88' : student.avgScore >= 50 ? '#FFD700' : '#FF4444' },
              { label: 'Tests Done', value: `${student.testsCompleted}/${student.totalTests}`, sub: 'Completed', color: ACCENT },
              { label: 'Doubts Asked', value: student.doubtsAsked, sub: 'Total', color: '#A78BFA' },
            ].map(s => (
              <div key={s.label} className="bg-[#12121A] border border-white/5 rounded-2xl p-4">
                <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-white/40 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Subject Performance */}
          <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white flex items-center"><TrendingUp size={16} className="mr-2 text-[#4F8EF7]" />Subject Performance</h3>
            {Object.entries(student.subjects).map(([sub, pct]) => (
              <SubjectBar key={sub} subject={sub} pct={pct} />
            ))}
          </div>

          {/* Weak Chapters */}
          {student.weakChapters.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
              <h3 className="font-bold text-white flex items-center mb-3"><TrendingDown size={16} className="mr-2 text-red-400" />Weak Chapters</h3>
              <div className="space-y-2">
                {student.weakChapters.map((ch, i) => (
                  <div key={ch} className="flex items-center space-x-2 text-sm">
                    <span className={i < 2 ? 'text-red-400' : 'text-yellow-400'}>{i < 2 ? '🔴' : '🟡'}</span>
                    <span className="text-white/80">{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Remark */}
          <div className="bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-5">
            <h3 className="font-bold text-white flex items-center mb-3"><MessageSquare size={16} className="mr-2 text-[#4F8EF7]" />Add Remark</h3>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="Type a remark for this student..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] resize-none placeholder:text-white/30"
            />
            <button onClick={saveRemark} disabled={!remark.trim()}
              className={`mt-3 flex items-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${remark.trim() ? 'text-[#0A0A0F] hover:scale-[1.02]' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
              style={remark.trim() ? { background: ACCENT } : {}}>
              <Send size={14} className="mr-2" /> Save Remark
            </button>
          </div>

          {/* Previous Remarks */}
          {remarks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Previous Remarks</h3>
              {remarks.map((r, i) => (
                <div key={i} className="bg-[#12121A] border border-white/5 rounded-xl p-3 border-l-2 border-l-[#4F8EF7] text-sm text-white/70">
                  "{r}"
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tests Tab */}
      {tab === 'Tests' && (
        <div className="space-y-3">
          {[
            { name: 'Algebra Chapter 3 Test', marks: '42/50', pct: 85, date: '28 May 2025', grade: 'A' },
            { name: 'Optics Weekly Test', marks: '38/50', pct: 76, date: '20 May 2025', grade: 'B+' },
            { name: 'Science Mid Term', marks: '55/75', pct: 73, date: '10 May 2025', grade: 'B' },
          ].map(test => (
            <div key={test.name} className="bg-[#12121A] border border-white/5 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-white text-sm">{test.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{test.date} • {test.marks}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: test.pct >= 80 ? '#00FF88' : test.pct >= 60 ? '#FFD700' : '#FF4444' }}>{test.pct}%</div>
                <div className="text-xs text-white/50">{test.grade}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Tab */}
      {tab === 'Attendance' && (
        <div className="space-y-4">
          <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold" style={{ color: student.attendance >= 75 ? '#00FF88' : '#FF4444' }}>{student.attendance}%</div>
            <div className="text-sm text-white/50 mt-1">{student.attendedDays} out of {student.totalDays} days attended</div>
            {student.attendance < 75 && (
              <div className="mt-3 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400">⚠️ Below 75% — Contact parent</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STUDENT LIST VIEW ─────────────────────────────────────────────────────
const StudentManagement = () => {
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (selectedStudent) {
    return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search);
    const matchBatch = batchFilter === 'All Batches' || s.batch === batchFilter;
    return matchSearch && matchBatch;
  });

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      <div>
        <h1 className="text-xl font-bold text-white">My Students</h1>
        <p className="text-sm text-white/50 mt-0.5">{MOCK_STUDENTS.length} students across {BATCHES.length - 1} batches</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#12121A] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7]/50 placeholder:text-white/30"
        />
      </div>

      {/* Batch Filter — horizontal scroll */}
      <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
        {BATCHES.map(b => (
          <button key={b} onClick={() => setBatchFilter(b)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${batchFilter === b ? 'text-[#0A0A0F]' : 'bg-[#12121A] border border-white/5 text-white/60 hover:text-white'}`}
            style={batchFilter === b ? { background: ACCENT } : {}}>
            {b}
          </button>
        ))}
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No students found</p>
          </div>
        ) : filtered.map(student => (
          <button key={student.id} onClick={() => setSelectedStudent(student)}
            className="w-full text-left bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-[#4F8EF7]/30 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}33, ${ACCENT}15)`, color: ACCENT }}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{student.name}</p>
                  <p className="text-xs text-white/40">{student.id} • {student.batch.split(' - ')[0]} • {student.batch.split(' - ')[1]} Batch</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-[#4F8EF7] transition-colors mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`rounded-xl py-2 text-xs ${student.attendance >= 75 ? 'bg-[#00FF88]/5' : 'bg-red-500/5'}`}>
                <div className="font-bold" style={{ color: student.attendance >= 75 ? '#00FF88' : '#FF4444' }}>{student.attendance}%</div>
                <div className="text-white/40 text-[10px]">Attendance</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 text-xs">
                <div className="font-bold text-[#FFD700]">{student.avgScore}%</div>
                <div className="text-white/40 text-[10px]">Avg Score</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 text-xs">
                <div className="font-bold text-white/80 text-[11px] leading-tight">{student.lastTest}</div>
                <div className="text-white/40 text-[10px]">Last Test</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;
