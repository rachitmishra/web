import React from 'react';
import { Play, Mic, Cable } from './Icons';
import { PianoKeyboard } from './PianoKeyboard';
import { PianoBuddy } from './PianoBuddy';
import { InputType, Note, BuddyMood } from '../types';

interface GameViewProps {
    inputType: InputType;
    isListening: boolean;
    inputLabel: string;
    toggleInput: (type: InputType) => void;
    isPlayingGame: boolean;
    startGame: () => void;
    gameMessage: string;
    targetNote: Note | null;
    xp: number;
    level: number;
    lastPlayed: string | null;
    onNotePress: (note: Note) => void;
    buddyProps: {
        mood: BuddyMood;
        message: string;
        onPoke: () => void;
    };
}

export const GameView: React.FC<GameViewProps> = ({ 
    inputType, 
    isListening, 
    inputLabel, 
    toggleInput, 
    isPlayingGame, 
    startGame, 
    gameMessage, 
    targetNote, 
    xp, 
    level, 
    lastPlayed,
    onNotePress,
    buddyProps
}) => (
    <div className="game-container">
      
      {/* Input Toggles */}
      <div className="input-toggles">
        <button 
            onClick={() => toggleInput('mic')}
            className={`toggle-btn ${
                inputType === 'mic' && isListening 
                ? 'toggle-mic-active' 
                : 'toggle-inactive'
            }`}
        >
            <Mic className="w-4 h-4" /> 
            {inputType === 'mic' && isListening ? 'Listening' : 'Use Mic'}
        </button>
        <button 
            onClick={() => toggleInput('midi')}
            className={`toggle-btn ${
                inputType === 'midi' && isListening 
                ? 'toggle-midi-active' 
                : 'toggle-inactive'
            }`}
        >
            <Cable className="w-4 h-4" />
            {inputType === 'midi' && isListening ? 'MIDI On' : 'Use MIDI'}
        </button>
      </div>

      <div className="game-card">
        <div className="game-card-overlay" />
        
        <div className="game-header">
             <h2 className="game-title">Note Ninja</h2>
             {/* Live Input Feedback Indicator */}
             {inputLabel && (
                 <div className="input-feedback">
                    {inputLabel}
                 </div>
             )}
        </div>
        
        <p className="game-instruction">Identify the notes to train your ear & eyes!</p>
        
        <div className="game-display-area">
            {/* Game Message Area */}
            {!isPlayingGame ? (
                <button 
                    onClick={startGame}
                    className="play-button"
                >
                    <Play className="w-6 h-6 fill-current" /> PLAY
                </button>
            ) : (
                <>
                    <p className="game-message-text">{gameMessage}</p>
                    {targetNote && (
                        <div className="target-note">
                            {targetNote.note}
                        </div>
                    )}
                </>
            )}
        </div>
        
        <div className="game-stats">
            <span className="stat-badge">Score: {xp} XP</span>
            <span className="stat-badge">Level {level}</span>
        </div>
      </div>

      <div className="keyboard-wrapper">
         <p className="keyboard-instruction">
             {inputType === 'touch' ? "Press keys below:" : "Play on your real instrument!"}
         </p>
         
         {/* Conditionally Render Keyboard OR Buddy */}
         {inputType !== 'touch' && isListening ? (
             <PianoBuddy 
                {...buddyProps} 
                className="buddy-container-static"
             />
         ) : (
             <PianoKeyboard lastPlayed={lastPlayed} onNotePress={onNotePress} />
         )}
      </div>
    </div>
);
