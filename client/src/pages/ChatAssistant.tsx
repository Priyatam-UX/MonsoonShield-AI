import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { apiService } from '../services/api';

export const ChatAssistant: React.FC = () => {
  const { language } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: string }[]>([
    { role: 'model', parts: 'Welcome to MonsoonShield conversational hub! Ask me about flood levels, travel safety, home recovery, or ask me to translate details.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isListening, transcript, startListening, stopListening, speak, stopSpeaking, supported } = useSpeech();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;
    setInput('');
    stopSpeaking();

    const updated = [...messages, { role: 'user' as const, parts: text }];
    setMessages(updated);
    setLoading(true);

    try {
      const response = await apiService.chatWithGemini(updated, text, language);
      setMessages(prev => [...prev, { role: 'model', parts: response }]);
      
      if (ttsEnabled) {
        speak(response, language);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', parts: 'Error compiling response. Check connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US');
    }
  };

  const quickPrompts = [
    'Should I travel today?',
    'How can I prepare?',
    'Translate advice into Telugu.',
    'Can I drive through flooded roads?',
    'What should I pack?'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans flex flex-col h-[80vh]">
      <div className="flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-extrabold text-secondary dark:text-white">AI Chat Assistant</h2>
        </div>
        <button
          onClick={() => {
            setTtsEnabled(!ttsEnabled);
            if (ttsEnabled) stopSpeaking();
          }}
          className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center space-x-2 transition-all ${ttsEnabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-white dark:bg-surface-dark border-secondary/20 dark:border-white/10 text-secondary dark:text-white hover:bg-secondary/5'}`}
        >
          {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <span>{ttsEnabled ? 'TTS Engaged' : 'Mute TTS'}</span>
        </button>
      </div>

      {/* Main chat log container */}
      <div className="flex-1 min-h-[350px] border border-secondary/15 dark:border-white/5 rounded-3xl overflow-hidden bg-white dark:bg-surface-dark shadow-m3-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-secondary/5 dark:bg-background-dark/30">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-3xl px-4.5 py-3 text-sm shadow-sm ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-surface-dark text-secondary dark:text-secondary-dark rounded-tl-none border border-secondary/10 dark:border-white/5'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{m.parts}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-surface-dark text-secondary rounded-3xl rounded-tl-none px-4.5 py-3 text-sm border border-secondary/10 dark:border-white/5 shadow-sm">
                <div className="flex space-x-1 items-center h-4">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Shortcuts / Quick prompts */}
        <div className="px-5 py-3 border-t border-secondary/15 dark:border-white/5 bg-secondary/5 dark:bg-background-dark/25 overflow-x-auto flex space-x-2 scrollbar-none flex-shrink-0">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-white dark:bg-surface-dark border border-secondary/15 dark:border-white/5 text-secondary-light hover:border-primary text-xs font-medium hover:text-primary transition-all shadow-2xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 bg-white dark:bg-surface-dark border-t border-secondary/15 dark:border-white/5 flex items-center space-x-3 flex-shrink-0">
          {supported && (
            <button
              onClick={toggleListen}
              className={`p-3 rounded-full transition-all ${isListening ? 'bg-danger text-white scale-105' : 'hover:bg-secondary/10 text-secondary'}`}
              title="Voice Recognition"
            >
              {isListening ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening with AI voice recognition..." : "Ask safety recommendations..."}
            className="flex-1 bg-secondary/5 dark:bg-background-dark/45 border border-transparent dark:border-white/5 rounded-full py-3 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 bg-primary hover:bg-primary-light rounded-full text-white transition-all disabled:opacity-50 shadow-sm"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
