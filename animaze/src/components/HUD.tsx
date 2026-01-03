import React from "react";

interface HUDProps {
  lastKeyPressed: string | null;
  displayType: "single" | "multiple";
  isSpeaking: boolean;
}

export const HUD: React.FC<HUDProps> = ({ lastKeyPressed, displayType, isSpeaking }) => {
  return (
    <div className="hud-container">
      <div className="hud-panel">
        <div className="hud-item">
          <span className="hud-label">
            Input:{" "}
            <span className="text-blue">
              {lastKeyPressed || "Waiting..."}
            </span>
          </span>
        </div>
        <div className="hud-separator" />
        <div className="hud-item">
          <span className="hud-label">
            Mode:
            <span className="text-purple ml-1">
              {displayType === "multiple"
                ? "Counting"
                : isSpeaking
                ? "Voice"
                : "Alphabet"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
