import { useState, useRef, useEffect } from 'react';
import { InputType } from '../types';

export const useInputSystem = (onNoteDetected: (note: string) => void) => {
  const [inputType, setInputType] = useState<InputType>('touch'); 
  const [isListening, setIsListening] = useState(false);
  const [inputLabel, setInputLabel] = useState(''); 
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const midiAccessRef = useRef<any>(null);

  // Keep latest callback in ref to avoid stale closures in RAF loop
  const onNoteDetectedRef = useRef(onNoteDetected);
  
  useEffect(() => {
    onNoteDetectedRef.current = onNoteDetected;
  }, [onNoteDetected]);

  // --- Helper: Frequency to Note ---
  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const getNoteFromFreq = (freq: number) => {
    const pitch = 12 * (Math.log(freq / 440) / Math.log(2)) + 69;
    const noteIndex = Math.round(pitch) % 12;
    const octave = Math.floor(Math.round(pitch) / 12) - 1;
    return { 
      note: noteStrings[noteIndex < 0 ? noteIndex + 12 : noteIndex], 
      octave 
    };
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      
      // Low-pass filter to clean up input
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000; 

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048; 
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(filter);
      filter.connect(analyser);
      
      analyserRef.current = analyser;

      detectPitch();
      setInputType('mic');
      setIsListening(true);
    } catch (err) {
      console.error("Mic Error:", err);
      alert("Could not access microphone.");
    }
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    // 1. RMS Check
    let rms = 0;
    for (let i = 0; i < bufferLength; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / bufferLength);

    if (rms > 0.01) { 
      const sampleRate = audioContextRef.current?.sampleRate || 44100;
      
      // YIN Constants
      const threshold = 0.20; // Slightly looser threshold
      const minFreq = 50;
      const maxFreq = 1500;
      
      // Search range in samples
      const minPeriod = Math.floor(sampleRate / maxFreq);
      const maxPeriod = Math.floor(sampleRate / minFreq);
      const bufferSize = bufferLength / 2; 

      // 2. Difference Function & Cumulative Mean Normalized Difference (CMND)
      const yinBuffer = new Float32Array(maxPeriod);
      yinBuffer[0] = 1;
      let runningSum = 0;
      let tauEstimate = -1;

      for (let tau = 1; tau < maxPeriod; tau++) {
        let diff = 0;
        for (let i = 0; i < bufferSize; i++) {
          const d = buffer[i] - buffer[i + tau];
          diff += d * d;
        }

        runningSum += diff;
        if (runningSum === 0) {
            yinBuffer[tau] = 1;
            continue;
        }
        
        yinBuffer[tau] = (diff * tau) / runningSum;
      }

      // 3. Absolute Threshold Search
      let bestTau = -1;
      for (let tau = minPeriod; tau < maxPeriod; tau++) {
          if (yinBuffer[tau] < threshold) {
              while (tau + 1 < maxPeriod && yinBuffer[tau + 1] < yinBuffer[tau]) {
                  tau++;
              }
              bestTau = tau;
              break; 
          }
      }

      // Global Min Fallback
      if (bestTau === -1) {
          let globalMin = 100;
          let globalMinTau = -1;
          for (let tau = minPeriod; tau < maxPeriod; tau++) {
              if (yinBuffer[tau] < globalMin) {
                  globalMin = yinBuffer[tau];
                  globalMinTau = tau;
              }
          }
          if (globalMin < 0.4) {
              bestTau = globalMinTau;
          }
      }

      if (bestTau !== -1) {
        // 4. Parabolic Interpolation
        let refinedTau = bestTau;
        if (bestTau > 0 && bestTau < maxPeriod - 1) {
            const s0 = yinBuffer[bestTau - 1];
            const s1 = yinBuffer[bestTau];
            const s2 = yinBuffer[bestTau + 1];
            let adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0));
            if (Math.abs(adjustment) > 1) adjustment = 0; 
            refinedTau += adjustment;
        }

        const frequency = sampleRate / refinedTau;
        const detected = getNoteFromFreq(frequency);
        
        if (frequency > minFreq && frequency < maxFreq) { 
            setInputLabel(`Hearing: ${detected.note}`);
            // Use the REF here to ensure we call the latest version of the callback
            onNoteDetectedRef.current(detected.note);
        }
      }
    } else {
        setInputLabel(isListening ? 'Listening...' : '');
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  };

  const stopMic = () => {
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setInputLabel('');
  };

  const startMidi = async () => {
    const nav = navigator as any;
    if (!nav.requestMIDIAccess) {
      alert("Web MIDI is not supported in this browser.");
      return;
    }
    try {
      const midi = await nav.requestMIDIAccess();
      midiAccessRef.current = midi;
      for (const input of midi.inputs.values()) {
        input.onmidimessage = handleMidiMessage;
      }
      midi.onstatechange = (e: any) => {
        if (e.port.type === 'input' && e.port.state === 'connected') {
             e.port.onmidimessage = handleMidiMessage;
        }
      };
      setInputType('midi');
      setIsListening(true);
      setInputLabel('MIDI Connected');
    } catch (err) {
      console.error("MIDI Error:", err);
      alert("Could not access MIDI devices.");
    }
  };

  const handleMidiMessage = (message: any) => {
    const [command, note, velocity] = message.data;
    if ((command & 0xF0) === 0x90 && velocity > 0) {
      const noteName = noteStrings[note % 12];
      setInputLabel(`MIDI: ${noteName}`);
      // Use ref here too for consistency, though MIDI listener re-binds are rarer
      onNoteDetectedRef.current(noteName);
    }
  };

  const stopMidi = () => {
      if (midiAccessRef.current) {
           for (const input of midiAccessRef.current.inputs.values()) {
                input.onmidimessage = null;
           }
      }
      setIsListening(false);
      setInputLabel('');
  };

  const toggleInput = (type: InputType) => {
    stopMic();
    stopMidi();
    if (inputType === type && isListening) {
      setInputType('touch');
      return;
    }
    if (type === 'mic') startMic();
    if (type === 'midi') startMidi();
  };

  useEffect(() => {
    return () => {
        stopMic();
        stopMidi();
    }
  }, []);

  return { inputType, isListening, inputLabel, toggleInput };
};
