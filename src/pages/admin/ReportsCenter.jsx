import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileBarChart2, FileText, Download, Calendar, Activity, Users, UserCheck } from 'lucide-react';

// ── Pull real data from localStorage ──────────────────────────────────────

const getReportData = (reportId) => {
  try {
    const usersRaw  = localStorage.getItem('achievers_users');
    const batchRaw  = localStorage.getItem('achievers_batches');
    const users     = usersRaw  ? JSON.parse(usersRaw)  : [];
    const batches   = batchRaw  ? JSON.parse(batchRaw)  : [];
    const students  = users.filter(u => u.role === 'Student');
    const teachers  = users.filter(u => u.role === 'Teacher');

    if (reportId === 'enrollment') {
      return students.map(s => ({
        'Student ID':   s.id,
        Name:           s.name,
        Class:          s.class  || '—',
        Board:          s.board  || '—',
        Batch:          s.batch  || '—',
        Medium:         s.medium || 'English',
        Status:         s.status || 'Active',
        'Parent Name':  s.parentName  || '—',
        'Parent Phone': s.parentPhone || '—',
      }));
    }

    if (reportId === 'teacher') {
      return teachers.map(t => ({
        'Teacher ID': t.id,
        Name:         t.name,
        Subjects:     t.subjects     || '—',
        Batch:        t.batch        || '—',
        Phone:        t.phone        || '—',
        Salary:       t.salary       ? `₹${t.salary.toLocaleString()}` : '—',
        'Salary Status': t.salaryStatus || '—',
        Status:       t.status       || 'Active',
      }));
    }

    if (reportId === 'center') {
      const totalPresent = (() => {
        let count = 0;
        const todayStr = new Date().toISOString().split('T')[0];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('attendance_') && key.includes(todayStr)) {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            count += Object.values(val).filter(v => v === 'P').length;
          }
        }
        return count;
      })();

      const resultsRaw = localStorage.getItem('achievers_results');
      const results = resultsRaw ? JSON.parse(resultsRaw) : [];
      const avgScore = results.length > 0
        ? (results.reduce((s, r) => s + r.percentage, 0) / results.length).toFixed(1)
        : '—';

      return [
        { Metric: 'Total Students',    Value: students.length },
        { Metric: 'Total Teachers',    Value: teachers.length },
        { Metric: 'Total Batches',     Value: batches.length },
        { Metric: 'Present Today',     Value: totalPresent || '—' },
        { Metric: 'Tests Conducted',   Value: results.length },
        { Metric: 'Average Score',     Value: avgScore !== '—' ? `${avgScore}%` : '—' },
        { Metric: 'Report Generated',  Value: new Date().toLocaleString('en-IN') },
      ];
    }

    if (reportId === 'board') {
      const cbse  = students.filter(s => s.board === 'CBSE');
      const state = students.filter(s => s.board === 'State Board');
      const icse  = students.filter(s => s.board === 'ICSE');
      const matric = students.filter(s => s.board === 'Matric');
      return [
        { Board: 'CBSE',         Students: cbse.length,   Percentage: students.length ? `${Math.round(cbse.length/students.length*100)}%` : '—' },
        { Board: 'State Board',  Students: state.length,  Percentage: students.length ? `${Math.round(state.length/students.length*100)}%` : '—' },
        { Board: 'ICSE',         Students: icse.length,   Percentage: students.length ? `${Math.round(icse.length/students.length*100)}%` : '—' },
        { Board: 'Matric',       Students: matric.length, Percentage: students.length ? `${Math.round(matric.length/students.length*100)}%` : '—' },
      ];
    }

    return [];
  } catch (e) {
    console.error('Report data error', e);
    return [];
  }
};

const reportsList = [
  { id: 'center',     title: 'Center Performance Report',   icon: Activity,    desc: 'Live student count, attendance today, test averages and center-wide growth metrics.' },
  { id: 'teacher',    title: 'Teacher Activity Report',     icon: UserCheck,   desc: 'All teachers with their subjects, assigned batches, salary and contact info.' },
  { id: 'board',      title: 'Board-wise Result Analysis',  icon: FileText,    desc: 'Comparative student distribution across CBSE, State Board, ICSE and Matric.' },
  { id: 'enrollment', title: 'Monthly Enrollment Report',   icon: Users,       desc: 'Full list of enrolled students with class, batch, medium and parent contact.' },
];

// ── Component ─────────────────────────────────────────────────────────────

const ReportsCenter = () => {
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [generating, setGenerating] = useState(null);

  const handleGenerate = (report) => {
    setGenerating(report.id);
    setTimeout(() => {
      const data = getReportData(report.id);

      if (data.length === 0) {
        alert('⚠️ No data found. Please add students and teachers first.');
        setGenerating(null);
        return;
      }

      if (selectedFormat === 'PDF') {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(report.title, 14, 22);
        doc.setFontSize(10);
        doc.text(`Date Range: ${dateRange} | Generated: ${new Date().toLocaleString('en-IN')}`, 14, 30);
        doc.text(`Achievers Nest | Vadavalli, Coimbatore`, 14, 36);

        const columns = Object.keys(data[0]).map(k => ({ header: k, dataKey: k }));
        doc.autoTable({
          startY: 44,
          columns,
          body: data,
          theme: 'grid',
          headStyles: { fillColor: [255, 215, 0], textColor: [10, 10, 15], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          styles: { fontSize: 9 }
        });

        doc.save(`${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
      }

      setGenerating(null);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports Center</h1>
          <p className="text-white/60 mt-1">Generate and export real-time analytical reports from live data.</p>
        </div>
      </header>

      {/* Global Report Settings */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-1">
          <label className="text-xs text-white/40 uppercase block mb-1">Time Period</label>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-gold outline-none appearance-none"
            >
              <option className="bg-dark-bg">Last 7 Days</option>
              <option className="bg-dark-bg">Last 30 Days</option>
              <option className="bg-dark-bg">This Quarter</option>
              <option className="bg-dark-bg">Academic Year (2026-27)</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </div>
        </div>

        <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <label className="text-xs text-white/40 uppercase block mb-2">Export Format</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFormat('PDF')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors border ${selectedFormat === 'PDF' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
            >
              PDF Document
            </button>
            <button
              onClick={() => setSelectedFormat('Excel')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors border ${selectedFormat === 'Excel' ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
            >
              Excel File
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map(report => (
          <div key={report.id} className="glass-card p-6 flex flex-col justify-between group hover:border-gold/30 transition-colors">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors mr-4 shrink-0">
                <report.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight mb-1">{report.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{report.desc}</p>
              </div>
            </div>

            <button
              onClick={() => handleGenerate(report)}
              disabled={generating === report.id}
              className="w-full bg-white/5 hover:bg-gold hover:text-dark-bg text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating === report.id ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <><Download size={18} className="mr-2" /> Generate & Download</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsCenter;
