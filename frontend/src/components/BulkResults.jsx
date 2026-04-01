import React from 'react';
import WordCloud from 'react-wordcloud';
import { Chart } from 'react-google-charts';
import { Brain, PieChart, TrendingUp, Info } from 'lucide-react';

const BulkResults = ({ wordFrequencies, counts }) => {
  if (!wordFrequencies?.length && !counts) return null;

  const wordCloudOptions = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [24, 64],
    colors: ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'],
    fontWeight: 'bold',
    enableOptimizations: true,
    deterministic: false,
    padding: 3,
  };

  const chartData = [
    ['Sentiment', 'Count', { role: 'style' }],
    ['Positive (>0.5)', counts?.greater_than_0_5 || 0, '#059669'], // emerald-600
    ['Negative (<0.5)', counts?.less_than_0_5 || 0, '#e11d48'], // rose-600
  ];

  const total = (counts?.greater_than_0_5 || 0) + (counts?.less_than_0_5 || 0);
  const positiveRate = total > 0 ? (((counts?.greater_than_0_5 || 0) / total) * 100).toFixed(0) : 0;

  return (
    <div className="animate-fade-in-up space-y-8 mt-12 mb-20">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dataset Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        {/* Word Cloud Panel */}
        <div className="bg-white rounded border border-slate-200 p-6 relative overflow-hidden group">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-900" />
              Frequent Keywords
            </h3>
            <div className="text-slate-400" title="Words extracted from the dataset sorted by significance">
               <Info className="w-4 h-4" />
            </div>
          </div>
          
          <div className="h-72 w-full transition-all duration-500 group-hover:scale-105">
            <WordCloud 
              words={wordFrequencies} 
              options={wordCloudOptions} 
            />
          </div>
        </div>

        {/* Chart Panel */}
        <div className="bg-white rounded border border-slate-200 p-6 relative overflow-hidden group">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-900" />
              Distribution
            </h3>
            <div className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
              {positiveRate}% POSITIVE
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <Chart
              chartType="BarChart"
              width="100%"
              height="280px"
              data={chartData}
              options={{
                backgroundColor: 'transparent',
                chartArea: { width: '65%', height: '80%' },
                hAxis: { 
                  title: 'Count', 
                  minValue: 0, 
                  textStyle: { color: '#64748b', fontSize: 10 },
                  titleTextStyle: { color: '#94a3b8', fontSize: 10 },
                  gridlines: { color: '#f1f5f9' }
                },
                vAxis: { 
                  textStyle: { color: '#334155', fontSize: 11, fontWeight: 'bold' }
                },
                legend: { position: 'none' },
                animation: { startup: true, duration: 1000, easing: 'out' }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Items Analyzed</span>
              <span className="text-2xl font-black text-slate-900">{total}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sentiment Lean</span>
              <span className={`text-2xl font-black ${positiveRate > 50 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {positiveRate > 50 ? 'Positive' : 'Mixed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkResults;
