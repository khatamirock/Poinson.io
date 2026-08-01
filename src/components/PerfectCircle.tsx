import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, CircleDashed } from 'lucide-react';

type GameState = 'setup' | 'p1_turn' | 'p1_result' | 'p2_turn' | 'result';

export default function PerfectCircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('setup');
  
  const isDrawingRef = useRef(false);
  const pointsRef = useRef<{x: number, y: number}[]>([]);
  
  const [p1Score, setP1Score] = useState<number | null>(null);
  const [p2Score, setP2Score] = useState<number | null>(null);

  const drawCenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (gameState === 'p1_turn' || gameState === 'p2_turn') {
      drawCenter();
      pointsRef.current = [];
      isDrawingRef.current = false;
    }
  }, [gameState, drawCenter]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e && (e as any).touches?.length > 0) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'p1_turn' && gameState !== 'p2_turn') return;
    isDrawingRef.current = true;
    const coords = getCoordinates(e.nativeEvent);
    pointsRef.current = [coords];
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      drawCenter();
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    if (gameState !== 'p1_turn' && gameState !== 'p2_turn') return;
    
    const coords = getCoordinates(e.nativeEvent);
    pointsRef.current.push(coords);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = gameState === 'p1_turn' ? '#8b5cf6' : '#ec4899'; // violet-500 or pink-500
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const calculateScore = (pts: {x: number, y: number}[]) => {
    const canvas = canvasRef.current;
    if (!canvas || pts.length < 20) return 0;
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    let totalRadius = 0;
    const radii = pts.map(p => {
      const r = Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2));
      totalRadius += r;
      return r;
    });
    
    const avgRadius = totalRadius / pts.length;
    
    // 1. Calculate accuracy based on deviation from perfect circle (avgRadius)
    let errorSum = 0;
    radii.forEach(r => {
      errorSum += Math.abs(r - avgRadius);
    });
    const avgError = errorSum / pts.length;
    
    // Base score - stricter penalty for deviation
    let accuracy = 100 - (avgError / avgRadius) * 200;
    
    // 2. Angular coverage - must surround the center
    const angleBins = new Set<number>();
    pts.forEach(p => {
      let angle = Math.atan2(p.y - cy, p.x - cx);
      let deg = (angle * 180) / Math.PI;
      if (deg < 0) deg += 360;
      angleBins.add(Math.floor(deg / 10)); // 36 bins of 10 degrees
    });
    
    const coverage = angleBins.size / 36;
    if (coverage < 0.9) {
      // If they didn't draw a full circle around the center (less than ~320 degrees)
      return 0;
    }

    // 3. Check for closing the loop
    const startPt = pts[0];
    const endPt = pts[pts.length - 1];
    const gapDist = Math.sqrt(Math.pow(startPt.x - endPt.x, 2) + Math.pow(startPt.y - endPt.y, 2));
    if (gapDist > avgRadius * 0.4) {
      accuracy -= 15; // Penalty if the ends don't meet
    }
    
    // 4. Size penalty (too small = too easy to draw)
    if (avgRadius < 40) {
      accuracy -= 40;
    }
    
    return Math.max(0, Math.min(99.9, accuracy));
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    if (gameState === 'p1_turn' || gameState === 'p2_turn') {
      const finalScore = calculateScore(pointsRef.current);
      
      if (gameState === 'p1_turn') {
        setP1Score(finalScore);
        setGameState('p1_result');
        setTimeout(() => {
          setGameState('p2_turn');
        }, 2500);
      } else {
        setP2Score(finalScore);
        setGameState('result');
      }
    }
  };

  // Prevent scrolling while drawing on mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventDefault = (e: TouchEvent) => {
      if (isDrawingRef.current) e.preventDefault();
    };
    canvas.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      canvas.removeEventListener('touchmove', preventDefault);
    };
  }, []);

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
              <div className="w-24 h-24 bg-violet-500/10 border-2 border-violet-500 flex items-center justify-center mb-8 rounded-full">
                <CircleDashed className="text-violet-500" size={40} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 uppercase">Perfect Circle</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 uppercase tracking-widest">
                Draw a flawless circle around the center point. <br/>Accuracy is everything.
              </p>
              
              <button
                onClick={() => setGameState('p1_turn')}
                className="px-8 py-4 bg-violet-500/10 border border-violet-500/50 hover:bg-violet-500/20 transition-all text-xs font-bold tracking-widest uppercase text-violet-200 hover:text-white"
              >
                Commence Tracing
              </button>
            </motion.div>
          )}

          {(gameState === 'p1_turn' || gameState === 'p2_turn') && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-2 uppercase">
                  Player {gameState === 'p1_turn' ? 1 : 2} <span className={gameState === 'p1_turn' ? 'text-violet-400' : 'text-pink-400'}>/ DRAW</span>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
                  Trace around the center.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                {/* Visual Center Point */}
                <div className={`absolute w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] pointer-events-none animate-pulse z-20 flex items-center justify-center ${gameState === 'p1_turn' ? 'bg-violet-400' : 'bg-pink-400'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
                </div>
                
                {/* Visual Crosshairs */}
                <div className="absolute w-12 h-12 pointer-events-none z-10 opacity-50">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-600 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[2px] bg-slate-600 -translate-x-1/2 rounded-full"></div>
                </div>

                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  className="bg-transparent cursor-crosshair touch-none w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] z-30 relative"
                />
              </div>
            </motion.div>
          )}

          {gameState === 'p1_result' && (
            <motion.div
              key="p1_result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center text-center w-full absolute inset-0 justify-center z-20 bg-slate-950/80 backdrop-blur-sm"
            >
              <h2 className="text-4xl sm:text-6xl font-light tracking-widest uppercase text-violet-400 mb-4">
                {p1Score?.toFixed(1)}%
              </h2>
              <p className="text-slate-300 text-sm tracking-widest uppercase">Player 1 Accuracy</p>
              <div className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">
                Preparing Player 2...
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
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-24 h-24 border-2 border-slate-700 bg-slate-800 flex items-center justify-center mb-8 rounded-full">
                  <CircleDashed className={`text-slate-300`} size={40} />
                </div>
                
                <h2 className={`text-4xl sm:text-5xl font-light tracking-widest uppercase mb-3 text-slate-200`}>
                  {p1Score! > p2Score! ? (
                    <>Player 1 <span className="text-violet-500 font-bold">Wins</span></>
                  ) : p2Score! > p1Score! ? (
                    <>Player 2 <span className="text-pink-500 font-bold">Wins</span></>
                  ) : (
                    <>A perfect <span className="text-slate-400 font-bold">Tie</span></>
                  )}
                </h2>
                <p className="text-slate-500 text-sm tracking-widest uppercase mb-8">
                  P1: {p1Score?.toFixed(1)}% — P2: {p2Score?.toFixed(1)}%
                </p>
              </div>
              
              <button
                onClick={() => { setP1Score(null); setP2Score(null); setGameState('setup'); }}
                className="flex items-center gap-2 bg-slate-800 text-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700"
              >
                <RotateCcw size={16} /> Draw Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <footer className="h-auto sm:h-20 py-4 sm:py-0 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center px-8 sm:px-12 justify-between shrink-0 gap-4 sm:gap-0 z-20 w-full mt-auto">
        <div className="flex gap-8 sm:gap-12 w-full justify-center sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 1 Accuracy</span>
            <span className="text-xl font-mono text-violet-500">{p1Score !== null ? `${p1Score.toFixed(1)}%` : '--'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Player 2 Accuracy</span>
            <span className="text-xl font-mono text-pink-500">{p2Score !== null ? `${p2Score.toFixed(1)}%` : '--'}</span>
          </div>
        </div>
      </footer>
      
      <div className="absolute top-1/4 -right-16 w-64 h-64 bg-slate-900 rotate-45 pointer-events-none -z-10"></div>
      <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-slate-900/50 rotate-[60deg] pointer-events-none -z-10"></div>
    </div>
  );
}
