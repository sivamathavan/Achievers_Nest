import React from 'react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import { Download, MessageCircle, CheckCircle, FileText, Calendar as CalIcon } from 'lucide-react';

const DashboardCard = ({ title, value, subtitle }) => (
  <div className="glass-card p-6">
    <h3 className="text-white/60 text-sm font-medium">{title}</h3>
    <div className="text-3xl font-bold text-white mt-2">{value}</div>
    {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
  </div>
);

import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, UserCheck, IndianRupee, Bell } from 'lucide-react';

const enrollmentData = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 135 },
  { month: 'Mar', students: 180 },
  { month: 'Apr', students: 195 },
  { month: 'May', students: 210 },
  { month: 'Jun', students: 245 },
];

const boardData = [
  { name: 'CBSE', value: 145, color: '#FFD700' },
  { name: 'State Board', value: 80, color: '#00FF88' },
  { name: 'ICSE', value: 20, color: '#FF6B6B' },
];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const storedUsers = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('achievers_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, []);

  const studentCount = React.useMemo(() => {
    const count = storedUsers.filter(u => u.role === 'Student').length;
    return count > 0 ? count : 245;
  }, [storedUsers]);

  const teacherCount = React.useMemo(() => {
    const count = storedUsers.filter(u => u.role === 'Teacher').length;
    return count > 0 ? count : 12;
  }, [storedUsers]);

  const revenueAmount = React.useMemo(() => {
    try {
      const savedPayments = localStorage.getItem('achievers_payments');
      if (savedPayments) {
        const payments = JSON.parse(savedPayments);
        const sum = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
        if (sum >= 100000) {
          return `₹ ${(sum / 100000).toFixed(1)}L`;
        }
        return `₹ ${(sum / 1000).toFixed(1)}K`;
      }
    } catch (e) {}
    return '₹2.4L';
  }, []);
  
  return (
    <div className="space-y-6 animate-in fade-in pb-4">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-space">Welcome back, {user?.name || 'Admin'}</h1>
          <p className="text-white/50 mt-1 text-sm">Here's your center overview for today.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button onClick={() => navigate('/admin/users')} className="flex-1 md:flex-none bg-gradient-to-r from-gold to-yellow-400 hover:scale-[1.02] transition-transform text-dark-bg px-4 py-2.5 rounded-xl flex items-center justify-center text-sm font-bold shadow-[0_4px_15px_rgba(255,215,0,0.2)]">
            <Users size={16} className="mr-2" /> Add User
          </button>
        </div>
      </div>
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#12121A] border border-white/5 rounded-[20px] p-4 md:p-5 relative overflow-hidden group hover:border-gold/30 transition-colors">
          <div className="flex items-center text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Users size={14} className="mr-1.5 text-blue-400" /> Total Students
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-space">{studentCount}</div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Users size={80} />
          </div>
        </div>
        
        <div className="bg-[#12121A] border border-white/5 rounded-[20px] p-4 md:p-5 relative overflow-hidden group hover:border-gold/30 transition-colors">
          <div className="flex items-center text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">
            <UserCheck size={14} className="mr-1.5 text-orange-400" /> Teachers
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-space">{teacherCount}</div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <UserCheck size={80} />
          </div>
        </div>
        
        <div className="bg-[#12121A] border border-white/5 rounded-[20px] p-4 md:p-5 relative overflow-hidden group hover:border-gold/30 transition-colors">
          <div className="flex items-center text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">
            <IndianRupee size={14} className="mr-1.5 text-[#00FF88]" /> Revenue
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-space">{revenueAmount}</div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <IndianRupee size={80} />
          </div>
        </div>
        
        <div className="bg-[#12121A] border border-white/5 rounded-[20px] p-4 md:p-5 relative overflow-hidden group hover:border-gold/30 transition-colors">
          <div className="flex items-center text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Activity size={14} className="mr-1.5 text-gold" /> Active Now
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white font-space">48</div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Activity size={80} />
          </div>
        </div>
      </div>
      
      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Enrollment Trend */}
        <div className="lg:col-span-2 bg-[#12121A] border border-white/5 rounded-[24px] p-5 md:p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-6">Enrollment Trend (6 Months)</h2>
          <div className="h-[200px] md:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="students" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#12121A', stroke: '#FFD700', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#FFD700' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Board Distribution */}
        <div className="bg-[#12121A] border border-white/5 rounded-[24px] p-5 md:p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Board Distribution</h2>
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={boardData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                  {boardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">245</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex flex-col space-y-3 mt-4">
            {boardData.map((board) => (
              <div key={board.name} className="flex justify-between items-center text-[13px]">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: board.color }}></span> 
                  <span className="text-white/70">{board.name}</span>
                </div>
                <span className="font-bold text-white">{board.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-3 bg-[#12121A] border border-white/5 rounded-[24px] p-5 md:p-6">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center">
            <Activity size={16} className="text-gold mr-2" /> Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl"><Users size={16} /></div>
              <div className="flex-1">
                <p className="text-[#F0F0F0] text-[13px] leading-relaxed">New student <span className="font-bold text-white">Rahul Sharma</span> enrolled in Class 10 CBSE.</p>
                <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">10 mins ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-2.5 bg-[#00FF88]/10 text-[#00FF88] rounded-xl"><IndianRupee size={16} /></div>
              <div className="flex-1">
                <p className="text-[#F0F0F0] text-[13px] leading-relaxed">Fee payment of ₹12,000 received from <span className="font-bold text-white">STU2024005</span>.</p>
                <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-2.5 bg-gold/10 text-gold rounded-xl"><Activity size={16} /></div>
              <div className="flex-1">
                <p className="text-[#F0F0F0] text-[13px] leading-relaxed">Teacher John published <span className="font-bold text-white">Optics Weekly Test</span> for Batch A.</p>
                <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, FilePlus, HelpCircle, ChevronRight } from 'lucide-react';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const schedule = [
    { time: '4:00 PM – 5:30 PM', class: 'Class 10 CBSE', batch: 'Morning Batch', students: 18, id: 'b1' },
    { time: '5:30 PM – 7:00 PM', class: 'Class 8 State', batch: 'Evening Batch', students: 22, id: 'b2' },
  ];

  const pendingDoubts = [
    { student: 'Priya Rajesh', class: 'Class 10', subject: 'Maths', q: 'How to solve quadratic equation by completing the square?', time: '3 hours ago' },
    { student: 'Arun Kumar', class: 'Class 10', subject: 'Science', q: 'What is the difference between ionic and covalent bonds?', time: '5 hours ago' },
    { student: 'Karthik Raj', class: 'Class 10', subject: 'Maths', q: 'I don\'t understand how to factorize x² - 5x + 6.', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-4 max-w-4xl">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-space">{greeting}, {user?.name || 'Teacher'}! 👋</h1>
          <p className="text-white/50 mt-1 text-sm">{dateStr}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/teacher/attendance')}
            className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors">
            <ClipboardCheck size={16} className="mr-2" /> Mark Attendance
          </button>
          <button onClick={() => navigate('/teacher/tests/create')}
            className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
            style={{ background: '#4F8EF7', color: '#0A0A0F' }}>
            <FilePlus size={16} className="mr-2" /> Create Test
          </button>
        </div>
      </div>

      {/* Stats 2x2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '👥', label: 'My Students', value: '48', sub: '3 batches', color: '#4F8EF7' },
          { icon: '❓', label: 'Pending Doubts', value: '7', sub: '🔴 New', color: '#FF4444', urgent: true },
          { icon: '📝', label: 'Tests Created', value: '12', sub: 'All time', color: '#00FF88' },
          { icon: '📅', label: 'Attendance', value: '⚠️', sub: 'Mark Now', color: '#FFD700', urgent: true },
        ].map(s => (
          <div key={s.label} className={`bg-[#12121A] rounded-[20px] p-4 md:p-5 border transition-all hover:scale-[1.02] cursor-pointer ${s.urgent ? 'border-red-500/20' : 'border-white/5 hover:border-[#4F8EF7]/25'}`}
            onClick={() => s.label === 'Pending Doubts' ? navigate('/teacher/doubts') : s.label === 'Attendance' ? navigate('/teacher/attendance') : null}>
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
            <div className="text-[11px] text-white/30 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-[#12121A] border border-white/5 rounded-[24px] p-5 md:p-6">
        <h2 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {schedule.map(cls => (
            <div key={cls.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-2xl border border-[#4F8EF7]/10 hover:border-[#4F8EF7]/25 transition-all gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#4F8EF7]/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🕓</span>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{cls.class} — {cls.batch}</p>
                  <p className="text-xs text-white/50 mt-0.5">{cls.time} • {cls.students} students</p>
                </div>
              </div>
              <button onClick={() => navigate('/teacher/attendance')}
                className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] w-full md:w-auto"
                style={{ background: '#4F8EF7', color: '#0A0A0F' }}>
                Mark Attendance <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Doubts */}
        <div className="bg-[#12121A] border border-white/5 rounded-[24px] p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center">
              <HelpCircle size={14} className="mr-1.5 text-red-400" /> Pending Doubts (7)
            </h2>
            <button onClick={() => navigate('/teacher/doubts')} className="text-xs font-medium" style={{ color: '#4F8EF7' }}>View All →</button>
          </div>
          <div className="space-y-3">
            {pendingDoubts.slice(0, 2).map((d, i) => (
              <div key={i} className="p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/20 transition-all cursor-pointer" onClick={() => navigate('/teacher/doubts')}>
                <p className="text-sm text-white/80 line-clamp-2">"{d.q}"</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-white/40">{d.student} • {d.class} • {d.subject}</div>
                  <div className="text-xs text-white/30">{d.time}</div>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/teacher/doubts')}
              className="w-full py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-white/5"
              style={{ borderColor: 'rgba(79,142,247,0.25)', color: '#4F8EF7' }}>
              Answer Now →
            </button>
          </div>
        </div>

        {/* Recent Test Results */}
        <div className="bg-[#12121A] border border-white/5 rounded-[24px] p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-white/60 uppercase tracking-wider">Recent Test Results</h2>
            <button onClick={() => navigate('/teacher/results')} className="text-xs font-medium" style={{ color: '#4F8EF7' }}>View All →</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Algebra Test', batch: 'Class 10 CBSE', avg: 74, students: 18 },
              { name: 'Science Test', batch: 'Class 8 State', avg: 81, students: 22 },
            ].map(t => (
              <div key={t.name} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{t.batch} • {t.students} students</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: t.avg >= 75 ? '#00FF88' : '#FFD700' }}>{t.avg}%</div>
                  <div className="text-[10px] text-white/30">Avg Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── AGE-ADAPTIVE STUDENT DASHBOARD ─────────────────────────────────────────

// Determine theme from class number
function getStudentTheme(classNum) {
  const n = parseInt(classNum) || 10;
  if (n <= 3) return {
    zone: 'FUN ZONE 🌈', accent: '#FF6B6B', secondary: '#4ECDC4', highlight: '#FFE66D',
    fontSize: '18px', headingSize: '28px', mascot: '🦉', tone: 'fun',
    cardBorder: 'rgba(255,107,107,0.2)', bg: 'rgba(255,107,107,0.08)',
  };
  if (n <= 6) return {
    zone: 'ADVENTURE ZONE 🗺️', accent: '#FF8C42', secondary: '#6C63FF', highlight: '#FFD700',
    fontSize: '16px', headingSize: '26px', mascot: '🚀', tone: 'adventure',
    cardBorder: 'rgba(255,140,66,0.2)', bg: 'rgba(255,140,66,0.08)',
  };
  if (n <= 9) return {
    zone: 'PRO ZONE ⚡', accent: '#00FF88', secondary: '#4F8EF7', highlight: '#FFD700',
    fontSize: '15px', headingSize: '24px', mascot: null, tone: 'pro',
    cardBorder: 'rgba(0,255,136,0.2)', bg: 'rgba(0,255,136,0.08)',
  };
  return {
    zone: 'ELITE ZONE 🏆', accent: '#FFD700', secondary: '#F0F0F0', highlight: '#00FF88',
    fontSize: '15px', headingSize: '22px', mascot: null, tone: 'elite',
    cardBorder: 'rgba(255,215,0,0.2)', bg: 'rgba(255,215,0,0.08)',
  };
}

// FUN ZONE (Class 1-3)
const FunZoneDashboard = ({ user, theme }) => {
  const navigate = useNavigate();
  const stickers = ['⭐', '🏆', '🌟', '💎', '🎯', '🎮', '🎨', '🚀'];
  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-5xl animate-bounce">{theme.mascot}</div>
        <div>
          <h1 style={{ fontSize: theme.headingSize, fontWeight: 'bold', color: theme.accent }} className="font-space">
            Hello {user?.name?.split(' ')[0]}! 🎉
          </h1>
          <p className="text-white/60 text-base">Great to see you today!</p>
        </div>
      </div>

      {/* Stars / Level */}
      <div className="rounded-2xl p-5 border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <div className="flex justify-between items-center mb-3">
          <span style={{ color: theme.highlight, fontSize: '18px', fontWeight: 'bold' }}>⭐ 150 Stars!</span>
          <span className="text-sm text-white/60">Level 3</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: '60%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.highlight})` }} />
        </div>
        <p className="text-xs text-white/40 mt-2">60 more stars to Level 4! 🎯</p>
      </div>

      {/* Today's Activities */}
      <div className="space-y-3">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Today's Activities</h2>
        {[
          { emoji: '📖', text: 'Read Chapter 4', cta: 'Start!', accent: theme.secondary },
          { emoji: '🎯', text: "Take today's quiz", cta: 'Play!', accent: theme.accent },
        ].map(a => (
          <div key={a.text} className="flex items-center justify-between p-4 bg-[#12121A] border border-white/5 rounded-2xl">
            <div className="flex items-center space-x-3">
              <span style={{ fontSize: '24px' }}>{a.emoji}</span>
              <span className="font-medium text-white" style={{ fontSize: '16px' }}>{a.text}</span>
            </div>
            <button onClick={() => navigate('/student/tests')}
              className="px-4 py-2 rounded-xl font-bold text-sm" style={{ background: a.accent, color: '#0A0A0F', minHeight: '44px' }}>
              {a.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Big Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { emoji: '❓', text: 'Ask a Question', path: '/student/doubts', accent: theme.accent },
          { emoji: '📝', text: 'Take a Test', path: '/student/tests', accent: theme.secondary },
        ].map(b => (
          <button key={b.text} onClick={() => navigate(b.path)}
            className="flex flex-col items-center justify-center py-6 rounded-2xl border-2 font-bold transition-all active:scale-95"
            style={{ borderColor: b.accent, background: `${b.accent}15`, minHeight: '100px' }}>
            <span style={{ fontSize: '40px' }}>{b.emoji}</span>
            <span className="text-white mt-2 text-sm">{b.text}</span>
          </button>
        ))}
      </div>

      {/* Sticker Collection */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-white/60 mb-3">My Sticker Collection ✨</h3>
        <div className="flex flex-wrap gap-3">
          {stickers.map(s => <span key={s} className="text-2xl">{s}</span>)}
        </div>
      </div>

      {/* Owl tip */}
      <div className="flex items-start space-x-3 p-4 rounded-2xl border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <span className="text-3xl">{theme.mascot}</span>
        <div>
          <p className="font-bold" style={{ color: theme.accent, fontSize: '15px' }}>Owl says:</p>
          <p className="text-white/70 text-sm mt-1">"You're doing AMAZING! Study for 10 more minutes and earn a special sticker! 🌟"</p>
        </div>
      </div>
    </div>
  );
};

// ADVENTURE ZONE (Class 4-6)
const AdventureZoneDashboard = ({ user, theme }) => {
  const navigate = useNavigate();
  const quests = [
    { done: true, text: 'Morning quiz completed!', xp: '+50 XP' },
    { done: false, text: 'Study Chapter 5 (20 min)' },
    { done: false, text: 'Answer 3 doubts' },
  ];
  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="font-bold font-space" style={{ fontSize: theme.headingSize, color: 'white' }}>
          Hey {user?.name?.split(' ')[0]}! Ready for adventure? {theme.mascot}
        </h1>
      </div>

      {/* Level + XP bar */}
      <div className="rounded-2xl p-5 border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: theme.accent, fontWeight: 'bold', fontSize: '16px' }}>LEVEL 12 EXPLORER</span>
          <span className="text-white/60 text-sm">1,240 / 1,500 XP</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '83%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.highlight})` }} />
        </div>
        <p className="text-xs text-white/40 mt-2">83% to Level 13 — keep going!</p>
      </div>

      {/* Quests */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5">
        <h2 className="font-bold text-white mb-3">── Today's Quests ──</h2>
        <div className="space-y-2.5">
          {quests.map((q, i) => (
            <div key={i} className="flex items-center space-x-3">
              <span className="text-xl">{q.done ? '✅' : '🔲'}</span>
              <span className={`text-sm flex-1 ${q.done ? 'text-white/50 line-through' : 'text-white'}`}>{q.text}</span>
              {q.xp && <span className="text-xs font-bold" style={{ color: theme.accent }}>{q.xp}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🔍', text: 'Ask', path: '/student/doubts', color: theme.accent },
          { emoji: '📝', text: 'Quiz', path: '/student/tests', color: theme.secondary },
          { emoji: '🏆', text: 'Rank', path: '/student/leaderboard', color: theme.highlight },
        ].map(a => (
          <button key={a.text} onClick={() => navigate(a.path)}
            className="flex flex-col items-center py-4 rounded-2xl border transition-all active:scale-95 font-bold"
            style={{ borderColor: `${a.color}30`, background: `${a.color}10` }}>
            <span className="text-3xl">{a.emoji}</span>
            <span className="text-xs mt-2" style={{ color: a.color }}>{a.text}</span>
          </button>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">My Badge Collection</h3>
        <div className="flex flex-wrap gap-2">
          {['🏆 Top Scorer', '⚡ Speed Demon', '🔥 7-Day Streak', '📚 Doubt Crusher'].map(b => (
            <span key={b} className="text-xs px-3 py-1.5 rounded-full border text-white/70" style={{ borderColor: `${theme.accent}30`, background: `${theme.accent}10` }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Batch Ranking */}
      <div className="rounded-2xl p-4 border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <p className="text-sm text-white">🏅 You are <strong style={{ color: theme.accent }}>#4 in your class</strong> this week!</p>
        <button onClick={() => navigate('/student/leaderboard')} className="mt-2 text-xs font-bold" style={{ color: theme.secondary }}>See Full Leaderboard →</button>
      </div>
    </div>
  );
};

// PRO ZONE (Class 7-9)
const ProZoneDashboard = ({ user, theme }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-5 pb-4">
      <h1 className="font-bold font-space" style={{ fontSize: theme.headingSize, color: 'white' }}>
        Good Morning, {user?.name?.split(' ')[0]} ⚡
      </h1>

      {/* Top 3 stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Rank', value: '#3', sub: 'Batch', color: theme.accent },
          { label: 'Score', value: '78%', sub: 'Avg', color: theme.secondary },
          { label: 'XP', value: '3,450', sub: 'Total', color: theme.highlight },
        ].map(s => (
          <div key={s.label} className="bg-[#12121A] border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
            <div className="text-[10px] text-white/30">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Upcoming alert */}
      <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ background: `${theme.secondary}10`, borderColor: `${theme.secondary}25` }}>
        <div>
          <p className="font-bold text-white text-sm">📝 Algebra Test Tomorrow 4PM</p>
          <p className="text-xs text-white/50 mt-0.5">Don't forget to revise Quadratic Equations</p>
        </div>
        <button onClick={() => navigate('/student/planner')} className="text-xs px-3 py-2 rounded-xl font-bold whitespace-nowrap" style={{ background: theme.secondary, color: '#0A0A0F' }}>
          Revise →
        </button>
      </div>

      {/* Quick Access */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: '🔍', text: 'Doubt', path: '/student/doubts' },
            { emoji: '📝', text: 'Test', path: '/student/tests' },
            { emoji: '🧬', text: 'DNA', path: '/student/dna' },
            { emoji: '🏆', text: 'Board', path: '/student/leaderboard' },
            { emoji: '📅', text: 'Plan', path: '/student/planner' },
            { emoji: '📊', text: 'Stats', path: '/student/analytics' },
          ].map(a => (
            <button key={a.text} onClick={() => navigate(a.path)}
              className="flex flex-col items-center py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-xl">{a.emoji}</span>
              <span className="text-[11px] text-white/60 mt-1">{a.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weak Areas */}
      <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4">
        <h3 className="font-bold text-white mb-3 text-sm">── Weak Areas ──</h3>
        {['Quadratic Equations', 'Chemical Bonding'].map(ch => (
          <div key={ch} className="flex items-center space-x-2 text-sm py-1.5">
            <span className="text-red-400">🔴</span>
            <span className="text-white/70 flex-1">{ch}</span>
          </div>
        ))}
        <button onClick={() => navigate('/student/doubts')} className="mt-3 text-xs font-bold" style={{ color: theme.accent }}>
          Practice These Now →
        </button>
      </div>

      {/* Streak */}
      <div className="rounded-2xl p-4 border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-white">🔥 12 day streak!</p>
            <p className="text-xs text-white/50 mt-0.5">Next milestone: 15 days 🏆</p>
          </div>
          <div className="text-4xl font-bold" style={{ color: theme.accent }}>12</div>
        </div>
      </div>
    </div>
  );
};

// ELITE ZONE (Class 10-12)
const EliteZoneDashboard = ({ user, theme }) => {
  const navigate = useNavigate();
  const getExamCountdown = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // CBSE board exams typically in February of the next calendar year
    const examYear = now.getMonth() >= 3 ? currentYear + 1 : currentYear; // After March = next year
    const examDate = new Date(`${examYear}-02-15`);
    const diffMs = examDate - now;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };
  const examDays = getExamCountdown();

  // Read readyPct from localStorage (written by test results)
  const progressData = (() => {
    try { return JSON.parse(localStorage.getItem('achievers_progress') || '{}'); } catch { return {}; }
  })();
  const readyPct = progressData.readyPct ?? 65;
  return (
    <div className="space-y-5 pb-4">
      <div>
        <p className="text-white/50 text-sm">{user?.name} • Class 10 CBSE</p>
        <h1 className="font-bold font-space mt-1" style={{ fontSize: theme.headingSize, color: 'white' }}>
          Board Exam Dashboard 🏆
        </h1>
      </div>

      {/* Countdown */}
      <div className="rounded-2xl p-5 border" style={{ background: theme.bg, borderColor: theme.cardBorder }}>
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-white">⏰ Board Exam 2026</span>
          <span className="text-3xl font-bold" style={{ color: theme.accent }}>{examDays}</span>
        </div>
        <p className="text-xs text-white/50 mb-3">{examDays} days remaining • {readyPct}% ready</p>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${readyPct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.highlight})` }} />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Avg Score', value: '78%', color: theme.accent },
          { label: 'Batch Rank', value: '#3', color: theme.highlight },
        ].map(s => (
          <div key={s.label} className="bg-[#12121A] border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Plan */}
      <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5">
        <h2 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">── Today's Study Plan ──</h2>
        <div className="space-y-3">
          {[
            { sub: 'Maths', topic: 'Quadratic Equations', min: 45, color: theme.accent },
            { sub: 'Physics', topic: 'Laws of Motion', min: 30, color: theme.secondary },
            { sub: 'English', topic: 'Essay Practice', min: 20, color: theme.highlight },
          ].map(p => (
            <div key={p.sub} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">📚 {p.sub}: {p.topic}</p>
                <p className="text-xs text-white/40 mt-0.5">{p.min} minutes</p>
              </div>
              <div className="w-2 h-8 rounded-full" style={{ background: p.color }} />
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/student/planner')} className="mt-3 text-xs font-bold w-full text-center py-2" style={{ color: theme.accent }}>View Full Study Plan →</button>
      </div>

      {/* Predicted Score */}
      <div className="p-4 rounded-2xl border" style={{ background: 'rgba(255,215,0,0.05)', borderColor: 'rgba(255,215,0,0.15)' }}>
        <h3 className="font-bold text-white mb-2">🔮 Predicted Score Analysis</h3>
        <p className="text-sm text-white/70">At current pace: <strong style={{ color: theme.accent }}>74–82%</strong></p>
        <p className="text-xs text-white/50 mt-1">Study 2 more chapters → reach 85%+</p>
        <button onClick={() => navigate('/student/analytics')} className="mt-2 text-xs font-bold" style={{ color: theme.accent }}>View Full Analysis →</button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { text: 'Doubt Solver 🔍', path: '/student/doubts', primary: true },
          { text: 'Mock Test 📝', path: '/student/tests', primary: false },
          { text: 'DNA Map 🧬', path: '/student/dna', primary: false },
          { text: 'Prev Papers 📚', path: '/student/materials', primary: false },
        ].map(a => (
          <button key={a.text} onClick={() => navigate(a.path)}
            className="py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border"
            style={a.primary
              ? { background: theme.accent, color: '#0A0A0F', borderColor: theme.accent }
              : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            {a.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN STUDENT DASHBOARD WRAPPER ───────────────────────────────────────
export const StudentDashboard = () => {
  const { user } = useAuth();
  const classNum = (() => {
    if (!user?.class) {
      const digits = user?.user_id?.replace(/\D/g, '') || '';
      return parseInt(digits.charAt(0)) || 10;
    }
    const num = parseInt(user.class.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 10 : num;
  })();
  const theme = getStudentTheme(classNum);
  const props = { user, theme };

  return (
    <div style={{ fontSize: theme.fontSize }}>
      {/* Zone indicator badge */}
      <div className="flex items-center space-x-2 mb-4 opacity-50">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold tracking-widest" style={{ color: theme.accent }}>{theme.zone}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {classNum <= 3 && <FunZoneDashboard {...props} />}
      {classNum >= 4 && classNum <= 6 && <AdventureZoneDashboard {...props} />}
      {classNum >= 7 && classNum <= 9 && <ProZoneDashboard {...props} />}
      {classNum >= 10 && <EliteZoneDashboard {...props} />}
    </div>
  );
};



const parentTestScores = [
  { test: 'Test 1', score: 65 },
  { test: 'Test 2', score: 72 },
  { test: 'Test 3', score: 85 },
  { test: 'Test 4', score: 78 },
  { test: 'Test 5', score: 92 },
];

export const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const childName = user?.childName || 'Your Child';
  const childId = user?.childId || '—';
  const parentPhone = user?.phone || '919876543210';

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Weekly Progress Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Student: ${childName} (${childId})`, 14, 32);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`Attendance: 92% | Latest Score: 92%`, 14, 50);
    doc.text(`Teacher Remarks: ${childName.split(' ')[0]} is showing excellent progress in Mathematics.`, 14, 60);
    doc.save(`Weekly_Report_${childId}.pdf`);
  };
  
  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto animate-in fade-in">
      <header className="flex flex-col md:flex-row justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name || 'Parent'}</h1>
          <p className="text-white/60 mt-1">Overview of {childName.split(' ')[0]}'s performance and activities.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.open(`https://wa.me/${parentPhone}`, '_blank')} className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 px-4 py-2 rounded-xl flex items-center text-sm font-bold transition-colors">
            <MessageCircle size={16} className="mr-2" /> Message Teacher
          </button>
          <button onClick={handleDownloadReport} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-colors">
            <Download size={16} className="mr-2" /> Weekly Report
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Overall Attendance" value="92%" subtitle="24/26 Classes Attended" />
        <DashboardCard title="Average Score" value="82.5%" subtitle="Across 14 tests" />
        <DashboardCard title="Global Rank" value="#4" subtitle="Top 5% in center" />
        <div className="glass-card p-6 border-l-4 border-l-[#00FF88]">
          <h3 className="text-white/60 text-sm font-medium">Fee Status</h3>
          <div className="text-2xl font-bold text-[#00FF88] mt-2 flex items-center"><CheckCircle size={24} className="mr-2" /> Paid</div>
          <p className="text-xs text-white/40 mt-1">Next due: Nov 1, 2026</p>
        </div>
      </div>

      {/* Attendance Record Button */}
      <button
        onClick={() => navigate('/parent/attendance')}
        className="w-full glass-card p-4 flex items-center justify-between hover:border-gold/30 transition-colors group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <CheckCircle size={20} />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Attendance Record</p>
            <p className="text-white/40 text-xs">View monthly calendar</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-white/30 group-hover:text-gold transition-colors" />
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Score Graph */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center"><FileText size={18} className="mr-2 text-gold" /> Test Score History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parentTestScores} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="test" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#0A0A0F', stroke: '#FFD700', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          {/* Teacher Remarks Feed */}
          <div className="glass-card p-6 h-48 overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">Teacher Remarks</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-gold pl-3">
                <p className="text-white text-sm">"{childName.split(' ')[0]} has shown massive improvement in Calculus. Keep encouraging him to practice daily!"</p>
                <p className="text-xs text-white/40 mt-1">John Doe (Math) • 2 days ago</p>
              </div>
              <div className="border-l-2 border-[#00FF88] pl-3">
                <p className="text-white text-sm">"Excellent participation in today's Brain Battle. Very quick problem-solving skills."</p>
                <p className="text-xs text-white/40 mt-1">Alice Smith (Physics) • 1 week ago</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tests */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center"><CalIcon size={18} className="mr-2 text-gold" /> Upcoming Schedule</h2>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-white text-sm">Full Length Mock Test 4</p>
                <p className="text-xs text-red-400">Sunday, 09:00 AM</p>
              </div>
              <div className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">Mandatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
