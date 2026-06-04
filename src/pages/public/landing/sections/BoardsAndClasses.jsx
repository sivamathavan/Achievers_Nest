import React, { useState, useEffect, useRef } from 'react';

const boardData = {
  'State Board': {
    features: 'Focused on Samacheer Kalvi syllabus with emphasis on rote-free conceptual understanding.',
    medium: 'Tamil & English Medium',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    subjects: ['Maths', 'Science', 'Social Science', 'Tamil', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accountancy', 'Commerce', 'Economics', 'History', 'Computer Applications']
  },
  'CBSE': {
    features: 'NCERT aligned curriculum with deep focus on analytical thinking and competitive exam foundation.',
    medium: 'English Medium Only',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Computer Applications']
  },
  'Matric': {
    features: 'Specialized coaching for Matriculation syllabus with rigorous practice and weekly assessments.',
    medium: 'English Medium Only',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    subjects: ['Maths', 'Science', 'Social Science', 'Tamil', 'English']
  },
  'ICSE': {
    features: 'Comprehensive coverage of CISCE syllabus with focus on language skills and detailed theory.',
    medium: 'English Medium Only',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    subjects: ['Mathematics', 'Science', 'History & Civics', 'Geography', 'English Literature', 'Computer Applications', 'Economics', 'Commercial Studies']
  }
};

const getSubjectsForClass = (board, cls) => {
  if (board === 'State Board') {
    if (cls <= 10) {
      return ['Maths', 'Science', 'Social Science', 'Tamil', 'English'];
    } else {
      return ['Maths', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accountancy', 'Commerce', 'Economics', 'History', 'Computer Applications', 'Tamil', 'English'];
    }
  }
  if (board === 'CBSE') {
    if (cls <= 10) {
      return ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];
    } else {
      return ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Computer Applications', 'English'];
    }
  }
  if (board === 'Matric') {
    return ['Maths', 'Science', 'Social Science', 'Tamil', 'English'];
  }
  if (board === 'ICSE') {
    if (cls <= 5) {
      return ['Mathematics', 'Science', 'History & Civics', 'Geography', 'English Literature'];
    } else if (cls <= 8) {
      return ['Mathematics', 'Science', 'History & Civics', 'Geography', 'English Literature', 'Computer Applications'];
    } else {
      return ['Mathematics', 'Science', 'History & Civics', 'Geography', 'English Literature', 'Computer Applications', 'Economics', 'Commercial Studies'];
    }
  }
  return [];
};

const BoardsAndClasses = () => {
  const [activeBoard, setActiveBoard] = useState('State Board');
  const [activeClass, setActiveClass] = useState(1);
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

  const getClassColor = (cls) => {
    if (cls <= 3) return 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30'; // Fun Zone
    if (cls <= 6) return 'bg-[#FF9F1C]/20 text-[#FF9F1C] border-[#FF9F1C]/30'; // Adventure Zone
    if (cls <= 9) return 'bg-[#4ECDC4]/20 text-[#4ECDC4] border-[#4ECDC4]/30'; // Pro Zone
    return 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30'; // Elite Zone
  };

  const currentData = boardData[activeBoard];
  const displayedSubjects = getSubjectsForClass(activeBoard, activeClass);

  return (
    <section id="courses" ref={sectionRef} className="py-24 bg-[#12121A] relative z-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">We Cover All Boards</h2>
          <p className="text-white/60 text-lg sm:text-xl">Specialized coaching for every syllabus</p>
        </div>

        {/* Board Tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {Object.keys(boardData).map((board) => (
            <button
              key={board}
              onClick={() => {
                setActiveBoard(board);
                setActiveClass(boardData[board].classes[0]);
              }}
              className={`px-6 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer ${
                activeBoard === board 
                  ? 'bg-gold text-dark-bg shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {board}
            </button>
          ))}
        </div>

        {/* Board Details Card */}
        <div className={`glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Subtle background glow based on active board */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            
            {/* Left Col: Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                  <span className="w-2 h-8 bg-gold rounded-full mr-3"></span>
                  {activeBoard}
                </h3>
                <p className="text-white/70 leading-relaxed">{currentData.features}</p>
              </div>
              
              <div className="glass-panel bg-white/5 p-4 rounded-xl border-l-2 border-l-blue-400">
                <span className="text-white/50 text-sm uppercase tracking-wider block mb-1">Medium Available</span>
                <span className="text-white font-medium text-lg">{currentData.medium}</span>
              </div>
            </div>

            {/* Right Col: Classes & Subjects */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Classes */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <h4 className="text-white/50 text-sm uppercase tracking-wider">Classes Covered</h4>
                  <span className="w-max text-[11px] text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20 font-bold tracking-wide uppercase">
                    Select a class to filter subjects
                  </span>
                </div>
                <div className="flex overflow-x-auto pb-4 no-scrollbar gap-3 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {currentData.classes.map((cls) => {
                    const isActive = cls === activeClass;
                    return (
                      <button 
                        key={cls} 
                        onClick={() => setActiveClass(cls)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 transform outline-none cursor-pointer ${
                          isActive 
                            ? 'bg-gold text-dark-bg border-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-110' 
                            : `${getClassColor(cls)} hover:scale-105`
                        }`}
                      >
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isActive ? 'text-dark-bg/70' : 'opacity-85'} mb-1`}>Class</span>
                        <span className="text-2xl sm:text-3xl font-black leading-none">{cls}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-wider mb-4">
                  Key Subjects for Class {activeClass}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {displayedSubjects.map((sub, i) => (
                    <span 
                      key={`${activeClass}-${sub}`}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm font-medium hover:border-gold/50 hover:text-gold transition-colors"
                      style={{ animation: isVisible ? `fadeInUp 0.3s ease-out forwards ${i * 0.05}s` : 'none', opacity: 0 }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default BoardsAndClasses;

