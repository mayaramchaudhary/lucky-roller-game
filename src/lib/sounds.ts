import type { SoundType } from '../types';

export const playSound = (type: SoundType) => {
  try {
    const AudioConstructor = (window.AudioContext || (window as any).webkitAudioContext) as { new (): AudioContext } | undefined;
    if (!AudioConstructor) return;
    const audioCtx = new AudioConstructor();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'tick') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(650, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.04);
    } else if (type === 'correct') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'wrong') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(250, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.35);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'spin') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99].forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gn = audioCtx.createGain();
        osc.connect(gn);
        gn.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gn.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.0);
      });
    }
  } catch(e) {
    console.log("Audio muted/unsupported");
  }
};

export default playSound;
