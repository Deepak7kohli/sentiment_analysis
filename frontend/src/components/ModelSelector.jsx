import React from 'react';
import { ShoppingCart, Vote, Film, MessageCircle, ChevronRight } from 'lucide-react';

const models = [
  {
    id: 'amazon',
    name: 'Amazon Product',
    icon: ShoppingCart,
    desc: 'Analyze product reviews and customer feedback sentiment.',
    accent: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-700'
    }
  },
  {
    id: 'election',
    name: 'Election',
    icon: Vote,
    desc: 'Analyze public opinion and political sentiment from news.',
    accent: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-700'
    }
  },
  {
    id: 'movie',
    name: 'Movie',
    icon: Film,
    desc: 'Analyze film reviews, ratings, and audience impressions.',
    accent: {
      bg: 'bg-fuchsia-50',
      text: 'text-fuchsia-700',
      border: 'border-fuchsia-700'
    }
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: MessageCircle,
    desc: 'Analyze real-time social sentiment from tweets.',
    accent: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-700'
    }
  }
];

const ModelSelector = ({ selectedModel, onSelect }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-snug">
          Select Data Source
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Choose the origin of your data to load the appropriate model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map((model) => {
          const Icon = model.icon;
          const isActive = selectedModel === model.id;
          
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model.id)}
              className={`group relative text-left p-6 rounded transition-colors duration-200 border ${
                isActive 
                  ? `bg-white ${model.accent.border}` 
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className={`w-10 h-10 rounded flex items-center justify-center mb-4 transition-colors ${isActive ? `${model.accent.bg} ${model.accent.text}` : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <h3 className={`text-base font-bold mb-2 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-900'}`}>
                {model.name}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {model.desc}
              </p>
              
              <div className={`mt-auto flex items-center text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                isActive ? model.accent.text : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <span>{isActive ? 'Active Model' : 'Select Source'}</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>

              {isActive && (
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${model.accent.bg} border ${model.accent.border}`}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;
export { models };
