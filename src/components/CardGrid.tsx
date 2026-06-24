import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { CardGridProps } from '../types';
import playSound from '../lib/sounds';

const CardGrid = ({ cards, onSelect, student, playedCount }: CardGridProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      <div className="flex flex-col md:flex-row justify-between w-full mb-8 items-center bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            {student?.rollNo}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{student?.name}</h2>
            <p className="text-cyan-400 text-sm font-medium">Select a lucky number to flip open your MCQ question!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Progression</div>
          <div className="text-3xl font-black text-white">
            <span className="text-cyan-400 font-mono">{10 - playedCount}</span> / 10 Remaining
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 md:gap-4 w-full perspective-1000">
        {cards.map((card, idx) => {
          return (
            <div 
              key={card.cardNo} 
              className="relative aspect-square cursor-pointer"
              onClick={() => {
                if (!card.isUsed) {
                  playSound('tick');
                  onSelect(idx);
                }
              }}
            >
              <motion.div
                whileHover={!card.isUsed ? { rotateY: 180, scale: 1.08, zIndex: 10 } : {}}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`relative w-full h-full preserve-3d transition-transform duration-500 ${card.isUsed ? 'opacity-25 pointer-events-none' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-cyan-400 backface-hidden shadow-lg shimmer-sweep overflow-hidden">
                  {card.cardNo}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border-2 border-cyan-400 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white rotate-y-180 backface-hidden shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <HelpCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CardGrid;
