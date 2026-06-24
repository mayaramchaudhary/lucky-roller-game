import type { ReactNode } from 'react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type SoundType = 'tick' | 'correct' | 'wrong' | 'spin' | 'victory';

export type Question = {
  id: number;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Student = {
  id: number;
  rollNo: number;
  name: string;
  class: string;
  section: string;
  isPresent: boolean;
};

export type LeaderboardEntry = {
  studentId: number;
  name: string;
  rollNo: number;
  score: number;
  accuracy: number;
  date: string;
};

export type Card = Question & {
  cardNo: number;
  isUsed: boolean;
};

export type PlayedQuestion = Card & {
  isCorrect: boolean;
};

export type QuestionForm = {
  id: number | null;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type StudentForm = {
  id: number | null;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  isPresent: boolean;
};

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export type GameState = 'menu' | 'dashboard' | 'rolling' | 'cards' | 'quiz' | 'result' | 'leaderboard';

export type RollSettings = {
  minRange: number;
  maxRange: number;
  onlyPresent: boolean;
};

export type MenuScreenProps = {
  onNavigate: (state: GameState) => void;
};

export type TeacherDashboardProps = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  leaderboard: LeaderboardEntry[];
  setLeaderboard: React.Dispatch<React.SetStateAction<LeaderboardEntry[]>>;
  rollSettings: RollSettings;
  setRollSettings: React.Dispatch<React.SetStateAction<RollSettings>>;
  onTriggerRoll: () => void;
};

export type MagicRollerProps = {
  targetRoll: number;
  onComplete: () => void;
};

export type CardGridProps = {
  cards: Card[];
  onSelect: (idx: number) => void;
  student: Student | null;
  playedCount: number;
};

export type QuizScreenProps = {
  question: Card;
  onAnswer: (isCorrect: boolean, difficulty: Difficulty) => void;
  currentQNumber: number;
};

export type ResultScreenProps = {
  student: Student;
  score: number;
  correct: number;
  onFinish: () => void;
};

export type LeaderboardViewProps = {
  data: LeaderboardEntry[];
  onBack: () => void;
};

