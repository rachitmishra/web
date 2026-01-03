import { Award, Calendar, Home, Star, Trophy, Share2 } from "../components/Icons";
import Button from "../components/Button";
import type { SupportedLanguage, LearningData } from "../data";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { useToast } from "../context/ToastContext";

interface ResultProps {
  state: {
    currentDay: number;
    streak: number;
    challengeDuration: number;
    theme: "light" | "dark";
    currentLanguage: SupportedLanguage;
    LEARNING_DATA: LearningData[];
  };
  actions: {
    setView: (view: string) => void;
    extendChallenge: () => void;
    toggleTheme: () => void;
    setCurrentLanguage: (lang: SupportedLanguage) => void;
    resetGame: () => void;
  };
}

export default function Result({ state, actions }: ResultProps) {
  const { streak, challengeDuration, LEARNING_DATA, currentDay } = state;
  const { setView, extendChallenge } = actions;
  const { showToast } = useToast();
  const shareRef = useRef<HTMLDivElement>(null);

  const isBadgeEarned = LEARNING_DATA[currentDay].badgeReward;
  const isWeekCompleted = (currentDay + 1) % 7 === 0;

  const handleShare = async () => {
    if (shareRef.current === null) {
      return;
    }

    try {
      showToast("Generating image...");
      // Filter out elements we don't want in the screenshot (like buttons)
      const filter = (node: HTMLElement) => {
          const exclusionClasses = ['result-actions'];
          return !exclusionClasses.some((classname) => node.classList?.contains(classname));
      };

      const dataUrl = await toPng(shareRef.current, { 
          cacheBust: true, 
          pixelRatio: 2,
          backgroundColor: '#0f172a', // Enforce dark bg for share
          filter: filter
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'kannadablitz-result.png', { type: blob.type });

      if (navigator.share) {
          await navigator.share({
            title: 'Mission Accomplished!',
            text: `I just cleared Day ${currentDay + 1} on KannadaBlitz! Streak: ${streak} 🔥`,
            files: [file],
          });
          showToast("Shared successfully!");
      } else {
          const link = document.createElement('a');
          link.download = 'kannadablitz-result.png';
          link.href = dataUrl;
          link.click();
          showToast("Image downloaded!");
      }
    } catch (err) {
      console.error('Error sharing:', err);
      showToast("Failed to share result.");
    }
  };

  return (
    <div className="result-view" ref={shareRef}>
      <div className="result-bg-blob blob-blue"></div>
      <div className="result-bg-blob blob-purple"></div>
      <div className="result-content">
        <div className="trophy-wrapper">
          <Trophy size={64} className="trophy-icon" />
        </div>
        <h2 className="result-title">Mission Accomplished!</h2>
        <p className="result-subtitle">Day {currentDay + 1} Cleared.</p>

        {isBadgeEarned && (
          <div className="new-badge-card">
            <div className="badge-card-inner">
              <Award size={40} className="badge-card-icon" />
              <div className="badge-text-group">
                <p className="badge-label">New Badge Unlocked</p>
                <p className="badge-name">
                  {LEARNING_DATA[currentDay].badgeReward}
                </p>
              </div>
            </div>
          </div>
        )}

        {isWeekCompleted && (
          <div className="week-complete-banner">
            <div className="banner-content">
              <div className="star-icon-bg">
                <Star size={24} />
              </div>
              <div className="banner-text">
                <p className="banner-title">Week Complete!</p>
                <p className="banner-subtitle">You've earned a Weekly Medal</p>
              </div>
            </div>
          </div>
        )}

        <div className="result-stats">
          <div className="result-stat-box">
            <p className="rs-label">Streak</p>
            <p className="rs-value">{streak}</p>
          </div>
          <div className="result-stat-box">
            <p className="rs-label">Status</p>
            <p className="rs-value text-green">Fluent</p>
          </div>
        </div>

        <div className="result-actions">
          <Button
            onClick={handleShare}
            variant="primary"
            fullWidth
          >
            <Share2 size={20} /> Share Result
          </Button>
          <Button
            onClick={() => setView("dashboard")}
            variant="surface"
            fullWidth
            className="home-btn"
          >
            <Home size={20} /> Back to Base
          </Button>
          {currentDay === 6 && challengeDuration === 7 && (
            <Button
              onClick={extendChallenge}
              variant="surface"
              fullWidth
              className="extension-btn-dark"
            >
              <Calendar size={18} /> Extend to 30 Days
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
