import { motion } from 'framer-motion';
import { Award, ChevronRight } from 'lucide-react';
import type { ResultScreenProps } from '../types';
import Button from './Button';

const ResultScreen = ({ student, score, correct, onFinish }: ResultScreenProps) => {
  const accuracy = Math.round((correct / 10) * 100);
  
  let grade = 'C';
  let color = 'text-orange-400';
  let border = 'border-orange-500/50';
  let message = 'Keep studying! Try again.';
  
  if (accuracy >= 90) { grade = 'A+'; color = 'text-cyan-400'; border = 'border-cyan-500'; message = 'Masterful performance!'; }
  else if (accuracy >= 80) { grade = 'A'; color = 'text-green-400'; border = 'border-green-500'; message = 'Excellent work!'; }
  else if (accuracy >= 70) { grade = 'B+'; color = 'text-yellow-400'; border = 'border-yellow-500'; message = 'Impressive effort!'; }
  else if (accuracy >= 60) { grade = 'B'; color = 'text-blue-400'; border = 'border-blue-500'; message = 'Well done!'; }

  const isHighScorer = accuracy >= 80;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-850 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative"
    >
      {isHighScorer && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
           {Array.from({length: 25}).map((_, i) => (
             <motion.div
               key={i}
               className={`absolute w-1.5 h-6 rounded-full ${['bg-yellow-400', 'bg-cyan-400', 'bg-pink-400', 'bg-green-400'][i%4]}`}
               initial={{ top: -50, left: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
               animate={{ top: '120%', rotate: Math.random() * 720 }}
               transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay: Math.random() * 1.5 }}
             />
           ))}
        </div>
      )}

      <div className="p-10 md:p-14 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Award className={`w-20 h-20 mx-auto mb-4 ${color} drop-shadow-[0_0_20px_currentColor]`} />
          <h2 className="text-4xl font-black text-white mb-2 tracking-wider">GAME OVER</h2>
          <p className="text-lg text-slate-400 font-medium">Congrats to {student?.name} (Roll: {student?.rollNo})</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800"
          >
            <div className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Accumulated Score</div>
            <div className={`text-5xl font-black ${color}`}>{score}</div>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800"
          >
            <div className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Accuracy</div>
            <div className={`text-5xl font-black ${color}`}>{accuracy}%</div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, type: 'spring' }}
          className={`inline-block border-4 ${border} rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 bg-slate-950 shadow-[0_0_35px_currentColor]`}
          style={{ color: color.replace('text-', '') }}
        >
          <div className="text-center">
            <div className={`text-5xl font-black ${color}`}>{grade}</div>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="text-xl font-bold text-white mb-10"
        >
          {message}
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
          <Button size="lg" onClick={onFinish} className="w-full">
            Back to Teacher Panel <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
