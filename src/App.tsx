import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Database, Home, Volume2, VolumeX } from 'lucide-react';

import type { Question, Student, LeaderboardEntry, Card, PlayedQuestion, GameState, RollSettings, Difficulty } from './types';
import { INITIAL_STUDENTS, INITIAL_QUESTIONS, INITIAL_LEADERBOARD } from './data';
import playSound from './lib/sounds';
import Button from './components/Button';
import Background from './components/Background';
import MenuScreenComponent from './components/MenuScreen';
import TeacherDashboard from './components/TeacherDashboard';
import MagicRoller from './components/MagicRoller';
import CardGrid from './components/CardGrid';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardView from './components/LeaderboardView';


// --- SOUND UTILS ---
export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const leaderboardStorageKey = 'gameLeaderboard';

  // App Global Mutable States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const stored = window.localStorage.getItem(leaderboardStorageKey);
      return stored ? (JSON.parse(stored) as LeaderboardEntry[]) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(leaderboardStorageKey, JSON.stringify(leaderboard));
    } catch {
      // ignore storage errors in private mode or unsupported browsers
    }
  }, [leaderboard]);

  // Settings state for Generator
  const [rollSettings, setRollSettings] = useState<RollSettings>({
    minRange: 1,
    maxRange: 50,
    onlyPresent: true
  });

  // Active Session State
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [playedQuestions, setPlayedQuestions] = useState<PlayedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Card | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Magic roll final selection
  const [rollTarget, setRollTarget] = useState(1);

  const triggerMagicRoll = () => {
    // Filter candidates based on settings range and attendance
    const candidates = students.filter(s => {
      const withinRange = s.rollNo >= rollSettings.minRange && s.rollNo <= rollSettings.maxRange;
      const passAttendance = rollSettings.onlyPresent ? s.isPresent : true;
      return withinRange && passAttendance;
    });

    if (candidates.length === 0) {
      alert("No students fit the active criteria in the settings range! Check your attendance/range settings.");
      return;
    }

    const randomChoice = candidates[Math.floor(Math.random() * candidates.length)];
    setRollTarget(randomChoice.rollNo);
    setGameState('rolling');
  };

  const startGameForStudent = (rollNo: number) => {
    const studentObj = students.find(s => s.rollNo === rollNo) || students[0];
    setCurrentStudent(studentObj);

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 50);
    const cardPool: Question[] = [...shuffled];
    while (cardPool.length < 50 && cardPool.length > 0) {
      cardPool.push({ ...cardPool[Math.floor(Math.random() * cardPool.length)], id: Date.now() + Math.random() });
    }

    setAvailableCards(cardPool.map((q, i) => ({ ...q, cardNo: i + 1, isUsed: false })));
    setPlayedQuestions([]);
    setScore(0);
    setCorrectCount(0);
    setGameState('cards');
  };

  const handleCardSelect = (cardIndex: number) => {
    if (playedQuestions.length >= 10) return;
    if (cardIndex < 0 || cardIndex >= availableCards.length) return;

    const newCards = [...availableCards];
    const selectedCard = newCards[cardIndex];
    selectedCard.isUsed = true;
    setAvailableCards(newCards);

    setCurrentQuestion(selectedCard);
    setGameState('quiz');
  };

  const handleAnswer = (isCorrect: boolean, difficulty: Difficulty) => {
    if (!currentQuestion) return;
    if (soundEnabled) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }

    const points = difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1;
    const newScore = score + (isCorrect ? points : 0);
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);

    setScore(newScore);
    setCorrectCount(newCorrectCount);

    const updatedPlayed = [...playedQuestions, { ...currentQuestion, isCorrect }];
    setPlayedQuestions(updatedPlayed);

    setTimeout(() => {
      if (updatedPlayed.length >= 10) {
        finishGame(newScore, newCorrectCount);
      } else {
        setGameState('cards');
      }
    }, 2800);
  };

  const finishGame = (finalScore: number, finalCorrect: number) => {
    if (!currentStudent) return;
    const accuracy = Math.round((finalCorrect / 10) * 100);
    const newResult: LeaderboardEntry = {
      studentId: currentStudent.id,
      name: currentStudent.name,
      rollNo: currentStudent.rollNo,
      score: finalScore,
      accuracy,
      date: new Date().toISOString()
    };
    
    setLeaderboard(prev => [newResult, ...prev].sort((a,b) => b.score - a.score || b.accuracy - a.accuracy));
    setGameState('result');
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Background />
      
      {/* Global CSS Inject for Card Flip animations and shining keyframes */}
      <style>{`
        .perspective-1000 {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-30deg); }
          50% { transform: translateX(150%) skewX(-30deg); }
          100% { transform: translateX(150%) skewX(-30deg); }
        }
        .shimmer-sweep::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 200%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: sweep 3.5s infinite linear;
        }
      `}</style>

      {/* Shared Nav Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 text-cyan-400 font-black text-lg md:text-2xl tracking-wider uppercase cursor-pointer" onClick={() => setGameState('menu')}>
            <Database className="w-8 h-8 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
            <span>Lucky Roller Game</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="min-w-0 p-2"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
            </Button>
            {gameState !== 'menu' && (
              <Button variant="outline" size="sm" onClick={() => setGameState('menu')}>
                <Home className="w-4 h-4" /> Menu
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="pt-24 pb-12 min-h-screen flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <MenuScreenComponent key="menu" onNavigate={setGameState} />
          )}
          {gameState === 'dashboard' && (
            <TeacherDashboard 
              key="dashboard" 
              students={students}
              setStudents={setStudents}
              questions={questions}
              setQuestions={setQuestions}
              leaderboard={leaderboard}
              setLeaderboard={setLeaderboard}
              rollSettings={rollSettings}
              setRollSettings={setRollSettings}
              onTriggerRoll={triggerMagicRoll}
            />
          )}
          {gameState === 'rolling' && (
            <MagicRoller key="rolling" targetRoll={rollTarget} onComplete={() => startGameForStudent(rollTarget)} />
          )}
          {gameState === 'cards' && (
            <CardGrid key="cards" cards={availableCards} onSelect={handleCardSelect} student={currentStudent} playedCount={playedQuestions.length} />
          )}
          {gameState === 'quiz' && currentQuestion && (
            <QuizScreen key="quiz" question={currentQuestion} onAnswer={handleAnswer} currentQNumber={playedQuestions.length + 1} />
          )}
          {gameState === 'result' && currentStudent && (
            <ResultScreen key="result" student={currentStudent} score={score} correct={correctCount} onFinish={() => setGameState('dashboard')} />
          )}
          {gameState === 'leaderboard' && (
            <LeaderboardView key="leaderboard" data={leaderboard} onBack={() => setGameState('menu')} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

