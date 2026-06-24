import type { ButtonProps } from '../types';
import { playSound } from '../lib/sounds';

const Button = ({
  children,
  onClick,
  className = "",
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  const baseStyles = "relative font-bold rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] border border-cyan-400/40",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 hover:border-slate-600",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-400/40",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] border border-rose-400/40",
    outline: "bg-transparent text-cyan-400 border-2 border-cyan-500/50 hover:bg-cyan-950/30"
  } as const;
  const sizes = {
    sm: "px-3 py-1.5 text-xs md:text-sm",
    md: "px-5 py-2.5 text-sm md:text-base",
    lg: "px-7 py-3.5 text-lg"
  } as const;

  return (
    <button 
      type={type}
      onClick={() => {
        playSound('tick');
        onClick && onClick();
      }} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <div className="absolute inset-0 bg-white/10 translate-y-[-100%] hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
      {children}
    </button>
  );
};

export default Button;
