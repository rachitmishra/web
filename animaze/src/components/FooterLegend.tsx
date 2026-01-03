import React from "react";

export const FooterLegend: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="legend-grid">
        <div className="legend-item">
          <span>A - Z</span>
          <span className="text-blue-sub legend-sub">Alphabet + AI Art</span>
        </div>
        <div className="legend-item">
          <span>0 - 9</span>
          <span className="text-emerald-sub legend-sub">Counting</span>
        </div>
        <div className="legend-item">
          <span>Space Bar</span>
          <span className="text-purple-sub legend-sub">Funny Sounds</span>
        </div>
      </div>
    </div>
  );
};
