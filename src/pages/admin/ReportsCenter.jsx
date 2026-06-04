import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileBarChart2, FileText, Download, Calendar, Activity, Users, UserCheck } from 'lucide-react';

const reportsList = [
  { id: 'center', title: 'Center Performance Report', icon: Activity, desc: 'Overall test averages, attendance trends, and growth metrics.' },
  { id: 'teacher', title: 'Teacher Activity Report', icon: UserCheck, desc: 'Classes taken, tests published, and doubts resolved per teacher.' },
  { id: 'board', title: 'Board-wise Result Analysis', icon: FileText, desc: 'Comparative performance breakdown between CBSE and State Board.' },
  { id: 'enrollment', title: 'Monthly Enrollment Report', icon: Users, desc: 'Detailed list of new admissions categorized by batch and class.' },
];

const mockData = [
  { Name: 'John Doe', Metric: '85%', Trend: '+5%' },
  { Name: 'Jane Smith', Metric: '92%', Trend: '+1%' }
];

const ReportsCenter = () => {
  const [selectedFormat, setSelectedFormat] = useState('PDF'); // 'PDF' | 'Excel'
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const handleGenerate = (reportTitle) => {
    if (selectedFormat === 'PDF') {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(reportTitle, 14, 22);
      doc.setFontSize(10);
      doc.text(`Date Range: ${dateRange} | Generated: ${new Date().toLocaleDateString()}`, 14, 30);
      
      doc.autoTable({
        startY: 35,
        head: [['Name', 'Metric', 'Trend']],
        body: mockData.map(d => [d.Name, d.Metric, d.Trend]),
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [10, 10, 15] }
      });
      
      doc.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
    } else {
      const ws = XLSX.utils.json_to_sheet(mockData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${reportTitle.replace(/\s+/g, '_')}.xlsx`);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports Center</h1>
          <p className="text-white/60 mt-1">Generate and export analytical reports.</p>
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
          <label className="text-xs text-white/40 uppercase block mb-2">Export Format Preference</label>
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
              onClick={() => handleGenerate(report.title)}
              className="w-full bg-white/5 hover:bg-gold hover:text-dark-bg text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            >
              <Download size={18} className="mr-2" /> Generate & Download
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReportsCenter;
