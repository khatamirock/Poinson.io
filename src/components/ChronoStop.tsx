import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Timer } from 'lucide-react';

type GameState = 'setup' | 'playing' | 'result';

export default function ChronoStop() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [p1Time, setP1Time] = useState<number | null>(null);
  const [p2Time, setP2Time] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState<number>(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const [targetTime, setTargetTime] = useState(7000);

  const VISIBLE_TIME = 2500;

  const startGame = () => {
    // Generate a random target time between 7.000 and 13.000 seconds in whole seconds
    const randomTarget = (Math.floor(Math.random() * 7) + 7) * 1000;
    setTargetTime(randomTarget);
    
    setGameState('playing');
    setP1Time(null);
    setP2Time(null);
    setDisplayTime(0);
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      setDisplayTime(elapsed);
      if (elapsed < VISIBLE_TIME) {
        rafRef.current = requestAnimationFrame(updateTimer);
      }
    };
    rafRef.current = requestAnimationFrame(updateTimer);
  };

  const handleStop = (player: 1 | 2) => {
    if (gameState !== 'playing') return;
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    
    if (player === 1 && p1Time === null) setP1Time(elapsed);
    if (player === 2 && p2Time === null) setP2Time(elapsed);
  };

  useEffect(() => {
    if (p1Time !== null && p2Time !== null && gameState === 'playing') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setGameState('result');
      
      const p1Diff = Math.abs(p1Time - targetTime);
      const p2Diff = Math.abs(p2Time - targetTime);
      
      if (p1Diff < p2Diff) setP1Score(s => s + 1);
      else if (p2Diff < p1Diff) setP2Score(s => s + 1);
    }
  }, [p1Time, p2Time, gameState]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(3);
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
              <div className="w-24 h-24 bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center mb-8 rounded-full">
                <Timer className="text-orange-500" size={40} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Chrono Stop</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
                Stop your clock exactly at the target time. <br/>The timer goes dark after 2.5 seconds. Trust your inner rhythm.
              </p>
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-orange-500/10 border border-orange-500/50 hover:bg-orange-500/20 transition-all text-xs font-bold tracking-widest uppercase text-orange-200 hover:text-white"
              >
                Initiate Sequence
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-between w-full h-full py-8"
            >
              {/* Central Timer */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <h3 className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">Target: {formatTime(targetTime)}s</h3>
                <div className={`text-6xl sm:text-8xl font-mono tracking-tighter ${displayTime >= VISIBLE_TIME ? 'text-slate-900 drop-shadow-none' : 'text-orange-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.6)]'}`}>
                  {formatTime(Math.min(displayTime, VISIBLE_TIME))}
                </div>
              </div>

              {/* Player 1 Area */}
              <div className="flex-1 w-full flex items-center justify-center p-4">
                {p1Time === null ? (
                  <button
                    onClick={() => handleStop(1)}
                    className="w-full h-full max-h-48 border-2 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 active:bg-emerald-500/40 transition-colors flex items-center justify-center rounded-2xl group"
                  >
                    <span className="text-2xl sm:text-4xl font-light uppercase tracking-widest text-emerald-500/50 group-active:text-emerald-300">P1 STOP</span>
                  </button>
                ) : (
                  <div className="w-full h-full max-h-48 flex items-center justify-center border-2 border-emerald-900/50 bg-emerald-950/10 rounded-2xl">
                    <span className="text-emerald-700 text-2xl uppercase tracking-widest font-bold">Locked</span>
                  </div>
                )}
              </div>

              {/* Player 2 Area */}
              <div className="flex-1 w-full flex items-center justify-center p-4">
                {p2Time === null ? (
                  <button
                    onClick={() => handleStop(2)}
                    className="w-full h-full max-h-48 border-2 border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 active:bg-purple-500/40 transition-colors flex items-center justify-center rounded-2xl group"
                  >
                    <span className="text-2xl sm:text-4xl font-light uppercase tracking-widest text-purple-500/50 group-active:text-purple-300">P2 STOP</span>
                  </button>
                ) : (
                  <div className="w-full h-full max-h-48 flex items-center justify-center border-2 border-purple-900/50 bg-purple-950/10 rounded-2xl">
                    <span className="text-purple-700 text-2xl uppercase tracking-widest font-bold">Locked</span>
                  </div>
                )}
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
              <div className="w-24 h-24 border-2 border-slate-700 bg-slate-800 flex items-center justify-center mb-8 rounded-full">
                <Timer className={`text-slate-300`} size={40} />
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-light tracking-widest uppercase mb-12 text-slate-200">
                {Math.abs(p1Time! - targetTime) < Math.abs(p2Time! - targetTime) ? (
                  <>Player 1 <span className="text-emerald-500 font-bold">Wins</span></>
                ) : Math.abs(p2Time! - targetTime) < Math.abs(p1Time! - targetTime) ? (
                  <>Player 2 <span className="text-purple-500 font-bold">Wins</span></>
                ) : (
                  <>It's a <span className="text-slate-400 font-bold">Tie</span></>
                )}
              </h2>

              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mb-12 w-full justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Player 1 Time</span>
                  <span className="text-3xl font-mono text-emerald-400">{formatTime(p1Time!)}s</span>
                  <span className="text-xs text-emerald-500/50 mt-1 uppercase tracking-widest">
                    Diff: {formatTime(Math.abs(p1Time! - targetTime))}s
                  </span>
                </div>
                
                <div className="w-px bg-slate-800 hidden sm:block"></div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Player 2 Time</span>
                  <span className="text-3xl font-mono text-purple-400">{formatTime(p2Time!)}s</span>
                  <span className="text-xs text-purple-500/50 mt-1 uppercase tracking-widest">
                    Diff: {formatTime(Math.abs(p2Time! - targetTime))}s
                  </span>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
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
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}
