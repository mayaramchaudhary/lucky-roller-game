import { motion } from 'framer-motion';
import { Medal, Trophy, Home } from 'lucide-react';
import type { LeaderboardViewProps, LeaderboardEntry } from '../types';
import Button from './Button';

const LeaderboardView = ({ data, onBack }: LeaderboardViewProps) => {
  const sortedData = [...data].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
  const top3 = sortedData.slice(0, 3);

  const PodiumStep = ({ student, rank }: { student: LeaderboardEntry | undefined; rank: 1 | 2 | 3 }) => {
    if (!student) return <div className="w-1/3" />;
    
    const heights = { 1: 'h-48 md:h-60', 2: 'h-36 md:h-44', 3: 'h-24 md:h-32' };
    const colors = { 
      1: 'from-yellow-400 to-amber-600 shadow-[0_0_30px_rgba(250,204,21,0.4)] border-yellow-300', 
      2: 'from-slate-300 to-slate-500 shadow-[0_0_30px_rgba(148,163,184,0.25)] border-slate-300', 
      3: 'from-orange-400 to-amber-700 shadow-[0_0_30px_rgba(217,119,6,0.25)] border-orange-300' 
    };
    
    return (
      <div className="w-1/3 flex flex-col items-center justify-end px-2">
        <motion.div 
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: rank * 0.15 }}
          className="text-center mb-4 relative w-full"
        >
          {rank === 1 && <Medal className="w-10 h-10 text-yellow-400 mx-auto mb-2 drop-shadow-lg" />}
          <div className="font-bold text-white truncate text-xs md:text-sm">{student.name}</div>
          <div className="text-cyan-400 font-black text-lg md:text-xl">{student.score} pts</div>
          <div className="text-slate-550 text-xxs md:text-xs">{student.accuracy}% Acc</div>
        </motion.div>
        <motion.div 
          initial={{ height: 0 }} animate={{ height: 'auto' }} transition={{ duration: 0.8, type: 'spring' }}
          className={`w-full ${heights[rank]} bg-gradient-to-t ${colors[rank]} rounded-t-xl border-t border-l border-r relative flex justify-center pt-3`}
        >
          <div className="text-3xl md:text-5xl font-black text-white/45">{rank}</div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="w-full max-w-5xl"
    >
      <div className="text-center mb-10">
        <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">Hall of Fame</h2>
        <p className="text-slate-400 text-sm">Real-time Top assessment performers</p>
      </div>

      <div className="flex items-end justify-center w-full max-w-2xl mx-auto mb-12 h-72">
        <PodiumStep student={top3[1]} rank={2} />
        <PodiumStep student={top3[0]} rank={1} />
        <PodiumStep student={top3[2]} rank={3} />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4 pl-6 w-16">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Roll No</th>
                <th className="p-4 text-center">Accuracy</th>
                <th className="p-4 pr-6 text-right w-32">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedData.map((student, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="p-4 font-bold text-white">{student.name}</td>
                  <td className="p-4 text-slate-400 font-mono">{student.rollNo}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-green-950 text-green-400 border border-green-900/40">
                      {student.accuracy}%
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right font-black text-cyan-400 text-lg">{student.score}</td>
                </tr>
              ))}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">No sessions on record yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" /> Return to Menu
        </Button>
      </div>
    </motion.div>
  );
};

export default LeaderboardView;
