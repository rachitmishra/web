export interface Note {
  note: string;
  freq: number;
  type: 'white' | 'black';
  label: string;
}

export interface CurriculumItem {
  id: number;
  title: string;
  desc: string;
  color: string;
  unlockedAt: number;
  tasks: string[];
}

export interface Song {
  id: string;
  title: string;
  notes: string[]; // Sequence of notes e.g., ["C", "C", "G", "G"]
  difficulty: 'easy' | 'medium' | 'hard';
}

export type InputType = 'touch' | 'mic' | 'midi';
export type BuddyMood = 'idle' | 'happy' | 'playing' | 'listening' | 'surprised';