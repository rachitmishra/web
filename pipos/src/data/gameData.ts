import { Note, CurriculumItem, Song } from '../types';

export const CURRICULUM: CurriculumItem[] = [
  // --- Month 1 ---
  {
    id: 1,
    title: "Week 1: First Steps",
    desc: "Finding Middle C and the white keys.",
    color: "bg-orange-400",
    unlockedAt: 0,
    tasks: ["Locate Middle C", "Play C-D-E", "Right Hand 5 Finger Pattern"]
  },
  {
    id: 2,
    title: "Week 2: Left Hand",
    desc: "Introducing the bass clef notes.",
    color: "bg-orange-400",
    unlockedAt: 0,
    tasks: ["Left Hand C Position", "C-B-A-G-F", "Hands Separate"]
  },
  {
    id: 3,
    title: "Week 3: Rhythm",
    desc: "Quarter, Half, and Whole notes.",
    color: "bg-orange-400",
    unlockedAt: 0,
    tasks: ["Counting 1-2-3-4", "Steady Beat", "Simple Duet"]
  },
  {
    id: 4,
    title: "Week 4: Intervals",
    desc: "Steps (2nds) and Skips (3rds).",
    color: "bg-orange-400",
    unlockedAt: 0,
    tasks: ["Identify Intervals", "Play Skips", "Ode to Joy (Snippet)"]
  },
  // --- Month 2 ---
  {
    id: 5,
    title: "Week 5: The Staff",
    desc: "Reading notes on the lines and spaces.",
    color: "bg-pink-400",
    unlockedAt: 0,
    tasks: ["Treble Clef FACE", "Treble Clef EGBDF", "Sight Reading"]
  },
  {
    id: 6,
    title: "Week 6: Black Keys",
    desc: "Sharps and Flats (Accidentals).",
    color: "bg-pink-400",
    unlockedAt: 0,
    tasks: ["Find F# and C#", "Chromatic Scale", "Key Signatures"]
  },
  {
    id: 7,
    title: "Week 7: Hands Together",
    desc: "Coordinating left and right hands.",
    color: "bg-pink-400",
    unlockedAt: 0,
    tasks: ["Parallel Motion", "Contrary Motion", "Simple Song"]
  },
  {
    id: 8,
    title: "Week 8: Chords",
    desc: "Building Triads (3 note chords).",
    color: "bg-pink-400",
    unlockedAt: 0,
    tasks: ["C Major Chord", "G Major Chord", "Block vs Broken"]
  },
  // --- Month 3 ---
  {
    id: 9,
    title: "Week 9: Scales",
    desc: "The C Major Scale and thumb tuck.",
    color: "bg-violet-400",
    unlockedAt: 0,
    tasks: ["Thumb Under", "Finger Over", "1 Octave Scale"]
  },
  {
    id: 10,
    title: "Week 10: Dynamics",
    desc: "Playing Loud (Forte) and Soft (Piano).",
    color: "bg-violet-400",
    unlockedAt: 0,
    tasks: ["Crescendo", "Diminuendo", "Expressive Playing"]
  },
  {
    id: 11,
    title: "Week 11: Minor Keys",
    desc: "The sad/serious sound of Minor.",
    color: "bg-violet-400",
    unlockedAt: 0,
    tasks: ["A Minor Scale", "Minor Triads", "Mood Change"]
  },
  {
    id: 12,
    title: "Week 12: Graduation",
    desc: "Your first recital piece.",
    color: "bg-violet-400",
    unlockedAt: 0,
    tasks: ["Full Performance", "Memorization", "Celebration!"]
  }
];

export const SONGS: Song[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle',
    difficulty: 'easy',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C']
  },
  {
    id: 'jingle',
    title: 'Jingle Bells',
    difficulty: 'easy',
    notes: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E', 'F', 'F', 'F', 'F', 'F', 'E', 'E', 'E', 'E', 'D', 'D', 'E', 'D', 'G']
  },
  {
    id: 'happy',
    title: 'Happy Birthday',
    difficulty: 'medium',
    notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F']
  },
  {
    id: 'ode',
    title: 'Ode to Joy',
    difficulty: 'medium',
    notes: ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'E', 'D', 'D']
  },
  {
    id: 'row',
    title: 'Row Row Row Your Boat',
    difficulty: 'easy',
    notes: ['C', 'C', 'C', 'D', 'E', 'E', 'D', 'E', 'F', 'G']
  },
  {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    difficulty: 'easy',
    notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G']
  },
  // --- New "Games" represented as Songs for now ---
  {
    id: 'scale_c',
    title: 'Scale Run: C Major',
    difficulty: 'easy',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'B', 'A', 'G', 'F', 'E', 'D', 'C']
  },
  {
    id: 'arpeggio_c',
    title: 'Chord Climber: C',
    difficulty: 'medium',
    notes: ['C', 'E', 'G', 'C2', 'G', 'E', 'C']
  }
];

export const NOTES: Note[] = [
  { note: 'C', freq: 261.63, type: 'white', label: 'C' },
  { note: 'C#', freq: 277.18, type: 'black', label: '' },
  { note: 'D', freq: 293.66, type: 'white', label: 'D' },
  { note: 'D#', freq: 311.13, type: 'black', label: '' },
  { note: 'E', freq: 329.63, type: 'white', label: 'E' },
  { note: 'F', freq: 349.23, type: 'white', label: 'F' },
  { note: 'F#', freq: 369.99, type: 'black', label: '' },
  { note: 'G', freq: 392.00, type: 'white', label: 'G' },
  { note: 'G#', freq: 415.30, type: 'black', label: '' },
  { note: 'A', freq: 440.00, type: 'white', label: 'A' },
  { note: 'A#', freq: 466.16, type: 'black', label: '' },
  { note: 'B', freq: 493.88, type: 'white', label: 'B' },
  { note: 'C2', freq: 523.25, type: 'white', label: 'C' },
];
