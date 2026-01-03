import Dashboard from "./screens/Dashboard";
import StrategyView from "./screens/StrategyView";
import Flashcards from "./screens/Flashcards";
import Scenarios from "./screens/Scenarios";
import Result from "./screens/Result";
import CertificateView from "./screens/CertificateView";
import Failure from "./screens/Failure";
import SettingsModal from "./components/SettingsModal";
import WordBank from "./screens/WordBank";

import useGameLogic from "./hooks/useGameLogic";
import { useEffect, useState } from "react";
import { useSocial } from "./hooks/useSocial";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";

export default function App() {
  const { state, actions } = useGameLogic();
  const { view, userEmoji } = state;
  const { addFriend, updateProfile, myProfile } = useSocial();
    const { user } = useAuth();
    const { showToast } = useToast();
  
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
    useEffect(() => {
      if (!user) return;
      
      const params = new URLSearchParams(window.location.search);    const inviteId = params.get("invite");
    if (inviteId) {
      addFriend(inviteId).then((success) => {
        if (success) {
          showToast("Friend added to your community!");
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [addFriend, user, showToast]);

  return (
    <div className="app-root">
      {view === "dashboard" && <Dashboard state={state} actions={actions} onOpenSettings={() => setIsSettingsOpen(true)} />}
      {view === "strategy" && <StrategyView state={state} actions={actions} />}
      {view === "flashcards" && <Flashcards state={state} actions={actions} />}
      {view === "wordbank" && (
        <WordBank 
            completedDays={state.completedDays}
            learningData={state.LEARNING_DATA}
            onBack={() => actions.setView("dashboard")}
        />
      )}
      {view === "scenarios" && (
        <Scenarios
          key={`${state.currentDay}-${state.scenarioIndex}`} // Add key prop here
          state={state}
          onOpenSettings={() => setIsSettingsOpen(true)}
          actions={{
            handleAnswer: actions.handleAnswer,
            startDrill: actions.startDrill,
            setView: actions.setView,
            toggleTheme: actions.toggleTheme,
            setCurrentLanguage: actions.setCurrentLanguage,
            resetGame: actions.resetGame,
          }}
        />
      )}
      {view === "result" && <Result state={state} actions={actions} />}
      {view === "failure" && <Failure actions={actions} />}
      {view === "certificate" && (
        <CertificateView 
            state={state} 
            actions={{
                ...actions,
                setUserName: (name) => {
                    actions.setUserName(name);
                    updateProfile(name, myProfile.emoji || userEmoji || "😀");
                }
            }} 
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        feedbackDuration={state.feedbackDuration}
        setFeedbackDuration={actions.setFeedbackDuration}
      />

      {(view === "dashboard" || view === "strategy") && (
        <footer className="app-footer">
          <div className="footer-inner">
            <a className="footer-logo" href="https://hypvzn.com" target="_blank" rel="noopener noreferrer">HYPVZN</a>
            <p className="footer-text">© {new Date().getFullYear()} KannadaBlitz</p>
          </div>
        </footer>
      )}
    </div>
  );
}
