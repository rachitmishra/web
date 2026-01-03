import { Award, Calendar, ChevronDown, Trophy, Zap, Book } from "../components/Icons";
import { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import type { SupportedLanguage, LearningData } from "../data";
import DashboardLevel from "../components/DashboardLevel";
import SocialPanel from "../components/SocialPanel";
import BadgeShareModal from "../components/BadgeShareModal";

interface DashboardProps {
  state: {
    streak: number;
    earnedBadges: string[];
    completedDays: number[];
    challengeDuration: number;
    theme: "light" | "dark";
    currentLanguage: SupportedLanguage;
    LEARNING_DATA: LearningData[];
    supportedLanguages: {
      id: SupportedLanguage;
      name: string;
      data_file: string;
    }[];
    lastPlayedDate: string | null;
    userName: string;
    userEmoji: string;
  };
  actions: {
    startDay: (dayIndex: number) => void;
    startPractice: (dayIndex: number) => void;
    setView: (view: string) => void;
    extendChallenge: () => void;
    toggleTheme: () => void;
    setCurrentLanguage: (lang: SupportedLanguage) => void;
    resetGame: () => void;
  };
  onOpenSettings?: () => void;
}

export default function Dashboard({ state, actions, onOpenSettings }: DashboardProps) {
  const {
    streak,
    earnedBadges,
    completedDays,
    challengeDuration,
    theme,
    currentLanguage,
    LEARNING_DATA,
    lastPlayedDate,
    userName,
    userEmoji,
  } = state;
  const {
    startDay,
    startPractice,
    setView,
    extendChallenge,
    toggleTheme,
    setCurrentLanguage,
    resetGame,
  } = actions;

  const today = new Date().toDateString();
  const isDailyLimitReached = lastPlayedDate === today;

  const [showHabitNudge, setShowHabitNudge] = useState(false);
  const [nudgeDayIndex, setNudgeDayIndex] = useState<number | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const handleHabitNudge = (dayIndex: number) => {
    setNudgeDayIndex(dayIndex);
    setShowHabitNudge(true);
  };

  const confirmStartNow = () => {
    if (nudgeDayIndex !== null) {
      startDay(nudgeDayIndex);
      setShowHabitNudge(false);
    }
  };

  // Dynamic Week Rendering
  const renderWeek = (weekNum: number, title: string) => {
    const weekData = LEARNING_DATA.filter((d) => d.week === weekNum);

    // Check if previous weeks are completed
    const previousWeekDays = LEARNING_DATA.filter(
      (d) => d.week < weekNum
    ).length;
    const isWeekLocked =
      challengeDuration === 7 && weekNum > 1
        ? true
        : weekNum > 1 && completedDays.length < previousWeekDays;

    // Check if this week is fully completed
    const daysInWeek = weekData.map((d) =>
      LEARNING_DATA.findIndex((global) => global.day === d.day)
    );
    const isWeekComplete = daysInWeek.every((idx) =>
      completedDays.includes(idx)
    );

    if (challengeDuration === 7 && weekNum > 1) return null;

    return (
      <div
        key={weekNum}
        className={`week-container ${isWeekLocked ? "locked" : ""} ${
          isWeekComplete && !isWeekLocked ? "has-weekly-medal" : ""
        }`}
      >
        <div className="week-header">
          <h3 className="level-heading">{title}</h3>
          {isWeekComplete && !isWeekLocked && (
            <span className="weekly-medal-badge">
              Week {weekNum} Medal{" "}
              <Award size={12} className="medal-icon-small" />
            </span>
          )}
        </div>
        <div className="level-list">
          {weekData.map((day) => {
            const globalIndex = LEARNING_DATA.findIndex(
              (d) => d.day === day.day
            );
            const isCompleted = completedDays.includes(globalIndex);
            
            const isSequenceLocked = isWeekLocked || (globalIndex > 0 && !completedDays.includes(globalIndex - 1));
            const isDailyLocked = isDailyLimitReached && !isCompleted && !isSequenceLocked;
            const isLocked = isSequenceLocked || isDailyLocked;

            return (
              <DashboardLevel
                key={day.day}
                day={day}
                isLocked={isLocked}
                isDailyLocked={isDailyLocked}
                isCompleted={isCompleted}
                globalIndex={globalIndex}
                startDay={startDay}
                startPractice={startPractice}
                isDailyLimitReached={isDailyLimitReached}
                onHabitNudge={handleHabitNudge}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const [badgesOpen, setBadgesOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        resetGame={resetGame}
        showLanguageSelector={true}
        onOpenSettings={onOpenSettings}
      />
      <div className="header-card">
        <div className="header-blob"></div>
        <h1 className="header-title">
          Kannada<span className="text-accent-yellow">Blitz</span>
        </h1>
        <p className="header-subtitle">{challengeDuration} Day Challenge</p>

        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-content text-accent-yellow">
              <Zap size={20} fill="currentColor" />
              <span className="stat-num">{streak}</span>
            </div>
            <p className="stat-label">Day Streak</p>
          </div>
          <div 
            className="stat-box" 
            onClick={() => setBadgesOpen(!badgesOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-content text-accent-pink">
              <Award size={20} />
              <span className="stat-num">{earnedBadges.length}</span>
              <ChevronDown 
                size={16} 
                style={{ 
                    marginLeft: 'auto', 
                    transform: badgesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    opacity: 0.5
                }} 
              />
            </div>
            <p className="stat-label">Badges</p>
          </div>
        </div>

        {/* Collapsible Badges Section inside Header Card */}
        <div 
            className={`badges-ribbon ${badgesOpen ? "" : "closed"}`}
            style={{ 
                padding: badgesOpen ? '1rem 0 0 0' : '0',
                marginTop: badgesOpen ? '1rem' : '0',
                borderTop: badgesOpen ? '1px solid var(--neutral-200)' : 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none' // For Internet Explorer/Edge
            }}
        >
            {earnedBadges.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontStyle: 'italic' }}>
                    Complete days to earn badges!
                </p>
            ) : (
                earnedBadges.map((badge, i) => (
                <button 
                    key={i} 
                    className="badge-pill" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBadge(badge);
                    }}
                    style={{ 
                        cursor: 'pointer', 
                        border: '1px solid color-mix(in srgb, var(--accent-yellow) 30%, transparent)', 
                        background: 'var(--surface-bg)',
                        flexShrink: 0
                    }} 
                >
                    <Trophy size={14} className="badge-icon" /> {badge}
                </button>
                ))
            )}
        </div>
      </div>

      <SocialPanel />

      {selectedBadge && (
        <BadgeShareModal 
            isOpen={!!selectedBadge}
            onClose={() => setSelectedBadge(null)}
            badgeName={selectedBadge}
            userName={userName}
            emoji={userEmoji}
        />
      )}

      <div className="levels-container">
        {/* Global Review Button */}
        {completedDays.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
                <Button 
                    onClick={() => setView("wordbank")} 
                    variant="surface"
                    fullWidth
                    style={{ justifyContent: 'space-between' }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Book size={18} style={{ color: 'var(--primary)' }} /> 
                        Review All Words
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                        {completedDays.length} Days Completed
                    </span>
                </Button>
            </div>
        )}

        {renderWeek(1, "Week 1: Survival")}
        {renderWeek(2, "Week 2: Settling In")}
        {renderWeek(3, "Week 3: Essentials")}
        {renderWeek(4, "Week 4: Advanced & Culture")}

        {challengeDuration === 30 && renderWeek(5, "Final Stretch: Mastery")}

        {challengeDuration === 7 && (
          <div className="extension-card">
            <div className="extension-content">
              <h3 className="extension-title">Want More?</h3>
              <p className="extension-description">
                Unlock the full 30-Day Masterclass with Weeks 2, 3, and 4.
              </p>
              <Button
                onClick={extendChallenge}
                className="extension-btn"
                variant="primary"
              >
                <Calendar size={18} /> Unlock 30 Days
              </Button>
            </div>
          </div>
        )}

        {completedDays.includes(29) && (
          <div className="certificate-banner">
            <p className="certificate-pre-title">Challenge Complete!</p>
            <Button
              onClick={() => setView("certificate")}
              variant="primary"
              fullWidth
            >
              <Award size={18} /> Claim Certificate
            </Button>
          </div>
        )}
      </div>

      {showHabitNudge && (
        <div className="habit-nudge-overlay">
          <div className="habit-nudge-modal">
            <h2 className="habit-nudge-title">Wait! Come back tomorrow?</h2>
            <p className="habit-nudge-text">
              Building a habit is better than binge-learning. Your brain needs rest to absorb new words.
            </p>
            <div className="habit-nudge-actions">
              <Button onClick={() => setShowHabitNudge(false)} variant="primary" fullWidth>
                Okay, I'll wait
              </Button>
              <Button onClick={confirmStartNow} variant="neutral" fullWidth>
                I want to learn now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
