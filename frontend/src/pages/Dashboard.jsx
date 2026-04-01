import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Header from '../components/Header';
import ModelSelector, { models } from '../components/ModelSelector';
import InputSection from '../components/InputSection';
import TextInput from '../components/TextInput';
import FileUpload from '../components/FileUpload';
import AnalyzeButton from '../components/AnalyzeButton';
import ResultCard from '../components/ResultCard';
import BulkResults from '../components/BulkResults';
import EmptyState from '../components/EmptyState';
import { AlertCircle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    // ── State ──
    const [selectedModel, setSelectedModel] = useState('amazon');
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'file'
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState(null);
    
    // Results
    const [prediction, setPrediction] = useState(null);
    const [wordFrequencies, setWordFrequencies] = useState([]);
    const [counts, setCounts] = useState(null);

    // ── Derived ──
    const currentModel = models.find(m => m.id === selectedModel);
    const isFileCSV = file && (file.name.endsWith('.csv') || file.type === 'text/csv');

    // ── Effects ──
    // Clear results and inputs when model or mode changes to keep UI clean
    useEffect(() => {
        setPrediction(null);
        setWordFrequencies([]);
        setCounts(null);
        setError(null);
        setText('');
        setFile(null);
    }, [selectedModel, inputMode]);

    // ── Actions ──
    const normalizePrediction = (pred) => {
        let val = Array.isArray(pred) ? pred[0] : pred;
        val = parseFloat(val);
        if (isNaN(val)) return 0.5;

        // Some models output on a 1.x scale where 1.5 is the neutral line
        if (val >= 1 && val <= 2) {
            val = val - 1;
        } 
        // If models output 1 to 5 stars
        else if (val > 2 && val <= 5) {
            val = (val - 1) / 4; 
        }

        return Math.max(0, Math.min(1, val));
    };

    const handleTextExtract = async (file) => {
        setIsExtracting(true);
        try {
            const { data: { text: extractedText } } = await Tesseract.recognize(file, 'eng');
            setText(extractedText);
        } catch (err) {
            console.error('OCR Error:', err);
            setError('Failed to extract text from image.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        setWordFrequencies([]);
        setCounts(null);

        try {
            if (inputMode === 'text') {
                if (!text.trim()) throw new Error('Please enter some text to analyze.');
                
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/${selectedModel}pred`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) throw new Error(await response.text() || 'Prediction failed');
                const data = await response.ok ? await response.json() : null;
                if (data) setPrediction(normalizePrediction(data.prediction));
            } 
            else {
                if (!file) throw new Error('Please upload a file.');

                // If it's an image, we analyze the extracted text instead
                if (file.type.startsWith('image/')) {
                    if (!text.trim()) throw new Error('No text extracted from image.');
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const response = await fetch(`${API_URL}/${selectedModel}pred`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });
                    if (!response.ok) throw new Error('Prediction failed');
                    const data = await response.json();
                    setPrediction(normalizePrediction(data.prediction));
                } 
                // Otherwise treat as CSV/TXT Bulk Upload
                else {
                    const formData = new FormData();
                    formData.append('file', file);

                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const response = await fetch(`${API_URL}/${selectedModel}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        // If it's a giant HTML error page, simplify it.
                        if (errText.includes('<html')) throw new Error(`Server Error (${response.status}): The file could not be uploaded.`);
                        throw new Error(errText || 'Upload failed');
                    }
                    
                    const data = await response.json();
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    
                    const words = Object.entries(data.word_frequencies || {}).map(([text, value]) => ({ text, value }));
                    setWordFrequencies(words);
                    setCounts(data.counts);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            // Smooth scroll to results
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30">
            <Header />

            <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-16">
                
                {/* ── Step 1: Model Selection ── */}
                <section>
                    <ModelSelector 
                        selectedModel={selectedModel} 
                        onSelect={setSelectedModel} 
                    />
                </section>

                <div className="flex justify-center flex-col items-center gap-4 animate-fade-in py-8">
                    <div className="h-12 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        <ArrowRight className="w-3 h-3" />
                        <span>Step 2: Configure Input</span>
                    </div>
                </div>

                {/* ── Step 2: Input ── */}
                <section className="max-w-4xl mx-auto w-full">
                    <InputSection activeTab={inputMode} onTabChange={setInputMode}>
                        {inputMode === 'text' ? (
                            <TextInput 
                                value={text} 
                                onChange={setText} 
                                placeholder={`Enter ${currentModel.name} content to analyze its sentiment...`}
                            />
                        ) : (
                            <FileUpload 
                                selectedFile={file} 
                                onFileSelect={setFile} 
                                onTextExtract={handleTextExtract}
                                isExtracting={isExtracting}
                            />
                        )}

                        {error && (
                            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-slide-down">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <AnalyzeButton 
                            onClick={handleAnalyze} 
                            isLoading={isLoading} 
                            disabled={inputMode === 'text' ? !text.trim() : !file}
                            label={`Analyze ${currentModel.name}`}
                        />
                    </InputSection>
                </section>

                {/* ── Results Output ── */}
                <section id="results" className="pt-12">
                    {prediction !== null ? (
                        <ResultCard prediction={prediction} />
                    ) : (wordFrequencies.length > 0 || counts) ? (
                        <BulkResults wordFrequencies={wordFrequencies} counts={counts} />
                    ) : (
                        <EmptyState modelName={currentModel.name} />
                    )}
                </section>

            </main>

            <footer className="relative py-12 border-t border-slate-200 bg-white text-center">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">
                   Sentiment Analysis Dashboard &bull; Build v3.0.0
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
