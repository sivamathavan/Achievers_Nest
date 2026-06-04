import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, User, BookOpen, Flame } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Find the child linked to this parent account from users list */
const findChild = (user) => {
  try {
    const usersRaw = localStorage.getItem('achievers_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    // Try to find a student whose parentPhone matches the parent's phone, or by name
    const parentPhone = user?.phone || user?.parentPhone || '';
    const parentName  = user?.name  || '';

    let child = users.find(u =>
      u.role === 'Student' && (
        u.parentPhone === parentPhone ||
        u.parentName?.toLowerCase() === parentName.toLowerCase()
      )
    );

    // Fallback: find any active student
    if (!child) child = users.find(u => u.role === 'Student' && u.status === 'Active');
    return child || null;
  } catch { return null; }
};

/** Read real attendance for a student-batch from localStorage */
const readAttendanceForMonth = (child, year, month) => {
  if (!child) return { present: new Set(), absent: new Set() };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const present = new Set();
  const absent  = new Set();

  // Find all batches to scan
  const batchIds = ['b1', 'b2', '1', '2', '3', '4', '5'];
  try {
    const batchRaw = localStorage.getItem('achievers_batches');
    const batches  = batchRaw ? JSON.parse(batchRaw) : [];
    batches.forEach(b => { batchIds.push(String(b.id)); });
  } catch {}

  const uniqueBatches = [...new Set(batchIds)];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let found = false;
    for (const bId of uniqueBatches) {
      try {
        const raw = localStorage.getItem(`attendance_${bId}_${dateStr}`);
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (data[child.id] === 'P') { present.add(day); found = true; break; }
        if (data[child.id] === 'A') { absent.add(day);  found = true; break; }
      } catch {}
    }
  }

  return { present, absent };
};

// ── Component ──────────────────────────────────────────────────────────────

const ParentAttendance = () => {
  const { user } = useAuth();
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const child = useMemo(() => findChild(user), [user]);
  const childName = child?.name || user?.childName || 'Your Child';

  const { present: presentDays, absent: absentDays } = useMemo(
    () => readAttendanceForMonth(child, viewYear, viewMonth),
    [child, viewYear, viewMonth]
  );

  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const monthName     = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const markedDays    = presentDays.size + absentDays.size;
  const attendancePct = markedDays > 0 ? Math.round((presentDays.size / markedDays) * 100) : null;
  const isGood        = attendancePct !== null && attendancePct >= 75;

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
        <p className="text-white/60 text-sm mt-1">{childName}'s attendance record</p>
      </header>

      {/* Child info card */}
      {child && (
        <div className="glass-card p-4 flex items-center space-x-4 border-l-4 border-l-gold">
          <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold text-xl font-bold shrink-0">
            {child.avatar?.startsWith('http') ? (
              <img src={child.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              child.name?.charAt(0) || '👤'
            )}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">{child.name}</p>
            <p className="text-xs text-white/50">{child.class} · {child.board} · {child.batch}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase">Roll No</p>
            <p className="text-sm font-mono text-white/70">{child.id}</p>
          </div>
        </div>
      )}

      {!child && (
        <div className="glass-card p-6 text-center border border-yellow-500/20 bg-yellow-500/5">
          <User size={32} className="mx-auto mb-2 text-yellow-400" />
          <p className="text-yellow-400 font-bold">Child Not Linked</p>
          <p className="text-white/50 text-sm mt-1">Contact the admin to link your child's account to this parent profile.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center border-l-4 border-l-[#00FF88]">
          <p className="text-2xl font-bold text-white">{presentDays.size}</p>
          <p className="text-xs text-white/50 mt-1">Present</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-l-red-400">
          <p className="text-2xl font-bold text-white">{absentDays.size}</p>
          <p className="text-xs text-white/50 mt-1">Absent</p>
        </div>
        <div className="glass-card p-4 text-center border-l-4 border-l-gold">
          {attendancePct !== null ? (
            <>
              <p className={`text-2xl font-bold ${isGood ? 'text-[#00FF88]' : 'text-orange-400'}`}>{attendancePct}%</p>
              <p className={`text-xs mt-1 font-medium ${isGood ? 'text-[#00FF88]/60' : 'text-orange-400/60'}`}>
                {isGood ? '✓ Good' : '⚠ Low'}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-white/30">—</p>
              <p className="text-xs text-white/30 mt-1">No Data</p>
            </>
          )}
        </div>
      </div>

      {/* Low attendance warning */}
      {attendancePct !== null && attendancePct < 75 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <p className="text-red-400 font-bold">Low Attendance Alert</p>
            <p className="text-sm text-red-300/70 mt-0.5">{childName}'s attendance is {attendancePct}%, which is below the required 75%. Please contact the teacher immediately.</p>
          </div>
        </div>
      )}

      {/* Month Navigation + Calendar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <button onClick={goToPrevMonth} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <span className="text-white font-semibold">{monthName}</span>
          <button
            onClick={goToNextMonth}
            disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-white/30 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isPresent = presentDays.has(day);
            const isAbsent  = absentDays.has(day);
            const isToday   = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
            const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                  isToday   ? 'border-2 border-gold bg-gold/10 text-gold' :
                  isPresent ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                  isAbsent  ? 'bg-red-500/20 text-red-400' :
                  isWeekend ? 'text-white/15' :
                  'text-white/30'
                }`}
              >
                {day}
                {isPresent && <div className="w-1 h-1 rounded-full bg-[#00FF88] mt-0.5" />}
                {isAbsent  && <div className="w-1 h-1 rounded-full bg-red-400 mt-0.5" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-5 text-xs text-white/50">
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded bg-[#00FF88]/30" /><span>Present</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded bg-red-500/30" /><span>Absent</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded border-2 border-gold/60" /><span>Today</span></div>
        </div>
      </div>

      {/* Note if no attendance data yet */}
      {markedDays === 0 && child && (
        <div className="text-center text-white/30 text-sm py-4">
          <BookOpen size={24} className="mx-auto mb-2 opacity-40" />
          No attendance records found for {monthName}.<br />
          <span className="text-[10px]">Attendance marked by teachers will appear here.</span>
        </div>
      )}
    </div>
  );
};

export default ParentAttendance;
