import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Zap } from 'lucide-react';

type GameState = 'setup' | 'waiting' | 'draw' | 'result';

export default function QuickDraw() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [falseStartPlayer, setFalseStartPlayer] = useState<1 | 2 | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState('waiting');
    setWinner(null);
    setFalseStartPlayer(null);
    setReactionTime(null);
    
    // Random delay between 3 to 7 seconds
    const delay = Math.floor(Math.random() * 4000) + 3000;
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setGameState('draw');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleShoot = (player: 1 | 2) => {
    if (gameState === 'waiting') {
      // False start
      if (timerRef.current) clearTimeout(timerRef.current);
      setFalseStartPlayer(player);
      const winnerPlayer = player === 1 ? 2 : 1;
      setWinner(winnerPlayer);
      setGameState('result');
      if (winnerPlayer === 1) setP1Score(prev => prev + 1);
      else setP2Score(prev => prev + 1);
    } else if (gameState === 'draw') {
      // Valid shot
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setWinner(player);
      setGameState('result');
      if (player === 1) setP1Score(prev => prev + 1);
      else setP2Score(prev => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        
        {gameState === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            <div className="w-24 h-24 bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mb-8 transform rotate-45">
              <Zap className="text-amber-500 transform -rotate-45" size={40} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Quick Draw</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
              Wait for the signal. First to strike survives. Do not shoot early.
            </p>
            
            <button
              onClick={startGame}
              className="px-8 py-4 bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 transition-all text-xs font-bold tracking-widest uppercase text-amber-100 hover:text-white"
            >
              Enter the Standoff
            </button>
          </motion.div>
        )}

        {(gameState === 'waiting' || gameState === 'draw') && (
          <div className="w-full h-full flex flex-col sm:flex-row gap-4 relative">
            {/* The Signal in the middle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <AnimatePresence>
                {gameState === 'draw' ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-red-600 border-8 border-red-500 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)]"
                  >
                    <span className="text-4xl sm:text-6xl font-bold tracking-widest text-white uppercase drop-shadow-lg">Fire!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-slate-700 flex items-center justify-center"
                  >
                    <span className="text-xl font-bold tracking-widest text-slate-600 uppercase">Wait</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Player 1 Button */}
            <button
              onClick={() => handleShoot(1)}
              className="flex-1 border-2 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 active:bg-emerald-500/40 transition-colors flex items-center justify-center group"
            >
              <span className="text-2xl sm:text-4xl font-light uppercase tracking-widest text-emerald-500/50 group-active:text-emerald-300">P1 Fire</span>
            </button>

            {/* Player 2 Button */}
            <button
              onClick={() => handleShoot(2)}
              className="flex-1 border-2 border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 active:bg-purple-500/40 transition-colors flex items-center justify-center group"
            >
              <span className="text-2xl sm:text-4xl font-light uppercase tracking-widest text-purple-500/50 group-active:text-purple-300">P2 Fire</span>
            </button>
          </div>
        )}

        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center w-full max-w-lg"
          >
            <div className="w-24 h-24 border-2 border-slate-700 bg-slate-800 flex items-center justify-center mb-8 rotate-45">
              <Zap className={`transform -rotate-45 ${winner === 1 ? 'text-emerald-500' : 'text-purple-500'}`} size={40} />
            </div>
            
            <h2 className={`text-4xl sm:text-5xl font-light tracking-widest uppercase mb-3 ${winner === 1 ? 'text-emerald-500' : 'text-purple-500'}`}>
              Player {winner} Wins
            </h2>
            
            <div className="h-16 mb-8 flex items-center justify-center">
              {falseStartPlayer ? (
                <p className="text-red-400 text-sm tracking-widest uppercase bg-red-950/50 px-4 py-2 border border-red-900/50">
                  Player {falseStartPlayer} false started!
                </p>
              ) : (
                <p className="text-amber-400 text-lg tracking-widest uppercase font-mono bg-amber-950/30 px-6 py-2 border border-amber-900/50">
                  Reaction: {reactionTime}ms
                </p>
              )}
            </div>
            
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
            >
              <RotateCcw size={16} /> Draw Again
            </button>
          </motion.div>
        )}

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
