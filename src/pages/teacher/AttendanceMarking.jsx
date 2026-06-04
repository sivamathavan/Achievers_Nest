import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, Save, Clock, Users, AlertTriangle, Check, Calendar } from 'lucide-react';

const BATCHES = [
  { id: 'b1', name: 'Class 10 CBSE - Morning', time: '4:00 PM – 5:30 PM', students: [
    { id: 'STU001', name: 'Arun Kumar' },
    { id: 'STU002', name: 'Priya Rajesh' },
    { id: 'STU003', name: 'Karthik Raj' },
    { id: 'STU004', name: 'Meena S' },
    { id: 'STU005', name: 'Ravi K' },
    { id: 'STU006', name: 'Divya M' },
    { id: 'STU007', name: 'Suresh P' },
    { id: 'STU008', name: 'Anitha R' },
    { id: 'STU009', name: 'Bala K' },
    { id: 'STU010', name: 'Chitra V' },
    { id: 'STU011', name: 'Deepak N' },
    { id: 'STU012', name: 'Ezhil A' },
    { id: 'STU013', name: 'Fathima B' },
    { id: 'STU014', name: 'Gopal S' },
    { id: 'STU015', name: 'Hema T' },
    { id: 'STU016', name: 'Indira K' },
    { id: 'STU017', name: 'Jai P' },
    { id: 'STU018', name: 'Kavitha R' },
  ]},
  { id: 'b2', name: 'Class 8 State - Evening', time: '5:30 PM – 7:00 PM', students: [
    { id: 'STU019', name: 'Latha M' },
    { id: 'STU020', name: 'Mani R' },
    { id: 'STU021', name: 'Nisha K' },
    { id: 'STU022', name: 'Om P' },
    { id: 'STU023', name: 'Prabha S' },
    { id: 'STU024', name: 'Renu D' },
    { id: 'STU025', name: 'Senthil V' },
    { id: 'STU026', name: 'Tara M' },
  ]},
];

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function getLocalKey(batchId, date) {
  return `attendance_${batchId}_${date}`;
}

function saveLocally(batchId, date, data) {
  localStorage.setItem(getLocalKey(batchId, date), JSON.stringify(data));
}

function loadLocally(batchId, date) {
  try {
    return JSON.parse(localStorage.getItem(getLocalKey(batchId, date))) || {};
  } catch { return {}; }
}

function getLowAttendanceAlerts() {
  return [
    { name: 'Karthik Raj', pct: 68 },
    { name: 'Meena S', pct: 71 },
    { name: 'Ravi K', pct: 74 },
  ];
}

