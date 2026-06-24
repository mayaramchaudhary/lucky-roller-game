import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MagicRollerProps } from '../types';
import playSound from '../lib/sounds';

const MagicRoller = ({ targetRoll, onComplete }: MagicRollerProps) => {
  const [isRolling, setIsRolling] = useState(true);
  const [displayArray, setDisplayArray] = useState<number[]>([]);

  useEffect(() => {
    if (!isRolling) return;
    const interval = setInterval(() => {
      playSound('spin');
    }, 110);
    return () => clearInterval(interval);
  }, [isRolling]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const strip = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 1);
    strip.push(targetRoll);
    setDisplayArray(strip);

    timer = setTimeout(() => {
      setIsRolling(false);
      playSound('victory');
      setTimeout(onComplete, 3500);
    }, 4500);

    return () => clearTimeout(timer);
  }, [targetRoll, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center space-y-10 relative w-full max-w-lg"
    >
      <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-amber-500 tracking-wider">
        {isRolling ? '⚡DRUM ROLLING⚡' : '🎉 LUCKY ROLL IDENTIFIED!'}
      </h2>

      <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-950 border-4 border-cyan-500/80 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.4)] overflow-hidden flex items-center justify-center">
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/4 opacity-40" />
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent bottom-1/4 opacity-40" />
        <div className="relative h-full w-full flex items-center justify-center">
          <motion.div
            animate={isRolling ? {
              y: ['0%', '-80%']
            } : {
              y: `-${((displayArray.length - 1) * 100) / displayArray.length}%`
            }}
            transition={isRolling ? {
              repeat: Infinity,
              duration: 1.2,
              ease: 'linear'
            } : {
              type: 'tween',
              duration: 1.2,
              ease: 'easeOut'
            }}
            className="flex flex-col absolute w-full"
            style={{ top: 0, height: `${displayArray.length * 100}%` }}
          >
            {displayArray.map((num, i) => (
              <div 
                key={i} 
                className="h-64 md:h-80 flex items-center justify-center text-8xl md:text-9xl font-black text-white font-mono drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {num}
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </div>

      <AnimatePresence>
        {!isRolling && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.8 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="bg-slate-900/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-green-500/50 shadow-[0_0_40px_rgba(74,222,128,0.35)]"
          >
            <p className="text-xl text-slate-300 font-medium">Get Ready,</p>
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mt-1">Student Roll No. {targetRoll}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isRolling && Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ 
            opacity: 0, 
            x: (Math.random() - 0.5) * 700, 
            y: (Math.random() - 0.5) * 600 - 100,
            scale: Math.random() * 2 + 1,
            rotate: Math.random() * 720
          }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className={`absolute w-3.5 h-3.5 rounded-sm z-0 ${['bg-red-500', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-500', 'bg-pink-500'][i%6]}`}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </motion.div>
  );
};

export default MagicRoller;
