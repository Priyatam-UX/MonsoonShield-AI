import { useState, useEffect, useRef } from 'react';

// Declare global speech interface extensions
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const startListening = (lang: string = 'en-US') => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.lang = lang;
      setTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
    }
  };

  const stopListening = () => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error('Failed to stop speech recognition', e);
    }
  };

  const speak = (text: string, lang: string = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }
    // Cancel any active speech first
    window.speechSynthesis.cancel();

    // Map language values to synthesis codes
    let speakLang = 'en-US';
    if (lang === 'te') speakLang = 'te-IN';
    else if (lang === 'hi') speakLang = 'hi-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speakLang;
    utterance.rate = 1.0;
    
    // Choose voice based on language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(speakLang.substring(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    supported,
  };
};
