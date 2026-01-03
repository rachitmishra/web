import { useState, useMemo } from "react";
import { Book, RefreshCcw, Home, XCircle, CheckCircle } from "../components/Icons";
import Button from "../components/Button";
import type { LearningData, Vocab } from "../data";

interface WordBankProps {
  completedDays: number[];
  learningData: LearningData[];
  onBack: () => void;
}

export default function WordBank({ completedDays, learningData, onBack }: WordBankProps) {
  const [viewMode, setViewMode] = useState<"list" | "game">("list");
  const [expandedWordKey, setExpandedWordKey] = useState<string | null>(null);

  // --- Game State ---
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 1. Filter learned words based on completedDays
  const learnedWords = useMemo(() => {
    // completedDays contains indices of completed days.
    // We need to map these indices to the actual day data.
    // Assuming completedDays stores the index in LEARNING_DATA array.
    const relevantDays = completedDays.map(index => learningData[index]).filter(Boolean);
    
    // Group by day for the List View
    const grouped = relevantDays.map(day => ({
        title: day.title,
        vocab: day.vocab
    }));

    // Flat list for the Game View
    const flat = relevantDays.flatMap(day => day.vocab);
    
    return { grouped, flat };
  }, [completedDays, learningData]);

  // 2. Initialize Game
  const startGame = () => {
    if (learnedWords.flat.length < 4) {
        alert("Learn more words to start the game! (Need at least 4)");
        return;
    }
    
    // Shuffle and pick 10 words (or less if fewer available)
    const shuffled = [...learnedWords.flat].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    // Generate questions for each selected word
    const questions = selected.map(word => {
        // Randomly decide direction: Kannada -> English or English -> Kannada
        const isKannadaQuestion = Math.random() > 0.5;
        const questionText = isKannadaQuestion ? word.kannada : word.english;
        const correctAnswer = isKannadaQuestion ? word.english : word.kannada;
        
        // Generate distractors
        const distractors = learnedWords.flat
            .filter(w => w.id !== word.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => isKannadaQuestion ? w.english : w.kannada);
            
        const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
        
        return {
            question: questionText,
            correctAnswer,
            options
        };
    });

    setGameWords(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setViewMode("game");
  };

  const handleOptionClick = (option: string) => {
      if (selectedOption) return; // Prevent multiple clicks
      
      const currentQ = gameWords[currentQuestionIndex];
      const correct = option === currentQ.correctAnswer;
      
      setSelectedOption(option);
      setIsCorrect(correct);
      
      if (correct) setScore(s => s + 1);
      
      // Auto advance
      setTimeout(() => {
          if (currentQuestionIndex < gameWords.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
              setSelectedOption(null);
              setIsCorrect(null);
          } else {
              setShowResult(true);
          }
      }, 1500);
  };

  if (viewMode === "game") {
      if (showResult) {
          return (
              <div className="word-bank-container">
                  <div className="wb-header">
                      <h2 className="wb-title">Game Over!</h2>
                  </div>
                  <div className="wb-result-card">
                      <div className="wb-score">{score} / {gameWords.length}</div>
                      <p className="wb-score-label">Correct Answers</p>
                      
                      <div className="wb-actions">
                          <Button onClick={startGame} variant="primary" fullWidth>
                              <RefreshCcw size={18} /> Play Again
                          </Button>
                          <Button onClick={() => setViewMode("list")} variant="neutral" fullWidth>
                              <Book size={18} /> Review Words
                          </Button>
                      </div>
                  </div>
              </div>
          );
      }

      const currentQ = gameWords[currentQuestionIndex];
      return (
          <div className="word-bank-container">
              <div className="wb-header">
                  <Button onClick={() => setViewMode("list")} variant="neutral"><XCircle size={20}/></Button>
                  <span className="wb-progress">{currentQuestionIndex + 1} / {gameWords.length}</span>
              </div>
              
              <div className="wb-game-card">
                  <h3 className="wb-question">{currentQ.question}</h3>
                  <div className="wb-options-grid">
                      {currentQ.options.map((opt: string, idx: number) => {
                          let btnVariant: "neutral" | "primary" | "danger" | "surface" = "surface";
                          if (selectedOption) {
                              if (opt === currentQ.correctAnswer) btnVariant = "primary"; // Show correct
                              else if (opt === selectedOption && !isCorrect) btnVariant = "danger"; // Show wrong
                          }
                          
                          return (
                              <button 
                                key={idx}
                                className={`wb-option-btn ${btnVariant}`}
                                onClick={() => handleOptionClick(opt)}
                                disabled={!!selectedOption}
                              >
                                  {opt}
                                  {selectedOption && opt === currentQ.correctAnswer && <CheckCircle size={16} />}
                              </button>
                          )
                      })}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="word-bank-container">
      <div className="wb-header-main">
        <Button onClick={onBack} variant="neutral"><Home size={18} /></Button>
        <h2 className="wb-title-main">My Word Bank</h2>
        <div style={{ width: 40 }}></div> {/* Spacer */}
      </div>

      <div className="wb-actions-main">
          <div className="wb-stat-pill">
              <Book size={16} /> {learnedWords.flat.length} Words Learned
          </div>
          <Button onClick={startGame} variant="primary">
              Play Quiz
          </Button>
      </div>

      <div className="wb-list-area">
          {learnedWords.grouped.length === 0 ? (
              <div className="wb-empty-state">
                  <p>Complete your first day to see words here!</p>
              </div>
          ) : (
              learnedWords.grouped.map((group, gIdx) => (
                  <div key={gIdx} className="wb-group">
                      <h3 className="wb-group-title">{group.title}</h3>
                      <div className="wb-words-grid">
                          {group.vocab.map((word: Vocab) => {
                              const uniqueKey = `${gIdx}-${word.id}`;
                              const isExpanded = expandedWordKey === uniqueKey;
                              return (
                                  <div 
                                    key={uniqueKey} 
                                    className={`wb-word-card ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => setExpandedWordKey(isExpanded ? null : uniqueKey)}
                                  >
                                      <div className="wb-card-content">
                                          <div className="wb-word-front">
                                              <span className="wb-kannada">{word.kannada}</span>
                                          </div>
                                          <div className="wb-word-drawer">
                                              <div className="wb-word-details">
                                                  <div className="wb-english">{word.english}</div>
                                                  <div className="wb-phonetic">{word.phonetic}</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
