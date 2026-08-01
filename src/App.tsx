import React, { useState } from 'react';
import CupGame from './components/CupGame';
import RussianRoulette from './components/RussianRoulette';
import NeonTicTacToe from './components/NeonTicTacToe';
import QuickDraw from './components/QuickDraw';
import PerfectCircle from './components/PerfectCircle';
import ChronoStop from './components/ChronoStop';
import MindClash from './components/MindClash';
import DotsAndBoxes from './components/DotsAndBoxes';
import { Play, Wine, Target, ArrowLeft, Grid3X3, Zap, CircleDashed, Timer, BrainCircuit, Grip } from 'lucide-react';

export default function App() {
  const [activeGame, setActiveGame] = useState<'menu' | 'venom' | 'roulette' | 'grid' | 'draw' | 'circle' | 'chrono' | 'clash' | 'dots'>('menu');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl flex flex-col border-4 sm:border-8 border-slate-900 bg-slate-950 shadow-2xl relative overflow-hidden min-h-[600px] h-[85vh] sm:h-[800px]">
        {/* Header: Geometric Navigation */}
        <nav className="h-16 flex items-center justify-between px-8 md:px-12 border-b border-slate-800 bg-slate-900/50 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-emerald-500 transform rotate-45 flex items-center justify-center cursor-pointer" onClick={() => setActiveGame('menu')}>
              <div className="w-4 h-4 bg-slate-950 rotate-[-45deg]"></div>
            </div>
            {activeGame !== 'menu' && (
              <button 
                onClick={() => setActiveGame('menu')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Hub
              </button>
            )}
            {activeGame === 'menu' && (
              <span className="font-bold tracking-widest text-xl uppercase">Game.Hub</span>
            )}
          </div>
          <div className="hidden md:flex gap-8 text-xs font-semibold tracking-tighter uppercase">
            <span className="text-emerald-500">Active Lobby #4429</span>
            <span className="text-slate-500">Region: US-East-1</span>
            <span className="text-slate-500 underline decoration-slate-700 underline-offset-4 cursor-pointer hover:text-slate-300">Docs</span>
          </div>
          <div className="w-32 h-8 bg-slate-800 rounded-sm hidden sm:flex items-center justify-center border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vercel V2.4</span>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {activeGame === 'menu' && (
            <div className="flex-1 flex flex-col items-center justify-start sm:justify-center p-6 sm:p-8 z-10 min-h-max w-full">
              <div className="text-center mb-8 sm:mb-16 mt-4 sm:mt-0">
                <h1 className="text-4xl sm:text-6xl font-light tracking-tight mb-3 sm:mb-4 uppercase">Select <span className="text-emerald-400 font-bold italic">Game</span></h1>
                <p className="text-slate-500 text-xs sm:text-sm tracking-widest uppercase max-w-md mx-auto">
                  Choose your trial. Two players required. High stakes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full max-w-5xl justify-center items-center pb-12 sm:pb-0 overflow-x-auto px-4">
                {/* Venom.io Card */}
                <button 
                  onClick={() => setActiveGame('venom')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/10 transform translate-x-12 -translate-y-12 sm:translate-x-16 sm:-translate-y-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Wine size={36} className="text-emerald-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Venom.io</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Deception and choice. One cup is laced with venom.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Russian Roulette Card */}
                <button 
                  onClick={() => setActiveGame('roulette')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-rose-500/10 transform translate-x-12 translate-y-12 sm:translate-x-16 sm:translate-y-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Target size={36} className="text-rose-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Roulette</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Six chambers. One bullet. Pure probability and nerve.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
                
                {/* Grid War Card */}
                <button 
                  onClick={() => setActiveGame('grid')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-1/2 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/10 transform translate-x-12 -translate-y-1/2 sm:translate-x-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Grid3X3 size={36} className="text-cyan-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Grid War</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Classic logic duel. Connect three to claim victory.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Quick Draw Card */}
                <button 
                  onClick={() => setActiveGame('draw')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-1/2 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500/10 transform translate-x-12 -translate-y-1/2 sm:translate-x-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Zap size={36} className="text-amber-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Quick Draw</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Wait for the signal. Fastest reaction survives.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Perfect Circle Card */}
                <button 
                  onClick={() => setActiveGame('circle')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-violet-500/10 transform -translate-x-12 -translate-y-12 sm:-translate-x-16 sm:-translate-y-16 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <CircleDashed size={36} className="text-violet-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Perfect Circle</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Draw a flawless circle. Accuracy is everything.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Chrono Stop Card */}
                <button 
                  onClick={() => setActiveGame('chrono')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-1/2 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-orange-500/10 transform -translate-x-12 -translate-y-1/2 sm:-translate-x-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Timer size={36} className="text-orange-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Chrono Stop</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Stop the hidden timer exactly at 7.000s.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Mind Clash Card */}
                <button 
                  onClick={() => setActiveGame('clash')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute bottom-0 left-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 transform -translate-x-1/2 translate-y-12 sm:translate-y-16 rotate-45 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <BrainCircuit size={36} className="text-blue-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Mind Clash</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">A mathematical duel. True or false? React first.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Dots and Boxes Card */}
                <button 
                  onClick={() => setActiveGame('dots')}
                  className="group relative w-full sm:w-80 h-64 sm:h-96 border border-lime-500/30 bg-lime-500/5 hover:bg-lime-500/10 transition-colors flex flex-col p-6 sm:p-8 text-left cursor-pointer overflow-hidden shrink-0"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-lime-500/10 transform translate-x-12 -translate-y-12 sm:translate-x-16 sm:-translate-y-16 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <Grip size={36} className="text-lime-500 mb-6 sm:mb-8 sm:w-12 sm:h-12" strokeWidth={1} />
                  
                  <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-light tracking-widest uppercase text-slate-200 mb-1 sm:mb-2">Dots / Boxes</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 tracking-widest uppercase mb-4 sm:mb-6 leading-relaxed">Strategic territory control. Claim the grid.</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-lime-400 uppercase tracking-widest">
                      Initialize <Play size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-slate-900 -translate-x-24 translate-y-24 sm:-translate-x-32 sm:translate-y-32 rotate-45 pointer-events-none -z-10"></div>
            </div>
          )}

          {activeGame === 'venom' && <CupGame />}
          {activeGame === 'roulette' && <RussianRoulette />}
          {activeGame === 'grid' && <NeonTicTacToe />}
          {activeGame === 'draw' && <QuickDraw />}
          {activeGame === 'circle' && <PerfectCircle />}
          {activeGame === 'chrono' && <ChronoStop />}
          {activeGame === 'clash' && <MindClash />}
          {activeGame === 'dots' && <DotsAndBoxes />}
        </main>
      </div>
    </div>
  );
}
