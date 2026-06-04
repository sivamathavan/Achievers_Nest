import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { UserPlus, Users, Upload, CheckCircle, Copy, MessageCircle, FileDown, Search, Edit, Lock, PowerOff, Filter, Save, X, Trash2, ShieldCheck, Mail, Phone, BookOpen, Clock, Image as ImageIcon, Award, Calendar, Book } from 'lucide-react';

const initialMockUsers = [
  { id: 'STU2024001', name: 'Rahul Sharma', role: 'Student', class: 'Class 10', batch: 'Batch A - Science Kings', status: 'Active', password: 'passSTU2024001', parentName: 'Rajesh Sharma', parentPhone: '919876543210', medium: 'English', language: 'Hindi', board: 'CBSE' },
  { id: 'STU2024002', name: 'Meena S', role: 'Student', class: 'Class 8', batch: 'Batch B - Math Wizards', status: 'Active', password: 'passSTU2024002', parentName: 'Sundar M', parentPhone: '919876543211', medium: 'Tamil', language: 'Tamil', board: 'State Board' },
  { id: 'TCH001', name: 'John Doe', role: 'Teacher', class: 'Multiple', batch: 'Batch A - Science Kings', status: 'Active', password: 'passTCH001', phone: '919876543220', subjects: 'Physics, Chemistry', salary: 45000, salaryStatus: 'Paid (1st Jun)' },
  { id: 'TCH002', name: 'Alice Smith', role: 'Teacher', class: 'Multiple', batch: 'Batch B - Math Wizards', status: 'Active', password: 'passTCH002', phone: '919876543221', subjects: 'Mathematics', salary: 48000, salaryStatus: 'Paid (1st Jun)' },
  { id: 'STU2024003', name: 'Amit Kumar', role: 'Student', class: 'Class 10', batch: 'Batch A - Science Kings', status: 'Active', password: 'passSTU2024003', parentName: 'Kishore Kumar', parentPhone: '919876543212', medium: 'English', language: 'Hindi', board: 'CBSE' },
  { id: 'STU2024004', name: 'Priya Patel', role: 'Student', class: 'Class 10', batch: 'Batch B - Math Wizards', status: 'Active', password: 'passSTU2024004', parentName: 'Dinesh Patel', parentPhone: '919876543213', medium: 'English', language: 'Gujarati', board: 'CBSE' },
  { id: 'STU2024005', name: 'Sneha Reddy', role: 'Student', class: 'Class 12', batch: 'Batch A - Science Kings', status: 'Active', password: 'passSTU2024005', parentName: 'Prasad Reddy', parentPhone: '919876543214', medium: 'English', language: 'Telugu', board: 'CBSE' },
  { id: 'STU2024006', name: 'Vijay Anand', role: 'Student', class: 'Class 10', batch: 'Batch A - Science Kings', status: 'Active', password: 'passSTU2024006', parentName: 'Anand K', parentPhone: '919876543215', medium: 'English', language: 'Tamil', board: 'CBSE' },
  { id: 'STU2024007', name: 'Anjali Gupta', role: 'Student', class: 'Class 11', batch: 'Batch A - Science Kings', status: 'Active', password: 'passSTU2024007', parentName: 'Sanjay Gupta', parentPhone: '919876543216', medium: 'English', language: 'Hindi', board: 'CBSE' },
  { id: 'STU2024008', name: 'Vikram Singh', role: 'Student', class: 'Class 9', batch: 'Batch B - Math Wizards', status: 'Active', password: 'passSTU2024008', parentName: 'Harbhajan Singh', parentPhone: '919876543217', medium: 'English', language: 'Punjabi', board: 'State Board' },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ['CBSE', 'State Board', 'ICSE', 'Matric'];

const logActivity = (description, type = 'general') => {
  try {
    const saved = localStorage.getItem('achievers_activities');
    const activities = saved ? JSON.parse(saved) : [];
    const newActivity = {
      id: Date.now(),
      description,
      type,
      timestamp: new Date().toISOString()
    };
    const updated = [newActivity, ...activities].slice(0, 50);
    localStorage.setItem('achievers_activities', JSON.stringify(updated));
    window.dispatchEvent(new Event('achievers_activities_updated'));
  } catch (e) {
    console.error('Error logging activity', e);
  }
};

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
    window.dispatchEvent(new Event('achievers_users_updated'));
  }, [users]);

  // Load batch options dynamically
  const batchOptions = useMemo(() => {
    try {
      const saved = localStorage.getItem('achievers_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          return parsed.map(b => b.name);
        }
      }
    } catch {}
    return ['Batch A - Science Kings', 'Batch B - Math Wizards'];
  }, []);

  // Form States
  const [studentForm, setStudentForm] = useState({ name: '', class: 'Class 10', board: 'CBSE', medium: 'English', language: 'Tamil', parentName: '', parentPhone: '', batch: batchOptions[0] || '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', phone: '', subjects: '', batches: [] });
  
  const [generatedCreds, setGeneratedCreds] = useState(null);
  
  // Details Modal and inner tab state
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [modalTab, setModalTab] = useState('profile'); // 'profile' | 'academic' | 'salary'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Editable Teacher Salary state inside modal
  const [editableSalary, setEditableSalary] = useState('');
  const [editableSalaryStatus, setEditableSalaryStatus] = useState('');

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

  const fileInputRefImport = useRef(null);

  const generateRandomPassword = () => Math.random().toString(36).slice(-8);

  const handleCreateStudent = (e) => {
    e.preventDefault();
    const newId = generateNextStudentId(users);
    const newPass = generateRandomPassword();
    
    const newStudent = { 
      id: newId, 
      name: studentForm.name, 
      role: 'Student', 
      class: studentForm.class, 
      board: studentForm.board,
      medium: studentForm.medium,
      language: studentForm.language,
      parentName: studentForm.parentName,
      parentPhone: studentForm.parentPhone,
      batch: studentForm.batch, 
      status: 'Active',
      password: newPass,
      avatar: ''
    };

    setGeneratedCreds({ id: newId, password: newPass, name: studentForm.name, phone: studentForm.parentPhone });
    setUsers(prev => [newStudent, ...prev]);
    logActivity(`Created new student account: ${studentForm.name} (${newId})`, 'user');
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    const newId = generateNextTeacherId(users);
    const newPass = generateRandomPassword();
    const assignedBatches = teacherForm.batches.length > 0 ? teacherForm.batches.join(', ') : 'Unassigned';
    
    const newTeacher = { 
      id: newId, 
      name: teacherForm.name, 
      role: 'Teacher', 
      class: 'Multiple', 
      batch: assignedBatches, 
      status: 'Active',
      password: newPass,
      phone: teacherForm.phone,
      subjects: teacherForm.subjects,
      avatar: '',
      salary: 45000,
      salaryStatus: 'Paid (1st Jun)'
    };

    setGeneratedCreds({ id: newId, password: newPass, name: teacherForm.name, phone: teacherForm.phone });
    setUsers(prev => [newTeacher, ...prev]);
    logActivity(`Created new teacher account: ${teacherForm.name} (${newId})`, 'user');
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
    const target = users.find(u => u.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to deactivate and remove user ${target.name} (${id})?`)) {
      setUsers(users.filter(u => u.id !== id));
      logActivity(`Deleted user account: ${target.name} (${id})`, 'user');
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ name: user.name, class: user.class, batch: user.batch, status: user.status });
  };

  const saveEditUser = () => {
    setUsers(users.map(u => u.id === editingUserId ? { ...u, ...editFormData } : u));
    logActivity(`Updated user details for ${editFormData.name || editingUserId}`, 'user');
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

  // Click row to show details
  const openUserDetailsModal = (user) => {
    setSelectedUserDetail(user);
    setModalTab('profile');
    if (user.role === 'Teacher') {
      setEditableSalary(user.salary || 45000);
      setEditableSalaryStatus(user.salaryStatus || 'Paid (1st Jun)');
    }
  };

  // Upload image handler inside modal
  const handleImageUpload = async (e, userId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatar: data.secure_url } : u));
        setSelectedUserDetail(prev => ({ ...prev, avatar: data.secure_url }));
        logActivity(`Uploaded profile image for user (${userId})`, 'user');
        alert('Profile picture uploaded successfully!');
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload image. Please verify Cloudinary credentials in .env.local.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save editable teacher salary inside modal
  const saveTeacherSalary = () => {
    if (!selectedUserDetail) return;
    const salaryVal = parseInt(editableSalary) || 0;
    setUsers(prev => prev.map(u => u.id === selectedUserDetail.id ? { ...u, salary: salaryVal, salaryStatus: editableSalaryStatus } : u));
    setSelectedUserDetail(prev => ({ ...prev, salary: salaryVal, salaryStatus: editableSalaryStatus }));
    logActivity(`Updated salary details for Teacher ${selectedUserDetail.name} (${selectedUserDetail.id})`, 'user');
    alert('Salary information updated successfully!');
  };

  // Calculate dynamic student attendance
  const studentAttendance = useMemo(() => {
    if (!selectedUserDetail || selectedUserDetail.role !== 'Student') return { present: 0, total: 0, percentage: null };
    let present = 0;
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('attendance_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw);
            if (data[selectedUserDetail.id]) {
              total++;
              if (data[selectedUserDetail.id] === 'P') {
                present++;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    const percentage = total > 0 ? Math.round((present / total) * 100) : null;
    return { present, total, percentage };
  }, [selectedUserDetail, users]);

  // Calculate dynamic teacher conduct classes
  const teacherConductedClassesCount = useMemo(() => {
    if (!selectedUserDetail || selectedUserDetail.role !== 'Teacher') return 0;
    let classesConducted = 0;
    try {
      const savedBatches = localStorage.getItem('achievers_batches');
      const batchesList = savedBatches ? JSON.parse(savedBatches) : [];
      // Get teacher's assigned batch IDs
      const teacherBatchNames = selectedUserDetail.batch ? selectedUserDetail.batch.split(', ') : [];
      const teacherBatchIds = batchesList
        .filter(b => teacherBatchNames.includes(b.name))
        .map(b => String(b.id));

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('attendance_')) {
          const parts = key.split('_');
          const batchId = parts[1];
          // Check if this attendance key is for one of the teacher's batches
          if (teacherBatchIds.includes(batchId) || teacherBatchIds.includes(batchId.replace('b', ''))) {
            classesConducted++;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return classesConducted;
  }, [selectedUserDetail, users]);

  // Fetch student test attempts history
  const studentTestAttempts = useMemo(() => {
    if (!selectedUserDetail || selectedUserDetail.role !== 'Student') return [];
    try {
      const savedResults = localStorage.getItem('achievers_results');
      if (savedResults) {
        const resultsList = JSON.parse(savedResults);
        const filtered = resultsList.filter(
          r => r.studentId === selectedUserDetail.id || r.studentName === selectedUserDetail.name || r.name === selectedUserDetail.name
        );
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {}
    // Fallback Mock test results
    return [
      { testName: 'Optics Weekly Test', subject: 'Physics', score: 12, total: 15, percentage: 80, date: '2026-05-28T16:00:00.000Z' },
      { testName: 'Algebra Chapter 3 Test', subject: 'Mathematics', score: 18, total: 20, percentage: 90, date: '2026-06-05T10:00:00.000Z' }
    ];
  }, [selectedUserDetail, users]);

  const shareDetailsViaWhatsApp = (userToShare) => {
    const pass = userToShare.password || 'achievers123';
    const text = `Hello ${userToShare.name},\nHere are your login credentials for Achievers Nest:\nUser ID: ${userToShare.id}\nPassword/Passkey: ${pass}\nUrl: https://achieversnest.in`;
    const phone = userToShare.parentPhone || userToShare.phone || '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

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

  const copyUserDetails = (userToCopy) => {
    const pass = userToCopy.password || 'achievers123';
    const text = `User ID: ${userToCopy.id}\nPassword/Passkey: ${pass}`;
    navigator.clipboard.writeText(text);
    alert('Credentials copied to clipboard!');
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
    <div className="space-y-6 pb-20 max-w-6xl mx-auto relative">
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
                  <label className="text-xs text-white/40 uppercase block mb-1">Assign Batch</label>
                  <select value={studentForm.batch} onChange={e=>setStudentForm({...studentForm, batch:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                    {batchOptions.map(b => <option key={b} className="bg-dark-bg">{b}</option>)}
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
                    {batchOptions.map(batch => (
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
                    {batchOptions.map(b => <option key={b} value={b} className="bg-dark-bg">{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end pt-4 border-t border-white/10">
              <input type="file" accept=".xlsx, .xls" ref={fileInputRefImport} onChange={handleBulkImport} className="hidden" />
              <button onClick={downloadTemplate} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center text-sm transition-colors">
                <FileDown size={16} className="mr-2" /> Template
              </button>
              <button onClick={() => fileInputRefImport.current?.click()} className="bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] px-4 py-2 rounded-lg font-bold flex items-center text-sm transition-colors border border-[#00FF88]/30">
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
                      <tr 
                        key={user.id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => openUserDetailsModal(user)}
                      >
                        <td className="px-6 py-4 font-mono text-gold">{user.id}</td>
                        <td className="px-6 py-4 font-medium text-white flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/5">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-white/40 font-bold">{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <span>
                            {editingUserId === user.id ? (
                              <input 
                                type="text" 
                                value={editFormData.name} 
                                onClick={e => e.stopPropagation()}
                                onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                                className="bg-[#161622] border border-white/20 rounded px-2 py-1 text-sm outline-none text-white focus:border-gold" 
                              />
                            ) : user.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'Teacher' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id && user.role !== 'Teacher' ? (
                             <select 
                               value={editFormData.class} 
                               onClick={e => e.stopPropagation()}
                               onChange={e => setEditFormData({...editFormData, class: e.target.value})} 
                               className="bg-[#161622] border border-white/20 rounded px-2 py-1 text-sm outline-none text-white focus:border-gold w-full max-w-[120px]"
                             >
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
                            <select 
                              value={editFormData.status} 
                              onClick={e => e.stopPropagation()}
                              onChange={e => setEditFormData({...editFormData, status: e.target.value})} 
                              className="bg-[#161622] border border-white/20 rounded px-2 py-1 text-sm outline-none text-white focus:border-gold"
                            >
                               <option value="Active" className="bg-dark-bg">Active</option>
                               <option value="Inactive" className="bg-dark-bg">Inactive</option>
                             </select>
                          ) : (
                            <span className={`flex items-center text-xs ${user.status === 'Active' ? 'text-[#00FF88]' : 'text-red-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-[#00FF88]' : 'bg-red-400'}`}></div>{user.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                          {editingUserId === user.id ? (
                            <div className="flex justify-end space-x-2">
                               <button onClick={saveEditUser} className="p-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 rounded text-[#00FF88]" title="Save"><Save size={14}/></button>
                               <button onClick={() => setEditingUserId(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white/60 hover:text-white" title="Cancel"><X size={14}/></button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => startEditUser(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-white" title="Edit User"><Edit size={14}/></button>
                              <button onClick={() => copyUserDetails(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-gold" title="Copy Credentials"><Lock size={14}/></button>
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

      {/* USER DETAILS MODAL (POPUP WITH CLOUDINARY UPLOADER & ACADEMICS/SALARY LOGS) */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 border border-white/10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                
                {/* Avatar with Cloudinary Edit Uploader Overlay */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold font-bold text-2xl border border-gold/25 overflow-hidden">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : selectedUserDetail.avatar ? (
                      <img src={selectedUserDetail.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedUserDetail.name.charAt(0)}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-dark-bg shadow-md hover:scale-110 transition-transform cursor-pointer"
                    title="Upload profile image"
                  >
                    <ImageIcon size={11} />
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={(e) => handleImageUpload(e, selectedUserDetail.id)} 
                    className="hidden" 
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedUserDetail.name}</h3>
                  <div className="flex space-x-2 mt-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      selectedUserDetail.role === 'Teacher' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-gold/20 text-gold border border-gold/20'
                    }`}>
                      {selectedUserDetail.role}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono self-center">ID: {selectedUserDetail.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserDetail(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs Selector inside modal */}
            <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
              <button 
                onClick={() => setModalTab('profile')} 
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  modalTab === 'profile' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
                }`}
              >
                Profile & Details
              </button>
              
              {selectedUserDetail.role === 'Student' ? (
                <button 
                  onClick={() => setModalTab('academic')} 
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    modalTab === 'academic' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Academics & Attendance
                </button>
              ) : (
                <button 
                  onClick={() => setModalTab('salary')} 
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    modalTab === 'salary' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Salary & Conduct
                </button>
              )}
            </div>

            {/* Tab 1: Profile Details */}
            {modalTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Portal Access</h4>
                  <div>
                    <p className="text-xs text-white/40">User Login ID</p>
                    <p className="text-sm font-mono font-bold text-gold mt-0.5">{selectedUserDetail.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Password / Passkey</p>
                    <p className="text-sm font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded inline-block mt-1">
                      {selectedUserDetail.password || 'achievers123'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Status</p>
                    <span className={`inline-flex items-center text-xs font-bold mt-1 ${selectedUserDetail.status === 'Active' ? 'text-[#00FF88]' : 'text-red-400'}`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${selectedUserDetail.status === 'Active' ? 'bg-[#00FF88]' : 'bg-red-400'}`}></span>
                      {selectedUserDetail.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Personal Details</h4>
                  {selectedUserDetail.role === 'Student' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40">Class</p>
                          <p className="text-sm text-white font-medium">{selectedUserDetail.class}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Board</p>
                          <p className="text-sm text-white font-medium">{selectedUserDetail.board || 'CBSE'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40">Medium</p>
                          <p className="text-sm text-white font-medium">{selectedUserDetail.medium || 'English'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Language</p>
                          <p className="text-sm text-white font-medium">{selectedUserDetail.language || 'Tamil'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Parent Name</p>
                        <p className="text-sm text-white font-semibold">{selectedUserDetail.parentName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Parent Contact</p>
                        <p className="text-sm text-white font-mono flex items-center mt-0.5">
                          <Phone size={12} className="mr-1.5 text-white/40" /> {selectedUserDetail.parentPhone || '—'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-white/40">Contact Phone</p>
                        <p className="text-sm text-white font-mono flex items-center mt-0.5">
                          <Phone size={12} className="mr-1.5 text-white/40" /> {selectedUserDetail.phone || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Subjects Expertise</p>
                        <p className="text-sm text-white font-medium mt-0.5">{selectedUserDetail.subjects || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Assigned Batch(es)</p>
                        <p className="text-sm text-gold font-bold mt-0.5">{selectedUserDetail.batch || 'Unassigned'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2 (Student): Academics & Attendance Logs */}
            {modalTab === 'academic' && selectedUserDetail.role === 'Student' && (
              <div className="space-y-6 py-2">
                
                {/* Attendance Summary */}
                <div className="grid grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {studentAttendance.percentage !== null ? `${studentAttendance.percentage}%` : '—'}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase font-medium mt-1">Attendance Rate</p>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <p className="text-2xl font-bold text-[#00FF88]">{studentAttendance.present}</p>
                    <p className="text-[10px] text-[#00FF88]/70 uppercase font-medium mt-1">Days Present</p>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <p className="text-2xl font-bold text-red-400">{studentAttendance.total - studentAttendance.present}</p>
                    <p className="text-[10px] text-red-400/70 uppercase font-medium mt-1">Days Absent</p>
                  </div>
                </div>

                {/* Test Attempts log list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Attempted Test History</h4>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {studentTestAttempts.map((attempt, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-white">{attempt.testName}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">{attempt.subject} • {attempt.date ? new Date(attempt.date).toLocaleDateString('en-IN') : '—'}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-white/50">{attempt.score}/{attempt.total}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            attempt.percentage >= 80 ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                            attempt.percentage >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {attempt.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {studentTestAttempts.length === 0 && (
                      <p className="text-center py-6 text-white/40 text-xs">No recorded test attempts.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2 (Teacher): Salary Details & Conducting Metrics */}
            {modalTab === 'salary' && selectedUserDetail.role === 'Teacher' && (
              <div className="space-y-6 py-2">
                
                {/* Conducting Classes stat card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-gold/10 rounded-xl text-gold"><Calendar size={20} /></div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Conducted Classes</h4>
                      <p className="text-xs text-white/40 mt-0.5">Sessions logged in your batches</p>
                    </div>
                  </div>
                  <span className="text-3xl font-extrabold text-white font-space mr-2">{teacherConductedClassesCount}</span>
                </div>

                {/* Salary management section */}
                <div className="glass-card p-5 border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center">
                    💰 Salary & Finance Administration
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Monthly Salary (INR)</label>
                      <input 
                        type="number" 
                        value={editableSalary} 
                        onChange={e => setEditableSalary(e.target.value)} 
                        className="w-full bg-[#161622] border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-gold outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase block mb-1">Payment Status</label>
                      <select 
                        value={editableSalaryStatus} 
                        onChange={e => setEditableSalaryStatus(e.target.value)} 
                        className="w-full bg-[#161622] border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-gold outline-none"
                      >
                        <option className="bg-dark-bg" value="Paid (1st Jun)">Paid (1st Jun)</option>
                        <option className="bg-dark-bg" value="Paid (June 5th)">Paid (June 5th)</option>
                        <option className="bg-dark-bg" value="Pending">Pending</option>
                        <option className="bg-dark-bg" value="Processing">Processing</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={saveTeacherSalary}
                    className="w-full mt-2 bg-gold hover:bg-gold-hover text-dark-bg font-bold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center"
                  >
                    <Save size={14} className="mr-1.5" /> Save Financial Details
                  </button>
                </div>

              </div>
            )}

            {/* Modal Bottom Buttons */}
            <div className="flex space-x-3 border-t border-white/10 pt-6 mt-auto">
              <button 
                onClick={() => copyUserDetails(selectedUserDetail)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center cursor-pointer"
              >
                <Copy size={16} className="mr-2" /> Copy Credentials
              </button>
              {(selectedUserDetail.parentPhone || selectedUserDetail.phone) && (
                <button 
                  onClick={() => shareDetailsViaWhatsApp(selectedUserDetail)}
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center cursor-pointer"
                >
                  <MessageCircle size={16} className="mr-2" /> Send via WhatsApp
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
