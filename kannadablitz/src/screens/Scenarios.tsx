import { useEffect, useState } from "react";
import { Clock, Heart } from "../components/Icons";
import Header from "../components/Header";
import Button from "../components/Button";
import type { SupportedLanguage, LearningData } from "../data";
import { useShuffledOptions } from "../hooks/useShuffledOptions"; // Import the custom hook
import FeedbackToast from "../components/FeedbackToast";
import ClickableSentence from "../components/ClickableSentence";

interface ScenariosProps {
  state: {
    currentDay: number;
    scenarioIndex: number;
    hearts: number;
    timeLeft: number;
    feedback: { type: "success" | "error"; msg: string; newWords?: { word: string; meaning: string }[] } | null;
    theme: "light" | "dark";
    currentLanguage: SupportedLanguage;
    LEARNING_DATA: LearningData[];
  };
  actions: {
    startDrill: () => void;
    handleAnswer: (option: {
      text: string;
      correct: boolean;
      explanation?: string;
      newWords?: { word: string; meaning: string }[]
    }) => void;
    setView: (view: string) => void;
    toggleTheme: () => void;
    setCurrentLanguage: (lang: SupportedLanguage) => void;
    resetGame: () => void;
  };
  onOpenSettings?: () => void;
}

export default function Scenarios({ state, actions, onOpenSettings }: ScenariosProps) {
  const {
    currentDay,
    hearts,
    timeLeft,
    feedback,
    scenarioIndex,
    theme,
    currentLanguage,
    LEARNING_DATA,
  } = state;
  const {
    handleAnswer,
    setView,
    toggleTheme,
    setCurrentLanguage,
    resetGame,
  } = actions;

  const scenario = LEARNING_DATA[currentDay].scenarios[scenarioIndex];

  // Use the custom hook for shuffled options
  const shuffledOptions = useShuffledOptions(scenario.options, [scenarioIndex, currentDay, LEARNING_DATA]);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Reset UI state on scenario change
  useEffect(() => {
    setSelectedIdx(null); // eslint-disable-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps

    // Blur active element defensively
    const active = document.activeElement as HTMLElement | null;
    if (active && active.classList && active.classList.contains("option-btn")) {
      active.blur();
    }
  }, [scenarioIndex, currentDay, LEARNING_DATA]); // Dependencies for resetting UI state

  return (
    <div className="scenarios-view">
      <Header
        onBack={() => setView("dashboard")}
        center={"SCENARIOS"}
        right={
          <div className={`timer ${timeLeft <= 3 ? "timer-danger" : ""}`}>
            <Clock size={18} /> {timeLeft}s
          </div>
        }
        variant="light"
        theme={theme}
        toggleTheme={toggleTheme}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        resetGame={resetGame}
        onOpenSettings={onOpenSettings}
      />

      <div className="sc-header">
        <div className="hearts-container">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              size={24}
              className={`heart-icon ${
                i < hearts ? "heart-filled" : "heart-empty"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="sc-content">
        <div className="context-card">
          <div className="context-badge">Scenario {scenarioIndex + 1}</div>
          <ClickableSentence 
            text={scenario.context} 
            vocab={LEARNING_DATA[currentDay].vocab} 
          />
        </div>

        <div className="options-list">
          {shuffledOptions.map(
            (
              opt: { text: string; correct: boolean; explanation?: string; newWords?: { word: string; meaning: string }[] },
              idx: number
            ) => (
              <Button
                key={opt.text + idx}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelectedIdx(idx);
                  handleAnswer(opt);
                }}
                disabled={feedback !== null}
                className={`option-btn 
                  ${selectedIdx === idx && opt.correct ? "opt-correct" : ""}
                  ${
                    feedback && !opt.correct && feedback.type === "error"
                      ? "opt-dimmed"
                      : ""
                  }
                `}
              >
                {opt.text}
              </Button>
            )
          )}
        </div>
      </div>

      <FeedbackToast 
        feedback={feedback} 
        explanation={selectedIdx !== null ? shuffledOptions[selectedIdx]?.explanation : undefined}
      />
    </div>
  );
}