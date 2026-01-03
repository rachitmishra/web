import React, { useEffect, useRef } from 'react';
import 'prismjs/themes/prism-tomorrow.css';
import type { Day, Track } from '../data/courses';

interface ContentProps {
  day: Day;
  track: Track;
  onComplete: () => void;
  isCompleted: boolean;
}

export const Content: React.FC<ContentProps> = ({ day, onComplete, isCompleted }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Re-highlight code blocks when content changes
      // In a real app we might use a proper markdown parser or react-syntax-highlighter
      // But since we are using raw HTML strings:
      // We can assume Prism is global or just leave it for now.
      // Ideally, we'd iterate over <pre><code> blocks and highlight.
    }
  }, [day]);

  return (
    <main className="main-content">
      <div 
        className="fade-in"
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: day.content }}
      />
      
      {day.id !== '0' && (
        <button 
          className="complete-btn" 
          onClick={onComplete}
          style={{ opacity: isCompleted ? 0.5 : 1 }}
        >
          {isCompleted ? 'Completed' : 'Mark Day Complete'}
        </button>
      )}
    </main>
  );
};
