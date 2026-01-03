export interface Vocab {
  id: number;
  kannada: string;
  english: string;
  hindi?: string; // Added hindi property
  phonetic: string;
}

export interface ScenarioOption {
  text: string;
  correct: boolean;
  explanation?: string;
  newWords?: { word: string; meaning: string }[];
}

export interface Scenario {
  context: string;
  options: ScenarioOption[];
}

export interface Strategy {
  title: string;
  tips: string[];
}

export interface LearningData {
  day: number;
  week: number;
  level: number;
  title: string;
  badgeReward: string | null;
  strategy: Strategy;
  vocab: Vocab[];
  scenarios: Scenario[];
  lang?: SupportedLanguage; // Added language property
}

export type SupportedLanguage = "english" | "hindi";
