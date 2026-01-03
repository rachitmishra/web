import { useState } from 'react';
import { X } from './Icons';

interface Vocab {
  id: number;
  kannada: string;
  english: string;
  phonetic: string;
}

interface ClickableSentenceProps {
  text: string;
  vocab: Vocab[];
}

export default function ClickableSentence({ text, vocab }: ClickableSentenceProps) {
  const [selectedWord, setSelectedWord] = useState<Vocab | null>(null);

  const words = text.split(/(\s+|[.,!?;])/);

  const getVocabMatch = (word: string) => {
    const clean = word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return null;
    return vocab.find(v => 
        v.english.toLowerCase() === clean
    );
  };

  return (
    <>
      <p className="context-text">
        {words.map((part, i) => {
            const match = getVocabMatch(part);
            if (match) {
                return (
                    <span 
                        key={i} 
                        className="interactive-word"
                        onClick={() => setSelectedWord(match)}
                        style={{ 
                            borderBottom: '2px dashed var(--primary)', 
                            cursor: 'pointer',
                            color: 'var(--primary-dark)' 
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        })}
      </p>

      {selectedWord && (
          <div className="habit-nudge-overlay" onClick={() => setSelectedWord(null)}>
            <div className="habit-nudge-modal" onClick={e => e.stopPropagation()}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{margin: 0, color: 'var(--primary)'}}>{selectedWord.english}</h3>
                     <button onClick={() => setSelectedWord(null)} className="btn--icon"><X /></button>
                </div>
                <div style={{fontSize: '2rem', fontWeight: 900, margin: '1rem 0', color: 'var(--text-title)'}}>
                    {selectedWord.kannada}
                </div>
                <div style={{color: 'var(--muted-text)', fontStyle: 'italic', fontSize: '1.2rem'}}>
                    {selectedWord.phonetic}
                </div>
            </div>
          </div>
      )}
    </>
  );
}
