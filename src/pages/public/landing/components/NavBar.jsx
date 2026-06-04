import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Courses', href: '#courses' },
    { name: 'Results', href: '#results' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center flex-nowrap w-full">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer select-none mr-2" onClick={() => handleNavClick('#home')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mr-1.5 sm:mr-3 flex items-center justify-center flex-shrink-0">
              <img src="/brand/app_icon.svg" alt="Achievers Nest Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-space font-bold text-[16px] sm:text-xl tracking-tight text-white block flex-shrink-0">
              Achievers Nest
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-white/80 hover:text-white font-medium text-sm transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-gold to-yellow-400 text-dark-bg font-bold px-6 py-2.5 rounded-full flex items-center transition-all hover:scale-105 glow-gold-hover"
            >
              Login <ArrowRight size={16} className="ml-2" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-gold to-yellow-400 text-dark-bg font-bold p-2 rounded-full flex items-center transition-all glow-gold-hover"
            >
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-white/80 hover:text-white hover:bg-white/5 font-medium text-lg text-left px-4 py-3 rounded-lg transition-colors"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
            className="w-full bg-gold/10 border border-gold/30 text-gold font-bold px-4 py-3 rounded-lg flex items-center justify-center mt-2"
          >
            Go to Portal <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
