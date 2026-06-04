import React, { useEffect, useState } from 'react';
import { ChevronDown, ArrowRight, Phone, ShieldCheck, Clock, Award, BookOpen } from 'lucide-react';

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headingWords = ["Unlock", "Your", "Child's", "Full", "Potential"];
  
  const handleScrollToForm = () => {
    const el = document.getElementById('enroll');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden bg-[#0A0A0F]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.png" 
          alt="Teacher helping student" 
          className="w-full h-full object-cover object-center opacity-40"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-12 pb-32 lg:py-12">
        
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-6">
          
          {/* Badge */}
          <div className="animated-border rounded-full p-[2px] opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="bg-[#12121A] rounded-full px-4 py-1.5 flex items-center">
              <span className="text-sm font-medium text-gold flex items-center">
                <Award size={16} className="mr-2" /> Coimbatore's #1 Tuition Centre
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-space font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white">
            {headingWords.map((word, i) => (
              <span 
                key={i} 
                className="inline-block mr-3 opacity-0"
                style={{
                  animation: mounted ? `fadeInUp 0.6s ease-out forwards ${i * 0.15}s` : 'none'
                }}
              >
                {word === "Potential" ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-300 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">{word}</span> : word}
              </span>
            ))}
          </h1>

          {/* Tamil Subtext */}
          <p className="font-tamil text-gold/90 text-lg sm:text-xl font-medium opacity-0" style={{ animation: mounted ? 'fadeInUp 0.6s ease-out forwards 0.8s' : 'none' }}>
            உங்கள் குழந்தையின் எதிர்காலத்தை நாங்கள் உருவாக்குகிறோம்
          </p>

          {/* Description */}
          <p className="text-white/70 text-base sm:text-lg max-w-lg leading-relaxed opacity-0" style={{ animation: mounted ? 'fadeInUp 0.6s ease-out forwards 1s' : 'none' }}>
            Expert coaching for Class 1-12 students. State Board, CBSE, Matric & ICSE. Tamil & English medium. Located in Vadavalli, Coimbatore.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto opacity-0" style={{ animation: mounted ? 'fadeInUp 0.6s ease-out forwards 1.2s' : 'none' }}>
            <button 
              onClick={handleScrollToForm}
              className="bg-gradient-to-r from-gold to-yellow-400 text-dark-bg font-bold px-8 py-4 rounded-xl flex justify-center items-center text-lg hover:scale-105 transition-transform glow-gold-hover"
            >
              🚀 Enroll Now <ArrowRight size={20} className="ml-2" />
            </button>
            <a 
              href="tel:+916382987874"
              className="glass-panel border-gold/30 text-gold hover:bg-gold/10 font-bold px-8 py-4 rounded-xl flex justify-center items-center text-lg transition-colors"
            >
              📞 Call Us
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 w-full max-w-lg opacity-0" style={{ animation: mounted ? 'fadeInUp 0.6s ease-out forwards 1.4s' : 'none' }}>
            <div className="flex items-center text-white/80">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                <ShieldCheck size={20} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">500+</span>
                <span className="text-xs text-white/50">Students</span>
              </div>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
                <Clock size={20} className="text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">10+ Years</span>
                <span className="text-xs text-white/50">Experience</span>
              </div>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mr-3">
                <Award size={20} className="text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">95%</span>
                <span className="text-xs text-white/50">Board Results</span>
              </div>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                <BookOpen size={20} className="text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">4 Boards</span>
                <span className="text-xs text-white/50">All Classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - 3D Cards (Desktop) */}
        <div className="hidden lg:block relative h-[600px] w-full card-stack group opacity-0" style={{ animation: mounted ? 'fadeIn 1s ease-out forwards 1.5s' : 'none' }}>
          
          {/* Card 1 */}
          <div className="absolute top-10 right-10 w-72 glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 card-3d z-40 transform rotate-[-5deg] hover:rotate-0 hover:z-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Performance</h3>
            <p className="text-white/60 text-sm">Real-time tracking of test scores and attendance.</p>
          </div>

          {/* Card 2 */}
          <div className="absolute top-48 left-0 w-72 glass-panel p-6 rounded-2xl border-l-4 border-l-gold card-3d z-30 transform rotate-[5deg] hover:rotate-0 hover:z-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🧬</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Weakness Map</h3>
            <p className="text-white/60 text-sm">Visual DNA map showing strong and weak chapters.</p>
          </div>

          {/* Card 3 */}
          <div className="absolute top-80 right-2 w-72 glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 card-3d z-20 transform rotate-[-8deg] hover:rotate-0 hover:z-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Board Specific</h3>
            <p className="text-white/60 text-sm">Tailored mock tests for State Board, CBSE, ICSE.</p>
          </div>

          {/* Card 4 */}
          <div className="absolute bottom-10 left-10 w-72 glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500 card-3d z-10 transform rotate-[3deg] hover:rotate-0 hover:z-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Top Rankers</h3>
            <p className="text-white/60 text-sm">Exclusive portal features for competitive edge.</p>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 animate-[fadeIn_1s_ease-out_forwards_2.5s]">
        <span className="text-white/40 text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
        <div className="animate-bounce bg-white/5 p-2 rounded-full border border-white/10">
          <ChevronDown size={20} className="text-gold" />
        </div>
      </div>
      
      {/* Keyframes injected via style for Tailwind one-offs not in landing.css */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </section>
  );
};

export default HeroSection;
