import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeech } from '../hooks/useSpeech';

describe('useSpeech hook', () => {
  beforeEach(() => {
    // Mock speechSynthesis
    const mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([
        { lang: 'en-US', name: 'English Voice' },
        { lang: 'te-IN', name: 'Telugu Voice' },
        { lang: 'hi-IN', name: 'Hindi Voice' }
      ]),
    };

    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true
    });

    // Mock SpeechSynthesisUtterance
    class MockUtterance {
      text: string;
      lang: string = 'en-US';
      rate: number = 1.0;
      voice: any = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: MockUtterance,
      writable: true,
      configurable: true
    });
  });

  it('should verify Speech APIs initialization and trigger checks', () => {
    const { result } = renderHook(() => useSpeech());

    // Test text-to-speech speak calls
    act(() => {
      result.current.speak('Secure emergency coordinates', 'en');
    });
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();

    // Test mute cancellation speak calls
    act(() => {
      result.current.stopSpeaking();
    });
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2);
  });
});
