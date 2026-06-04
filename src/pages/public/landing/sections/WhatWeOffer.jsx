import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, PenTool, Dna, Trophy, Users, Mic } from 'lucide-react';

const WhatWeOffer = () => {
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

  const features = [
    {
      icon: <BrainCircuit size={32} className="text-[#00FF88]" />,
      title: "AI Doubt Solver",
      desc: "Get instant answers to any question. Available 24/7 in Tamil & English.",
      color: "from-[#00FF88]/20 to-transparent",
      borderColor: "group-hover:border-[#00FF88]/50"
    },
    {
      icon: <PenTool size={32} className="text-[#FFD700]" />,
      title: "Mock Test Engine",
      desc: "Chapter-wise & full syllabus tests. Board-specific question papers.",
      color: "from-[#FFD700]/20 to-transparent",
      borderColor: "group-hover:border-[#FFD700]/50"
    },
    {
      icon: <Dna size={32} className="text-[#4F8EF7]" />,
      title: "Weakness DNA Map",
      desc: "Visual map of strong and weak chapters. Know exactly what to study next.",
      color: "from-[#4F8EF7]/20 to-transparent",
      borderColor: "group-hover:border-[#4F8EF7]/50"
    },
    {
      icon: <Trophy size={32} className="text-[#FF6B6B]" />,
      title: "Live Leaderboard",
      desc: "Healthy competition with batchmates. Weekly top performers highlighted.",
      color: "from-[#FF6B6B]/20 to-transparent",
      borderColor: "group-hover:border-[#FF6B6B]/50"
    },
    {
      icon: <Users size={32} className="text-[#A78BFA]" />,
      title: "Parent Dashboard",
      desc: "Real-time progress updates. Attendance, scores & fee status.",
      color: "from-[#A78BFA]/20 to-transparent",
      borderColor: "group-hover:border-[#A78BFA]/50"
    },
    {
      icon: <Mic size={32} className="text-[#F472B6]" />,
      title: "Voice Doubt System",
      desc: "Speak your doubt in Tamil. Get answer instantly.",
      color: "from-[#F472B6]/20 to-transparent",
      borderColor: "group-hover:border-[#F472B6]/50"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-[#0A0A0F] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Everything Your Child Needs</h2>
          <p className="text-white/60 text-lg sm:text-xl">One platform. All classes. All boards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div 
              key={i}
              className={`glass-panel p-8 rounded-2xl border border-white/5 relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] ${feat.borderColor}`}
              style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms` 
              }}
            >
              {/* Animated Gradient Border using pseudo element in landing.css can be applied by adding 'animated-border' class, but standard hover borders look cleaner here */}
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 relative">
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-current opacity-20 blur-xl rounded-full"></div>
                {feat.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-white/60 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatWeOffer;
