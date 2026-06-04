import React, { useEffect, useRef, useState } from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "My daughter went from 65% to 91% in just 6 months. The online portal helps me track her daily progress.",
    parent: "Mrs. Lakshmi",
    student: "Parent of Class 10 Student"
  },
  {
    id: 2,
    quote: "The Tamil medium teaching is excellent. My son finally understands Maths now. Best tuition in Vadavalli!",
    parent: "Mr. Rajesh",
    student: "Parent of Class 8 Student"
  },
  {
    id: 3,
    quote: "The mock tests and weakness tracking helped my child focus on right topics. Board exam results were outstanding.",
    parent: "Mrs. Priya",
    student: "Parent of Class 12 Student"
  }
];

const Testimonials = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#12121A] relative z-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">What Parents Say</h2>
          <p className="text-white/60 text-lg sm:text-xl">Real stories from Coimbatore families</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={t.id}
              className={`glass-panel p-8 rounded-2xl relative transition-all duration-700 hover:-translate-y-2`}
              style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 200}ms` 
              }}
            >
              <div className="absolute top-6 right-6 opacity-20">
                <Quote size={60} className="text-gold" />
              </div>
              
              <div className="flex text-gold mb-6 relative z-10">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="#FFD700" />)}
              </div>
              
              <p className="text-white/80 leading-relaxed italic mb-8 relative z-10">"{t.quote}"</p>
              
              <div className="relative z-10 border-t border-white/10 pt-6">
                <h4 className="font-bold text-white text-lg">{t.parent}</h4>
                <p className="text-white/50 text-sm">{t.student}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
