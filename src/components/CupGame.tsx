import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

type GameState = 'setup' | 'transition' | 'guess' | 'result';

export default function CupGame() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [venomCup, setVenomCup] = useState<number | null>(null);
  const [guessedCup, setGuessedCup] = useState<number | null>(null);
  const [isPoisoning, setIsPoisoning] = useState<number | null>(null);
  const [dealerScore, setDealerScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [cupsOrder, setCupsOrder] = useState([0, 1]);

  const handlePlayer1Select = (cupIndex: number) => {
    setIsPoisoning(cupIndex);
    setTimeout(() => {
      setVenomCup(cupIndex);
      setGameState('transition');
      setIsPoisoning(null);
    }, 1200);
  };

  const handleTransitionNext = () => {
    setGameState('guess');
  };

  const handlePlayer2Guess = (cupIndex: number) => {
    setGuessedCup(cupIndex);
    setGameState('result');
    if (cupIndex === venomCup) {
      setDealerScore(prev => prev + 1);
    } else {
      setGuestScore(prev => prev + 1);
    }
  };

  const handleShuffle = () => {
    setCupsOrder(prev => [prev[1], prev[0]]);
  };

  const resetGame = () => {
    setGameState('setup');
    setVenomCup(null);
    setGuessedCup(null);
    setCupsOrder([0, 1]);
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
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">Player 1 <span className="text-emerald-400 font-bold italic">/ DEALER</span></h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">Select one vessel to lace with venom. Your opponent must guess which one is lethal.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              {[0, 1].map((cupIndex) => (
                <button
                  key={cupIndex}
                  onClick={() => handlePlayer1Select(cupIndex)}
                  disabled={isPoisoning !== null}
                  className="relative group flex flex-col items-center justify-center p-8 w-64 h-72 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors disabled:pointer-events-none"
                >
                  {/* Geometric Cup */}
                  <div className={`w-20 h-28 border-x-4 border-b-4 relative mb-6 transition-colors duration-500 ${isPoisoning === cupIndex ? 'border-emerald-400' : 'border-emerald-500/70 group-hover:border-emerald-500'}`}>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors"></div>
                    <div className={`absolute top-0 -left-2 -right-2 h-1 transition-colors ${isPoisoning === cupIndex ? 'bg-emerald-400' : 'bg-emerald-500/70 group-hover:bg-emerald-500'}`}></div>
                    <AnimatePresence>
                      {isPoisoning === cupIndex && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, y: -40 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", bounce: 0.4 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="bg-slate-950 p-2 border border-emerald-500/50">
                            <Skull className="text-emerald-400" size={32} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-300">
                    Vessel {cupIndex === 0 ? 'Alpha' : 'Omega'}
                  </span>
                  <span className={`mt-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase transition-opacity ${isPoisoning === null ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                    Click to Lace
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-8 transform rotate-45">
              <Skull className="text-emerald-500 transform -rotate-45" size={40} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-widest text-slate-200 mb-3 uppercase">The Trap is Set</h2>
            <p className="text-slate-500 mb-12 text-sm tracking-widest uppercase">Pass the device to Player 2.</p>
            <button
              onClick={handleTransitionNext}
              className="flex items-center gap-3 bg-slate-200 text-slate-950 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors active:scale-95"
            >
              I am Player 2 <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {gameState === 'guess' && (
          <motion.div
            key="guess"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">Player 2 <span className="text-purple-400 font-bold italic">/ GUEST</span></h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">Analyze the risk. One cup leads to victory, the other to certain doom.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mb-8">
              {cupsOrder.map((cupIndex) => (
                <motion.button
                  layout
                  key={cupIndex}
                  onClick={() => handlePlayer2Guess(cupIndex)}
                  className="relative group flex flex-col items-center justify-center p-8 w-64 h-72 border border-slate-700 bg-slate-800/20 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-20 h-28 border-x-4 border-b-4 border-slate-600 group-hover:border-slate-400 relative mb-6 transition-colors duration-300">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-700/20 group-hover:bg-slate-500/20 transition-colors"></div>
                    <div className="absolute top-0 -left-2 -right-2 h-1 bg-slate-600 group-hover:bg-slate-400 transition-colors"></div>
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-300">
                    Vessel {cupIndex === 0 ? 'Alpha' : 'Omega'}
                  </span>
                  <span className="mt-2 text-[10px] font-bold tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 uppercase transition-opacity">
                    Select Vessel
                  </span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleShuffle}
              className="px-6 py-2 border border-slate-700 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
            >
              Rotate Vessels
            </button>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center w-full"
          >
            {guessedCup === venomCup ? (
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ rotate: -45, scale: 0 }}
                  animate={{ rotate: 45, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="w-24 h-24 bg-red-500/10 border-2 border-red-500 flex items-center justify-center mb-8"
                >
                  <Skull className="text-red-500 transform -rotate-45" size={40} />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-light tracking-widest uppercase text-red-500 mb-3">Lethal</h2>
                <p className="text-slate-400 text-sm tracking-widest uppercase mb-12">Dealer wins this round.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ rotate: 45, scale: 0 }}
                  animate={{ rotate: 45, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="w-24 h-24 bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center mb-8"
                >
                  <ShieldCheck className="text-blue-500 transform -rotate-45" size={40} />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-light tracking-widest uppercase text-blue-500 mb-3">Safe</h2>
                <p className="text-slate-400 text-sm tracking-widest uppercase mb-12">Guest wins this round.</p>
              </div>
            )}
            
            <div className="flex gap-16 mb-12 opacity-80">
               {[0, 1].map((cupIndex) => (
                  <div key={cupIndex} className="flex flex-col items-center gap-4">
                    <div className={`w-12 h-16 border-x-2 border-b-2 relative ${cupIndex === venomCup ? 'border-red-500' : 'border-blue-500'}`}>
                      <div className={`absolute inset-x-0 bottom-0 h-1/2 ${cupIndex === venomCup ? 'bg-red-500/40' : 'bg-blue-500/40'}`}></div>
                      <div className={`absolute top-0 -left-1 -right-1 h-0.5 ${cupIndex === venomCup ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${cupIndex === venomCup ? 'text-red-500' : 'text-blue-500'}`}>
                      {cupIndex === venomCup ? 'Venom' : 'Safe'}
                    </span>
                  </div>
               ))}
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
            >
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Footer: Vercel Themed Stats */}
      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dealer Score</span>
            <span className="text-xl font-mono text-emerald-500">{dealerScore.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Guest Score</span>
            <span className="text-xl font-mono text-purple-400">{guestScore.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex-col hidden sm:flex">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Toxicity Level</span>
            <span className="text-xl font-mono text-emerald-500">88%</span>
          </div>
        </div>
      </footer>
      
      {/* Background Geometry */}
      <div className="absolute bottom-16 left-0 w-64 h-64 bg-slate-900 -translate-x-32 translate-y-32 rotate-45 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-900/50 translate-x-48 -translate-y-48 rotate-45 pointer-events-none z-0"></div>
    </div>
  );
}
