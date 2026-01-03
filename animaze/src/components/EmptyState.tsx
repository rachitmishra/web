import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon-container">
        <span className="empty-icon">⌨️</span>
      </div>
      <h2 className="empty-title">
        Press a key to begin
      </h2>
      <p className="empty-description">
        A-Z: Learn Animals
        <br />
        0-9: Learn Counting
        <br />
        Space: Funny Sounds
      </p>
    </div>
  );
};
