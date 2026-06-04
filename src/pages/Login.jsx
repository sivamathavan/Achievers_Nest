import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleFromUserId, generateMockJWT } from '../utils/auth';
import { User, Lock, Eye, EyeOff, ArrowLeft, Shield, BookOpen, GraduationCap, Users } from 'lucide-react';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [detectedRole, setDetectedRole] = useState(null);
  const [board, setBoard] = useState('CBSE');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // On Mount: Load remembered User ID
  useEffect(() => {
    const saved = localStorage.getItem('rememberedUserId');
    if (saved) {
      setUserId(saved);
      setRememberMe(true);
      handleRoleDetection(saved);
    }
  }, []);

  const handleRoleDetection = (val) => {
    const prefix = val.substring(0, 3).toUpperCase();
    if (prefix === 'ADM') setDetectedRole('Admin');
    else if (prefix === 'TCH') setDetectedRole('Teacher');
    else if (prefix === 'STU') setDetectedRole('Student');
    else if (prefix === 'PAR') setDetectedRole('Parent');
    else setDetectedRole(null);
  };

  const handleUserIdChange = (e) => {
    const val = e.target.value;
    setUserId(val);
    handleRoleDetection(val);
    setError(null); // clear error on typing
  };

  const getRoleBadge = () => {
    if (!detectedRole) return null;
    
    switch (detectedRole) {
      case 'Admin': return { bg: 'bg-gold', text: 'text-dark-bg', icon: <Shield size={14} className="mr-1.5" /> };
      case 'Teacher': return { bg: 'bg-[#4F8EF7]', text: 'text-white', icon: <BookOpen size={14} className="mr-1.5" /> };
      case 'Student': return { bg: 'bg-[#00FF88]', text: 'text-dark-bg', icon: <GraduationCap size={14} className="mr-1.5" /> };
      case 'Parent': return { bg: 'bg-[#A78BFA]', text: 'text-white', icon: <Users size={14} className="mr-1.5" /> };
      default: return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!password || password.length < 4) {
        throw new Error('Password must be at least 4 characters.');
      }

      if (!userId || userId.length < 4) {
        throw new Error('Invalid User ID');
      }
      
      const role = getRoleFromUserId(userId);
      if (!role) {
        throw new Error('Invalid User ID or Password.');
      }

      // Simulate network
      await new Promise(resolve => setTimeout(resolve, 800));

      const digits = userId.replace(/\D/g, '');
      const parsedClassNum = parseInt(digits);
      const studentClass = !isNaN(parsedClassNum) && parsedClassNum >= 1 && parsedClassNum <= 12 
        ? `Class ${parsedClassNum}` 
        : 'Class 10';

      const mockUser = {
        id: 'mock-uuid',
        user_id: userId.toUpperCase(),
        name: `Mock ${role}`,
        role: role,
        class: role === 'Student' ? studentClass : undefined
      };

      if (role === 'Student') {
        mockUser.board = board;
      }

      if (role === 'Parent') {
        mockUser.childName = 'Linked Student';
        mockUser.childId = 'STU2024001';
      }

      if (rememberMe) {
        localStorage.setItem('rememberedUserId', userId.toUpperCase());
      } else {
        localStorage.removeItem('rememberedUserId');
      }

      const token = generateMockJWT(mockUser);
      login(token, mockUser);
      
      const routes = {
        'Admin': '/admin',
        'Teacher': '/teacher',
        'Student': '/student',
        'Parent': '/parent'
      };
      
      navigate(routes[role] || '/');
      
    } catch (err) {
      setError(err.message || 'Invalid User ID or Password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const badge = getRoleBadge();

  return (
    <div className="relative min-h-[100svh] flex flex-col items-center justify-center p-4">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80" 
          alt="Students studying" 
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.85) 50%, rgba(10,10,15,0.92) 100%)'
          }}
        />
      </div>

      {/* Login Card */}
      <div 
        className={`relative z-10 w-full max-w-[420px] mx-auto bg-[#12121A]/95 backdrop-blur-[20px] border border-gold/20 rounded-[24px] p-8 md:p-10 shadow-2xl transition-transform ${shake ? 'animate-shake' : ''}`}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto flex items-center justify-center mb-4">
            <img src="/brand/app_icon.svg" alt="Achievers Nest Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 font-space">Welcome Back</h1>
          <p className="text-white/50 text-sm">Sign in to your portal</p>
        </div>

        {/* Role Indicator */}
        <div className={`h-8 mb-4 transition-all duration-300 flex items-center justify-center ${detectedRole ? 'opacity-100' : 'opacity-0'}`}>
          {badge && (
            <div className="flex items-center text-xs">
              <span className="text-white/50 mr-2">Detected Role:</span>
              <div className={`flex items-center px-3 py-1 rounded-full font-bold ${badge.bg} ${badge.text}`}>
                {badge.icon} {detectedRole} Portal
              </div>
            </div>
          )}
        </div>

        {detectedRole === 'Student' && (
          <div className="mb-4">
            <label className="text-[13px] font-medium text-white/70 mb-2 block">Board</label>
            <div className="flex gap-2">
              {['CBSE', 'State Board', 'ICSE'].map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBoard(b)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    board === b
                      ? 'bg-gold text-dark-bg border-gold font-bold'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* User ID Field */}
          <div>
            <label className="block text-[13px] font-medium text-white/70 mb-2">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gold" />
              </div>
              <input
                type="text"
                placeholder="e.g. ADM001"
                className="w-full bg-white/5 border border-gold/20 rounded-xl py-3.5 pl-12 pr-4 text-[#F0F0F0] text-[16px] tracking-widest uppercase focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                value={userId}
                onChange={handleUserIdChange}
                autoComplete="username"
              />
            </div>
            <p className="text-[11px] text-white/40 mt-1.5 ml-1">e.g. ADM001, TCH001, STU001</p>
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-[13px] font-medium text-white/70 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gold" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-gold/20 rounded-xl py-3.5 pl-12 pr-12 text-[#F0F0F0] text-[16px] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 mr-2">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="peer appearance-none w-4 h-4 border border-gold/40 rounded bg-transparent checked:bg-gold transition-colors" 
                />
                <svg className="absolute w-3 h-3 text-dark-bg opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">Remember me</span>
            </label>
            
            <button 
              type="button" 
              onClick={() => alert("Contact your administrator to reset your password")}
              className="text-[13px] text-gold hover:text-yellow-300 transition-colors"
            >
              Forgot Pass?
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center text-[16px] transition-all mt-6 ${
              isLoading 
                ? 'bg-gradient-to-r from-gold/80 to-yellow-400/80 text-dark-bg cursor-not-allowed' 
                : 'bg-gradient-to-r from-gold to-yellow-400 text-dark-bg hover:scale-[1.02] shadow-[0_4px_15px_rgba(255,215,0,0.3)]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>🚀 Sign In to Portal</>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-[14px] flex items-start animate-[fadeIn_0.3s_ease-out]">
            <span className="mr-2">❌</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Back to Home */}
      <Link to="/" className="relative z-10 mt-8 flex items-center text-white/50 hover:text-gold text-sm transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Home
      </Link>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20%     { transform: translateX(-8px) }
          40%     { transform: translateX(8px) }
          60%     { transform: translateX(-8px) }
          80%     { transform: translateX(8px) }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default Login;
