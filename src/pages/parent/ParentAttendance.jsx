import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ParentAttendance = () => {
  const { user } = useAuth();
  const childName = user?.childName || 'Your Child';
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // Mock attendance: present on weekdays except some
  const absentDays = new Set([3, 10, 17]);
  const presentDays = new Set(
    Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => {
      const dayOfWeek = new Date(viewYear, viewMonth, d).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6 && !absentDays.has(d);
    })
  );

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const totalWorkingDays = presentDays.size + absentDays.size;
  const attendancePct = totalWorkingDays > 0 ? Math.round((presentDays.size / totalWorkingDays) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
        <p className="text-white/60 text-sm">{childName}'s attendance record</p>
      </header>

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
          <p className={`text-2xl font-bold ${attendancePct >= 75 ? 'text-[#00FF88]' : 'text-orange-400'}`}>{attendancePct}%</p>
          <p className="text-xs text-white/50 mt-1">Overall</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
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
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-white/30 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isPresent = presentDays.has(day);
            const isAbsent = absentDays.has(day);
            const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
            const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium ${
                  isToday ? 'border-2 border-gold text-white' :
                  isPresent ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                  isAbsent ? 'bg-red-500/20 text-red-400' :
                  isWeekend ? 'text-white/15' :
                  'text-white/30'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-white/50">
          <div className="flex items-center space-x-1"><div className="w-3 h-3 rounded bg-[#00FF88]/30" /><span>Present</span></div>
          <div className="flex items-center space-x-1"><div className="w-3 h-3 rounded bg-red-500/30" /><span>Absent</span></div>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendance;
