const getChaptersForClass = (classNum) => {
  const n = parseInt(classNum) || 10;
  
  if (n <= 3) {
    // FUN ZONE (Class 1-3) - Samacheer Kalvi Primary EVS, Maths, Tamil, English
    return [
      { en: "Shapes and Figures", ta: "வடிவங்கள்", subject: "Maths" },
      { en: "Numbers up to 99", ta: "எண்கள் 99 வரை", subject: "Maths" },
      { en: "Fun with Addition", ta: "கூட்டல் விளையாட்டு", subject: "Maths" },
      { en: "Plants Around Us", ta: "நம்மைச் சுற்றியுள்ள தாவரங்கள்", subject: "Science" },
      { en: "Animal Kingdom", ta: "விலங்கு உலகம்", subject: "Science" },
      { en: "Our Sweet Family", ta: "எங்கள் குடும்பம்", subject: "Science" },
      { en: "Fun with Phonics", ta: "ஒலியியல் அடிப்படைகள்", subject: "English" },
      { en: "My Body Parts", ta: "என் உடற்பாகங்கள்", subject: "English" },
      { en: "எழுத்துக்கள் அறிவோம்", ta: "எழுத்துக்கள் அறிவோம்", subject: "Tamil" },
      { en: "பாடி ஆடி விளையாடலாம்", ta: "பாடி ஆடி விளையாடலாம்", subject: "Tamil" }
    ];
  }
  
  if (n <= 6) {
    // ADVENTURE ZONE (Class 4-6) - General Science, Basic History, Fractions, Tamil/English
    return [
      { en: "Fractions & Decimals", ta: "பின்னங்கள் மற்றும் தசமங்கள்", subject: "Maths" },
      { en: "Practical Geometry", ta: "செய்முறை வடிவியல்", subject: "Maths" },
      { en: "Food and Health", ta: "உணவும் சுகாதாரமும்", subject: "Science" },
      { en: "Matter Around Us", ta: "நம்மைச் சுற்றியுள்ள பருப்பொருட்கள்", subject: "Science" },
      { en: "Ancient Civilizations", ta: "பண்டைய நாகரிகங்கள்", subject: "Social" },
      { en: "Basic Earth Map Skills", ta: "அடிப்படை வரைபடப் பயிற்சி", subject: "Social" },
      { en: "Sentence Formations", ta: "வாக்கிய அமைப்புகள்", subject: "English" },
      { en: "தமிழர் கலைகள்", ta: "தமிழர் கலைகள்", subject: "Tamil" }
    ];
  }

  if (n <= 9) {
    // PRO ZONE (Class 7-9) - Middle School Core Academic
    return [
      { en: "Linear Equations", ta: "நேரியல் சமன்பாடுகள்", subject: "Maths" },
      { en: "Ratio and Proportion", ta: "விகிதம் மற்றும் விகிதாச்சாரம்", subject: "Maths" },
      { en: "Force and Pressure", ta: "விசை மற்றும் அழுத்தம்", subject: "Science" },
      { en: "Cell Biology basics", ta: "செல் உயிரியல் அடிப்படைகள்", subject: "Science" },
      { en: "Sultans of Delhi", ta: "டெல்லி சுல்தான்கள்", subject: "Social" },
      { en: "Resources of Earth", ta: "புவியின் வளங்கள்", subject: "Social" },
      { en: "Direct & Indirect Speech", ta: "நேர்க்கூற்று மற்றும் அயற்கூற்று", subject: "English" },
      { en: "இலக்கண நயங்கள்", ta: "இலக்கண நயங்கள்", subject: "Tamil" }
    ];
  }

  // ELITE ZONE (Class 10-12) - High/Higher Secondary Board Exams
  return [
    { en: "Quadratic Equations", ta: "இருபடிச் சமன்பாடுகள்", subject: "Maths" },
    { en: "Trigonometry Basics", ta: "முக்கோணவியல்", subject: "Maths" },
    { en: "Coordinate Geometry", ta: "ஆயத்தொலை வடிவியல்", subject: "Maths" },
    { en: "Chemical Bonding", ta: "வேதிப் பிணைப்பு", subject: "Science" },
    { en: "Acids, Bases & Salts", ta: "அமிலங்கள், காரங்கள் மற்றும் உப்புகள்", subject: "Science" },
    { en: "Electricity & Circuits", ta: "மின்னோட்டவியல்", subject: "Science" },
    { en: "Optics & Light", ta: "ஒளியியல்", subject: "Science" },
    { en: "Photosynthesis Pathways", ta: "ஒளிச்சேர்க்கை", subject: "Science" },
    { en: "English Grammar Rules", ta: "இலக்கண அடிப்படைகள்", subject: "English" },
    { en: "Prose Comprehension", ta: "உரைநடை புரிதல்", subject: "English" },
    { en: "Indian Constitution", ta: "இந்திய அரசியலமைப்பு", subject: "Social" },
    { en: "World War II History", ta: "இரண்டாம் உலகப் போர் வரலாறு", subject: "Social" }
  ];
};

export const generateMockDNAData = (classNum = 10) => {
  const chapters = getChaptersForClass(classNum);
  
  return chapters.map((chap, index) => {
    const rand = Math.random();
    let score = 0;
    let attempts = Math.floor(Math.random() * 5) + 1;
    let trend = [];

    if (rand < 0.1) {
      score = 0;
      attempts = 0;
    } else if (rand < 0.35) {
      score = Math.floor(Math.random() * 20) + 20; // 20-39
      trend = [score - 5, score, score + 2];
    } else if (rand < 0.75) {
      score = Math.floor(Math.random() * 30) + 40; // 40-69
      trend = [score - 10, score - 5, score];
    } else {
      score = Math.floor(Math.random() * 30) + 70; // 70-100
      trend = [score - 5, score + 2, score];
    }

    // Ensure valid ranges
    trend = trend.map(t => Math.max(0, Math.min(100, t)));

    return {
      chapter_id: `chap_${index}`,
      chapter_name: chap.en,
      name_tamil: chap.ta,
      subject_name: chap.subject,
      score_percentage: score,
      attempts: attempts,
      recent_scores: trend
    };
  });
};

export const getGeneColor = (score, attempts) => {
  if (attempts === 0) return 'blue';
  if (score < 40) return 'red';
  if (score < 70) return 'yellow';
  return 'green';
};

export const getGeneColorHex = (colorName) => {
  switch (colorName) {
    case 'red': return '#EF4444'; // Tailwind red-500
    case 'yellow': return '#EAB308'; // Tailwind yellow-500
    case 'green': return '#10B981'; // Tailwind emerald-500
    case 'blue': return '#3B82F6'; // Tailwind blue-500
    case 'white': return '#FFFFFF'; 
    default: return '#6B7280'; // gray
  }
};
