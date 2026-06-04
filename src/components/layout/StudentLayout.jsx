import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, User, Trophy, FileText, HelpCircle, LogOut, Activity, CheckCircle, IndianRupee, Phone } from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'Parent'
    ? [
        { name: 'Home', path: '/parent', icon: Home },
        { name: 'Attendance', path: '/parent/attendance', icon: CheckCircle },
        { name: 'Contacts', path: '/parent/contacts', icon: Phone },
      ]
    : [
        { name: 'Home', path: '/student', icon: Home },
        { name: 'Doubts', path: '/student/doubts', icon: HelpCircle },
        { name: 'DNA', path: '/student/dna', icon: Activity },
        { name: 'Tests', path: '/student/tests', icon: FileText },
        { name: 'Rank', path: '/student/leaderboard', icon: Trophy },
        { name: 'Profile', path: '/student/profile', icon: User },
      ];

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <img src="/brand/app_icon.svg" alt="Achievers Nest Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gold leading-tight">Achievers Nest</h1>
            <p className="text-xs text-white/50">{user?.role} Portal</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationBell />
          <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      
      {/* Main Content - Padded at bottom for mobile nav */}
      <main className="flex-1 overflow-auto p-4 pb-24 md:pb-8 md:pl-64">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 w-full bg-[#0A0A0F]/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center md:hidden z-20 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/student' || item.path === '/parent'}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-gold' : 'text-white/50 hover:text-white/80'
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Desktop Sidebar Fallback (if they view on large screen) */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white/5 border-r border-white/10 flex-col">
         <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/student' || item.path === '/parent'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-gold text-dark-bg font-semibold' : 'hover:bg-white/10 text-white/70 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default StudentLayout;
