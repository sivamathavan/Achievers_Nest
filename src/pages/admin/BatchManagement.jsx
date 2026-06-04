import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Settings, PieChart, Plus, Trash2, Activity } from 'lucide-react';

const mockBatches = [
  { id: 1, name: 'Batch A - Science Kings', class: 'Class 10', board: 'CBSE', teacher: 'John Doe', capacity: 30, enrolled: 24, schedule: 'Mon-Wed-Fri 10:00 AM', attendance: 85 },
  { id: 2, name: 'Batch B - Math Wizards', class: 'Class 10', board: 'State Board', teacher: 'Alice Smith', capacity: 25, enrolled: 25, schedule: 'Tue-Thu-Sat 04:00 PM', attendance: 92 },
];

const mockStudents = [
  { id: 'STU001', name: 'Rahul Sharma', status: 'Enrolled' },
  { id: 'STU002', name: 'Priya Patel', status: 'Unassigned' },
  { id: 'STU003', name: 'Amit Kumar', status: 'Unassigned' },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const BatchManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchForm, setBatchForm] = useState({ name: '', class: 'Class 10', board: 'CBSE', capacity: 30, schedule: '', shift: 'Morning' });
  const [batches, setBatches] = useState(mockBatches);
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const newBatch = {
      id: batches.length + 1,
      name: batchForm.name,
      class: batchForm.class,
      board: batchForm.board,
      teacher: 'Unassigned',
      capacity: parseInt(batchForm.capacity) || 30,
      enrolled: 0,
      schedule: batchForm.schedule,
      attendance: 0,
    };
    setBatches(prev => [...prev, newBatch]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('list');
      setBatchForm({ name: '', class: 'Class 10', board: 'CBSE', capacity: 30, schedule: '', shift: 'Morning' });
    }, 1500);
  };

  const getSeatColor = (enrolled, capacity) => {
    const ratio = enrolled / capacity;
    if (ratio >= 1) return 'bg-red-500';
    if (ratio >= 0.8) return 'bg-orange-400';
    return 'bg-[#00FF88]';
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Management</h1>
          <p className="text-white/60 mt-1">Organize students into batches and assign teachers.</p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          {activeTab === 'create' || selectedBatch ? (
            <button onClick={() => { setActiveTab('list'); setSelectedBatch(null); }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors font-medium">
              Back to List
            </button>
          ) : (
            <button onClick={() => setActiveTab('create')} className="w-full md:w-auto bg-gold hover:bg-gold-hover text-dark-bg font-bold px-6 py-2 rounded-xl transition-colors flex items-center justify-center">
              <Plus size={18} className="mr-2" /> New Batch
            </button>
          )}
        </div>
      </header>

      {/* LIST VIEW */}
      {activeTab === 'list' && !selectedBatch && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {batches.map(batch => (
            <div key={batch.id} className="glass-card p-6 flex flex-col justify-between group hover:border-gold/50 cursor-pointer transition-colors" onClick={() => setSelectedBatch(batch)}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-white leading-tight">{batch.name}</h2>
                  <span className="text-[10px] uppercase font-bold bg-white/10 text-white/60 px-2 py-1 rounded">{batch.board}</span>
                </div>
                
                <p className="text-sm text-white/60 mb-2">Class: <span className="text-white">{batch.class}</span></p>
                <p className="text-sm text-white/60 mb-4">Teacher: <span className="text-white">{batch.teacher}</span></p>
                <p className="text-xs text-gold flex items-center mb-6"><Settings size={12} className="mr-1" /> {batch.schedule}</p>
              </div>

              {/* Seat Tracker */}
              <div className="mt-auto border-t border-white/10 pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60">Seats Filled</span>
                  <span className="text-white font-medium">{batch.enrolled} / {batch.capacity}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-3">
                  <div className={`h-full rounded-full transition-all ${getSeatColor(batch.enrolled, batch.capacity)}`} style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Avg Attendance</span>
                  <span className={batch.attendance >= 90 ? 'text-[#00FF88]' : 'text-orange-400'}>{batch.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE BATCH VIEW */}
      {activeTab === 'create' && (
        <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto animate-in fade-in">
          <form onSubmit={handleCreateBatch} className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Batch Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Batch Name</label>
                <input type="text" required placeholder="e.g. Science Kings 2026" value={batchForm.name} onChange={e=>setBatchForm({...batchForm, name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Class</label>
                  <select value={batchForm.class} onChange={e=>setBatchForm({...batchForm, class:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {CLASSES.map(cls => <option key={cls} className="bg-dark-bg">{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Board</label>
                  <select value={batchForm.board} onChange={e=>setBatchForm({...batchForm, board:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    <option className="bg-dark-bg">CBSE</option>
                    <option className="bg-dark-bg">State Board</option>
                    <option className="bg-dark-bg">ICSE</option>
                    <option className="bg-dark-bg">Matric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Shift</label>
                  <select value={batchForm.shift} onChange={e=>setBatchForm({...batchForm, shift:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    <option className="bg-dark-bg">Morning</option>
                    <option className="bg-dark-bg">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Max Capacity</label>
                  <input type="number" required value={batchForm.capacity} onChange={e=>setBatchForm({...batchForm, capacity:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Schedule</label>
                  <input type="text" placeholder="e.g. Mon-Wed 5PM" required value={batchForm.schedule} onChange={e=>setBatchForm({...batchForm, schedule:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center ${
                createSuccess ? 'bg-[#00FF88] text-[#0A0A0F]' : 'bg-gold hover:bg-gold-hover text-dark-bg'
              }`}
            >
              {createSuccess ? '✓ Batch Created!' : <><Plus size={18} className="mr-2" /> Create Batch</>}
            </button>
          </form>
        </div>
      )}

      {/* BATCH DETAIL VIEW (MANAGE) */}
      {selectedBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
          
          {/* Batch Stats Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 border-t-4 border-t-gold">
              <h2 className="text-xl font-bold text-white mb-1">{selectedBatch.name}</h2>
              <p className="text-sm text-white/60 mb-6">{selectedBatch.class} • {selectedBatch.board}</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Assigned Teacher</p>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-white font-medium">{selectedBatch.teacher}</span>
                    <button className="text-gold text-xs hover:underline">Change</button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Schedule</p>
                  <p className="text-white text-sm bg-white/5 p-3 rounded-lg border border-white/10">{selectedBatch.schedule}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Seats Filled ({selectedBatch.enrolled}/{selectedBatch.capacity})</span>
                    <span className="text-white font-medium">{Math.round((selectedBatch.enrolled/selectedBatch.capacity)*100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${getSeatColor(selectedBatch.enrolled, selectedBatch.capacity)}`} style={{ width: `${(selectedBatch.enrolled / selectedBatch.capacity) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-4 w-full">
                <div className="p-3 bg-[#00FF88]/20 rounded-xl text-[#00FF88]"><PieChart size={24} /></div>
                <div>
                  <p className="text-white/60 text-sm">Avg. Attendance</p>
                  <p className="text-2xl font-bold text-white">{selectedBatch.attendance}%</p>
                </div>
              </div>
              <button onClick={() => navigate(`/admin/batch-dna/${selectedBatch.id}`)} className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center">
                <Activity size={18} className="mr-2" /> View Batch DNA Overview
              </button>
            </div>
          </div>

          {/* Student Management Column */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Enrolled Students</h3>
              <button className="bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88]/30 text-[#00FF88] px-3 py-1.5 text-sm font-bold rounded-lg flex items-center transition-colors">
                <UserPlus size={16} className="mr-1" /> Add Students
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {mockStudents.map(s => (
                <div key={s.id} className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{s.name}</p>
                      <p className="text-white/40 text-xs font-mono">{s.id}</p>
                    </div>
                  </div>
                  {s.status === 'Enrolled' ? (
                    <button className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors tooltip-trigger" title="Remove from batch">
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">Assign</button>
                  )}
                </div>
              ))}
              <div className="text-center py-8 text-white/40 text-sm">
                Showing all 24 enrolled students.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;
