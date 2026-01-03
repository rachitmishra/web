import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  effectiveUid: string | null;
  loading: boolean;
  setRecoveredUid: (uid: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, effectiveUid: null, loading: true, setRecoveredUid: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveredUid, setRecoveredUidState] = useState<string | null>(() => {
    try {
        const params = new URLSearchParams(window.location.search);
        const urlUid = params.get("uid");
        if (urlUid) return urlUid;
        return localStorage.getItem("recovered_uid");
    } catch {
        return null;
    }
  });

  const setRecoveredUid = (uid: string | null) => {
    setRecoveredUidState(uid);
    if (uid) {
        localStorage.setItem("recovered_uid", uid);
        const url = new URL(window.location.href);
        url.searchParams.set("uid", uid);
        window.history.replaceState({}, "", url);
    } else {
        localStorage.removeItem("recovered_uid");
        const url = new URL(window.location.href);
        url.searchParams.delete("uid");
        window.history.replaceState({}, "", url);
    }
  };

  useEffect(() => {
    // If we have an effective UID (and it's not the default anonymous auth UID, or even if it is),
    // we might want to sync URL. But setRecoveredUid handles explicit setting.
    // If we loaded from localStorage or URL initially, we should ensure URL is consistent.
    if (recoveredUid) {
        const url = new URL(window.location.href);
        if (url.searchParams.get("uid") !== recoveredUid) {
            url.searchParams.set("uid", recoveredUid);
            window.history.replaceState({}, "", url);
        }
    }
  }, [recoveredUid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        // Auto-login anonymously if not logged in
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous auth failed", error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const effectiveUid = recoveredUid || user?.uid || null;

  return (
    <AuthContext.Provider value={{ user, effectiveUid, loading, setRecoveredUid }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
