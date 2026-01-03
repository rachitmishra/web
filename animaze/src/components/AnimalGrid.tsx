import React from "react";
import type { Animal } from "../types";

interface AnimalGridProps {
  animals: Animal[];
}

export const AnimalGrid: React.FC<AnimalGridProps> = ({ animals }) => {
  return (
    <div className="animal-grid">
      {animals.map((animal, idx) => (
        <div
          key={idx}
          className="grid-item"
        >
          <div className="grid-emoji">{animal.emoji}</div>
          <div className="grid-name">
            {animal.name}
          </div>
        </div>
      ))}
    </div>
  );
};
