import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (language = 'en-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isFinal, setIsFinal] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    
    // Check for iOS workaround if needed. iOS usually requires continuous false, which is set above.
  }, []);

  const startListening = useCallback((lang = language) => {
    if (!recognitionRef.current) return;
    
    try {
      setError(null);
      setTranscript('');
      setIsFinal(false);
      
      recognitionRef.current.lang = lang;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        let isResultFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
            isResultFinal = true;
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(currentTranscript);
        if (isResultFinal) {
            setIsFinal(true);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setError('No voice detected. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (err) {
      console.error("Speech recognition start error:", err);
      // Fallback if it was already started
      if (err.name === 'InvalidStateError') {
         recognitionRef.current.stop();
         setTimeout(() => startListening(lang), 100);
      }
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isSupported,
    isListening,
    transcript,
    isFinal,
    error,
    startListening,
    stopListening
  };
};
