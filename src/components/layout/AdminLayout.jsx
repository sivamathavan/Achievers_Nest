import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Calendar, LogOut, BookOpen, Settings, IndianRupee, PieChart, Bell, ClipboardCheck, HelpCircle, Upload, MoreHorizontal } from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTeacher = user?.role === 'Teacher';
  const accent = isTeacher ? '#4F8EF7' : '#FFD700';
  const accentBg = isTeacher ? 'rgba(79,142,247,0.1)' : 'rgba(255,215,0,0.1)';
  const accentBorder = isTeacher ? 'rgba(79,142,247,0.25)' : 'rgba(255,215,0,0.25)';

  const getNavItems = () => {
    if (isTeacher) {
      return [
        { name: 'Home', path: '/teacher', icon: Home, isBottomNav: true, group: 'MAIN' },
        { name: 'Students', path: '/teacher/students', icon: Users, isBottomNav: true, group: 'MAIN' },
        { name: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck, isBottomNav: false, group: 'MAIN' },
        { name: 'Create Test', path: '/teacher/tests/create', icon: Calendar, isBottomNav: true, group: 'TESTS' },
        { name: 'Results', path: '/teacher/results', icon: PieChart, isBottomNav: false, group: 'TESTS' },
        { name: 'Doubts', path: '/teacher/doubts', icon: HelpCircle, isBottomNav: true, group: 'SUPPORT' },
        { name: 'Materials', path: '/teacher/materials', icon: Upload, isBottomNav: true, group: 'SUPPORT' },
      ];
    }
    // Admin Routes
    return [
      { name: 'Home', path: '/admin', icon: Home, isBottomNav: true, group: 'MAIN' },
      { name: 'Users', path: '/admin/users', icon: Users, isBottomNav: true, group: 'MAIN' },
      { name: 'Batches', path: '/admin/batches', icon: Calendar, isBottomNav: true, group: 'MAIN' },
      { name: 'Reports', path: '/admin/reports', icon: PieChart, isBottomNav: true, group: 'MAIN' },
      { name: 'Q&A Bank', path: '/admin/qa', icon: BookOpen, isBottomNav: false, group: 'MANAGE' },
      { name: 'Alerts', path: '/admin/announcements', icon: Bell, isBottomNav: false, group: 'MANAGE' },
    ];
  };

  const navItems = getNavItems();
  const bottomNavItems = navItems.filter(item => item.isBottomNav).slice(0, 5);

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname || (item.path !== '/admin' && item.path !== '/teacher' && location.pathname.startsWith(item.path)));
    return currentItem ? currentItem.name : 'Portal';
  };

  return (
    <div className="flex h-[100svh] bg-[#0A0A0F] text-[#F0F0F0] overflow-hidden font-inter">
      
      {/* -----------------------------
          DESKTOP SIDEBAR (>= 768px)
      ------------------------------ */}
      <aside className="w-64 flex-shrink-0 bg-[#12121A] hidden md:flex flex-col z-20 shadow-xl" style={{ borderRight: `1px solid ${accentBorder}` }}>
        <div className="p-6 pb-4">
          <div className="w-10 h-10 mb-3 flex items-center justify-center">
            <img src="/brand/app_icon.svg" alt="Achievers Nest Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white font-space">Achievers Nest</h1>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{user?.role} Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
          {(() => {
            const groups = [...new Set(navItems.map(i => i.group))];
            return groups.map(group => (
              <div key={group} className="mb-4">
                <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-4 mb-1">{group}</p>
                {navItems.filter(i => i.group === group).map((item) => {
                  const isItemActive = location.pathname === item.path || (item.path !== `/${user?.role.toLowerCase()}` && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === `/${user?.role.toLowerCase()}`}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-0.5 ${
                        isItemActive ? 'font-semibold' : 'text-white/55 hover:bg-white/5 hover:text-white'
                      }`}
                      style={isItemActive ? { background: accentBg, color: accent, borderLeft: `3px solid ${accent}` } : {}}
                    >
                      <item.icon size={18} />
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ));
          })()}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center space-x-3 px-3 py-2 mb-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/10 overflow-hidden bg-[#141419] flex-shrink-0">
              <img src="/brand/avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || user?.user_id}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.user_id}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* -----------------------------
          MAIN CONTENT AREA
      ------------------------------ */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        
        {/* MOBILE TOP BAR (< 768px) - Fixed 56px */}
        <header className="md:hidden flex items-center justify-between px-4 h-[56px] bg-[#12121A]/95 backdrop-blur-md absolute top-0 left-0 right-0 z-30" style={{ borderBottom: `1px solid ${accentBorder}` }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/10 overflow-hidden bg-[#141419] flex-shrink-0">
              <img src="/brand/avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">{getPageTitle()}</h1>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button onClick={handleLogout} className="text-white/60 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        {/* SCROLLABLE CONTENT */}
        {/* pt-[56px] for mobile top bar, pb-[64px] for mobile bottom bar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-[56px] pb-[80px] md:pt-0 md:pb-0 relative custom-scrollbar">
          
          {/* Desktop Top Bar (Optional, currently just bell) */}
          <div className="hidden md:flex justify-between items-center p-6 pb-2 sticky top-0 bg-[#0A0A0F]/90 backdrop-blur-md z-10">
            <div>
              <h2 className="text-xl font-bold text-white font-space">{getPageTitle()}</h2>
              <p className="text-sm text-white/50">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <NotificationBell />
          </div>

          <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* MOBILE BOTTOM NAV (< 768px) - Fixed 64px */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[#12121A]/98 backdrop-blur-xl z-40 px-2" style={{ borderTop: `1px solid ${accentBorder}` }}>
          <div className="flex items-center justify-around h-full">
            {bottomNavItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path || (item.path !== `/${user?.role.toLowerCase()}` && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === `/${user?.role.toLowerCase()}`}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all duration-300 ${isActive ? '' : 'text-white/40 hover:text-white/70'}`}
                  style={isActive ? { color: accent } : {}}
                >
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                    style={{ background: accent }} />
                  <item.icon size={22} className={`transition-transform duration-300 ${isActive ? '-translate-y-0.5' : ''}`} />
                  <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
            {/* More Button */}
            <button
              onClick={() => setShowMoreMenu(true)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-white/40 hover:text-white/70 transition-colors"
            >
              <MoreHorizontal size={22} />
              <span className="text-[10px] font-medium tracking-wide">More</span>
            </button>
          </div>
        </nav>

        {/* More Menu Overlay (Mobile) */}
        {showMoreMenu && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMoreMenu(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-[#12121A] rounded-t-3xl p-5 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">All Pages</p>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path || (item.path !== `/${user?.role.toLowerCase()}` && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors"
                      style={isActive
                        ? { background: accentBg, color: accent, border: `1px solid ${accentBorder}` }
                        : { color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }
                      }
                    >
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;
