import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import VoiceReady from './VoiceReady';
import VoiceListening from './VoiceListening';
import VoiceResults from './VoiceResults';
import VoiceNoResults from './VoiceNoResults';

// Mock DB for voice search
const mockQuestionDB = [
  {
    id: 1,
    keywords: ['photosynthesis', 'ஒளிச்சேர்க்கை'],
    q: "What is photosynthesis?",
    qTa: "ஒளிச்சேர்க்கை என்றால் என்ன?",
    a: "Photosynthesis is the process used by plants to convert light energy into chemical energy.",
    aTa: "ஒளிச்சேர்க்கை என்பது தாவரங்கள் ஒளி ஆற்றலை வேதியியல் ஆற்றலாக மாற்றும் முறையாகும்.",
    subject: "Science",
    class: "Class 10"
  },
  {
    id: 2,
    keywords: ['quadratic', 'equation', 'solve', 'algebra'],
    q: "How to solve a quadratic equation?",
    qTa: "இருபடி சமன்பாட்டை எப்படி தீர்ப்பது?",
    a: "Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
    aTa: "இருபடி சூத்திரத்தைப் பயன்படுத்தவும்: x = (-b ± √(b² - 4ac)) / 2a",
    subject: "Maths",
    class: "Class 10"
  },
  {
    id: 3,
    keywords: ['newton', 'third', 'law', 'விதி'],
    q: "What is Newton's third law?",
    qTa: "நியூட்டனின் மூன்றாம் விதி என்ன?",
    a: "For every action, there is an equal and opposite reaction.",
    aTa: "ஒவ்வொரு விசைக்கும் சமமான எதிர் விசை உண்டு.",
    subject: "Physics",
    class: "Class 9"
  }
];

const tamilFillers = ['eppadi', 'sollunga', 'explain', 'pannu', 'panna', 'theriyala', 'doubt', 'help', 'please', 'enraal', 'enna'];

const VoiceDoubtSolver = ({ classLevel }) => {
  const [language, setLanguage] = useState('en-IN'); // or 'ta-IN'
  const { isSupported, isListening, transcript, isFinal, error, startListening, stopListening } = useSpeechRecognition(language);
  
  const [appState, setAppState] = useState('ready'); // ready, listening, processing, results, no-results
  const [searchResults, setSearchResults] = useState([]);
  const [finalTranscript, setFinalTranscript] = useState('');

  // Sync internal state with hook
  useEffect(() => {
    if (isListening) {
      setAppState('listening');
    } else if (appState === 'listening' && !isListening) {
      // Stopped listening, check if we have a transcript
      if (transcript) {
        handleSearch(transcript);
      } else if (error) {
        setAppState('ready');
      } else {
        setAppState('ready');
      }
    }
  }, [isListening, transcript, error]);

  // Handle final result while still listening (for continuous mode if needed)
  useEffect(() => {
    if (isFinal && transcript) {
      handleSearch(transcript);
    }
  }, [isFinal]);

  const handleSearch = (text) => {
    setAppState('processing');
    setFinalTranscript(text);
    
    // Auto-detect language loosely
    const hasTamilChars = /[\u0B80-\u0BFF]/.test(text);
    const hasTamilWords = tamilFillers.some(w => text.toLowerCase().includes(w));
    const isTamilQuery = hasTamilChars || hasTamilWords || language === 'ta-IN';

    // Extract keywords
    const cleanText = text.toLowerCase().trim().replace(/[?.,!]/g, '');
    const keywords = cleanText.split(' ').filter(word => !tamilFillers.includes(word) && word.length > 2);

    setTimeout(() => {
      // Mock search logic
      const results = mockQuestionDB.filter(item => {
        return keywords.some(kw => 
          item.keywords.some(ikw => ikw.includes(kw) || kw.includes(ikw)) ||
          item.q.toLowerCase().includes(kw) ||
          item.qTa.toLowerCase().includes(kw)
        );
      });

      if (results.length > 0) {
        setSearchResults(results);
        setAppState('results');
      } else {
        setSearchResults([]);
        setAppState('no-results');
      }
    }, 1000); // Fake delay for processing
  };

  const handleRetry = () => {
    setAppState('ready');
    setSearchResults([]);
    setFinalTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
        <p className="text-white/60 mb-2">Voice search is not supported in this browser.</p>
        <p className="text-sm text-gold">Please use Chrome or Edge for the best experience.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {appState === 'ready' && (
        <VoiceReady 
          onStartListening={startListening} 
          classLevel={classLevel} 
          language={language}
          setLanguage={setLanguage}
          error={error}
        />
      )}
      
      {appState === 'listening' && (
        <VoiceListening 
          transcript={transcript} 
          onStopListening={stopListening} 
          classLevel={classLevel}
        />
      )}

      {appState === 'processing' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/60 font-medium">Searching for answer...</p>
        </div>
      )}

      {appState === 'results' && (
        <VoiceResults 
          results={searchResults} 
          transcript={finalTranscript} 
          onRetry={handleRetry}
          isTamil={language === 'ta-IN' || /[\u0B80-\u0BFF]/.test(finalTranscript)}
        />
      )}

      {appState === 'no-results' && (
        <VoiceNoResults 
          transcript={finalTranscript} 
          onRetry={handleRetry} 
        />
      )}
    </div>
  );
};

export default VoiceDoubtSolver;
