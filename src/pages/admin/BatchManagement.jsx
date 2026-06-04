import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Settings, PieChart, Plus, Trash2, Activity, Edit } from 'lucide-react';

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const mockStudents = [
  { id: 'STU001', name: 'Rahul Sharma', status: 'Enrolled' },
  { id: 'STU002', name: 'Priya Patel', status: 'Unassigned' },
  { id: 'STU003', name: 'Amit Kumar', status: 'Unassigned' },
];

const BatchManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchForm, setBatchForm] = useState({ name: '', class: 'Class 10', board: 'CBSE', capacity: 30, schedule: '', shift: 'Morning Batch' });
  const [createSuccess, setCreateSuccess] = useState(false);
  
  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', class: '', board: '', capacity: 30, schedule: '', shift: '' });
  
  // Teacher change state
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('Unassigned');

  // Load and sync batches with LocalStorage
  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('achievers_batches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse batches from localStorage', e);
      }
    }
    return [
      { id: 1, name: 'Batch A - Science Kings', class: 'Class 10', board: 'CBSE', teacher: 'John Doe', capacity: 30, enrolled: 24, schedule: 'Mon-Wed-Fri 10:00 AM', attendance: 85, shift: 'Morning Batch' },
      { id: 2, name: 'Batch B - Math Wizards', class: 'Class 10', board: 'State Board', teacher: 'Alice Smith', capacity: 25, enrolled: 25, schedule: 'Tue-Thu-Sat 04:00 PM', attendance: 92, shift: 'Evening Batch' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('achievers_batches', JSON.stringify(batches));
  }, [batches]);

  // Load available teachers from achievers_users
  const teachers = useMemo(() => {
    try {
      const saved = localStorage.getItem('achievers_users');
      if (saved) {
        const users = JSON.parse(saved);
        return users.filter(u => u.role === 'Teacher' || u.id.startsWith('TCH'));
      }
    } catch (e) {
      console.error('Failed to parse users for teachers list', e);
    }
    return [
      { id: 'TCH001', name: 'John Doe' },
      { id: 'TCH002', name: 'Alice Smith' },
    ];
  }, [batches]);

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const newBatch = {
      id: batches.length > 0 ? Math.max(...batches.map(b => b.id)) + 1 : 1,
      name: batchForm.name,
      class: batchForm.class,
      board: batchForm.board,
      teacher: 'Unassigned',
      capacity: parseInt(batchForm.capacity) || 30,
      enrolled: 0,
      schedule: batchForm.schedule,
      attendance: 0,
      shift: batchForm.shift,
    };
    setBatches(prev => [...prev, newBatch]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('list');
      setBatchForm({ name: '', class: 'Class 10', board: 'CBSE', capacity: 30, schedule: '', shift: 'Morning Batch' });
    }, 1500);
  };

  const handleDeleteBatch = (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch? All data related to this batch will be removed.')) {
      setBatches(prev => prev.filter(b => b.id !== batchId));
      if (selectedBatch && selectedBatch.id === batchId) {
        setSelectedBatch(null);
      }
    }
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
            <button onClick={() => { setActiveTab('list'); setSelectedBatch(null); setIsEditing(false); setIsChangingTeacher(false); }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors font-medium">
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
            <div 
              key={batch.id} 
              className="glass-card p-6 flex flex-col justify-between group hover:border-gold/50 cursor-pointer transition-colors relative"
              onClick={() => setSelectedBatch(batch)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-8">
                    <h2 className="text-lg font-bold text-white leading-tight">{batch.name}</h2>
                    <span className="text-[10px] uppercase font-bold bg-white/10 text-white/60 px-2 py-1 rounded mt-1.5 inline-block">{batch.board}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBatch(batch.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-sm text-white/60 mb-2">Class: <span className="text-white">{batch.class}</span></p>
                <p className="text-sm text-white/60 mb-2">Shift: <span className="text-white">{batch.shift || 'Morning Batch'}</span></p>
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
                  <div className={`h-full rounded-full transition-all ${getSeatColor(batch.enrolled, batch.capacity)}`} style={{ width: `${Math.min((batch.enrolled / batch.capacity) * 100, 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Avg Attendance</span>
                  <span className={batch.attendance >= 90 ? 'text-[#00FF88]' : 'text-orange-400'}>{batch.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
          {batches.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card text-white/40">
              No batches created yet. Click "New Batch" to get started.
            </div>
          )}
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
                    <option className="bg-dark-bg" value="Morning Batch">Morning Batch</option>
                    <option className="bg-dark-bg" value="Evening Batch">Evening Batch</option>
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
            {isEditing ? (
              <div className="glass-card p-6 border-t-4 border-t-gold">
                <h3 className="text-lg font-bold text-white mb-4">Edit Batch Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase block mb-1">Batch Name</label>
                    <input 
                      type="text" 
                      required
                      value={editForm.name} 
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Class</label>
                      <select 
                        value={editForm.class} 
                        onChange={e => setEditForm({ ...editForm, class: e.target.value })} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none"
                      >
                        {CLASSES.map(cls => <option key={cls} className="bg-dark-bg">{cls}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Board</label>
                      <select 
                        value={editForm.board} 
                        onChange={e => setEditForm({ ...editForm, board: e.target.value })} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none"
                      >
                        <option className="bg-dark-bg">CBSE</option>
                        <option className="bg-dark-bg">State Board</option>
                        <option className="bg-dark-bg">ICSE</option>
                        <option className="bg-dark-bg">Matric</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Shift</label>
                      <select 
                        value={editForm.shift} 
                        onChange={e => setEditForm({ ...editForm, shift: e.target.value })} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none"
                      >
                        <option className="bg-dark-bg" value="Morning Batch">Morning Batch</option>
                        <option className="bg-dark-bg" value="Evening Batch">Evening Batch</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Max Capacity</label>
                      <input 
                        type="number" 
                        required
                        value={editForm.capacity} 
                        onChange={e => setEditForm({ ...editForm, capacity: parseInt(e.target.value) || 30 })} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/40 uppercase block mb-1">Schedule</label>
                    <input 
                      type="text" 
                      required
                      value={editForm.schedule} 
                      onChange={e => setEditForm({ ...editForm, schedule: e.target.value })} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-gold outline-none" 
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => {
                        const updated = {
                          ...selectedBatch,
                          name: editForm.name,
                          class: editForm.class,
                          board: editForm.board,
                          capacity: editForm.capacity,
                          schedule: editForm.schedule,
                          shift: editForm.shift,
                        };
                        setBatches(prev => prev.map(b => b.id === selectedBatch.id ? updated : b));
                        setSelectedBatch(updated);
                        setIsEditing(false);
                      }}
                      className="flex-1 bg-gold hover:bg-gold-hover text-dark-bg font-bold py-2 rounded-lg transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 border-t-4 border-t-gold">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{selectedBatch.name}</h2>
                    <p className="text-sm text-white/60">{selectedBatch.class} • {selectedBatch.board}</p>
                    <span className="text-[10px] uppercase font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded mt-1.5 inline-block">{selectedBatch.shift || 'Morning Batch'}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditForm({
                          name: selectedBatch.name,
                          class: selectedBatch.class,
                          board: selectedBatch.board,
                          capacity: selectedBatch.capacity,
                          schedule: selectedBatch.schedule,
                          shift: selectedBatch.shift || 'Morning Batch',
                        });
                        setIsEditing(true);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors"
                      title="Edit Details"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(selectedBatch.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 text-red-400 transition-colors"
                      title="Delete Batch"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <p className="text-xs text-white/40 uppercase mb-1">Assigned Teacher</p>
                    {isChangingTeacher ? (
                      <div className="flex space-x-2">
                        <select 
                          value={selectedTeacher}
                          onChange={(e) => setSelectedTeacher(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-gold outline-none"
                        >
                          <option className="bg-dark-bg" value="Unassigned">Unassigned</option>
                          {teachers.map(t => (
                            <option className="bg-dark-bg" key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => {
                            const updated = { ...selectedBatch, teacher: selectedTeacher };
                            setBatches(prev => prev.map(b => b.id === selectedBatch.id ? updated : b));
                            setSelectedBatch(updated);
                            setIsChangingTeacher(false);
                          }}
                          className="bg-gold hover:bg-gold-hover text-dark-bg text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsChangingTeacher(false)}
                          className="bg-white/10 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-white font-medium">{selectedBatch.teacher}</span>
                        <button 
                          onClick={() => {
                            setSelectedTeacher(selectedBatch.teacher);
                            setIsChangingTeacher(true);
                          }}
                          className="text-gold text-xs hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    )}
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
                      <div className={`h-full rounded-full ${getSeatColor(selectedBatch.enrolled, selectedBatch.capacity)}`} style={{ width: `${Math.min((selectedBatch.enrolled / selectedBatch.capacity) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                Showing all {selectedBatch.enrolled} enrolled students.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;
