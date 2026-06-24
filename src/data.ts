import type { Student, Question, LeaderboardEntry } from './types';

export const TOPICS = [
  "ER Model", "Keys", "SQL", "Normalization", "Transactions", 
  "Concurrency", "Indexing", "Relational Algebra", "Architecture"
];

export const INITIAL_STUDENTS: Student[] = Array.from({ length: 41 }, (_, i) => ({
  id: i + 1,
  rollNo: i + 1,
  name: `Student ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  class: '10',
  section: i % 2 === 0 ? 'IT' : 'IT',
  isPresent: true
}));

export const INITIAL_QUESTIONS: Question[] = [
  {
    "id": 1,
    "topic": "Introduction to DBMS",
    "difficulty": "Easy",
    "question": "What is DBMS?",
    "options": [
      "Database Management System",
      "Data Backup Management System",
      "Digital Base Management System",
      "Data Building Management System"
    ],
    "correctAnswer": "Database Management System",
    "explanation": "DBMS is software used to create, store, manage and retrieve data in databases."
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  // { studentId: 5, name: "Student E5", rollNo: 5, score: 28, accuracy: 95, date: new Date().toISOString() },
  // { studentId: 12, name: "Student L12", rollNo: 12, score: 24, accuracy: 80, date: new Date().toISOString() },
  // { studentId: 3, name: "Student C3", rollNo: 3, score: 21, accuracy: 70, date: new Date().toISOString() },
];
