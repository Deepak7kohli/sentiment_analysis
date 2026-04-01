import React from 'react';
import { MousePointer2 } from 'lucide-react';

const EmptyState = ({ modelName }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in opacity-80">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded bg-white border border-slate-200 border-dashed flex items-center justify-center">
          <MousePointer2 className="w-8 h-8 text-slate-300" />
        </div>
      </div>
      
      <p className="text-slate-500 text-sm text-center max-w-sm leading-relaxed">
        Model selected: <span className="font-semibold text-slate-700">{modelName}</span><br />
        Input data above to generate your first sentiment prediction.
      </p>
    </div>
  );
};

export default EmptyState;