// ─── HISTORY (calendar) VIEW ───────────────────────────────────────────────
const HistoryView = ({ onBack }) => {
  const today = new Date();
  const [batch, setBatch] = useState(BATCHES[0].id);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const alerts = getLowAttendanceAlerts();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sunday

  // Read marked days from localStorage for selected batch & month
  const markedDays = React.useMemo(() => {
    const marked = new Set();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const key = `attendance_${batch}_${dateStr}`;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Object.keys(parsed).length > 0) marked.add(d);
        } catch (_) {}
      }
    }
    return marked;
  }, [batch, viewYear, viewMonth, daysInMonth]);

  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Attendance History</h2>
          <p className="text-xs text-white/50">{monthName}</p>
        </div>
      </div>

      <select
        value={batch}
        onChange={e => setBatch(e.target.value)}
        className="w-full bg-[#12121A] border border-[#4F8EF7]/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4F8EF7]"
      >
        {BATCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={goToPrevMonth} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <ChevronLeft size={16} className="text-white" />
        </button>
        <span className="text-white font-semibold text-sm">{monthName}</span>
        <button
          onClick={goToNextMonth}
          disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-4">
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-white/30 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isMarked = markedDays.has(day);
            const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  isToday
                    ? 'border-2 border-[#4F8EF7] text-white'
                    : isMarked
                    ? 'bg-[#00FF88]/20 text-[#00FF88]'
                    : 'text-white/30'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{markedDays.size}</p>
          <p className="text-xs text-white/50 mt-1">Classes Taken This Month</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-[#00FF88]">
            {daysInMonth > 0 ? `${Math.round((markedDays.size / Math.max(1, daysInMonth)) * 100)}%` : '—'}
          </p>
          <p className="text-xs text-white/50 mt-1">Month Coverage</p>
        </div>
      </div>

      {/* Low Attendance Alerts */}
      {alerts.length > 0 && (
        <div className="bg-orange-400/5 border border-orange-400/20 rounded-2xl p-4">
          <h3 className="text-orange-400 font-bold text-sm flex items-center mb-3">
            <AlertTriangle size={16} className="mr-2" /> Low Attendance Alerts
          </h3>
          {alerts.map(a => (
            <div key={a.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-white/80 text-sm">{a.name}</span>
              <span className="text-orange-400 font-bold text-sm">{a.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── STEP 2: MARK ATTENDANCE ───────────────────────────────────────────────
const MarkStep = ({ batch, date, onBack, onSaved }) => {
  const [attendance, setAttendance] = useState(() => loadLocally(batch.id, date));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync to server (mock)
      const key = getLocalKey(batch.id, date);
      const local = localStorage.getItem(key);
      if (local) {
        console.log('🔄 Online — syncing attendance to server:', JSON.parse(local));
        // In real app: await supabase.from('attendance').upsert(...)
      }
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, [batch.id, date]);

  const mark = (studentId, status) => {
    const updated = { ...attendance, [studentId]: status };
    setAttendance(updated);
    saveLocally(batch.id, date, updated);
  };

  const markAll = (status) => {
    const updated = {};
    batch.students.forEach(s => updated[s.id] = status);
    setAttendance(updated);
    saveLocally(batch.id, date, updated);
  };

  const present = Object.values(attendance).filter(v => v === 'P').length;
  const absent = Object.values(attendance).filter(v => v === 'A').length;
  const remaining = batch.students.length - present - absent;
  const allMarked = remaining === 0;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    onSaved();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div>
          <h2 className="text-base font-bold text-white">{batch.name}</h2>
          <p className="text-xs text-white/50">{new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        {!isOnline && (
          <div className="ml-auto flex items-center bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1 text-xs text-orange-400 font-medium">
            📶 Offline — saved locally
          </div>
        )}
      </div>

      {/* Mark All + Progress */}
      <div className="bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-white/60">{present}/{batch.students.length} marked present</span>
          <div className="flex space-x-2">
            <button onClick={() => markAll('P')} className="text-xs bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] px-3 py-1.5 rounded-lg font-medium hover:bg-[#00FF88]/25 transition-colors">✅ All Present</button>
            <button onClick={() => markAll('A')} className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-medium hover:bg-red-500/20 transition-colors">❌ All Absent</button>
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4F8EF7] to-[#00FF88] transition-all duration-500 rounded-full"
            style={{ width: `${((present + absent) / batch.students.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-white/40">
          <span>🟢 Present: {present}</span>
          <span>🔴 Absent: {absent}</span>
          <span>⬜ Remaining: {remaining}</span>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {batch.students.map((student, idx) => {
          const status = attendance[student.id];
          return (
            <div key={student.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
              status === 'P' ? 'bg-[#00FF88]/5 border-[#00FF88]/25' :
              status === 'A' ? 'bg-red-500/5 border-red-500/20' :
              'bg-[#12121A] border-white/5'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  status === 'P' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                  status === 'A' ? 'bg-red-500/20 text-red-400' :
                  'bg-white/10 text-white/60'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{student.name}</p>
                  <p className="text-[11px] text-white/40">{student.id}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* PRESENT BUTTON — 48px tap target */}
                <button
                  onClick={() => mark(student.id, 'P')}
                  className="w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center"
                  style={{
                    background: status === 'P' ? '#00FF88' : 'transparent',
                    color: status === 'P' ? '#0A0A0F' : '#888',
                    borderColor: status === 'P' ? '#00FF88' : '#444',
                  }}
                >P</button>
                {/* ABSENT BUTTON — 48px tap target */}
                <button
                  onClick={() => mark(student.id, 'A')}
                  className="w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center"
                  style={{
                    background: status === 'A' ? '#FF4444' : 'transparent',
                    color: status === 'A' ? '#fff' : '#888',
                    borderColor: status === 'A' ? '#FF4444' : '#444',
                  }}
                >A</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!allMarked || saving || saved}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center transition-all duration-300 ${
          saved ? 'bg-[#00FF88] text-[#0A0A0F]' :
          allMarked ? 'bg-gradient-to-r from-[#4F8EF7] to-[#6BA8FF] text-white shadow-[0_4px_20px_rgba(79,142,247,0.3)] hover:scale-[1.02]' :
          'bg-white/5 text-white/30 cursor-not-allowed'
        }`}
      >
        {saving ? (
          <><svg className="animate-spin mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
        ) : saved ? (
          <><Check size={20} className="mr-2" /> Attendance Saved!</>
        ) : allMarked ? (
          <><Save size={20} className="mr-2" /> Save Attendance</>
        ) : (
          `Mark ${remaining} more student${remaining > 1 ? 's' : ''} to save`
        )}
      </button>
    </div>
  );
};

// ─── MAIN ATTENDANCE MARKING SCREEN ───────────────────────────────────────
const AttendanceMarking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // 'select' | 'mark' | 'history' | 'success'
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  if (step === 'history') {
    return (
      <div className="max-w-2xl mx-auto pb-8">
        <HistoryView onBack={() => setStep('select')} />
      </div>
    );
  }

  if (step === 'mark' && selectedBatch) {
    return (
      <div className="max-w-2xl mx-auto pb-8">
        <MarkStep
          batch={selectedBatch}
          date={selectedDate}
          onBack={() => setStep('select')}
          onSaved={() => setTimeout(() => setStep('select'), 1500)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mark Attendance</h1>
          <p className="text-sm text-white/50 mt-0.5">Select a batch to get started</p>
        </div>
        <button onClick={() => setStep('history')} className="flex items-center text-sm bg-[#4F8EF7]/10 border border-[#4F8EF7]/25 text-[#4F8EF7] px-4 py-2 rounded-xl hover:bg-[#4F8EF7]/20 transition-colors font-medium">
          <Calendar size={16} className="mr-2" /> History
        </button>
      </div>

      {/* Date Picker */}
      <div className="bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 mb-1">Date</p>
          <p className="font-bold text-white">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          max={todayStr}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-[#4F8EF7]/10 border border-[#4F8EF7]/30 text-[#4F8EF7] px-3 py-2 rounded-xl text-sm focus:outline-none"
        />
      </div>

      {/* Batch Cards */}
      <div className="space-y-3">
        {BATCHES.map(batch => {
          const local = loadLocally(batch.id, selectedDate);
          const markedCount = Object.keys(local).length;
          const isDone = markedCount === batch.students.length;
          return (
            <button
              key={batch.id}
              onClick={() => { setSelectedBatch(batch); setStep('mark'); }}
              className="w-full text-left bg-[#12121A] border border-[#4F8EF7]/15 rounded-2xl p-5 hover:border-[#4F8EF7]/40 hover:bg-[#4F8EF7]/5 transition-all duration-200 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-white">{batch.name}</h3>
                    {isDone && <span className="text-[10px] bg-[#00FF88]/15 text-[#00FF88] px-2 py-0.5 rounded-full font-bold border border-[#00FF88]/25">DONE</span>}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/50">
                    <span className="flex items-center"><Clock size={12} className="mr-1" />{batch.time}</span>
                    <span className="flex items-center"><Users size={12} className="mr-1" />{batch.students.length} students</span>
                  </div>
                  {markedCount > 0 && !isDone && (
                    <div className="mt-2 text-xs text-[#4F8EF7]">📊 {markedCount}/{batch.students.length} marked — tap to continue</div>
                  )}
                </div>
                <ChevronRight size={20} className="text-white/30 group-hover:text-[#4F8EF7] transition-colors mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Offline badge */}
      {!navigator.onLine && (
        <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
          <span className="text-orange-400">📶</span>
          <p className="text-sm text-orange-400">You're offline. Attendance will be saved locally and synced when connected.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;
