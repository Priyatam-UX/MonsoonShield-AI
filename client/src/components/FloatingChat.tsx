import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { apiService } from '../services/api';

export const FloatingChat: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: string }[]>([
    { role: 'model', parts: 'Hello! I am your MonsoonShield AI assistant. Ask me anything about safety planning, flooded roads, or WhatsApp warnings.' }
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    stopSpeaking();

    const updatedMessages = [...messages, { role: 'user' as const, parts: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map history format to match the api service expected shape
      const responseText = await apiService.chatWithGemini(updatedMessages, userText, language);
      setMessages(prev => [...prev, { role: 'model', parts: responseText }]);
      
      if (ttsEnabled) {
        speak(responseText, language);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', parts: 'Sorry, I am experiencing server errors. Please check back later.' }]);
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

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-m3-3 hover:scale-105 transition-all duration-300"
          id="btn-floating-chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className="flex h-[500px] w-96 flex-col rounded-3xl bg-white dark:bg-surface-dark shadow-m3-3 border border-secondary/15 dark:border-white/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-4 text-white">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success-light animate-pulse" />
              <span className="font-semibold text-sm">MonsoonShield AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setTtsEnabled(!ttsEnabled);
                  if (ttsEnabled) stopSpeaking();
                }}
                className={`p-1 rounded-full transition-colors hover:bg-white/10 ${ttsEnabled ? 'text-amber-300' : 'text-white/60'}`}
                title={ttsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button onClick={() => { setIsOpen(false); stopSpeaking(); stopListening(); }} className="p-1 rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/5 dark:bg-background-dark/30">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-surface-dark text-secondary dark:text-secondary-dark rounded-tl-none border border-secondary/10 dark:border-white/5'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.parts}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-surface-dark text-secondary rounded-2xl rounded-tl-none px-4 py-2.5 text-sm border border-secondary/10 dark:border-white/5 shadow-sm">
                  <div className="flex space-x-1 items-center h-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-dark animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-dark animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-dark animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <div className="p-3 bg-white dark:bg-surface-dark border-t border-secondary/15 dark:border-white/5 flex items-center space-x-2">
            {supported && (
              <button
                onClick={toggleListen}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-danger text-white' : 'hover:bg-secondary/10 text-secondary dark:text-secondary-dark'}`}
              >
                {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask safety guidelines..."}
              className="flex-1 bg-secondary/5 dark:bg-background-dark/40 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-secondary-dark border border-transparent dark:border-white/5"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-2 bg-primary rounded-full text-white hover:bg-primary-light transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
