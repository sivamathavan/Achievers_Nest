import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#08080E] pt-16 pb-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left lg:col-span-1">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-8 h-8 mr-2.5 flex items-center justify-center">
                <img src="/brand/app_icon.svg" alt="Achievers Nest Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-space font-bold text-xl tracking-tight text-white">
                Achievers Nest
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-sm">
              Empowering students since 2020. Expert coaching for all boards and classes in Vadavalli, Coimbatore.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Courses', 'Results', 'Enroll'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => handleNavClick(`#${link.toLowerCase() === 'enroll' ? 'enroll' : link.toLowerCase()}`)}
                    className="text-white/60 hover:text-gold transition-colors text-sm w-full md:w-auto text-center md:text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Boards */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Boards</h4>
            <ul className="space-y-2">
              {['State Board', 'CBSE', 'Matric', 'ICSE'].map((board) => (
                <li key={board}>
                  <button 
                    onClick={() => handleNavClick('#courses')}
                    className="text-white/60 hover:text-gold transition-colors text-sm w-full md:w-auto text-center md:text-left"
                  >
                    {board}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="tel:+916382987874" className="text-white/60 hover:text-gold transition-colors text-sm block w-full md:w-auto text-center md:text-left">+91 63829 87874</a>
              </li>
              <li>
                <a href="https://wa.me/916381169124" target="_blank" rel="noreferrer" className="text-white/60 hover:text-gold transition-colors text-sm block w-full md:w-auto text-center md:text-left">WhatsApp Chat</a>
              </li>
              <li>
                <a href="mailto:achieversnest@gmail.com" className="text-white/60 hover:text-gold transition-colors text-sm block w-full md:w-auto text-center md:text-left">Email Us</a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps/search/rturox/@11.0283294,76.903623,13z?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-gold transition-colors text-sm block w-full md:w-auto text-center md:text-left"
                >
                  View on Map
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="space-y-1.5">
            <p className="text-white/40 text-sm">
              &copy; {currentYear} Achievers Nest. All rights reserved. Made with ❤️ in Coimbatore
            </p>
            <p className="text-white/30 text-xs font-inter">
              Developed by{' '}
              <a 
                href="https://rturox.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gold hover:text-yellow-400 hover:underline transition-colors font-medium"
              >
                Rturox
              </a>
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
