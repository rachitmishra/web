import { useRef } from 'react';

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }
    }
  };

  const playNote = (frequency: number, duration = 1.5) => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle'; // Softer, more piano-like than sine/square
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // ADSR Envelope for Piano-like sound
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.02); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Decay

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(now + duration);
  };

  return { playNote };
};
