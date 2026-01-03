import { forwardRef } from 'react';
import { User, Trophy } from './Icons';

interface BadgeShareCardProps {
  userName: string;
  emoji: string;
  badgeName: string;
}

const BadgeShareCard = forwardRef<HTMLDivElement, BadgeShareCardProps>(({ userName, emoji, badgeName }, ref) => {
  return (
    <div ref={ref} className="share-card" style={{ borderColor: 'var(--primary)' }}>
      {/* Background Decor */}
      <div className="share-card-decor-1" style={{ background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)', opacity: 0.1 }}></div>
      <div className="share-card-decor-2"></div>

      <h2 className="share-card-logo" style={{ color: 'var(--primary)' }}>NEW BADGE UNLOCKED!</h2>

      <div className="share-card-avatar-wrapper" style={{ borderColor: 'var(--primary)', boxShadow: 'none' }}>
          {emoji || <User size={64} />}
      </div>

      <h1 className="share-card-username" style={{ fontSize: '2rem' }}>{userName || "Friend"}</h1>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ 
              background: 'var(--neutral-50)', 
              color: 'var(--text-title)',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid var(--neutral-200)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
              <Trophy size={24} style={{ color: 'var(--accent-yellow)' }} /> {badgeName}
          </div>
      </div>
      
      <div className="share-card-footer" style={{ marginTop: 'auto' }}>
          Start your streak at kannadablitz.web.app
      </div>
    </div>
  );
});

export default BadgeShareCard;
