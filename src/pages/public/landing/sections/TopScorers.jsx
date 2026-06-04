import React, { useEffect, useRef, useState } from 'react';
import { Star, Trophy } from 'lucide-react';

const scorers = [
  { id: 1, name: 'Arun Kumar', class: 'Class 10 CBSE', score: '98%', rank: 'State Rank #12', isRanker: true },
  { id: 2, name: 'Kavya S', class: 'Class 12 State', score: '590/600', rank: 'District First', isRanker: true },
  { id: 3, name: 'Rahul V', class: 'Class 10 Matric', score: '97%', rank: 'School Topper', isRanker: false },
  { id: 4, name: 'Meena K', class: 'Class 12 CBSE', score: '96.5%', rank: '', isRanker: false },
  { id: 5, name: 'Sanjay P', class: 'Class 10 State', score: '488/500', rank: 'School Topper', isRanker: false },
  { id: 6, name: 'Priya R', class: 'Class 12 ICSE', score: '98.2%', rank: 'State Rank #8', isRanker: true },
  { id: 7, name: 'Vikram A', class: 'Class 10 CBSE', score: '95%', rank: '', isRanker: false },
  { id: 8, name: 'Deepa M', class: 'Class 12 State', score: '585/600', rank: '', isRanker: false }
];

const TopScorers = () => {
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

  // Double the array for seamless infinite scrolling
  const marqueeData = [...scorers, ...scorers];

  return (
    <section id="results" ref={sectionRef} className="py-24 bg-[#0A0A0F] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Our Star Achievers 🌟</h2>
          <p className="text-white/60 text-lg sm:text-xl">Students who made us proud</p>
        </div>
      </div>

      {/* Marquee */}
      <div className={`marquee-container pb-12 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="marquee-content gap-6 px-3">
          {marqueeData.map((student, i) => (
            <div 
              key={`${student.id}-${i}`} 
              className={`flex-shrink-0 w-72 glass-panel p-6 rounded-2xl transition-transform hover:-translate-y-2 hover:rotate-1 cursor-default ${
                student.isRanker ? 'border border-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'border border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white uppercase border border-white/20">
                  {student.name.charAt(0)}
                </div>
                <div className="flex text-gold">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="#FFD700" />)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
              <p className="text-white/50 text-sm mb-4">{student.class}</p>
              
              <div className="bg-white/5 rounded-xl p-3 mb-2 flex items-center justify-between">
                <span className="text-white/70 text-sm">Score</span>
                <span className="font-bold text-white text-lg">{student.score}</span>
              </div>
              
              {student.rank && (
                <div className="flex items-center text-gold text-sm font-bold bg-gold/10 px-3 py-1.5 rounded-lg w-max">
                  <Trophy size={14} className="mr-1.5" /> {student.rank}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`relative rounded-2xl overflow-hidden animated-border transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-gradient-to-r from-gold/20 via-yellow-400/20 to-gold/20 p-8 sm:p-10 text-center backdrop-blur-md">
            <h3 className="font-space text-2xl sm:text-3xl font-bold text-white mb-2 text-glow">
              🎉 2025-26 Results
            </h3>
            <p className="text-gold font-medium text-lg sm:text-xl">
              95% of our students scored above 85% in board exams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopScorers;
