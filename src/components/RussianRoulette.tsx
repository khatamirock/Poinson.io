import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, RotateCcw, Target } from 'lucide-react';

type GameState = 'setup' | 'playing' | 'result';

const playSound = (type: 'click' | 'bang') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 1000;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(1, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      noise.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
      noise.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error('Audio failed', e);
  }
};

export default function RussianRoulette() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [bulletIndex, setBulletIndex] = useState<number | null>(null);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const startGame = () => {
    setIsSpinning(true);
    // Spin animation
    setTimeout(() => {
      setBulletIndex(Math.floor(Math.random() * 6));
      setCurrentChamber(0);
      setCurrentPlayer(1);
      setGameState('playing');
      setIsSpinning(false);
      setWinner(null);
    }, 1500);
  };

  const handleTrigger = () => {
    if (currentChamber === bulletIndex) {
      playSound('bang');
      setWinner(currentPlayer === 1 ? 2 : 1);
      setGameState('result');
      if (currentPlayer === 1) {
        setP2Score(prev => prev + 1);
      } else {
        setP1Score(prev => prev + 1);
      }
    } else {
      playSound('click');
      setCurrentChamber(prev => prev + 1);
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setBulletIndex(null);
    setCurrentChamber(0);
    setCurrentPlayer(1);
    setWinner(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {gameState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full max-w-lg mx-auto text-center"
            >
              <div className="w-24 h-24 bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mb-8 transform rotate-45">
                <Target className="text-rose-500 transform -rotate-45" size={40} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Russian Roulette</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
                Six chambers. One bullet. Two players.<br/>Take turns testing your luck.
              </p>
              
              <button
                onClick={startGame}
                disabled={isSpinning}
                className="group relative px-8 py-4 bg-rose-500/10 border border-rose-500/50 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-rose-500/20 group-hover:bg-rose-500/40 transition-colors"></div>
                <div className="absolute top-0 -left-2 -right-2 h-1 bg-rose-500 group-hover:bg-rose-400 transition-colors"></div>
                <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-rose-100 group-hover:text-white transition-colors">
                  {isSpinning ? 'Loading Chamber...' : 'Spin the Cylinder'}
                </span>
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">
                  Player {currentPlayer} <span className={currentPlayer === 1 ? 'text-emerald-400' : 'text-purple-400'}>/ TURN</span>
                </h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">Pull the trigger if you dare.</p>
              </div>

              <div className="relative mb-16">
                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center relative">
                  {/* Cylinder holes */}
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const angle = (idx * 60) * (Math.PI / 180);
                    const radius = 60; // relative to center
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <div 
                        key={idx}
                        className={`absolute w-12 h-12 rounded-full border-2 ${idx === currentChamber ? 'border-rose-500 bg-rose-500/10' : 'border-slate-800 bg-slate-950'}`}
                        style={{
                          transform: `translate(${x}px, ${y}px)`
                        }}
                      >
                        {idx === currentChamber && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700"></div>
                </div>
              </div>

              <button
                onClick={handleTrigger}
                className="px-12 py-4 border border-rose-500 bg-rose-900/20 hover:bg-rose-900/40 transition-colors text-rose-300 font-bold tracking-widest uppercase text-sm"
              >
                Pull Trigger
              </button>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex flex-col items-center w-full relative"
            >
              <motion.div 
                initial={{ x: 0, y: 0 }}
                animate={{ 
                  x: [0, -10, 10, -5, 5, 0], 
                  y: [0, 10, -10, 5, -5, 0] 
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center text-center z-10"
              >
                <div className="w-24 h-24 bg-red-950 border-2 border-red-500 flex items-center justify-center mb-8 relative">
                  <Skull className="text-red-500 transform -rotate-45" size={40} />
                </div>
                <motion.h2 
                  initial={{ color: "#f87171", scale: 1 }}
                  animate={{ color: "#ef4444", scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl sm:text-7xl font-bold tracking-widest uppercase text-red-500 mb-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                >
                  Bang!
                </motion.h2>
                <p className="text-red-200/80 text-sm tracking-widest uppercase mb-12 bg-red-950/50 px-4 py-2 border border-red-900/50">
                  Player {currentPlayer} was eliminated. Player {winner} wins!
                </p>
              </motion.div>
              
              {/* Minimal blood splatter overlays to reduce lag */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50 mix-blend-overlay">
                <div className="absolute top-10 left-10 w-24 h-24 bg-red-600 rounded-full blur-md" />
                <div className="absolute bottom-10 right-20 w-32 h-32 bg-red-700 rounded-full blur-md" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-900/10" />
              </div>
              
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700 relative z-10"
              >
                <RotateCcw size={16} /> Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1 Score</span>
            <span className="text-xl font-mono text-emerald-500">{p1Score.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2 Score</span>
            <span className="text-xl font-mono text-purple-400">{p2Score.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex-col hidden sm:flex">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Round</span>
            <span className="text-xl font-mono text-rose-500">{currentChamber + 1}/6</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}
