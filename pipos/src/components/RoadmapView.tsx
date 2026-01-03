import React from 'react';
import { Lock, Trophy } from './Icons';
import { CURRICULUM } from '../data/gameData';

interface RoadmapViewProps {
  xp: number;
  onLevelSelect: (levelId: number) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ xp, onLevelSelect }) => (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <h2 className="roadmap-title">Your 6-Month Party</h2>
        <p className="roadmap-subtitle">Earn XP to unlock the next levels!</p>
      </div>
      
      <div className="roadmap-grid">
        {CURRICULUM.map((item, idx) => {
          const isUnlocked = xp >= item.unlockedAt;
          // Determine color class based on item.color string from data (assuming it matches standard Tailwind names we mapped)
          // Since we defined .bg-color-400 classes in app.css, we can use them directly if they match.
          // The data has "bg-orange-400", etc.
          
          return (
            <div 
              key={idx}
              onClick={() => isUnlocked && onLevelSelect(item.id)}
              className={`roadmap-item ${item.color} ${isUnlocked ? 'roadmap-item-unlocked' : 'roadmap-item-locked'}`}
            >
              {!isUnlocked && <Lock className="lock-icon" size={20} />}
              <div className="flex justify-between items-start mb-2">
                <span className="item-number">
                  0{item.id}
                </span>
                <div className="item-content">
                  <h3 className={`item-title ${isUnlocked ? 'item-title-unlocked' : 'item-title-locked'}`}>
                    {item.title}
                  </h3>
                  <p className={`item-desc ${isUnlocked ? 'item-desc-unlocked' : 'item-desc-locked'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
              
              {isUnlocked && (
                <div className="mission-box">
                  <p className="mission-label">Mission:</p>
                  <ul className="mission-list">
                    {item.tasks.map((t, i) => (
                      <li key={i} className="mission-item">
                        <div className="bullet-dot" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
               {!isUnlocked && (
                 <div className="locked-footer">
                    <Trophy className="w-3 h-3" /> Requires {item.unlockedAt} XP
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
);