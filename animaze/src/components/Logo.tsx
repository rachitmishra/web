import React from "react";

export const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        {/* Hippo Face Shape */}
        <rect x="20" y="20" width="60" height="50" rx="15" fill="currentColor" className="text-purple-400" />
        <rect x="15" y="50" width="70" height="35" rx="12" fill="currentColor" className="text-purple-400" />
        
        {/* Ears */}
        <circle cx="25" cy="20" r="8" fill="currentColor" className="text-purple-400" />
        <circle cx="75" cy="20" r="8" fill="currentColor" className="text-purple-400" />
        
        {/* Eyes */}
        <circle cx="35" cy="40" r="4" fill="#0a0a0a" />
        <circle cx="65" cy="40" r="4" fill="#0a0a0a" />
        
        {/* Nostrils */}
        <circle cx="35" cy="70" r="3" fill="#0a0a0a" opacity="0.6" />
        <circle cx="65" cy="70" r="3" fill="#0a0a0a" opacity="0.6" />
        
        {/* Teeth */}
        <rect x="30" y="85" width="6" height="8" rx="2" fill="white" />
        <rect x="64" y="85" width="6" height="8" rx="2" fill="white" />
      </svg>
      <span className="logo-text">
        Typotamus
      </span>
    </div>
  );
};
