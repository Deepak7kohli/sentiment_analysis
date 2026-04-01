import React, { useRef, useState } from 'react';
import { UploadCloud, FileType, CheckCircle2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

const FileUpload = ({ onFileSelect, onTextExtract, selectedFile, isExtracting }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    
    setDragActive(false);
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      
      // Extract text via OCR
      onTextExtract(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!selectedFile ? (
        <label 
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded cursor-pointer transition-all duration-200 group ${
            dragActive 
              ? 'border-slate-900 bg-slate-50 scale-[1.01]' 
              : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-12 h-12 mb-4 rounded flex items-center justify-center transition-all duration-200 ${
              dragActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
            }`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            
            <p className="text-base font-bold text-slate-900 mb-1 tracking-tight">
              Drop your file here, or <span className="text-slate-500 font-medium underline underline-offset-2">browse</span>
            </p>
            
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Upload a file (CSV or TXT) containing reviews OR upload an image directly.
            </p>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <FileType className="w-3 h-3" /> .csv / .txt
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <ImageIcon className="w-3 h-3" /> .jpg / .png
              </span>
            </div>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".csv,.txt,image/*"
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="relative group animate-scale-in">
          <div className="bg-slate-50 border border-slate-200 rounded p-6 flex items-center gap-6">
            <div className="relative">
              <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center text-white">
                {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-6 h-6" /> : <FileType className="w-6 h-6" />}
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-600 text-white p-0.5 rounded-full border-2 border-slate-50">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 font-bold text-base truncate tracking-tight">
                {selectedFile.name}
              </h4>
              <p className="text-slate-500 text-xs">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
              </p>
            </div>

            <button 
              onClick={clearFile}
              className="p-2 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {preview && (
            <div className="mt-4 rounded overflow-hidden border border-slate-200 relative group bg-white p-2">
              <img src={preview} alt="Upload preview" className="w-full max-h-48 object-contain rounded-sm" />
              <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 p-2 rounded shadow-sm">
                  {isExtracting ? (
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Extracting text</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Text extracted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
