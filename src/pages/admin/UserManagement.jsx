import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { UserPlus, Users, Upload, CheckCircle, Copy, MessageCircle, FileDown, Search, Edit, Lock, PowerOff, Filter, Save, X, Trash2 } from 'lucide-react';

const initialMockUsers = [
  { id: 'STU2024001', name: 'Rahul Sharma', role: 'Student', class: 'Class 10', batch: 'Batch A - Morning', status: 'Active' },
  { id: 'STU2024002', name: 'Meena S', role: 'Student', class: 'Class 8', batch: 'Batch B - Evening', status: 'Active' },
  { id: 'TCH001', name: 'John Doe', role: 'Teacher', class: 'Multiple', batch: 'Batch A - Morning, Batch C - Evening', status: 'Active' },
  { id: 'TCH002', name: 'Alice Smith', role: 'Teacher', class: 'Multiple', batch: 'Batch B - Evening', status: 'Active' },
  { id: 'STU2024003', name: 'Amit Kumar', role: 'Student', class: 'Class 10', batch: 'Batch A - Morning', status: 'Active' },
  { id: 'STU2024004', name: 'Priya Patel', role: 'Student', class: 'Class 10', batch: 'Batch B - Evening', status: 'Active' },
  { id: 'STU2024005', name: 'Sneha Reddy', role: 'Student', class: 'Class 12', batch: 'Batch A - Morning', status: 'Active' },
  { id: 'STU2024006', name: 'Vijay Anand', role: 'Student', class: 'Class 10', batch: 'Batch A - Morning', status: 'Active' },
  { id: 'STU2024007', name: 'Anjali Gupta', role: 'Student', class: 'Class 11', batch: 'Batch C - Morning', status: 'Active' },
  { id: 'STU2024008', name: 'Vikram Singh', role: 'Student', class: 'Class 9', batch: 'Batch B - Evening', status: 'Active' },
  { id: 'STU2024009', name: 'Pooja Hegde', role: 'Student', class: 'Class 10', batch: 'Batch A - Morning', status: 'Active' },
  { id: 'STU2024010', name: 'Karthik Raja', role: 'Student', class: 'Class 10', batch: 'Batch D - Evening', status: 'Active' },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ['CBSE', 'State Board', 'ICSE', 'Matric'];
const BATCH_OPTIONS = ['Batch A - Morning', 'Batch B - Evening', 'Batch C - Morning', 'Batch D - Evening'];

// Generate next sequential ID for Students
const generateNextStudentId = (existingUsers) => {
  const existingNums = existingUsers
    .filter(u => u.id && u.id.startsWith('STU'))
    .map(u => {
      const num = parseInt(u.id.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    });
  const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 2024000;
  return `STU${maxNum + 1}`;
};

// Generate next sequential ID for Teachers
const generateNextTeacherId = (existingUsers) => {
  const existingNums = existingUsers
    .filter(u => u.id && u.id.startsWith('TCH'))
    .map(u => {
      const num = parseInt(u.id.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    });
  const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
  return `TCH${String(maxNum + 1).padStart(3, '0')}`;
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('student');
  
  // Dynamic Users State with localStorage sync
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('achievers_users');
    return saved ? JSON.parse(saved) : initialMockUsers;
  });

  useEffect(() => {
    localStorage.setItem('achievers_users', JSON.stringify(users));
  }, [users]);

  // Form States
  const [studentForm, setStudentForm] = useState({ name: '', class: 'Class 10', board: 'CBSE', medium: 'English', language: 'Tamil', parentName: '', parentPhone: '', batch: 'Batch A - Morning' });
  const [teacherForm, setTeacherForm] = useState({ name: '', phone: '', subjects: '', batches: [] });
  
  const [generatedCreds, setGeneratedCreds] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');

  // Edit State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole, filterClass, filterBatch]);

  const fileInputRef = useRef(null);

  const generateRandomPassword = () => Math.random().toString(36).slice(-8);

  const handleCreateStudent = (e) => {
    e.preventDefault();
    const newId = generateNextStudentId(users);
    const newPass = generateRandomPassword();
    setGeneratedCreds({ id: newId, password: newPass, name: studentForm.name, phone: studentForm.parentPhone });
    setUsers([{ id: newId, name: studentForm.name, role: 'Student', class: studentForm.class, batch: studentForm.batch, status: 'Active' }, ...users]);
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    const newId = generateNextTeacherId(users);
    const newPass = generateRandomPassword();
    setGeneratedCreds({ id: newId, password: newPass, name: teacherForm.name, phone: teacherForm.phone });
    const assignedBatches = teacherForm.batches.length > 0 ? teacherForm.batches.join(', ') : 'Unassigned';
    setUsers([{ id: newId, name: teacherForm.name, role: 'Teacher', class: 'Multiple', batch: assignedBatches, status: 'Active' }, ...users]);
  };

  const toggleTeacherBatch = (batch) => {
    const current = teacherForm.batches;
    if (current.includes(batch)) {
      setTeacherForm({...teacherForm, batches: current.filter(b => b !== batch)});
    } else {
      setTeacherForm({...teacherForm, batches: [...current, batch]});
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm(`Are you sure you want to deactivate and remove user ${id}?`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ name: user.name, class: user.class, batch: user.batch, status: user.status });
  };

  const saveEditUser = () => {
    setUsers(users.map(u => u.id === editingUserId ? { ...u, ...editFormData } : u));
    setEditingUserId(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = filterRole === 'All' || user.role === filterRole;
      const matchClass = filterClass === 'All' || user.class === filterClass || (user.role === 'Teacher');
      const matchBatch = filterBatch === 'All' || (user.batch && user.batch.includes(filterBatch));
      return matchSearch && matchRole && matchClass && matchBatch;
    });
  }, [users, searchQuery, filterRole, filterClass, filterBatch]);

  const shareViaWhatsApp = () => {
    const text = `Hello ${generatedCreds.name},\nWelcome to Achievers Nest!\nYour Login Details:\nUser ID: ${generatedCreds.id}\nPassword: ${generatedCreds.password}\nPlease login at our website.`;
    const url = `https://wa.me/${generatedCreds.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyCredentials = () => {
    const text = `User ID: ${generatedCreds.id}\nPassword: ${generatedCreds.password}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      alert(`Successfully parsed users from Excel. (Simulated save)`);
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ Name: 'John', Role: 'Student', Class: '10', Board: 'CBSE', Phone: '9999999999' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "User_Import_Template.xlsx");
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/60 mt-1">Onboard and manage students and staff.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl">
          <button onClick={() => {setActiveTab('student'); setGeneratedCreds(null);}} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'student' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Create Student</button>
          <button onClick={() => {setActiveTab('teacher'); setGeneratedCreds(null);}} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'teacher' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Create Teacher</button>
          <button onClick={() => {setActiveTab('manage'); setGeneratedCreds(null);}} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Manage Users</button>
        </div>
      </header>

      {/* CREATE STUDENT TAB */}
      {activeTab === 'student' && (
        <div className="glass-card p-6 md:p-8 animate-in fade-in">
          {!generatedCreds ? (
            <form onSubmit={handleCreateStudent} className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Student Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Student Name</label>
                  <input type="text" required value={studentForm.name} onChange={e=>setStudentForm({...studentForm, name:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Class</label>
                  <select value={studentForm.class} onChange={e=>setStudentForm({...studentForm, class:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {CLASSES.map(cls => <option key={cls} className="bg-dark-bg">{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Board</label>
                  <select value={studentForm.board} onChange={e=>setStudentForm({...studentForm, board:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {BOARDS.map(b => <option key={b} className="bg-dark-bg">{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Medium / Language</label>
                  <div className="flex space-x-2">
                    <select value={studentForm.medium} onChange={e=>setStudentForm({...studentForm, medium:e.target.value})} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                      <option className="bg-dark-bg">English</option>
                      <option className="bg-dark-bg">Tamil</option>
                    </select>
                    <select value={studentForm.language} onChange={e=>setStudentForm({...studentForm, language:e.target.value})} className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                      <option className="bg-dark-bg">Tamil</option>
                      <option className="bg-dark-bg">Hindi</option>
                      <option className="bg-dark-bg">French</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Parent Name</label>
                  <input type="text" value={studentForm.parentName} onChange={e=>setStudentForm({...studentForm, parentName:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Parent WhatsApp Number (With Country Code)</label>
                  <input type="text" placeholder="e.g. 919876543210" required value={studentForm.parentPhone} onChange={e=>setStudentForm({...studentForm, parentPhone:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Assign Batch (Morning / Evening)</label>
                  <select value={studentForm.batch} onChange={e=>setStudentForm({...studentForm, batch:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {BATCH_OPTIONS.map(b => <option key={b} className="bg-dark-bg">{b}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center">
                <UserPlus size={18} className="mr-2" /> Create Student Account
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-[#00FF88]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-[#00FF88]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Student Account Created!</h2>
              <p className="text-white/60 mb-8">Please share these credentials securely with the parent/student.</p>
              <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 max-w-sm mx-auto text-left mb-8">
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase">User ID</p>
                  <p className="text-xl font-bold text-gold tracking-wider">{generatedCreds.id}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">Password</p>
                  <p className="text-xl font-bold text-white tracking-wider font-mono">{generatedCreds.password}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button onClick={copyCredentials} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors">
                  <Copy size={18} className="mr-2" /> Copy Details
                </button>
                <button onClick={shareViaWhatsApp} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-bold flex items-center transition-colors">
                  <MessageCircle size={18} className="mr-2" /> Send via WhatsApp
                </button>
              </div>
              <button onClick={() => {setGeneratedCreds(null); setStudentForm({...studentForm, name:'', parentPhone:''});}} className="mt-8 text-white/40 hover:text-white text-sm underline">
                Create another student
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREATE TEACHER TAB */}
      {activeTab === 'teacher' && (
        <div className="glass-card p-6 md:p-8 animate-in fade-in">
           {!generatedCreds ? (
            <form onSubmit={handleCreateTeacher} className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Teacher Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Full Name</label>
                  <input type="text" value={teacherForm.name} onChange={e=>setTeacherForm({...teacherForm, name:e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Phone Number</label>
                  <input type="text" value={teacherForm.phone} onChange={e=>setTeacherForm({...teacherForm, phone:e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Subjects Expertise</label>
                  <input type="text" value={teacherForm.subjects} onChange={e=>setTeacherForm({...teacherForm, subjects:e.target.value})} placeholder="e.g. Physics, Math" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Assign to Batches (Multiple)</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {BATCH_OPTIONS.map(batch => (
                      <button 
                        key={batch} type="button" 
                        onClick={() => toggleTeacherBatch(batch)}
                        className={`text-xs p-2 rounded-lg border text-left flex items-center transition-colors ${
                          teacherForm.batches.includes(batch) ? 'bg-gold/20 border-gold text-gold' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-sm border mr-2 flex items-center justify-center ${teacherForm.batches.includes(batch) ? 'bg-gold border-gold' : 'border-white/30'}`}>
                           {teacherForm.batches.includes(batch) && <CheckCircle size={10} className="text-dark-bg" />}
                        </div>
                        {batch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center mt-4">
                <UserPlus size={18} className="mr-2" /> Create Teacher Account
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Teacher Account Created!</h2>
              <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 max-w-sm mx-auto text-left mb-8 mt-6">
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase">User ID</p>
                  <p className="text-xl font-bold text-gold tracking-wider">{generatedCreds.id}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase">Password</p>
                  <p className="text-xl font-bold text-white tracking-wider font-mono">{generatedCreds.password}</p>
                </div>
              </div>
              <button onClick={copyCredentials} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center transition-colors">
                <Copy size={18} className="mr-2" /> Copy Details
              </button>
              <br/>
              <button onClick={() => {setGeneratedCreds(null); setTeacherForm({...teacherForm, name:'', phone:'', batches:[]})}} className="mt-8 text-white/40 hover:text-white text-sm underline">
                Create another teacher
              </button>
            </div>
          )}
        </div>
      )}

      {/* MANAGE USERS TAB */}
      {activeTab === 'manage' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Action Bar & Filters */}
          <div className="glass-card p-4 space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="relative w-full lg:w-96 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, ID, or role..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:border-gold outline-none" />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Filter size={14} className="text-white/40 mr-2" />
                  <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-transparent text-sm text-white/80 outline-none w-24">
                    <option value="All" className="bg-dark-bg">All Roles</option>
                    <option value="Student" className="bg-dark-bg">Students</option>
                    <option value="Teacher" className="bg-dark-bg">Teachers</option>
                  </select>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="bg-transparent text-sm text-white/80 outline-none w-28">
                    <option value="All" className="bg-dark-bg">All Classes</option>
                    {CLASSES.map(c => <option key={c} value={c} className="bg-dark-bg">{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="bg-transparent text-sm text-white/80 outline-none w-32 truncate">
                    <option value="All" className="bg-dark-bg">All Batches</option>
                    {BATCH_OPTIONS.map(b => <option key={b} value={b} className="bg-dark-bg">{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end pt-4 border-t border-white/10">
              <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleBulkImport} className="hidden" />
              <button onClick={downloadTemplate} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center text-sm transition-colors">
                <FileDown size={16} className="mr-2" /> Template
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] px-4 py-2 rounded-lg font-bold flex items-center text-sm transition-colors border border-[#00FF88]/30">
                <Upload size={16} className="mr-2" /> Bulk Import
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                <thead className="bg-white/5 text-white uppercase text-xs border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Class/Batch</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                    if (paginatedUsers.length === 0) {
                      return (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-white/40">No users found matching filters.</td>
                        </tr>
                      );
                    }
                    return paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-gold">{user.id}</td>
                        <td className="px-6 py-4 font-medium text-white">
                          {editingUserId === user.id ? (
                            <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm outline-none" />
                          ) : user.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'Teacher' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id && user.role !== 'Teacher' ? (
                             <select value={editFormData.class} onChange={e => setEditFormData({...editFormData, class: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm outline-none w-full max-w-[120px]">
                               {CLASSES.map(c => <option key={c} value={c} className="bg-dark-bg">{c}</option>)}
                             </select>
                          ) : (
                            <div className="flex flex-col">
                              <span>{user.class}</span>
                              <span className="text-[10px] text-white/40 truncate max-w-[150px]">{user.batch}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm outline-none">
                               <option value="Active" className="bg-dark-bg">Active</option>
                               <option value="Inactive" className="bg-dark-bg">Inactive</option>
                             </select>
                          ) : (
                            <span className={`flex items-center text-xs ${user.status === 'Active' ? 'text-[#00FF88]' : 'text-red-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-[#00FF88]' : 'bg-red-400'}`}></div>{user.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingUserId === user.id ? (
                            <div className="flex justify-end space-x-2">
                               <button onClick={saveEditUser} className="p-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 rounded text-[#00FF88]" title="Save"><Save size={14}/></button>
                               <button onClick={() => setEditingUserId(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white/60 hover:text-white" title="Cancel"><X size={14}/></button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => startEditUser(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-white" title="Edit User"><Edit size={14}/></button>
                              <button className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-gold" title="Reset Password"><Lock size={14}/></button>
                              <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 text-red-400" title="Delete"><Trash2 size={14}/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > pageSize && (
              <div className="flex justify-between items-center px-6 py-4 bg-white/5 border-t border-[#FFFFFF1A]">
                <span className="text-xs text-white/50">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entries
                </span>
                <div className="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-xs"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-white px-3 py-1.5 bg-white/10 rounded border border-white/20 font-bold">
                    {currentPage} / {Math.ceil(filteredUsers.length / pageSize)}
                  </span>
                  <button
                    disabled={currentPage >= Math.ceil(filteredUsers.length / pageSize)}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredUsers.length / pageSize)))}
                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}

    </div>
  );
};

export default UserManagement;
