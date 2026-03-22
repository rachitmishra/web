import { useState, useCallback, useEffect } from 'react';

export interface DebugError {
  id: string;
  message: string;
  timestamp: Date;
  source?: string;
}

// Global singleton-like state for errors (using a simple event bus approach)
const errorListeners: Set<(errors: DebugError[]) => void> = new Set();
let globalErrors: DebugError[] = [];

export const addDebugError = (message: string, source?: string) => {
  const newError: DebugError = {
    id: Math.random().toString(36).substring(7),
    message,
    timestamp: new Date(),
    source
  };
  globalErrors = [newError, ...globalErrors].slice(0, 10); // Keep last 10
  errorListeners.forEach(listener => listener(globalErrors));
};

export const clearDebugErrors = () => {
  globalErrors = [];
  errorListeners.forEach(listener => listener(globalErrors));
};

export function useDebug() {
  const [errors, setErrors] = useState<DebugError[]>(globalErrors);
  const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

  useEffect(() => {
    const listener = (newErrors: DebugError[]) => setErrors(newErrors);
    errorListeners.add(listener);
    return () => {
      errorListeners.delete(listener);
    };
  }, []);

  return {
    isDebugMode,
    errors,
    addDebugError,
    clearDebugErrors
  };
}
