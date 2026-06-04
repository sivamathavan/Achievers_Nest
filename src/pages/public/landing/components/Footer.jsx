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
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <span className="text-dark-bg font-space font-bold">AN</span>
              </div>
              <span className="font-space font-bold text-xl tracking-tight text-white">
                Achievers Nest
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Empowering students since 2020. Expert coaching for all boards and classes in Vadavalli, Coimbatore.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Courses', 'Results', 'Enroll'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => handleNavClick(`#${link.toLowerCase() === 'enroll' ? 'enroll' : link.toLowerCase()}`)}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Boards */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Boards</h4>
            <ul className="space-y-2">
              {['State Board', 'CBSE', 'Matric', 'ICSE'].map((board) => (
                <li key={board}>
                  <button 
                    onClick={() => handleNavClick('#courses')}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {board}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="tel:+916382987874" className="text-white/60 hover:text-gold transition-colors text-sm">+91 63829 87874</a>
              </li>
              <li>
                <a href="https://wa.me/916381169124" target="_blank" rel="noreferrer" className="text-white/60 hover:text-gold transition-colors text-sm">WhatsApp Chat</a>
              </li>
              <li>
                <a href="mailto:achieversnest@gmail.com" className="text-white/60 hover:text-gold transition-colors text-sm">Email Us</a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=Vadavalli,+Coimbatore,+Tamil+Nadu+641041" target="_blank" rel="noreferrer" className="text-white/60 hover:text-gold transition-colors text-sm">View on Map</a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Achievers Nest. All rights reserved. Made with ❤️ in Coimbatore
          </p>
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
