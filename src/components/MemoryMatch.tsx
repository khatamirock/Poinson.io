import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Diamond, Hexagon, Triangle, Circle, Square, Star, Cloud, Zap } from 'lucide-react';

type Player = 'P1' | 'P2';

type CardType = 'diamond' | 'hexagon' | 'triangle' | 'circle' | 'square' | 'star' | 'cloud' | 'zap';

interface Card {
  id: string;
  type: CardType;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS: Record<CardType, React.ElementType> = {
  diamond: Diamond,
  hexagon: Hexagon,
  triangle: Triangle,
  circle: Circle,
  square: Square,
  star: Star,
  cloud: Cloud,
  zap: Zap,
};

const generateDeck = (): Card[] => {
  const types: CardType[] = ['diamond', 'hexagon', 'triangle', 'circle', 'square', 'star', 'cloud', 'zap'];
  const deck: Card[] = [];
  
  types.forEach((type) => {
    deck.push({ id: `${type}-1`, type, isFlipped: false, isMatched: false });
    deck.push({ id: `${type}-2`, type, isFlipped: false, isMatched: false });
  });

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('P1');
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setCards(generateDeck());
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsLocked(true);
      const [idx1, idx2] = flippedIndices;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.type === card2.type) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === idx1 || i === idx2 ? { ...c, isMatched: true } : c
          ));
          if (currentPlayer === 'P1') setP1Score(s => s + 1);
          else setP2Score(s => s + 1);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c
          ));
          setCurrentPlayer(p => p === 'P1' ? 'P2' : 'P1');
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, currentPlayer]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    setCards(prev => prev.map((c, i) => 
      i === index ? { ...c, isFlipped: true } : c
    ));
    setFlippedIndices(prev => [...prev, index]);
  };

  const resetGame = () => {
    setCards(generateDeck());
    setCurrentPlayer('P1');
    setFlippedIndices([]);
    setP1Score(0);
    setP2Score(0);
    setGameOver(false);
    setIsLocked(false);
  };

  const winner = p1Score > p2Score ? 'P1' : p2Score > p1Score ? 'P2' : 'draw';

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 z-10 overflow-y-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2 uppercase">
            Memory <span className="text-teal-400 font-bold italic">/ MATCH</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            {gameOver 
              ? winner === 'draw' ? 'Stalemate' : `Player ${winner === 'P1' ? '1' : '2'} claims victory` 
              : `Awaiting Player ${currentPlayer === 'P1' ? '1' : '2'}`}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
          {cards.map((card, index) => {
            const Icon = ICONS[card.type];
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 cursor-pointer perspective-1000`}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  initial={false}
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front of card (hidden when matched/flipped) */}
                  <div className="absolute w-full h-full backface-hidden bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-slate-800 rounded-sm" />
                  </div>
                  
                  {/* Back of card (visible when matched/flipped) */}
                  <div className={`absolute w-full h-full backface-hidden flex items-center justify-center rotate-y-180 border ${
                    card.isMatched 
                      ? 'bg-slate-800 border-teal-500/50' 
                      : 'bg-slate-800 border-slate-600'
                  }`}>
                    <Icon 
                      size={32} 
                      className={`${card.isMatched ? 'text-teal-400' : 'text-slate-300'} transition-colors duration-500 sm:w-10 sm:h-10 lg:w-12 lg:h-12`} 
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {gameOver && (
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
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1</span>
            <span className={`text-xl font-mono ${currentPlayer === 'P1' ? 'text-teal-400' : 'text-slate-300'}`}>
              {p1Score.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2</span>
            <span className={`text-xl font-mono ${currentPlayer === 'P2' ? 'text-teal-400' : 'text-slate-300'}`}>
              {p2Score.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
    </div>
  );
}
