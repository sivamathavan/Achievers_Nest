import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Users, CheckCircle2, XCircle, AlertTriangle, TrendingUp, UserCheck } from 'lucide-react';

const AdminAttendance = () => {
  const today = new Date();
  
  // State variables
  const [selectedBatchId, setSelectedBatchId] = useState('b1');
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Merge static default batches with dynamic batches from localStorage
  const allBatches = useMemo(() => {
    const defaults = [
      { id: 'b1', name: 'Class 10 CBSE - Morning Batch', students: [
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
      { id: 'b2', name: 'Class 8 State - Evening Batch', students: [
        { id: 'STU019', name: 'Latha M' },
        { id: 'STU020', name: 'Mani R' },
        { id: 'STU021', name: 'Nisha K' },
        { id: 'STU022', name: 'Om P' },
        { id: 'STU023', name: 'Prabha S' },
        { id: 'STU024', name: 'Renu D' },
        { id: 'STU025', name: 'Senthil V' },
        { id: 'STU026', name: 'Tara M' },
      ]}
    ];

    try {
      const savedBatches = localStorage.getItem('achievers_batches');
      const savedUsers = localStorage.getItem('achievers_users');
      
      const parsedBatches = savedBatches ? JSON.parse(savedBatches) : [];
      const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];

      parsedBatches.forEach(batch => {
        const batchIdStr = String(batch.id);
        if (batchIdStr !== '1' && batchIdStr !== '2' && batchIdStr !== 'b1' && batchIdStr !== 'b2') {
          const batchStudents = parsedUsers
            .filter(u => u.role === 'Student' && (u.batch === batch.name || u.batch?.includes(batch.name)))
            .map(u => ({ id: u.id, name: u.name }));
            
          defaults.push({
            id: batchIdStr,
            name: `${batch.name} (${batch.class})`,
            students: batchStudents.length > 0 ? batchStudents : [
              { id: 'STU001', name: 'Rahul Sharma' },
              { id: 'STU002', name: 'Priya Patel' },
              { id: 'STU003', name: 'Amit Kumar' }
            ]
          });
        }
      });
    } catch (e) {
      console.error('Error fetching batches/users for attendance view', e);
    }
    return defaults;
  }, []);

  const activeBatch = useMemo(() => {
    return allBatches.find(b => b.id === selectedBatchId) || allBatches[0];
  }, [selectedBatchId, allBatches]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sunday
  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // Read attendance data for the entire month
  const monthAttendanceData = useMemo(() => {
    const data = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const key = `attendance_${selectedBatchId}_${dateStr}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          data[d] = JSON.parse(saved);
        } catch (_) {}
      }
    }
    return data;
  }, [selectedBatchId, viewYear, viewMonth, daysInMonth]);

  // Selected date's detailed logs
  const selectedDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayLogs = useMemo(() => {
    return monthAttendanceData[selectedDay] || null;
  }, [selectedDay, monthAttendanceData]);

  // Calculate monthly stats
  const stats = useMemo(() => {
    const classesHeld = Object.keys(monthAttendanceData).length;
    let totalPresent = 0;
    let totalEntries = 0;

    // Student compliance tracker: { studentId: { present: 0, total: 0 } }
    const studentStats = {};
    activeBatch.students.forEach(s => {
      studentStats[s.id] = { present: 0, total: 0, name: s.name };
    });

    Object.entries(monthAttendanceData).forEach(([day, attendanceMap]) => {
      activeBatch.students.forEach(student => {
        const status = attendanceMap[student.id];
        if (status) {
          totalEntries++;
          studentStats[student.id].total++;
          if (status === 'P') {
            totalPresent++;
            studentStats[student.id].present++;
          }
        }
      });
    });

    const overallPct = totalEntries > 0 ? Math.round((totalPresent / totalEntries) * 100) : null;

    const lowAttendanceAlerts = Object.entries(studentStats)
      .map(([id, sData]) => {
        const pct = sData.total > 0 ? Math.round((sData.present / sData.total) * 100) : 100; // If no classes, default to 100
        return { id, name: sData.name, pct, total: sData.total };
      })
      .filter(s => s.total > 0 && s.pct < 75);

    return {
      classesHeld,
      overallPct,
      lowAttendanceAlerts,
      studentStats
    };
  }, [monthAttendanceData, activeBatch]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    const currentLimit = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    if (!currentLimit) {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(y => y + 1);
      } else {
        setViewMonth(m => m + 1);
      }
      setSelectedDay(1);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-white">Attendance Monitor</h1>
        <p className="text-white/60 mt-1">Real-time center-wide attendance logs and student compliance stats.</p>
      </header>

      {/* Selectors and Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Batch Dropdown */}
        <div className="md:col-span-1 glass-card p-5 flex flex-col justify-center">
          <label className="text-xs text-white/40 uppercase block mb-1.5 font-bold">Select Batch</label>
          <select
            value={selectedBatchId}
            onChange={e => {
              setSelectedBatchId(e.target.value);
              setSelectedDay(1);
            }}
            className="w-full bg-[#12121A] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
          >
            {allBatches.map(b => (
              <option key={b.id} value={b.id} className="bg-dark-bg">{b.name}</option>
            ))}
          </select>
        </div>

        {/* Stats 1 */}
        <div className="glass-card p-5 flex items-center space-x-4">
          <div className="p-3 bg-gold/10 rounded-xl text-gold">
            <CalIcon size={24} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Classes Held (Month)</p>
            <p className="text-2xl font-bold text-white">{stats.classesHeld}</p>
          </div>
        </div>

        {/* Stats 2 */}
        <div className="glass-card p-5 flex items-center space-x-4">
          <div className="p-3 bg-[#00FF88]/10 rounded-xl text-[#00FF88]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Avg Attendance Rate</p>
            <p className="text-2xl font-bold text-[#00FF88]">
              {stats.overallPct !== null ? `${stats.overallPct}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Calendar & Daily Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Monthly Log Calendar</h2>
              
              <div className="flex items-center space-x-3">
                <button onClick={goToPrevMonth} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <span className="text-white font-semibold text-sm min-w-[120px] text-center">{monthName}</span>
                <button
                  onClick={goToNextMonth}
                  disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-white/30 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const hasMarked = !!monthAttendanceData[day];
                const isSelected = selectedDay === day;
                const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square flex flex-col items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all relative ${
                      isSelected
                        ? 'bg-gold text-dark-bg border border-gold shadow-[0_4px_15px_rgba(255,215,0,0.2)]'
                        : isToday
                        ? 'border-2 border-gold/45 text-white bg-gold/5'
                        : hasMarked
                        ? 'bg-[#00FF88]/15 text-[#00FF88] hover:bg-[#00FF88]/25'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <span>{day}</span>
                    {hasMarked && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-dark-bg' : 'bg-[#00FF88]'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Attendance Details */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Daily Attendance Log</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Showing logs for {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
              {selectedDayLogs && (
                <div className="flex space-x-3 text-xs">
                  <span className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 px-2 py-1 rounded">
                    Present: {Object.values(selectedDayLogs).filter(v => v === 'P').length}
                  </span>
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded">
                    Absent: {Object.values(selectedDayLogs).filter(v => v === 'A').length}
                  </span>
                </div>
              )}
            </div>

            {selectedDayLogs ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                  <thead className="bg-white/5 text-white uppercase text-xs border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Student ID</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBatch.students.map(student => {
                      const status = selectedDayLogs[student.id] || 'Not Marked';
                      return (
                        <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3 font-medium text-white">{student.name}</td>
                          <td className="px-6 py-3 text-xs font-mono text-white/40">{student.id}</td>
                          <td className="px-6 py-3 text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              status === 'P' ? 'bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/25' :
                              status === 'A' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              'bg-white/5 text-white/30'
                            }`}>
                              {status === 'P' ? (
                                <><CheckCircle2 size={12} className="mr-1" /> Present</>
                              ) : status === 'A' ? (
                                <><XCircle size={12} className="mr-1" /> Absent</>
                              ) : 'Not Marked'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40 text-sm">
                No attendance logs found for this date.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Low Attendance Alert & Month Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Low Attendance Alert */}
          <div className="glass-card p-6 border-t-4 border-t-red-500">
            <h3 className="text-red-400 font-bold text-sm flex items-center mb-4 uppercase tracking-wider">
              <AlertTriangle size={18} className="mr-2" /> Low Attendance Alerts (&lt;75%)
            </h3>
            
            {stats.lowAttendanceAlerts.length > 0 ? (
              <div className="space-y-3">
                {stats.lowAttendanceAlerts.map(alert => (
                  <div key={alert.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{alert.name}</p>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">{alert.id}</p>
                    </div>
                    <span className="text-red-400 font-bold text-sm bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                      {alert.pct}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-white/40 text-sm">
                All students satisfy the 75% attendance criteria.
              </div>
            )}
          </div>

          {/* Student Compliance list */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold text-sm flex items-center mb-4 uppercase tracking-wider">
              <UserCheck size={18} className="mr-2 text-gold" /> Student Attendance Rates
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {activeBatch.students.map(student => {
                const sData = stats.studentStats[student.id];
                const pct = sData && sData.total > 0 ? Math.round((sData.present / sData.total) * 100) : null;
                
                return (
                  <div key={student.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{student.name}</p>
                      <p className="text-[10px] text-white/40">{sData ? `${sData.present}/${sData.total} classes` : '0/0 classes'}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      pct === null ? 'bg-white/5 text-white/40' :
                      pct >= 85 ? 'bg-[#00FF88]/10 text-[#00FF88]' :
                      pct >= 75 ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {pct !== null ? `${pct}%` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAttendance;
