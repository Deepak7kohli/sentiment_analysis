import React, { useState, useRef } from 'react';
import WordCloud from 'react-wordcloud';
import { Chart } from 'react-google-charts';
import Tesseract from 'tesseract.js';

export default function Twitter() {
    const [wordFrequencies, setWordFrequencies] = useState([]);
    const [error, setError] = useState('');
    const [counts, setCounts] = useState(null);
    const [csvLoading, setCsvLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [predLoading, setPredLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [csvFileName, setCsvFileName] = useState('');
    const fileInputRef = useRef(null);

    // ── CSV Upload ──
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setCsvLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/twitter', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setError('');
                const words = Object.entries(data.word_frequencies).map(([text, value]) => ({ text, value }));
                setWordFrequencies(words);
                setCounts(data.counts);
            } else {
                const errorText = await res.text();
                setError(`Error: ${res.status} ${res.statusText} - ${errorText}`);
                setWordFrequencies([]);
                setCounts(null);
            }
        } catch (err) {
            setError(`Network error: ${err.message}`);
            setWordFrequencies([]);
            setCounts(null);
        } finally {
            setCsvLoading(false);
        }
    };

    // ── Image OCR ──
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setOcrLoading(true);
            setImage(URL.createObjectURL(file));
            try {
                const { data: { text: extractedText } } = await Tesseract.recognize(file, 'eng');
                setText(extractedText);
            } catch (err) {
                console.error(err);
            } finally {
                setOcrLoading(false);
            }
        }
    };

    // ── Text Prediction ──
    const handleTextPrediction = async () => {
        if (!text.trim()) return;
        setPredLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/twitterpred', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            if (res.ok) {
                const data = await res.json();
                setPrediction(data.prediction);
            } else {
                setError(`Prediction Error: ${res.status} ${res.statusText}`);
                setPrediction(null);
            }
        } catch (err) {
            setError(`Prediction error: ${err.message}`);
            setPrediction(null);
        } finally {
            setPredLoading(false);
        }
    };

    const isPositive = prediction !== null && prediction > 0.49;
    const confidencePercent = prediction !== null ? (prediction * 100).toFixed(1) : 0;

    const wordCloudOptions = {
        rotations: 2,
        rotationAngles: [-90, 0],
        fontSizes: [30, 60],
        colors: ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#f472b6', '#38bdf8', '#c084fc'],
        fontWeight: 'bold',
        enableOptimizations: true,
        deterministic: false,
    };

    const chartData = [
        ['Sentiment', 'Count', { role: 'style' }],
        ['Positive ( > 0.49 )', counts?.greater_than_0_5 || 0, '#22c55e'],
        ['Negative ( < 0.49 )', counts?.less_than_0_5 || 0, '#ef4444'],
    ];

    const chartOptions = {
        title: '',
        backgroundColor: 'transparent',
        chartArea: { width: '65%', height: '70%' },
        hAxis: { title: 'Count', minValue: 0, textStyle: { color: '#94a3b8' }, titleTextStyle: { color: '#94a3b8' } },
        vAxis: { title: 'Sentiment', textStyle: { color: '#94a3b8' }, titleTextStyle: { color: '#94a3b8' } },
        legend: { position: 'none' },
        titleTextStyle: { color: '#e2e8f0' },
    };

    return (
        <div className="twitter-page">
            {/* Header */}
            <div className="twitter-header">
                <div className="twitter-header-icon">🐦</div>
                <h1 className="twitter-title">Twitter Sentiment Analysis</h1>
                <p className="twitter-subtitle">Analyze sentiment from CSV data, images, or direct text input</p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="twitter-error">
                    <span className="twitter-error-icon">⚠️</span>
                    <span>{error}</span>
                    <button className="twitter-error-close" onClick={() => setError('')}>✕</button>
                </div>
            )}

            {/* Cards Grid */}
            <div className="twitter-grid">

                {/* ── Card 1: CSV Upload ── */}
                <div className="twitter-card twitter-card-full">
                    <div className="twitter-card-header">
                        <span className="twitter-card-icon">📊</span>
                        <h2>Bulk CSV Analysis</h2>
                    </div>
                    <p className="twitter-card-desc">Upload a CSV file with tweets to analyze sentiment across the entire dataset.</p>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="twitter-file-zone" onClick={() => fileInputRef.current?.click()}>
                            <div className="twitter-file-zone-icon">📁</div>
                            <p className="twitter-file-zone-text">
                                {csvFileName || 'Click to select a CSV file'}
                            </p>
                            <p className="twitter-file-zone-hint">Only .csv files • Max 100MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="file"
                                accept=".csv"
                                style={{ display: 'none' }}
                                onChange={(e) => setCsvFileName(e.target.files[0]?.name || '')}
                            />
                        </div>
                        <button type="submit" className="twitter-btn twitter-btn-primary" disabled={csvLoading}>
                            {csvLoading ? (
                                <><span className="twitter-spinner"></span> Analyzing...</>
                            ) : (
                                <><span>🚀</span> Upload & Analyze</>
                            )}
                        </button>
                    </form>

                    {/* CSV Results */}
                    {(wordFrequencies.length > 0 || counts) && (
                        <div className="twitter-csv-results twitter-fade-in">
                            <div className="twitter-results-divider">
                                <span>Analysis Results</span>
                            </div>
                            <div className="twitter-results-grid">
                                {wordFrequencies.length > 0 && (
                                    <div className="twitter-result-panel">
                                        <h3>Word Cloud</h3>
                                        <div className="twitter-wordcloud-wrap">
                                            <WordCloud words={wordFrequencies} options={wordCloudOptions} />
                                        </div>
                                    </div>
                                )}
                                {counts && (
                                    <div className="twitter-result-panel">
                                        <h3>Sentiment Distribution</h3>
                                        <div className="twitter-chart-wrap">
                                            <Chart
                                                chartType="BarChart"
                                                width="100%"
                                                height="300px"
                                                data={chartData}
                                                options={chartOptions}
                                            />
                                        </div>
                                        <div className="twitter-stats-row">
                                            <div className="twitter-stat twitter-stat-positive">
                                                <span className="twitter-stat-num">{counts.greater_than_0_5 || 0}</span>
                                                <span className="twitter-stat-label">Positive</span>
                                            </div>
                                            <div className="twitter-stat twitter-stat-negative">
                                                <span className="twitter-stat-num">{counts.less_than_0_5 || 0}</span>
                                                <span className="twitter-stat-label">Negative</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Card 2: Image OCR ── */}
                <div className="twitter-card">
                    <div className="twitter-card-header">
                        <span className="twitter-card-icon">🖼️</span>
                        <h2>Image Text Extraction</h2>
                    </div>
                    <p className="twitter-card-desc">Upload an image containing text — we'll extract it using OCR for analysis.</p>
                    <label className="twitter-file-label">
                        <span>📷 Choose Image</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {ocrLoading && (
                        <div className="twitter-ocr-loading">
                            <span className="twitter-spinner"></span>
                            <span>Extracting text...</span>
                        </div>
                    )}
                    {image && (
                        <div className="twitter-image-preview twitter-fade-in">
                            <img src={image} alt="Uploaded" />
                        </div>
                    )}
                </div>

                {/* ── Card 3: Text Prediction ── */}
                <div className="twitter-card">
                    <div className="twitter-card-header">
                        <span className="twitter-card-icon">✍️</span>
                        <h2>Text Sentiment</h2>
                    </div>
                    <p className="twitter-card-desc">Type or paste text (or use OCR-extracted text) to predict its sentiment.</p>
                    <textarea
                        className="twitter-textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter tweet text here..."
                        rows={5}
                    />
                    <button
                        className="twitter-btn twitter-btn-accent"
                        onClick={handleTextPrediction}
                        disabled={predLoading || !text.trim()}
                    >
                        {predLoading ? (
                            <><span className="twitter-spinner"></span> Analyzing...</>
                        ) : (
                            <><span>🔍</span> Analyze Sentiment</>
                        )}
                    </button>

                    {/* Prediction Result */}
                    {prediction !== null && (
                        <div className={`twitter-prediction twitter-fade-in ${isPositive ? 'twitter-prediction-positive' : 'twitter-prediction-negative'}`}>
                            <div className="twitter-prediction-emoji">
                                {isPositive ? '😊' : '😔'}
                            </div>
                            <div className="twitter-prediction-body">
                                <span className={`twitter-badge ${isPositive ? 'twitter-badge-positive' : 'twitter-badge-negative'}`}>
                                    {isPositive ? '✓ Positive' : '✗ Negative'}
                                </span>
                                <div className="twitter-confidence">
                                    <span className="twitter-confidence-label">Confidence</span>
                                    <div className="twitter-confidence-bar-track">
                                        <div
                                            className={`twitter-confidence-bar-fill ${isPositive ? 'twitter-fill-positive' : 'twitter-fill-negative'}`}
                                            style={{ width: `${confidencePercent}%` }}
                                        />
                                    </div>
                                    <span className="twitter-confidence-val">{confidencePercent}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="twitter-footer">
                Powered by Machine Learning &bull; Sentiment Analysis Engine
            </div>
        </div>
    );
}
