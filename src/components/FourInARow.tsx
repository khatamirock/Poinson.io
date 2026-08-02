import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

type Player = 'P1' | 'P2';
type BoardState = (Player | null)[];

const ROWS = 6;
const COLS = 7;

export default function FourInARow() {
  const [board, setBoard] = useState<BoardState>(Array(ROWS * COLS).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('P1');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const checkWinner = (squares: BoardState, row: number, col: number, player: Player) => {
    // Check all directions from the newly placed token
    const directions = [
      [[0, 1], [0, -1]], // horizontal
      [[1, 0], [-1, 0]], // vertical
      [[1, 1], [-1, -1]], // diagonal 1
      [[1, -1], [-1, 1]]  // diagonal 2
    ];

    for (const axis of directions) {
      let count = 1;
      for (const [dRow, dCol] of axis) {
        let r = row + dRow;
        let c = col + dCol;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && squares[r * COLS + c] === player) {
          count++;
          r += dRow;
          c += dCol;
        }
      }
      if (count >= 4) return player;
    }

    if (!squares.includes(null)) return 'draw';
    return null;
  };

  const handleColumnClick = (colIndex: number) => {
    if (winner) return;

    // Find the lowest empty row in this column
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r * COLS + colIndex]) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return; // Column is full

    const newBoard = [...board];
    newBoard[targetRow * COLS + colIndex] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, targetRow, colIndex, currentPlayer);
    if (result) {
      setWinner(result);
      if (result === 'P1') setP1Score(prev => prev + 1);
      else if (result === 'P2') setP2Score(prev => prev + 1);
    } else {
      setCurrentPlayer(currentPlayer === 'P1' ? 'P2' : 'P1');
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS * COLS).fill(null));
    setCurrentPlayer('P1');
    setWinner(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-y-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">
            Four <span className="text-indigo-400 font-bold italic">/ ROW</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            {winner 
              ? winner === 'draw' ? 'Stalemate' : `Player ${winner === 'P1' ? '1' : '2'} claims victory` 
              : `Awaiting Player ${currentPlayer === 'P1' ? '1' : '2'}`}
          </p>
        </div>

        <div className="bg-slate-900 border-4 border-slate-800 p-2 sm:p-4 rounded-lg shadow-2xl mb-8">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className="flex flex-col gap-1 sm:gap-2 group cursor-pointer"
                onClick={() => handleColumnClick(colIndex)}
              >
                {/* Hover indicator */}
                <div className="h-4 sm:h-6 flex items-center justify-center mb-1">
                  {!winner && board[colIndex] === null && (
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${currentPlayer === 'P1' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                  )}
                </div>
                {Array.from({ length: ROWS }).map((_, rowIndex) => {
                  const cell = board[rowIndex * COLS + colIndex];
                  return (
                    <div
                      key={rowIndex}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-slate-950 bg-slate-950 flex items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] rounded-full z-10 pointer-events-none" />
                      <AnimatePresence>
                        {cell && (
                          <motion.div
                            initial={{ y: -200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                            className={`w-[85%] h-[85%] rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2)] ${
                              cell === 'P1' 
                                ? 'bg-rose-500 border border-rose-400' 
                                : 'bg-amber-400 border border-amber-300'
                            }`}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
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

      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1 (Rose)</span>
            <span className="text-xl font-mono text-rose-500">{p1Score.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2 (Amber)</span>
            <span className="text-xl font-mono text-amber-400">{p2Score.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
    </div>
  );
}
