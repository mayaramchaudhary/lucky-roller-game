import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import type { MenuScreenProps } from '../types';

const MenuScreen = ({ onNavigate }: MenuScreenProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center gap-8 w-full max-w-2xl text-center"
  >
    <div className="space-y-4">
      <motion.div 
        animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block"
      >
        <Database className="w-24 h-24 text-cyan-400 mx-auto drop-shadow-[0_0_35px_rgba(34,211,238,0.6)]" />
      </motion.div>
      <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 tracking-tight pb-2">
        DBMS CHALLENGE
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">A lightweight classroom roll & quiz tool built for quick practice sessions and random student selection.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
      <button onClick={() => onNavigate('rolling')} className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black">Start Lucky Roll</button>
      <button onClick={() => onNavigate('dashboard')} className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-200 font-black">Teacher Dashboard</button>
      <button onClick={() => onNavigate('leaderboard')} className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-200 font-black border border-cyan-500">Leaderboard</button>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="mt-20"
    >
      <p className="mx-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-500/25 bg-slate-950/80 px-5 py-3 text-sm text-slate-300 shadow-[0_0_30px_rgba(14,165,233,0.16)] backdrop-blur-sm">
        <span className="font-semibold text-cyan-300">Made with</span>
        <span className="text-pink-400 animate-pulse">♥</span>
        <span className="font-semibold text-slate-100">by 
        <span className="text-slate-500">•</span>
        <a
          href="https://github.com/mayaramchaudhary"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-cyan-200 hover:text-cyan-50 transition-colors underline decoration-cyan-500/40 underline-offset-2"
        >
          MRC
        </a></span>
      </p>
    </motion.div>
  </motion.div>
);

export default MenuScreen;
