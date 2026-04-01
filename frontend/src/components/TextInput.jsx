import React from 'react';

const TextInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Paste your content here for sentiment analysis..."}
          className="w-full h-48 bg-white text-slate-900 placeholder-slate-400 p-6 rounded border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all resize-none text-base leading-relaxed"
        />
        <div className="absolute bottom-4 right-6 text-slate-400 text-xs font-mono">
          {value.length} characters
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-2">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <p className="text-slate-500 text-sm">
          Manual input mode is best for quick, single-item sentiment checks.
        </p>
      </div>
    </div>
  );
};

export default TextInput;
