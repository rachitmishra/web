import React from 'react';
import { useAuth } from '../context/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button 
        className="user-profile-btn"
        style={{ position: 'fixed', top: '1.5rem', right: '14rem', zIndex: 50 }}
        onClick={login}
      >
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <button 
      className="user-profile-btn"
      style={{ position: 'fixed', top: '1.5rem', right: '14rem', zIndex: 50 }}
      onClick={logout}
      title="Click to Logout"
    >
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="User" 
          style={{ width: 24, height: 24, borderRadius: '50%' }}
        />
      ) : (
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
          {user.displayName ? user.displayName[0] : 'U'}
        </div>
      )}
      <span>{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
    </button>
  );
};
