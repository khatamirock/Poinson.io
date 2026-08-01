import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Grip, Play } from 'lucide-react';

type Player = 1 | 2;
type LineState = Player | null;
type GameState = 'setup' | 'playing';

export default function DotsAndBoxes() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gridSize, setGridSize] = useState<number>(5);
  
  const [hLines, setHLines] = useState<LineState[]>([]);
  const [vLines, setVLines] = useState<LineState[]>([]);
  const [boxes, setBoxes] = useState<LineState[]>([]);
  
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);

  const getP1Score = () => boxes.filter(b => b === 1).length;
  const getP2Score = () => boxes.filter(b => b === 2).length;

  const initGame = (size: number) => {
    setGridSize(size);
    setHLines(Array((size + 1) * size).fill(null));
    setVLines(Array(size * (size + 1)).fill(null));
    setBoxes(Array(size * size).fill(null));
    setCurrentPlayer(1);
    setWinner(null);
    setGameState('playing');
  };

  const checkBoxCompletion = (newHLines: LineState[], newVLines: LineState[]) => {
    let newBoxes = [...boxes];
    let completedAny = false;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const idx = r * gridSize + c;
        if (newBoxes[idx] === null) {
          const top = newHLines[r * gridSize + c];
          const bottom = newHLines[(r + 1) * gridSize + c];
          const left = newVLines[r * (gridSize + 1) + c];
          const right = newVLines[r * (gridSize + 1) + c + 1];
          
          if (top && bottom && left && right) {
            newBoxes[idx] = currentPlayer;
            completedAny = true;
          }
        }
      }
    }
    return { newBoxes, completedAny };
  };

  const handleLineClick = (type: 'h' | 'v', index: number) => {
    if (winner) return;
    if (type === 'h' && hLines[index]) return;
    if (type === 'v' && vLines[index]) return;

    const newHLines = [...hLines];
    const newVLines = [...vLines];

    if (type === 'h') newHLines[index] = currentPlayer;
    else newVLines[index] = currentPlayer;

    const { newBoxes, completedAny } = checkBoxCompletion(newHLines, newVLines);

    setHLines(newHLines);
    setVLines(newVLines);
    setBoxes(newBoxes);

    // Check if game is over
    if (newBoxes.every(b => b !== null)) {
      const p1 = newBoxes.filter(b => b === 1).length;
      const p2 = newBoxes.filter(b => b === 2).length;
      if (p1 > p2) setWinner(1);
      else if (p2 > p1) setWinner(2);
      else setWinner('tie');
    } else {
      if (!completedAny) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  };

  const resetGame = () => {
    setGameState('setup');
  };

  // Dynamic sizing based on grid size
  const dotSize = gridSize === 13 ? 6 : gridSize === 10 ? 8 : 12;
  const lineLength = gridSize === 13 ? 18 : gridSize === 10 ? 28 : 50;
  const lineThickness = gridSize === 13 ? 4 : gridSize === 10 ? 6 : 8;
  const boxTextSize = gridSize === 13 ? 'text-[10px]' : gridSize === 10 ? 'text-xs' : 'text-xl';

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
              className="flex flex-col items-center text-center max-w-lg"
            >
              <div className="w-24 h-24 bg-lime-500/10 border-2 border-lime-500 flex items-center justify-center mb-8 rounded-full">
                <Grip className="text-lime-500" size={40} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Dots / Boxes</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
                Select grid size to begin. <br/>Claim more territory than your opponent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => initGame(5)}
                  className="flex-1 py-4 bg-lime-500/5 border border-lime-500/30 hover:bg-lime-500/10 transition-all text-xs font-bold tracking-widest uppercase text-lime-200"
                >
                  Small (5x5)
                </button>
                <button
                  onClick={() => initGame(10)}
                  className="flex-1 py-4 bg-lime-500/10 border border-lime-500/50 hover:bg-lime-500/20 transition-all text-xs font-bold tracking-widest uppercase text-lime-200"
                >
                  Medium (10x10)
                </button>
                <button
                  onClick={() => initGame(13)}
                  className="flex-1 py-4 bg-lime-500/15 border border-lime-500/70 hover:bg-lime-500/30 transition-all text-xs font-bold tracking-widest uppercase text-lime-100 shadow-[0_0_15px_rgba(132,204,22,0.2)]"
                >
                  Large (13x13)
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-2 uppercase">
                  Dots <span className="text-lime-400 font-bold italic">/ BOXES</span>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
                  {winner 
                    ? winner === 'tie' ? 'A tactical stalemate' : `Player ${winner} claims the grid` 
                    : `Awaiting Player ${currentPlayer} ( ${currentPlayer === 1 ? 'Cyan' : 'Fuchsia'} )`}
                </p>
              </div>

              <div className="relative bg-slate-900/80 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-2xl backdrop-blur-sm overflow-auto max-w-full">
                <div 
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, ${dotSize}px ${lineLength}px) ${dotSize}px`,
                    gridTemplateRows: `repeat(${gridSize}, ${dotSize}px ${lineLength}px) ${dotSize}px`,
                    gap: 0
                  }}
                  className="origin-center"
                >
                  {Array.from({ length: gridSize + 1 }).map((_, r) => (
                    <React.Fragment key={`row-${r}`}>
                      {/* Dots and Horizontal Lines */}
                      {Array.from({ length: gridSize }).map((_, c) => (
                        <React.Fragment key={`h-${r}-${c}`}>
                          {/* Dot */}
                          <div 
                            style={{ width: dotSize, height: dotSize }} 
                            className="bg-slate-600 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.8)] z-20"
                          ></div>
                          {/* H-Line */}
                          <button 
                            onClick={() => handleLineClick('h', r * gridSize + c)}
                            style={{ height: dotSize, width: lineLength }}
                            className="flex items-center justify-center cursor-pointer group z-10"
                          >
                            <div 
                              style={{ height: lineThickness, width: '100%' }}
                              className={`transition-colors rounded-full ${
                              hLines[r * gridSize + c] === 1 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' :
                              hLines[r * gridSize + c] === 2 ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]' :
                              'bg-slate-800/50 group-hover:bg-slate-500'
                            }`}></div>
                          </button>
                        </React.Fragment>
                      ))}
                      {/* Final dot of the row */}
                      <div 
                        style={{ width: dotSize, height: dotSize }} 
                        className="bg-slate-600 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.8)] z-20"
                      ></div>

                      {/* Vertical lines and Boxes (except after the last row) */}
                      {r < gridSize && Array.from({ length: gridSize + 1 }).map((_, c) => (
                        <React.Fragment key={`v-${r}-${c}`}>
                          {/* V-Line */}
                          <button 
                            onClick={() => handleLineClick('v', r * (gridSize + 1) + c)}
                            style={{ width: dotSize, height: lineLength }}
                            className="flex items-center justify-center cursor-pointer group z-10"
                          >
                            <div 
                              style={{ width: lineThickness, height: '100%' }}
                              className={`transition-colors rounded-full ${
                              vLines[r * (gridSize + 1) + c] === 1 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' :
                              vLines[r * (gridSize + 1) + c] === 2 ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]' :
                              'bg-slate-800/50 group-hover:bg-slate-500'
                            }`}></div>
                          </button>
                          {/* Box */}
                          {c < gridSize && (
                            <div 
                              style={{ width: lineLength, height: lineLength }}
                              className={`flex items-center justify-center transition-colors duration-500 ${
                              boxes[r * gridSize + c] === 1 ? 'bg-cyan-500/20' :
                              boxes[r * gridSize + c] === 2 ? 'bg-fuchsia-500/20' :
                              'bg-transparent'
                            }`}>
                              <AnimatePresence>
                                {boxes[r * gridSize + c] && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`font-bold ${boxTextSize} ${boxes[r * gridSize + c] === 1 ? 'text-cyan-400' : 'text-fuchsia-400'}`}
                                  >
                                    P{boxes[r * gridSize + c]}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {winner && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mt-8"
                  >
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
                    >
                      <RotateCcw size={16} /> New Game
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1 (Cyan)</span>
            <span className="text-xl font-mono text-cyan-400">{getP1Score().toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2 (Fuchsia)</span>
            <span className="text-xl font-mono text-fuchsia-500">{getP2Score().toString().padStart(2, '0')}</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}

