import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Star, Map, Trophy, Play } from './components/Icons';
import { NOTES, SONGS } from './data/gameData';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useInputSystem } from './hooks/useInputSystem';
import { useProgress } from './hooks/useProgress';
import { PianoBuddy } from './components/PianoBuddy';
import { RoadmapView } from './components/RoadmapView';
import { GameView } from './components/GameView';
import { PianoKeyboard } from './components/PianoKeyboard';
import { Note, BuddyMood, Song } from './types';

export default function PianoQuestApp() {
  const [view, setView] = useState<'roadmap' | 'piano' | 'game' | 'songs'>('roadmap');
  
  // Replace local state with useProgress hook
  const { progress, addXp, updateLevel, checkDailyStreak } = useProgress();
  const { xp, level, streak } = progress;

  const { playNote } = useAudioEngine();
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  // Game State
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [targetNote, setTargetNote] = useState<Note | null>(null);
  const [songIndex, setSongIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState("Press Start to Play!");
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  
  // Buddy State
  const [buddyMood, setBuddyMood] = useState<BuddyMood>('idle');
  const [buddyMessage, setBuddyMessage] = useState("Hi! I'm Pipo. Let's play!");

  // Integrate Input System
  const lastInputTime = useRef(0);

  // --- Logic for Note Ninja (Random) ---
  const pickNewRandomTarget = useCallback(() => {
    const whiteKeys = NOTES.filter(n => n.type === 'white' && n.note !== 'C2');
    const random = whiteKeys[Math.floor(Math.random() * whiteKeys.length)];
    setTargetNote(random);
  }, []);

  // --- Logic for Song Play ---
  const pickNextSongNote = useCallback(() => {
    if (!selectedSong) return;
    if (songIndex >= selectedSong.notes.length) {
        setIsPlayingGame(false);
        setGameMessage("Song Complete! +50 XP");
        addXp(50);
        setBuddyMood('happy');
        setBuddyMessage("Bravo! Encore!");
        setSongIndex(0);
        return;
    }
    const noteName = selectedSong.notes[songIndex];
    const noteObj = NOTES.find(n => n.note === noteName) || { note: noteName, freq: 0, type: 'white', label: noteName };
    setTargetNote(noteObj as Note);
  }, [selectedSong, songIndex, addXp]);

  const checkGameAnswer = useCallback((playedNote: string) => {
    if (!targetNote) return;
    
    // Simple check: note name matches
    if (playedNote === targetNote.note) {
      setBuddyMood('happy');
      
      if (selectedSong) {
          // Song Mode
          setGameMessage("Good!");
          setSongIndex(prev => prev + 1);
      } else {
          // Note Ninja Mode
          addXp(10); 
          setGameMessage("Correct! +10 XP");
          setBuddyMessage("Yay! That's it!");
          setTimeout(() => {
            setGameMessage("Find: ");
            pickNewRandomTarget();
          }, 800);
      }
    } else {
      setGameMessage("Try again!");
      setBuddyMood('idle');
      setBuddyMessage("Oops, try again!");
    }
  }, [targetNote, selectedSong, addXp, pickNewRandomTarget]);

  // Effect to trigger next note when songIndex changes
  useEffect(() => {
      if (isPlayingGame && selectedSong) {
          pickNextSongNote();
      }
  }, [songIndex, isPlayingGame, selectedSong, pickNextSongNote]);


  const handleExternalInput = useCallback((note: string) => {
    const now = Date.now();
    if (now - lastInputTime.current < 200) return; 
    lastInputTime.current = now;
    
    setLastPlayed(note);
    setBuddyMood('playing');

    if (isPlayingGame) {
        checkGameAnswer(note);
    }
  }, [isPlayingGame, checkGameAnswer]); 

  const { inputType, isListening, inputLabel, toggleInput } = useInputSystem(handleExternalInput);

  // Check streak on mount
  useEffect(() => {
      checkDailyStreak();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Level up logic
  useEffect(() => {
    const newLevel = Math.floor(xp / 200) + 1;
    if (newLevel > level) {
      updateLevel(newLevel); // Use hook function
      setBuddyMood('happy');
      setBuddyMessage("Level Up! Amazing!");
      setTimeout(() => setBuddyMessage("Keep it up!"), 2000);
    }
  }, [xp, level, updateLevel]);

  useEffect(() => {
    if (isListening) {
      setBuddyMood('listening');
      // If detected note label exists, Pipo shows it via GameView usually, but here we can update message
      if (inputLabel && inputLabel.startsWith('Hearing:')) {
          setBuddyMessage(inputLabel);
      } else if (inputLabel && inputLabel.startsWith('MIDI:')) {
          setBuddyMessage(inputLabel);
      } else {
          setBuddyMessage("I'm listening...");
      }
    } else {
      setBuddyMood('idle');
      setBuddyMessage("Ready to play?");
    }
  }, [isListening, inputLabel]);
  
  useEffect(() => {
      if (buddyMood === 'playing') {
          const timer = setTimeout(() => {
             setBuddyMood(isListening ? 'listening' : 'idle');
          }, 300);
          return () => clearTimeout(timer);
      }
  }, [buddyMood, isListening]);

  const handleNotePress = (noteData: Note) => {
    playNote(noteData.freq);
    setLastPlayed(noteData.note);
    setBuddyMood('playing');

    if (isPlayingGame) {
      checkGameAnswer(noteData.note);
    }
  };

  const handleBuddyPoke = () => {
    if (Math.random() > 0.8) {
      addXp(5); // Use hook function
    }
  };

  const startSong = (song: Song | null) => {
      setSelectedSong(song);
      setSongIndex(0);
      setIsPlayingGame(true);
      setView('game');
      setGameMessage(song ? `Play: ${song.title}` : "Listen & Look! Find: ");
      setBuddyMood('happy');
      setBuddyMessage(song ? "Let's play music!" : "Find the notes!");
      
      if (!song) {
          pickNewRandomTarget();
      }
  };

  // --- Components for Songs List ---
  const SongsList = () => (
      <div className="roadmap-container">
          <div className="roadmap-header">
            <h2 className="roadmap-title">Song Library</h2>
            <p className="roadmap-subtitle">Pick a tune to learn!</p>
          </div>
          
          <div className="roadmap-grid">
              {/* Note Ninja Card */}
              <div 
                onClick={() => startSong(null)}
                className="roadmap-item bg-rose-500 roadmap-item-unlocked"
              >
                  <div className="item-content">
                      <h3 className="item-title item-title-unlocked">Note Ninja</h3>
                      <p className="item-desc item-desc-unlocked">Train your ear! Identify random notes.</p>
                  </div>
                  <Trophy className="lock-icon" size={20} color="white" />
              </div>

              {SONGS.map((song) => (
                  <div 
                    key={song.id}
                    onClick={() => startSong(song)}
                    className="roadmap-item bg-violet-400 roadmap-item-unlocked"
                  >
                      <div className="item-content">
                          <h3 className="item-title item-title-unlocked">{song.title}</h3>
                          <p className="item-desc item-desc-unlocked">Difficulty: {song.difficulty}</p>
                      </div>
                      <Music className="lock-icon" size={20} color="white" />
                  </div>
              ))}
          </div>
      </div>
  );
  
  const shouldShowGlobalBuddy = !(view === 'game' && isListening);
  
  const buddyProps = {
      mood: buddyMood,
      message: buddyMessage,
      onPoke: handleBuddyPoke
  };

  // --- Main Layout ---
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-box">
                <Music className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="header-title">Mellopop</h1>
                <p className="header-subtitle">Day {streak} Party</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="level-indicator">
                <span className="level-label">Level {level}</span>
                <div className="xp-bar-container">
                    <div 
                        className="xp-bar-fill" 
                        style={{ width: `${(xp % 200) / 2}%` }}
                    />
                </div>
            </div>
            <div className="xp-badge">
                <Star className="w-3 h-3 fill-current" /> {xp}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {view === 'roadmap' && <RoadmapView xp={xp} onLevelSelect={() => setView('songs')} />}
        {view === 'songs' && <SongsList />}
        {view === 'game' && <GameView 
            inputType={inputType}
            isListening={isListening}
            inputLabel={inputLabel}
            toggleInput={toggleInput}
            isPlayingGame={isPlayingGame}
            startGame={() => startSong(selectedSong)}
            gameMessage={gameMessage}
            targetNote={targetNote}
            xp={xp}
            level={level}
            lastPlayed={lastPlayed}
            onNotePress={handleNotePress}
            buddyProps={buddyProps}
        />}
        {view === 'practice' && (
            <div className="practice-view">
                <div className="practice-title-container">
                    <h2 className="practice-title">Free Play</h2>
                    <p className="practice-subtitle">Jam out with Pipo!</p>
                </div>
                <PianoKeyboard className="practice-keyboard" lastPlayed={lastPlayed} onNotePress={handleNotePress} />
                <div className="practice-tip">
                    <p className="tip-text">
                        <span className="tip-highlight">PRO TIP!</span> 
                        Try playing C-E-G together to make a C Major chord!
                    </p>
                </div>
            </div>
        )}
      </main>

      {/* Piano Buddy - Pipo (Global) */}
      {shouldShowGlobalBuddy && (
          <PianoBuddy {...buddyProps} />
      )}

      {/* Bottom Navigation */}
      <nav className="app-nav pb-safe">
        <div className="nav-content">
          <button 
            onClick={() => { setView('roadmap'); setBuddyMessage("Look how far we've come!"); }}
            className={`nav-button ${view === 'roadmap' ? 'nav-button-active' : ''}`}
          >
            <Map className="w-6 h-6" />
            <span className="nav-label">Map</span>
          </button>

          <button 
             onClick={() => { setView('practice'); setBuddyMessage("Let's make some noise!"); }}
             className={`nav-button-center ${view === 'practice' ? 'nav-button-center-active' : ''}`}
          >
            <div className={`center-icon-container ${view === 'practice' ? 'center-icon-active' : ''}`}>
                <Music className="w-7 h-7 text-white" />
            </div>
            {view !== 'practice' && <span className="nav-label mt-1">Piano</span>}
          </button>

          <button 
             onClick={() => { setView('songs'); setBuddyMessage("Time to play a song!"); }}
             className={`nav-button ${view === 'songs' || view === 'game' ? 'nav-button-active' : ''}`}
          >
            <Play className="w-6 h-6" />
            <span className="nav-label">Songs</span>
          </button>
        </div>
      </nav>
      
      <style>{`
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}