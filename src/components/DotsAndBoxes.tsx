import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Grip } from 'lucide-react';

type Player = 1 | 2;
type LineState = Player | null;

export default function DotsAndBoxes() {
  const ROWS = 3;
  const COLS = 3;
  
  const [hLines, setHLines] = useState<LineState[]>(Array((ROWS + 1) * COLS).fill(null));
  const [vLines, setVLines] = useState<LineState[]>(Array(ROWS * (COLS + 1)).fill(null));
  const [boxes, setBoxes] = useState<LineState[]>(Array(ROWS * COLS).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);

  const getP1Score = () => boxes.filter(b => b === 1).length;
  const getP2Score = () => boxes.filter(b => b === 2).length;

  const checkBoxCompletion = (newHLines: LineState[], newVLines: LineState[]) => {
    let newBoxes = [...boxes];
    let completedAny = false;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        if (newBoxes[idx] === null) {
          const top = newHLines[r * COLS + c];
          const bottom = newHLines[(r + 1) * COLS + c];
          const left = newVLines[r * (COLS + 1) + c];
          const right = newVLines[r * (COLS + 1) + c + 1];
          
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
    setHLines(Array((ROWS + 1) * COLS).fill(null));
    setVLines(Array(ROWS * (COLS + 1)).fill(null));
    setBoxes(Array(ROWS * COLS).fill(null));
    setCurrentPlayer(1);
    setWinner(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">
            Dots <span className="text-lime-400 font-bold italic">/ BOXES</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            {winner 
              ? winner === 'tie' ? 'A tactical stalemate' : `Player ${winner} claims the grid` 
              : `Awaiting Player ${currentPlayer} ( ${currentPlayer === 1 ? 'Cyan' : 'Fuchsia'} )`}
          </p>
        </div>

        <div className="relative bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, 12px 60px) 12px`,
              gridTemplateRows: `repeat(${ROWS}, 12px 60px) 12px`
            }}
            className="sm:scale-125 origin-center"
          >
            {Array.from({ length: ROWS + 1 }).map((_, r) => (
              <React.Fragment key={`row-${r}`}>
                {/* Dots and Horizontal Lines */}
                {Array.from({ length: COLS }).map((_, c) => (
                  <React.Fragment key={`h-${r}-${c}`}>
                    {/* Dot */}
                    <div className="w-3 h-3 bg-slate-700 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div>
                    {/* H-Line */}
                    <button 
                      onClick={() => handleLineClick('h', r * COLS + c)}
                      className="h-3 w-[60px] flex items-center justify-center cursor-pointer group"
                    >
                      <div className={`h-1.5 w-full transition-colors rounded-full ${
                        hLines[r * COLS + c] === 1 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' :
                        hLines[r * COLS + c] === 2 ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]' :
                        'bg-slate-800 group-hover:bg-slate-600'
                      }`}></div>
                    </button>
                  </React.Fragment>
                ))}
                {/* Final dot of the row */}
                <div className="w-3 h-3 bg-slate-700 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div>

                {/* Vertical lines and Boxes (except after the last row) */}
                {r < ROWS && Array.from({ length: COLS + 1 }).map((_, c) => (
                  <React.Fragment key={`v-${r}-${c}`}>
                    {/* V-Line */}
                    <button 
                      onClick={() => handleLineClick('v', r * (COLS + 1) + c)}
                      className="w-3 h-[60px] flex items-center justify-center cursor-pointer group"
                    >
                      <div className={`w-1.5 h-full transition-colors rounded-full ${
                        vLines[r * (COLS + 1) + c] === 1 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' :
                        vLines[r * (COLS + 1) + c] === 2 ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]' :
                        'bg-slate-800 group-hover:bg-slate-600'
                      }`}></div>
                    </button>
                    {/* Box */}
                    {c < COLS && (
                      <div className={`w-[60px] h-[60px] flex items-center justify-center transition-colors duration-500 ${
                        boxes[r * COLS + c] === 1 ? 'bg-cyan-500/20' :
                        boxes[r * COLS + c] === 2 ? 'bg-fuchsia-500/20' :
                        'bg-transparent'
                      }`}>
                        <AnimatePresence>
                          {boxes[r * COLS + c] && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`font-bold text-2xl ${boxes[r * COLS + c] === 1 ? 'text-cyan-400' : 'text-fuchsia-400'}`}
                            >
                              P{boxes[r * COLS + c]}
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
              className="flex flex-col items-center mt-12"
            >
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
              >
                <RotateCcw size={16} /> Rematch
              </button>
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
