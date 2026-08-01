import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, BrainCircuit, Check, X } from 'lucide-react';

type GameState = 'setup' | 'countdown' | 'playing' | 'result';
type Equation = { text: string; isCorrect: boolean };

export default function MindClash() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [equation, setEquation] = useState<Equation | null>(null);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  const generateEquation = (): Equation => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, result;
    
    if (op === '+') {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * 40) + 10;
      result = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 40) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      result = a - b;
    } else {
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 8) + 2;
      result = a * b;
    }

    const isCorrect = Math.random() > 0.5;
    if (!isCorrect) {
      // Offset the result by 1 to 5 to make it incorrect but believable
      const offset = Math.floor(Math.random() * 5) + 1;
      result += (Math.random() > 0.5 ? offset : -offset);
    }
    
    return { text: `${a} ${op} ${b} = ${result}`, isCorrect };
  };

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
    setWinner(null);
  };

  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setEquation(generateEquation());
        setGameState('playing');
      }
    }
  }, [gameState, countdown]);

  const handleAnswer = (player: 1 | 2, answer: boolean) => {
    if (gameState !== 'playing' || !equation) return;
    
    if (answer === equation.isCorrect) {
      // Player answered correctly
      setWinner(player);
      if (player === 1) setP1Score(s => s + 1);
      else setP2Score(s => s + 1);
    } else {
      // Player answered incorrectly, opponent wins
      const opponent = player === 1 ? 2 : 1;
      setWinner(opponent);
      if (opponent === 1) setP1Score(s => s + 1);
      else setP2Score(s => s + 1);
    }
    setGameState('result');
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {gameState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center max-w-lg"
            >
              <div className="w-24 h-24 bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center mb-8 rotate-12">
                <BrainCircuit className="text-blue-500" size={40} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Mind Clash</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
                A mathematical duel. Decide if the equation is true or false. <br/>First correct answer wins. A wrong answer gives the point to the enemy.
              </p>
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-blue-500/10 border border-blue-500/50 hover:bg-blue-500/20 transition-all text-xs font-bold tracking-widest uppercase text-blue-200 hover:text-white"
              >
                Begin Clash
              </button>
            </motion.div>
          )}

          {gameState === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="text-8xl sm:text-9xl font-light text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            >
              {countdown}
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border-2 border-blue-500/50 px-8 py-6 z-20 shadow-2xl">
                <span className="text-3xl sm:text-5xl font-mono text-slate-200 tracking-tighter whitespace-nowrap">
                  {equation?.text}
                </span>
              </div>

              <div className="flex-1 flex gap-4 p-4 items-center">
                <div className="flex-1 flex flex-col gap-4 h-full max-h-96">
                  <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs font-bold">Player 1</h3>
                  <button 
                    onClick={() => handleAnswer(1, true)}
                    className="flex-1 border-2 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 flex items-center justify-center text-emerald-500/50 hover:text-emerald-400 group"
                  >
                    <Check size={48} className="group-active:scale-90 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleAnswer(1, false)}
                    className="flex-1 border-2 border-red-500/30 bg-red-950/20 hover:bg-red-900/40 flex items-center justify-center text-red-500/50 hover:text-red-400 group"
                  >
                    <X size={48} className="group-active:scale-90 transition-transform" />
                  </button>
                </div>
                
                <div className="w-16 h-full border-x border-dashed border-slate-800 opacity-50 shrink-0"></div>

                <div className="flex-1 flex flex-col gap-4 h-full max-h-96">
                  <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs font-bold">Player 2</h3>
                  <button 
                    onClick={() => handleAnswer(2, true)}
                    className="flex-1 border-2 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 flex items-center justify-center text-emerald-500/50 hover:text-emerald-400 group"
                  >
                    <Check size={48} className="group-active:scale-90 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleAnswer(2, false)}
                    className="flex-1 border-2 border-red-500/30 bg-red-950/20 hover:bg-red-900/40 flex items-center justify-center text-red-500/50 hover:text-red-400 group"
                  >
                    <X size={48} className="group-active:scale-90 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-12">
                <p className="text-slate-400 text-sm tracking-widest uppercase mb-4">Equation was <span className={equation?.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{equation?.isCorrect ? 'TRUE' : 'FALSE'}</span></p>
                <div className="text-3xl font-mono text-slate-600 line-through mb-8">{equation?.text}</div>
                
                <h2 className="text-4xl sm:text-5xl font-light tracking-widest uppercase mb-3 text-slate-200">
                  Player {winner} <span className="text-blue-500 font-bold">Wins</span>
                </h2>
              </div>
              
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
              >
                <RotateCcw size={16} /> Next Clash
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1 Score</span>
            <span className="text-xl font-mono text-blue-400">{p1Score.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2 Score</span>
            <span className="text-xl font-mono text-blue-400">{p2Score.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}
