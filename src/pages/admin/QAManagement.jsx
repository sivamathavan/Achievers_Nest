import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Search, CheckCircle, XCircle, Database, Upload, FileDown, Edit, Trash2, Tag, Plus } from 'lucide-react';

// ── Storage helpers ─────────────────────────────────────────────────────────

const PENDING_KEY = 'achievers_qa_pending';
const GLOBAL_KEY  = 'achievers_qa_global';

const loadPending = () => {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: Date.now(),
        subject: 'Physics',
        question: 'Why does light bend when it enters water?',
        answer: 'Due to refraction, the speed of light changes as it moves from one medium to another with a different refractive index.',
        teacher: 'John Doe',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      }
    ];
  } catch { return []; }
};

const loadGlobal = () => {
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    return raw ? JSON.parse(raw) : [
      { id: 1, subject: 'Math', chapter: 'Algebra', question: 'What is a quadratic equation?', answer: 'An equation of degree 2 in the form ax²+bx+c=0.', tags: ['Class 10', 'CBSE'] }
    ];
  } catch { return []; }
};

const savePending = (data) => {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(data)); } catch {}
};
const saveGlobal = (data) => {
  try { localStorage.setItem(GLOBAL_KEY, JSON.stringify(data)); } catch {}
};

// ── Component ────────────────────────────────────────────────────────────────

