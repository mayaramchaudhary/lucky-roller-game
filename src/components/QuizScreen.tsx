import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Database, Zap, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { QuizScreenProps, Difficulty } from '../types';
import playSound from '../lib/sounds';

const QuizScreen = ({ question, onAnswer, currentQNumber }: QuizScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [used5050, setUsed5050] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);

  useEffect(() => {
    if (isRevealed) return;
    if (timeLeft === 0) {
      handleOptionSelect('TIMEOUT');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRevealed]);

  const handleOptionSelect = (option: string) => {
    if (isRevealed) return;
    setSelectedOption(option);
    setIsRevealed(true);
    const isCorrect = option === question.correctAnswer;
    onAnswer(isCorrect, question.difficulty);
  };

  const use5050Lifeline = () => {
    if (used5050 || isRevealed) return;
    setUsed5050(true);
    playSound('tick');

    const wrongOptions = question.options.filter(opt => opt !== question.correctAnswer);
    const shuffled = wrongOptions.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0], shuffled[1]]);
  };

  const diffColors: Record<Difficulty, string> = {
    Easy: 'text-green-400 bg-green-400/10 border-green-400/30',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30'
  };

  const pointsMap: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, rotateX: -10 }} 
      animate={{ opacity: 1, scale: 1, rotateX: 0 }} 
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative"
    >
      <div className="bg-slate-800/80 p-6 flex flex-wrap justify-between items-center border-b border-slate-700/65 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-950 text-cyan-400 font-bold px-4 py-2 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            Question {currentQNumber} of 10
          </div>
          <div className={`font-medium px-3 py-1 rounded-full border text-sm flex items-center gap-1 ${diffColors[question.difficulty]}`}>
            <Zap className="w-4 h-4" /> {question.difficulty} (+{pointsMap[question.difficulty]})
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={use5050Lifeline}
            disabled={used5050 || isRevealed}
            className={`font-bold px-4 py-2 rounded-lg transition-all text-xs md:text-sm ${used5050 ? 'bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed' : 'bg-indigo-900/50 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-800/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}
          >
            50:50 Lifeline
          </button>
          <div className={`flex items-center gap-2 font-mono text-xl md:text-2xl font-black px-5 py-2 rounded-xl border shadow-lg transition-colors duration-300 ${timeLeft <= 5 ? 'text-rose-500 bg-rose-500/10 border-rose-500/50 animate-pulse' : 'text-cyan-400 bg-cyan-950 border-cyan-500/30'}`}>
            <Clock className="w-5 h-5" />
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-slate-800">
        <motion.div 
          className={`h-full ${timeLeft <= 5 ? 'bg-rose-500' : 'bg-cyan-500'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <div className="p-8 md:p-12">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" /> Topic: {question.topic}
        </h3>
        <h2 className="text-xl md:text-3xl font-bold text-white mb-10 leading-tight">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            const isHidden = hiddenOptions.includes(option);
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === question.correctAnswer;

            let btnClass = 'bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]';
            let icon = null;

            if (isRevealed) {
              if (isCorrectAnswer) {
                btnClass = 'bg-green-600/20 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.02] z-10';
                icon = <CheckCircle className="w-6 h-6" />;
              } else if (isSelected) {
                btnClass = 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
                icon = <XCircle className="w-6 h-6" />;
              } else {
                btnClass = 'bg-slate-900/30 border-slate-800/50 text-slate-500 opacity-40';
              }
            } else if (isSelected) {
              btnClass = 'bg-cyan-900 border-cyan-400 text-white';
            }

            if (isHidden) {
              return (
                <div key={idx} className="h-16 md:h-20 bg-slate-900/20 border border-slate-950 rounded-xl" />
              );
            }

            return (
              <button
                key={idx}
                disabled={isRevealed || isHidden}
                onClick={() => handleOptionSelect(option)}
                className={`group relative w-full h-16 md:h-20 px-6 rounded-xl border-2 text-left font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-between ${btnClass}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${isRevealed && isCorrectAnswer ? 'bg-green-500 text-slate-950 border-transparent' : isRevealed && isSelected ? 'bg-rose-500 text-slate-950 border-transparent' : 'border-slate-500 text-slate-400 group-hover:border-cyan-450 group-hover:text-cyan-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isRevealed && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              className={`p-6 rounded-xl border ${selectedOption === question.correctAnswer ? 'bg-green-950/20 border-green-900/50' : 'bg-rose-950/20 border-rose-900/50'}`}
            >
              <h4 className="font-bold flex items-center gap-2 mb-2 text-white">
                <HelpCircle className={`w-5 h-5 ${selectedOption === question.correctAnswer ? 'text-green-400' : 'text-rose-400'}`} /> 
                {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                <span className="text-slate-400 font-bold">Explanation:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizScreen;
