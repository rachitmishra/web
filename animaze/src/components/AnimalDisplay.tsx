import React from "react";
import type { Animal } from "../types";

interface AnimalDisplayProps {
  animal: Animal;
  isSpeaking: boolean;
  isGeneratingImage: boolean;
}

export const AnimalDisplay: React.FC<AnimalDisplayProps> = ({ animal, isSpeaking, isGeneratingImage }) => {
  return (
    <div className="animal-display">
      <div className={`animal-visual ${isSpeaking ? "speaking" : ""}`}>
           {animal.imageUrl ? (
               <div className="animal-image-wrapper">
                  <img 
                      src={animal.imageUrl} 
                      alt={animal.name} 
                      className="animal-generated-image animate-in fade-in zoom-in duration-500"
                  />
                  <div className="animal-emoji-overlay">{animal.emoji}</div>
               </div>
           ) : (
              <div className="animal-emoji">
                  {isGeneratingImage && <div className="loading-sparkle">✨</div>}
                  {animal.emoji}
              </div>
           )}
      </div>
      
      <h1 className="animal-name">
        {animal.name}
      </h1>
      {isSpeaking && (
        <div className="synthesis-indicator">
          <span className="synthesis-text">
            Synthesizing sound...
          </span>
        </div>
      )}
    </div>
  );
};
