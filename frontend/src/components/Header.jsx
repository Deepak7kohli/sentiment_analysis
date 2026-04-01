import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sentiment Analysis <span className="text-slate-500 font-medium">Dashboard</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Links disabled/hidden for clean look */}
          <span className="text-sm font-medium text-slate-500 uppercase tracking-widest text-[11px]">
            Data-Driven Insights
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
