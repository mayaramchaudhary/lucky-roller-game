import { motion } from 'framer-motion';

const Background = () => (
  <div className="fixed inset-0 z-[-1] bg-slate-950 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,1),rgba(2,6,23,1))]" />
    <motion.div 
      animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }} 
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[130px]" 
    />
    <motion.div 
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} 
      transition={{ duration: 12, repeat: Infinity, delay: 3 }}
      className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[130px]" 
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)]" />
  </div>
);

export default Background;
