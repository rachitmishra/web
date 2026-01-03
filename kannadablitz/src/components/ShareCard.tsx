import { forwardRef } from 'react';
import { Star, User } from './Icons';

interface ShareCardProps {
  userName: string;
  emoji: string;
  streak: number;
  badges: number;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ userName, emoji, streak, badges }, ref) => {
  return (
    <div ref={ref} className="share-card">
      {/* Background Decor */}
      <div className="share-card-decor-1"></div>
      <div className="share-card-decor-2"></div>

      <h2 className="share-card-logo">HYPVZN LEARNING</h2>

      <div className="share-card-avatar-wrapper">
          {emoji || <User size={64} />}
      </div>

      <h1 className="share-card-username">{userName || "Friend"}</h1>
      
      <div className="share-card-stats">
          <div className="share-card-stat-item">
              <div className="share-card-stat-value">
                  <span className="fire-emoji">🔥</span> {streak}
              </div>
              <div className="share-card-stat-label">Day Streak</div>
          </div>
          <div className="share-card-divider"></div>
          <div className="share-card-stat-item">
               <div className="share-card-stat-value">
                  <Star size={36} fill="#fbbf24" /> {badges}
              </div>
              <div className="share-card-stat-label">Badges</div>
          </div>
      </div>
      
      <div className="share-card-footer">
          Join me at kannadablitz.web.app
      </div>
    </div>
  );
});

export default ShareCard;