const QAManagement = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pending, setPending] = useState(loadPending);
  const [globalQA, setGlobalQA] = useState(loadGlobal);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQA, setNewQA] = useState({ subject: 'Physics', chapter: '', question: '', answer: '', tags: '' });
  const fileInputRef = React.useRef(null);

  const handleApprove = (item) => {
    const newGlobal = [
      ...globalQA,
      {
        id: Date.now(),
        subject: item.subject,
        chapter: 'General',
        question: item.question,
        answer: item.answer,
        tags: [item.subject, 'Teacher Approved']
      }
    ];
    setGlobalQA(newGlobal);
    saveGlobal(newGlobal);

    const newPending = pending.filter(p => p.id !== item.id);
    setPending(newPending);
    savePending(newPending);
  };

  const handleReject = (id) => {
    const newPending = pending.filter(p => p.id !== id);
    setPending(newPending);
    savePending(newPending);
  };

  const handleDeleteGlobal = (id) => {
    const updated = globalQA.filter(q => q.id !== id);
    setGlobalQA(updated);
    saveGlobal(updated);
  };

  const handleAddManual = (e) => {
    e.preventDefault();
    if (!newQA.question.trim() || !newQA.answer.trim()) return;
    const entry = {
      id: Date.now(),
      subject: newQA.subject,
      chapter: newQA.chapter || 'General',
      question: newQA.question,
      answer: newQA.answer,
      tags: newQA.tags ? newQA.tags.split(',').map(t => t.trim()) : [newQA.subject]
    };
    const updated = [entry, ...globalQA];
    setGlobalQA(updated);
    saveGlobal(updated);
    setNewQA({ subject: 'Physics', chapter: '', question: '', answer: '', tags: '' });
    setShowAddModal(false);
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
      const imported = jsonData.map((row, i) => ({
        id: Date.now() + i,
        subject: row.Subject || 'General',
        chapter: row.Chapter || 'General',
        question: row.Question || '',
        answer: row.Answer || '',
        tags: [row.Board || 'CBSE', `Class ${row.Class || '10'}`]
      })).filter(q => q.question && q.answer);

      const updated = [...imported, ...globalQA];
      setGlobalQA(updated);
      saveGlobal(updated);
      alert(`✅ Imported ${imported.length} questions into the Global Q&A Bank!`);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Question: 'What is Newton\'s second law?', Answer: 'F = ma', Subject: 'Physics', Chapter: 'Laws of Motion', Board: 'CBSE', Class: '10', Language: 'English' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'QA_Template');
    XLSX.writeFile(wb, 'QA_Bulk_Upload_Template.xlsx');
  };

  const filteredGlobal = useMemo(() => {
    if (!search.trim()) return globalQA;
    const q = search.toLowerCase();
    return globalQA.filter(
      qa => qa.question.toLowerCase().includes(q) || qa.subject.toLowerCase().includes(q) || qa.chapter?.toLowerCase().includes(q)
    );
  }, [globalQA, search]);

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
            {pending.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pending.length}</span>}
          </button>
          <button onClick={() => setActiveTab('global')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'global' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>
            Global Bank <span className="ml-1 text-[10px] opacity-60">({globalQA.length})</span>
          </button>
          <button onClick={() => setActiveTab('upload')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Bulk Upload</button>
        </div>
      </header>

      {/* PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in">
          {pending.length === 0 ? (
            <div className="glass-card p-12 text-center text-white/40">
              <CheckCircle size={48} className="mx-auto mb-4 text-[#00FF88]/40" />
              <p className="text-lg font-medium text-[#00FF88]">All caught up!</p>
              <p className="text-sm mt-1">No pending answers to review.</p>
            </div>
          ) : (
            pending.map(item => (
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
                    <XCircle size={16} className="mr-2" /> Reject & Delete
                  </button>
                  <button onClick={() => handleApprove(item)} className="px-4 py-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] border border-[#00FF88]/30 font-bold rounded-xl flex items-center transition-colors">
                    <CheckCircle size={16} className="mr-2" /> Approve & Publish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* GLOBAL BANK */}
      {activeTab === 'global' && (
        <div className="glass-card p-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Q&A Bank..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:border-gold outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gold hover:bg-gold/90 text-dark-bg font-bold px-4 py-2.5 rounded-xl text-sm flex items-center transition-colors"
            >
              <Plus size={16} className="mr-2" /> Add Question
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {filteredGlobal.length === 0 ? (
              <p className="text-center text-white/40 py-12">No questions found.</p>
            ) : (
              filteredGlobal.map(qa => (
                <div key={qa.id} className="bg-white/5 border border-white/10 p-5 rounded-xl group hover:border-gold/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{qa.subject}</span>
                      <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded">{qa.chapter}</span>
                    </div>
                    <button onClick={() => handleDeleteGlobal(qa.id)} className="text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-tight">Q: {qa.question}</h3>
                  <p className="text-white/70 text-sm mb-4">A: {qa.answer}</p>
                  <div className="flex items-center space-x-2 text-[10px]">
                    {qa.tags?.map(t => (
                      <span key={t} className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">#{t}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BULK UPLOAD */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <div className="glass-card p-6 flex flex-col justify-center text-center border-2 border-dashed border-white/20">
            <Database size={48} className="text-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Import Question Bank</h2>
            <p className="text-white/60 text-sm mb-6">Upload an Excel file to instantly populate the Global Q&A Database.</p>
            <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleBulkUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="bg-gold hover:bg-gold/90 text-dark-bg font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center justify-center mx-auto w-full md:w-auto">
              <Upload size={18} className="mr-2" /> Select Excel File
            </button>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Instructions</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-2 mb-6">
              <li>File must be in .xlsx format.</li>
              <li>Required columns: Question, Answer, Subject, Class.</li>
              <li>Optional: Chapter, Board, Language.</li>
              <li>Do not include empty rows between data.</li>
            </ul>
            <button onClick={downloadTemplate} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl font-medium flex justify-center items-center transition-colors">
              <FileDown size={18} className="mr-2" /> Download Template File
            </button>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Add Question Manually</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Subject</label>
                  <select value={newQA.subject} onChange={e => setNewQA({...newQA, subject: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {['Physics','Chemistry','Math','Biology','English','Social','Tamil','Computer'].map(s => (
                      <option key={s} className="bg-[#0A0A0F]">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Chapter</label>
                  <input value={newQA.chapter} onChange={e => setNewQA({...newQA, chapter: e.target.value})} placeholder="e.g. Optics" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Question</label>
                <textarea required rows={2} value={newQA.question} onChange={e => setNewQA({...newQA, question: e.target.value})} placeholder="Enter the question..." className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Answer</label>
                <textarea required rows={3} value={newQA.answer} onChange={e => setNewQA({...newQA, answer: e.target.value})} placeholder="Enter the answer..." className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Tags (comma separated)</label>
                <input value={newQA.tags} onChange={e => setNewQA({...newQA, tags: e.target.value})} placeholder="e.g. Class 10, CBSE" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-gold hover:bg-gold/90 text-dark-bg font-bold py-3 rounded-xl transition-colors">Add to Bank</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAManagement;
