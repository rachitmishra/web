import React from 'react';
import { NOTES } from '../data/gameData';
import { Note } from '../types';

interface PianoKeyboardProps {
  className?: string;
  lastPlayed: string | null;
  onNotePress: (note: Note) => void;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ className = "", lastPlayed, onNotePress }) => (
    <div className={`piano-keyboard-container ${className}`}>
      <div className="keys-wrapper">
        {NOTES.map((n, i) => {
            const isBlack = n.type === 'black';
            const isActive = lastPlayed === n.note;
            return (
            <div
                key={i}
                onMouseDown={() => onNotePress(n)}
                onTouchStart={(e) => { e.preventDefault(); onNotePress(n); }}
                className={`
                piano-key
                ${isBlack ? 'piano-key-black' : 'piano-key-white'}
                ${isActive ? (isBlack ? 'piano-key-active-black' : 'piano-key-active-white') : ''}
                `}
            >
                <span className={isBlack ? 'piano-key-label-black' : 'piano-key-label-white'}>
                {n.label}
                </span>
            </div>
            );
        })}
      </div>
    </div>
);