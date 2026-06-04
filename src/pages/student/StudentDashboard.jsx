import React from 'react';
import { useAuth } from '../../context/AuthContext';
import FunZone from './FunZone';
import AdventureZone from './AdventureZone';
import ProZone from './ProZone';
import EliteZone from './EliteZone';
import GamificationWidget from '../../components/student/GamificationWidget';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Parse the class string to an integer
const getClassLevel = (classStr) => {
  if (!classStr) return 10; // Default fallback
  const num = parseInt(classStr.replace(/[^0-9]/g, ''));
  return isNaN(num) ? 10 : num;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const classLevel = getClassLevel(user?.class);
  const isSpeechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  let ZoneComponent = EliteZone;
  if (classLevel >= 1 && classLevel <= 3) {
    ZoneComponent = FunZone;
  } else if (classLevel >= 4 && classLevel <= 6) {
    ZoneComponent = AdventureZone;
  } else if (classLevel >= 7 && classLevel <= 9) {
    ZoneComponent = ProZone;
  }

  return (
    <div className="animate-in fade-in relative">
      <GamificationWidget user={user} />
      <ZoneComponent user={user} />
      
      {/* Floating Voice Doubt Button */}
      {isSpeechSupported && (
        <button 
          onClick={() => navigate(`/${user?.role.toLowerCase()}/doubts?mode=voice`)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-gold to-yellow-300 rounded-full shadow-[0_4px_20px_rgba(255,215,0,0.5)] flex items-center justify-center text-dark-bg hover:scale-110 active:scale-95 transition-transform z-30 md:bottom-10 tooltip-trigger"
          title="Ask a Doubt"
        >
          <Mic size={28} />
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;
