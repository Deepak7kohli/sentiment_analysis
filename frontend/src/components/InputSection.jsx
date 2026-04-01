import React from 'react';
import { Type, Upload } from 'lucide-react';

const InputSection = ({ activeTab, onTabChange, children }) => {
  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm animate-fade-in">
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => onTabChange('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all duration-200 text-sm ${
            activeTab === 'text' 
              ? 'bg-white text-slate-900 border-b-2 border-slate-900' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-b-2 border-transparent'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Enter Text</span>
        </button>
        <button
          onClick={() => onTabChange('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all duration-200 text-sm ${
            activeTab === 'file' 
              ? 'bg-white text-slate-900 border-b-2 border-slate-900' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-b-2 border-transparent'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File / Image</span>
        </button>
      </div>

      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default InputSection;
