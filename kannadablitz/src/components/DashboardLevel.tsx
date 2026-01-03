import type { LearningData } from "../data";

import { Lock, Trophy, RefreshCcw, Clock } from "./Icons";

type DashboardLevelProps = {
  day: LearningData;
  isLocked: boolean;
  isCompleted: boolean;
  globalIndex: number;
  startDay: (dayIndex: number) => void;
  startPractice: (dayIndex: number) => void;
  isDailyLimitReached: boolean;
  isDailyLocked?: boolean;
  onHabitNudge?: (dayIndex: number) => void;
};
const DashboardLevel = ({
  day,
  isLocked,
  isCompleted,
  globalIndex,
  startDay,
  startPractice,
  isDailyLocked,
  onHabitNudge,
}: DashboardLevelProps) => {
  const handleClick = () => {
    if (isLocked) {
      if (isDailyLocked && onHabitNudge) {
        onHabitNudge(globalIndex);
      }
      return;
    }
    if (isCompleted) {
      startPractice(globalIndex);
    } else {
      startDay(globalIndex);
    }
  };

  let subText = `${day.vocab.length} Words • ${day.scenarios.length} Scenarios`;
  if (isCompleted) {
    subText = "Practice Mode";
  } else if (isDailyLocked) {
    subText = "Come back tomorrow!";
  }

  return (
    <button
      onClick={handleClick}
      className={`level-btn ${isLocked ? "locked" : ""} ${
        isDailyLocked ? "daily-locked" : ""
      } ${isCompleted ? "completed" : ""}`}
      disabled={isLocked && !isDailyLocked}
    >
      <div className="level-btn-content-parent">
        <div className="level-btn-content">
          <div
            className={`level-icon ${
              isCompleted ? "icon-completed" : "icon-active"
            }`}
          >
            {isLocked ? (
              isDailyLocked ? (
                <Clock size={18} />
              ) : (
                <Lock size={18} />
              )
            ) : (
              day.day
            )}
          </div>
          <div className="level-info">
            <h4
              className={`day-title ${isCompleted ? "day-meta-completed" : ""}`}
            >
              {day.title}
            </h4>
            <p
              className={`day-meta ${isCompleted ? "day-meta-completed" : ""}`}
            >
              {subText}
            </p>
          </div>
          {isCompleted && <RefreshCcw className="check-icon" size={20} />}
          {day.badgeReward && !isCompleted && !isLocked && (
            <Trophy size={20} className="reward-icon" />
          )}
        </div>
      </div>
    </button>
  );
};

export default DashboardLevel;
