import React from 'react';
import { Loader2 } from 'lucide-react';

const AnalyzeButton = ({ onClick, isLoading, disabled, label }) => {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`relative flex items-center justify-center gap-2 px-10 py-4 rounded font-bold text-sm uppercase tracking-widest transition-all duration-200 border ${
          isLoading || disabled
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 hover:border-slate-800 active:scale-[0.99] shadow-sm hover:shadow'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <span>{label || "Analyze Sentiment"}</span>
        )}
      </button>
    </div>
  );
};

export default AnalyzeButton;
