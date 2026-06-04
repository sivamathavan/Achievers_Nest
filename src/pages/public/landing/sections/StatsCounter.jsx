import React, { useEffect, useState, useRef } from 'react';

const AnimatedNumber = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing out function
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeOut * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
};

const StatsCounter = () => {
  const stats = [
    { number: 500, suffix: '+', label: 'Students' },
    { number: 10, suffix: '+', label: 'Years' },
    { number: 95, suffix: '%', label: 'Results' },
    { number: 4, suffix: '', label: 'Boards' },
  ];

  return (
    <section className="py-16 bg-[#08080E] border-y border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-gold/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h2 className="font-space text-4xl sm:text-5xl font-bold text-gold mb-2 text-glow">
                <AnimatedNumber end={stat.number} suffix={stat.suffix} />
              </h2>
              <p className="text-white/60 font-medium text-sm sm:text-base uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
