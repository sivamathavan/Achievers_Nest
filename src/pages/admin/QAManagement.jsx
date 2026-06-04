import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Search, CheckCircle, XCircle, Database, Upload, FileDown, Edit, Trash2, Tag } from 'lucide-react';

const mockPendingAnswers = [
  { id: 1, subject: 'Physics', question: 'Why does light bend when it enters water?', answer: 'Due to refraction, the speed of light changes as it moves from one medium to another with a different refractive index.', teacher: 'John Doe', date: 'Oct 15, 2026' }
];

const mockGlobalQA = [
  { id: 2, subject: 'Math', chapter: 'Algebra', question: 'What is a quadratic equation?', answer: 'An equation of degree 2 in the form ax^2+bx+c=0.', tags: ['Class 10', 'CBSE'] }
];

const QAManagement = () => {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'global' | 'upload'
  const fileInputRef = useRef(null);

  const handleApprove = (id) => {
    alert(`Answer ${id} approved and added to Global Q&A Bank!`);
  };

  const handleReject = (id) => {
    alert(`Answer ${id} rejected. Sent back to teacher.`);
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      console.log('Imported Q&A:', jsonData);
      alert(`Successfully parsed ${jsonData.length} questions from Excel. They are now live in the Global Bank.`);
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ Question: 'Sample Q', Answer: 'Sample A', Subject: 'Math', Chapter: 'Algebra', Board: 'CBSE', Class: '10', Language: 'English' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "QA_Template");
    XLSX.writeFile(wb, "QA_Bulk_Upload_Template.xlsx");
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Q&A Database Management</h1>
          <p className="text-white/60 mt-1">Curate and maintain the central knowledge base.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl w-full md:w-auto">
          <button onClick={() => setActiveTab('approvals')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'approvals' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>
            Pending Approvals
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">1</span>
          </button>
          <button onClick={() => setActiveTab('global')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'global' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Global Bank</button>
          <button onClick={() => setActiveTab('upload')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Bulk Upload</button>
        </div>
      </header>

      {/* PENDING APPROVALS TAB */}
      {activeTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in">
          {mockPendingAnswers.map(item => (
            <div key={item.id} className="glass-card p-6 border-l-4 border-l-orange-400">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold bg-white/10 text-white/60 px-2 py-1 rounded mb-2 inline-block">{item.subject}</span>
                  <p className="text-xs text-white/40 mb-1">Answered by: <span className="text-white">{item.teacher}</span> on {item.date}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1A1A24] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase mb-2">Student Question</p>
                  <p className="text-white font-medium">{item.question}</p>
                </div>
                <div className="bg-[#1A1A24] p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-[#00FF88]/60 uppercase mb-2">Teacher Answer</p>
                  <p className="text-white/80">{item.answer}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t border-white/10 pt-4">
                <button onClick={() => handleReject(item.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl flex items-center transition-colors">
                  <XCircle size={16} className="mr-2" /> Reject & Return
                </button>
                <button onClick={() => handleApprove(item.id)} className="px-4 py-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] border border-[#00FF88]/30 font-bold rounded-xl flex items-center transition-colors">
                  <CheckCircle size={16} className="mr-2" /> Approve & Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GLOBAL BANK TAB */}
      {activeTab === 'global' && (
        <div className="glass-card p-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="text" placeholder="Search Q&A Bank..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:border-gold outline-none" />
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors">
              <Tag size={16} className="mr-2" /> Manage Tags
            </button>
          </div>

          <div className="space-y-4">
            {mockGlobalQA.map(qa => (
              <div key={qa.id} className="bg-white/5 border border-white/10 p-5 rounded-xl group hover:border-gold/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex space-x-2">
                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{qa.subject}</span>
                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{qa.chapter}</span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-white/40 hover:text-white"><Edit size={16} /></button>
                    <button className="text-white/40 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Q: {qa.question}</h3>
                <p className="text-white/70 text-sm mb-4">A: {qa.answer}</p>
                
                <div className="flex items-center space-x-2 text-[10px]">
                  {qa.tags.map(t => (
                    <span key={t} className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BULK UPLOAD TAB */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <div className="glass-card p-6 flex flex-col justify-center text-center border-2 border-dashed border-white/20">
            <Database size={48} className="text-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Import Question Bank</h2>
            <p className="text-white/60 text-sm mb-6">Upload an Excel file to instantly populate the Global Q&A Database. Use the template provided for correct column formatting.</p>
            
            <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleBulkUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center justify-center mx-auto w-full md:w-auto">
              <Upload size={18} className="mr-2" /> Select Excel File
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Instructions</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-2 mb-6">
              <li>Ensure the file is in .xlsx format.</li>
              <li>Required columns: Question, Answer, Subject, Class.</li>
              <li>Optional columns: Chapter, Board, Language.</li>
              <li>Do not include empty rows between data.</li>
            </ul>
            <button onClick={downloadTemplate} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl font-medium flex justify-center items-center transition-colors">
              <FileDown size={18} className="mr-2" /> Download Template File
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QAManagement;
