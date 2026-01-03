import React from 'react';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTrackId: string;
  currentDayId: string;
  onTrackChange: (id: string) => void;
  onDayChange: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTrackId, 
  currentDayId, 
  onTrackChange, 
  onDayChange 
}) => {
  const { userProgress } = useAuth();
  const track = courses[currentTrackId];

  // Calculate progress for current track
  const maxCompleted = userProgress[currentTrackId] || 0;
  const totalDays = Object.keys(track.days).length;
  const percentage = Math.round((maxCompleted / (totalDays - 1)) * 100);

  return (
    <aside className="sidebar">
      <div className="brand">
        Distributed<span style={{ color: track.color }}>Go</span>
      </div>

      <div className="track-selector">
        {Object.values(courses).map((t) => (
          <button
            key={t.id}
            onClick={() => onTrackChange(t.id)}
            className={`track-btn ${t.id === currentTrackId ? 'active' : ''}`}
            style={t.id === currentTrackId ? { borderBottom: `2px solid ${t.color}` } : {}}
          >
            {t.id}
          </button>
        ))}
      </div>

      <div className="progress-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{track.title}</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: track.color 
            }} 
          />
        </div>
      </div>

      <nav className="nav-list">
        {Object.values(track.days).map((day) => {
          const isActive = day.id === currentDayId;
          
          return (
            <div 
              key={day.id}
              onClick={() => onDayChange(day.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={isActive ? { borderLeft: `3px solid ${track.color}` } : {}}
            >
              <span className="nav-item-idx">
                {day.id === '0' ? '●' : day.id}
              </span>
              <span>{day.title}</span>
              {parseInt(day.id) < maxCompleted && day.id !== '0' && (
                <span style={{ marginLeft: 'auto', color: 'var(--color-success)', fontSize: '0.7rem' }}>✓</span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
