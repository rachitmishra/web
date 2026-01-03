import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string | null;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 1,
  lastPlayedDate: null,
};

const getUserId = () => {
  let id = localStorage.getItem('pipos_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('pipos_user_id', id);
  }
  return id;
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    // 1. Initial Load from LocalStorage
    const saved = localStorage.getItem('pipos_progress');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });

  const userId = getUserId();

  // 2. Sync with Firebase on Mount (and subscribe to changes)
  useEffect(() => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            // Remote data exists, update local state if different
            // We could implement conflict resolution here, but for now, 
            // we'll assume Firebase is the source of truth if it updates.
            // However, to avoid overwriting local optimistic updates immediately,
            // we might want to be careful. For this simple app, trusting the stream is okay.
            const data = docSnap.data() as UserProgress;
            // Only update if actually different to avoid loops if we add local listeners
            setProgress((prev) => {
                if (JSON.stringify(prev) !== JSON.stringify(data)) {
                    return data;
                }
                return prev;
            });
        } else {
            // Doc doesn't exist, create it with current local progress
            setDoc(userDocRef, progress);
        }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // 3. Persist to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('pipos_progress', JSON.stringify(progress));
  }, [progress]);

  // 4. Function to update progress (Optimistic Update + Firebase Push)
  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress((prev) => {
      const newVal = { ...prev, ...updates };
      
      // Persist to Firebase
      // Fire-and-forget for performance, or handle errors if needed
      const userDocRef = doc(db, 'users', userId);
      setDoc(userDocRef, newVal, { merge: true }).catch(err => 
        console.error("Firebase sync failed:", err)
      );
      
      return newVal;
    });
  };

  const addXp = (amount: number) => {
      updateProgress({ xp: progress.xp + amount });
  };

  const updateLevel = (newLevel: number) => {
      updateProgress({ level: newLevel });
  };
  
  // Helper to handle daily streaks (logic could be moved here)
  const checkDailyStreak = () => {
      const today = new Date().toDateString();
      if (progress.lastPlayedDate !== today) {
         // Logic for streak increments could go here
         updateProgress({ lastPlayedDate: today });
      }
  };

  return {
    progress,
    addXp,
    updateLevel,
    checkDailyStreak
  };
};
