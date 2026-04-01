import React from 'react';
import { Smile, Frown, BarChart3, TrendingUp, Info } from 'lucide-react';

const ResultCard = ({ prediction }) => {
  if (prediction === null) return null;

  const isPositive = prediction > 0.49;
  const score = (prediction * 100).toFixed(1);
  const Icon = isPositive ? Smile : Frown;
  
  // Minimalist palette
  const themeClasses = isPositive 
    ? {
        border: 'border-emerald-200',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        bar: 'bg-emerald-600',
        iconBg: 'bg-emerald-100',
        label: 'Positive'
      }
    : {
        border: 'border-rose-200',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        bar: 'bg-rose-600',
        iconBg: 'bg-rose-100',
        label: 'Negative'
      };

  return (
    <div className="animate-fade-in-up mt-12 mb-16 max-w-2xl mx-auto">
      <div className="text-center mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Analysis Report
        </h2>
      </div>

      <div className={`bg-white border rounded p-8 ${themeClasses.border}`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Main Visual Indicator */}
          <div className="flex flex-col items-center flex-shrink-0 w-32">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${themeClasses.iconBg} ${themeClasses.text}`}>
              <Icon className="w-10 h-10" />
            </div>
            <span className={`text-2xl font-black ${themeClasses.text}`}>{score}%</span>
          </div>

          {/* Details Content */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`text-3xl font-black uppercase tracking-tight ${themeClasses.text}`}>
                  {themeClasses.label}
                </h3>
              </div>
              <p className="text-slate-500 text-sm">
                Our model identifies this content as having {isPositive ? 'favorable' : 'unfavorable'} sentiment attributes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Confidence Score</span>
                <span className="text-slate-600">{score}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded overflow-hidden border border-slate-200">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${themeClasses.bar}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-slate-50 border border-slate-200">
                <TrendingUp className="w-3 h-3" />
                <span>Real-time Scoring</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-slate-50 border border-slate-200">
                <Info className="w-3 h-3" />
                <span>v1.2 Predictor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
