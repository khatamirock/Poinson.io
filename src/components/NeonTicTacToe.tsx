import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X, Circle } from 'lucide-react';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

export default function NeonTicTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  const checkWinner = (squares: BoardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'draw';
    return null;
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result === 'X') setXScore(prev => prev + 1);
      else if (result === 'O') setOScore(prev => prev + 1);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-y-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">
            Grid <span className="text-cyan-400 font-bold italic">/ WAR</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            {winner 
              ? winner === 'draw' ? 'Stalemate' : `Player ${winner} claims victory` 
              : `Awaiting Player ${currentPlayer}`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-12">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              disabled={!!winner || !!cell}
              className={`w-20 h-20 sm:w-28 sm:h-28 border-2 flex items-center justify-center transition-colors ${
                !cell && !winner 
                  ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 cursor-pointer' 
                  : 'border-slate-700 bg-slate-900'
              }`}
            >
              <AnimatePresence>
                {cell && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    {cell === 'X' ? (
                      <X className="text-cyan-400" size={48} strokeWidth={2} />
                    ) : (
                      <Circle className="text-fuchsia-500" size={44} strokeWidth={2} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
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
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player X (Cyan)</span>
            <span className="text-xl font-mono text-cyan-400">{xScore.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player O (Fuchsia)</span>
            <span className="text-xl font-mono text-fuchsia-500">{oScore.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}
