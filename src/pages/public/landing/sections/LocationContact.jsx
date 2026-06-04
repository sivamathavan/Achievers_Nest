import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Mail, ExternalLink } from 'lucide-react';

const LocationContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-[#12121A] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Left Column: Contact Info */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div>
              <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Find Us</h2>
              <p className="text-white/60 text-lg">We're located in the heart of Vadavalli.</p>
            </div>

            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white/50 text-sm uppercase tracking-wider mb-1 font-medium">Address</h4>
                  <p className="text-white/90 leading-relaxed max-w-sm">
                    Mudhaliyar street, Vadavalli-Thondamuthur Rd,<br/>
                    Coimbatore, Tamil Nadu 641041
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-[#4F8EF7]">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white/50 text-sm uppercase tracking-wider mb-1 font-medium">Call Us</h4>
                  <div className="flex flex-col space-y-1">
                    <a href="tel:+916382987874" className="text-white/90 hover:text-[#4F8EF7] transition-colors font-medium text-lg">+91 63829 87874</a>
                    <a href="tel:+916381169124" className="text-white/90 hover:text-[#4F8EF7] transition-colors font-medium text-lg">+91 63811 69124</a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-[#00FF88]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="text-white/50 text-sm uppercase tracking-wider mb-1 font-medium">WhatsApp</h4>
                  <a href="https://wa.me/916381169124" target="_blank" rel="noreferrer" className="text-white/90 hover:text-[#00FF88] transition-colors font-medium text-lg flex items-center group">
                    +91 63811 69124 <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-[#FF9F1C]">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-white/50 text-sm uppercase tracking-wider mb-1 font-medium">Timings</h4>
                  <p className="text-white/90">Mon-Sat: 8:00 AM - 8:00 PM</p>
                  <p className="text-white/90">Sunday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 flex-shrink-0 text-white/80">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white/50 text-sm uppercase tracking-wider mb-1 font-medium">Email</h4>
                  <a href="mailto:achieversnest@gmail.com" className="text-white/90 hover:text-white transition-colors">achieversnest@gmail.com</a>
                </div>
              </div>

            </div>

            {/* Socials */}
            <div className="pt-6 border-t border-white/10 flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">YT</a>
            </div>
          </div>

          {/* Right Column: Google Maps */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="glass-panel p-2 rounded-[2rem] border border-white/10 h-full min-h-[400px] flex flex-col relative group">
              {/* Map embed */}
              <div className="w-full h-full min-h-[400px] rounded-[1.8rem] overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.452391097652!2d76.9024227!3d11.0113824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85f7cd00908eb%3A0xc3afc64072fec0a8!2sVadavalli%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin" 
                  className="w-full h-full border-0 absolute inset-0 filter invert-[90%] hue-rotate-[180deg] opacity-80 mix-blend-screen transition-all duration-500 group-hover:filter-none group-hover:opacity-100 group-hover:mix-blend-normal"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Achievers Nest Location"
                ></iframe>
                {/* Overlay to enforce dark mode appearance when not hovered */}
                <div className="absolute inset-0 bg-[#0A0A0F]/20 pointer-events-none group-hover:opacity-0 transition-opacity duration-500"></div>
              </div>
              
              <a 
                href="https://maps.google.com/?q=Vadavalli,+Coimbatore,+Tamil+Nadu+641041" 
                target="_blank" 
                rel="noreferrer"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-dark-bg font-bold py-3 px-6 rounded-xl shadow-xl hover:scale-105 transition-transform flex items-center whitespace-nowrap z-10"
              >
                <MapPin size={18} className="mr-2 text-red-500" /> Get Directions
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationContact;
