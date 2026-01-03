import React, { useState, useEffect, useRef } from 'react';
import { BuddyMood } from '../types';

interface PianoBuddyProps {
  mood: BuddyMood;
  message: string;
  onPoke: () => void;
  className?: string;
  variant?: 'floating' | 'static';
}

export const PianoBuddy: React.FC<PianoBuddyProps> = ({ 
  mood, 
  message, 
  onPoke, 
  className,
  variant = 'floating' 
}) => {
  const [internalState, setInternalState] = useState<{ mood: BuddyMood | null, text: string | null }>({ mood: null, text: null });
  
  // Dragging & Positioning State
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUserMoved, setHasUserMoved] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragDistance = useRef(0);

  // --- Scroll Listener (Auto-Pin Logic) ---
  useEffect(() => {
    if (variant !== 'floating') return;

    const handleScroll = () => {
      // Only auto-pin if user hasn't taken control
      if (!hasUserMoved) {
        const scrolled = window.scrollY > 50;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, hasUserMoved]);

  // --- Drag Handlers ---
  const handleStart = (clientX: number, clientY: number) => {
    if (variant !== 'floating') return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
    startPos.current = { x: clientX, y: clientY };
    dragDistance.current = 0;
    
    setIsDragging(true);
    
    // If this is the first time dragging, we need to initialize 'position' 
    // to the current visual location to prevent jumping.
    if (!position) {
        setPosition({ x: rect.left, y: rect.top });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Track total movement distance to distinguish click from drag
      const dx = clientX - startPos.current.x;
      const dy = clientY - startPos.current.y;
      dragDistance.current = Math.sqrt(dx*dx + dy*dy);

      // Constrain to window bounds
      const x = Math.min(Math.max(0, clientX - dragOffset.current.x), window.innerWidth - (containerRef.current?.offsetWidth || 0));
      const y = Math.min(Math.max(0, clientY - dragOffset.current.y), window.innerHeight - (containerRef.current?.offsetHeight || 0));

      setPosition({ x, y });
      
      // Only mark as "User Moved" if dragged significantly
      if (dragDistance.current > 5) {
          setHasUserMoved(true);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);


  // --- Poke Logic ---
  const handlePokeClick = (e: React.MouseEvent) => {
    // If we dragged more than 5px, it's a drag, not a click.
    if (dragDistance.current > 5) return; 
    
    if (onPoke) onPoke();
    if (internalState.mood) return;

    const reactions: { m: BuddyMood, t: string }[] = [
      { m: 'surprised', t: 'BEEP!' },
      { m: 'happy', t: 'BOOP!' },
      { m: 'playing', t: "ROCK ON" },
      { m: 'surprised', t: 'WHOA' },
      { m: 'happy', t: 'NICE' },
    ];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    setInternalState({ mood: reaction.m, text: reaction.t });
    setTimeout(() => setInternalState({ mood: null, text: null }), 1500);
  };

  const activeMood = internalState.mood || mood;
  const activeMessage = internalState.text || message;

  // --- Determine Classes & Styles ---
  
  // If static (Game Mode), use simple render
  if (variant === 'static') {
      return (
        <div 
            className={className || "buddy-container-static"} 
            onClick={handlePokeClick}
        >
           <BuddyContent activeMood={activeMood} activeMessage={activeMessage} />
        </div>
      );
  }

  // Floating Logic
  const style: React.CSSProperties = hasUserMoved && position ? {
      position: 'fixed',
      left: position.x,
      top: position.y,
      bottom: 'auto',
      right: 'auto',
      transform: 'none', 
      touchAction: 'none' 
  } : {};

  const positioningClass = !hasUserMoved 
      ? (isScrolled ? 'buddy-pinned-top' : 'buddy-pinned-bottom') 
      : ''; 

  return (
    <div 
        ref={containerRef}
        className={`buddy-container ${positioningClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handlePokeClick}
    >
       <BuddyContent activeMood={activeMood} activeMessage={activeMessage} />
    </div>
  );
};

const BuddyContent: React.FC<{activeMood: BuddyMood, activeMessage: string}> = ({activeMood, activeMessage}) => (
    <div className={`
         buddy-robot-body
         ${activeMood === 'happy' ? 'buddy-body-happy' : ''}
         ${activeMood === 'playing' ? 'buddy-body-playing' : 'buddy-body-hover'}
         ${activeMood === 'listening' ? 'buddy-body-listening' : ''}
         ${activeMood === 'surprised' ? 'buddy-body-surprised' : ''}
       `}
    >
          {/* LED Screen */}
          <div className="buddy-screen">
             <div className="buddy-screen-scanlines"></div>
             <p className="buddy-led-text">
                {activeMessage ? activeMessage.toUpperCase() : "^_^"}
             </p>
          </div>
    </div>
);