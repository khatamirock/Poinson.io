/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import CupGame from './components/CupGame';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl flex flex-col border-4 sm:border-8 border-slate-900 bg-slate-950 shadow-2xl relative overflow-hidden min-h-[600px] h-[85vh] sm:h-[800px]">
        {/* Header: Geometric Navigation */}
        <nav className="h-16 flex items-center justify-between px-8 md:px-12 border-b border-slate-800 bg-slate-900/50 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 transform rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-slate-950 rotate-[-45deg]"></div>
            </div>
            <span className="font-bold tracking-widest text-xl uppercase">Venom.io</span>
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
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <CupGame />
        </main>
      </div>
    </div>
  );
}
