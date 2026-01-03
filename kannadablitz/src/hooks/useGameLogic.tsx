import { useState, useEffect, useCallback } from "react";
import {
  LEARNING_DATA as LEARNING_DATA_ENGLISH,
  LEARNING_DATA_HINDI,
  supportedLanguages,
  type SupportedLanguage,
} from "../data";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { generateRandomProfile } from "../utils/nameGenerator";

interface Feedback {
  type: "success" | "error";
  msg: string;
  newWords?: { word: string; meaning: string }[];
}

const useGameLogic = () => {
  const { effectiveUid } = useAuth();
  const { showToast } = useToast();

  function getPersistedData<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultVal;
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (e) {
      console.warn("Storage access failed", e);
      return defaultVal;
    }
  }

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    () => getPersistedData("kannadaLanguage", "english")
  );

  const LEARNING_DATA =
    currentLanguage === "english" ? LEARNING_DATA_ENGLISH : LEARNING_DATA_HINDI;

  const [currentDay, setCurrentDay] = useState(0);
  const [view, setView] = useState("dashboard");
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(() =>
    getPersistedData("kannadaStreak", 0)
  );
  const [completedDays, setCompletedDays] = useState<number[]>(() =>
    getPersistedData("kannadaCompleted", [])
  );
  const [earnedBadges, setEarnedBadges] = useState<string[]>(() =>
    getPersistedData("kannadaBadges", [])
  );
  const [challengeDuration, setChallengeDuration] = useState(() =>
    getPersistedData("kannadaDuration", 7)
  );
  const [lastPlayedDate, setLastPlayedDate] = useState<string | null>(() =>
    getPersistedData("kannadaLastPlayed", null)
  );
  const [userName, setUserName] = useState<string>(() => { 
    let storedName = getPersistedData<string | null>("kannadaUserName", null);
    if (!storedName || storedName === "Friend") { 
      const { name, emoji } = generateRandomProfile();
      storedName = name;
      localStorage.setItem("kannadaUserName", name);
      localStorage.setItem("kannadaUserEmoji", emoji);
    }
    return storedName as string;
  });
  const [userEmoji, setUserEmoji] = useState<string>(() => {
    return getPersistedData("kannadaUserEmoji", "😀");
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const persisted = getPersistedData<string | null>("kannadaTheme", null);
    if (persisted === "light" || persisted === "dark") return persisted as "light" | "dark";
    
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const [feedbackDuration, setFeedbackDuration] = useState(() => 
    getPersistedData("kannadaFeedbackDuration", 4000)
  );

  const updateFeedbackDuration = (duration: number) => {
    setFeedbackDuration(duration);
    localStorage.setItem("kannadaFeedbackDuration", JSON.stringify(duration));
  };

  // Check for streak break
  useEffect(() => {
    if (!lastPlayedDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastPlayed = new Date(lastPlayedDate);
    lastPlayed.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastPlayed.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1 && streak > 0) {
      setStreak(0);
      showToast("Streak lost! Play daily to keep it.");
    }
  }, [lastPlayedDate, streak]);

  // Sync from Firestore on Login
  useEffect(() => {
    if (!effectiveUid) return;

    const unsub = onSnapshot(doc(db, "users", effectiveUid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        setUserName(prev => {
            // Only update from Firestore if it's a custom name (not auto-generated)
            if (data.userName && data.isCustomName && data.userName !== prev) {
                localStorage.setItem("kannadaUserName", data.userName);
                if (data.emoji) {
                    setUserEmoji(data.emoji);
                    localStorage.setItem("kannadaUserEmoji", data.emoji);
                }
                return data.userName;
            }
            return prev;
        });
        
        setStreak((prev) => {
            const val = Math.max(prev, data.streak || 0);
            return val === prev ? prev : val;
        });

        setCompletedDays((prev) => {
            const incoming = data.completedDays || [];
            const merged = new Set([...prev, ...incoming]);
            if (merged.size === prev.length) return prev;
            return Array.from(merged);
        });

        setEarnedBadges((prev) => {
             const incoming = data.earnedBadges || [];
             const merged = new Set([...prev, ...incoming]);
             if (merged.size === prev.length) return prev;
             return Array.from(merged);
        });

        setChallengeDuration((prev) => {
            const val = Math.max(prev, data.challengeDuration || 7);
            return val === prev ? prev : val;
        });

        setLastPlayedDate(prev => {
             if (data.lastPlayedDate && data.lastPlayedDate !== prev) return data.lastPlayedDate;
             return prev;
        });
      }
    });

    return () => unsub();
  }, [effectiveUid]);

  // Sync to Firestore on Change
  useEffect(() => {
    if (!effectiveUid) return;

    const saveData = async () => {
      try {
        const userRef = doc(db, "users", effectiveUid);
        await setDoc(userRef, {
          streak,
          completedDays,
          earnedBadges,
          challengeDuration,
          lastPlayedDate,
          // userName managed separately to avoid overwrite race condition
          lastUpdated: Date.now()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [effectiveUid, streak, completedDays, earnedBadges, challengeDuration, lastPlayedDate]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("kannadaTheme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(false);

  const completeDay = useCallback(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setView("result");

    if (!completedDays.includes(currentDay)) {
      const newCompleted = [...completedDays, currentDay];
      setCompletedDays(newCompleted);
      localStorage.setItem("kannadaCompleted", JSON.stringify(newCompleted));

      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("kannadaStreak", JSON.stringify(newStreak));

      const badgeName = LEARNING_DATA[currentDay].badgeReward;
      if (badgeName && !earnedBadges.includes(badgeName)) {
        const newBadges = [...earnedBadges, badgeName];
        setEarnedBadges(newBadges);
        localStorage.setItem("kannadaBadges", JSON.stringify(newBadges));
      }

      const today = new Date().toDateString();
      setLastPlayedDate(today);
      localStorage.setItem("kannadaLastPlayed", today);
    }
  }, [completedDays, currentDay, streak, earnedBadges, LEARNING_DATA]);

  const nextScenario = useCallback(
    (wasCorrect: boolean) => {
      setFeedback(null);
      if (hearts <= 1 && !wasCorrect) {
        setView("failure");
        return;
      }

      if (scenarioIndex < LEARNING_DATA[currentDay].scenarios.length - 1) {
        setScenarioIndex((prev) => prev + 1);
        setTimeLeft(10);
        setTimerActive(true);
      } else {
        completeDay();
      }
    },
    [hearts, scenarioIndex, currentDay, completeDay, LEARNING_DATA]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0 && !feedback) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && !feedback) {
      // Directly apply the logic for timeout handling asynchronously
      setTimeout(() => {
        setFeedback({
          type: "error",
          msg: "Time's Up! In real life, they drove away.",
        });
        setHearts((prev) => prev - 1);
        setTimerActive(false);
        nextScenario(false);
      }, 0);
    }
    return () => clearInterval(interval || undefined);
  }, [
    timerActive,
    timeLeft,
    feedback,
    setHearts,
    setFeedback,
    setTimerActive,
    nextScenario,
  ]);

  const updateUserName = (name: string) => {
      setUserName(name);
      localStorage.setItem("kannadaUserName", name);
      // Firestore update happens only via updateProfile in useSocial, to manage isCustomName flag.
  };

  const startDay = (dayIndex: number) => {
    setCurrentDay(dayIndex);
    setView("strategy");
  };

  const startPractice = (dayIndex: number) => {
    setCurrentDay(dayIndex);
    setView("flashcards");
    setCardIndex(0);
    setScenarioIndex(0);
    setHearts(3);
    setFeedback(null);
    setIsFlipped(false);
  };

  const startDrill = () => {
    setView("flashcards");
    setCardIndex(0);
    setScenarioIndex(0);
    setHearts(3);
    setFeedback(null);
    setIsFlipped(false);
  };

  const startScenarios = () => {
    setView("scenarios");
    setFeedback(null); // Reset feedback when starting scenarios
    setTimeLeft(10);
    setTimerActive(true);
  };

  const handleAnswer = (option: { correct: boolean; explanation?: string; newWords?: { word: string; meaning: string }[] }) => {
    setTimerActive(false);
    if (option.correct) {
      setFeedback({ type: "success", msg: option.explanation || "", newWords: option.newWords });
      setTimeout(() => nextScenario(true), feedbackDuration);
    } else {
      setFeedback({ type: "error", msg: "Tappu! (Wrong)", newWords: option.newWords });
      setHearts((prev) => prev - 1);
      setTimeout(() => nextScenario(false), feedbackDuration);
    }
  };

  const extendChallenge = () => {
    setChallengeDuration(30);
    localStorage.setItem("kannadaDuration", "30");
    setView("dashboard");
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.9 } });
  };

  const retryLevel = () => {
    setHearts(3);
    setScenarioIndex(0);
    setFeedback(null);
    setTimeLeft(10);
    setTimerActive(true);
    setView("scenarios");
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem("kannadaLanguage", lang);
  };

  const resetGame = useCallback(() => {
    localStorage.removeItem("kannadaStreak");
    localStorage.removeItem("kannadaCompleted");
    localStorage.removeItem("kannadaBadges");
    localStorage.removeItem("kannadaDuration");
    localStorage.removeItem("kannadaLastPlayed");
    localStorage.removeItem("kannadaUserName");
    localStorage.removeItem("kannadaUserEmoji");
    window.location.reload();
  }, []);

  return {
    state: {
      currentDay,
      view,
      hearts,
      streak,
      completedDays,
      earnedBadges,
      challengeDuration,
      cardIndex,
      isFlipped,
      scenarioIndex,
      feedback,
      timeLeft,
      userName,
      userEmoji,
      theme,
      currentLanguage,
      LEARNING_DATA,
      supportedLanguages,
      lastPlayedDate,
      feedbackDuration,
    },
    actions: {
      setView,
      startDay,
      startPractice,
      startDrill,
      startScenarios,
      handleAnswer,
      setIsFlipped,
      setCardIndex,
      setUserName: updateUserName,
      extendChallenge,
      toggleTheme,
      setCurrentLanguage: changeLanguage,
      resetGame,
      retryLevel,
      setFeedbackDuration: updateFeedbackDuration,
    },
  };
};

export default useGameLogic;