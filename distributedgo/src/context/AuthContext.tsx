import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  userProgress: any;
  updateProgress: (trackId: string, dayId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load progress from Firestore
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProgress(docSnap.data().progress || {});
          } else {
             // Create initial profile
             await setDoc(docRef, { 
               email: currentUser.email,
               displayName: currentUser.displayName,
               progress: {} 
             });
          }
        } catch (e) {
          console.error("Error loading profile:", e);
        }
      } else {
        // Load from localStorage if not logged in
        const local = localStorage.getItem('distributedgo_progress');
        if (local) setUserProgress(JSON.parse(local));
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
      alert("Login failed. Check console. (Note: Firebase config might be missing)");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    // Reset to local storage or empty
    setUserProgress({});
  };

  const updateProgress = async (trackId: string, dayId: number) => {
    const newProgress = { ...userProgress, [trackId]: dayId };
    setUserProgress(newProgress);
    
    // Save to LocalStorage always
    localStorage.setItem('distributedgo_progress', JSON.stringify(newProgress));

    // Save to Firestore if logged in
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { progress: newProgress }, { merge: true });
      } catch (e) {
        console.error("Error syncing progress", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, userProgress, updateProgress }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
