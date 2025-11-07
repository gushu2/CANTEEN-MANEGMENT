import React, { useState, useCallback, useMemo } from 'react';
import { editImageWithGemini } from '../services/geminiService';

const Spinner: React.FC = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-slate-600 font-semibold">Gemini is thinking...</p>
    </div>
  </div>
);

const ImagePlaceholder: React.FC<{ icon: React.ReactElement; text: string; subtext?: string }> = ({ icon, text, subtext }) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
    <div className="w-16 h-16 text-slate-400">{icon}</div>
    <p className="mt-4 font-semibold text-lg">{text}</p>
    {subtext && <p className="mt-1 text-sm">{subtext}</p>}
  </div>
);

const ImageEditor: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const originalImageUrl = useMemo(() => {
    if (originalImageFile) {
      return URL.createObjectURL(originalImageFile);
    }
    return null;
  }, [originalImageFile]);

  const resetState = () => {
    setOriginalImageFile(null);
    setEditedImageUrl(null);
    setPrompt('');
    setIsLoading(false);
    setError(null);
    setIsDragging(false);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      if (files[0].type.startsWith('image/')) {
        resetState();
        setOriginalImageFile(files[0]);
      } else {
        setError('Please upload a valid image file (e.g., PNG, JPG, WEBP).');
      }
    }
  };

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleGenerate = async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const resultUrl = await editImageWithGemini(originalImageFile, prompt);
      if (resultUrl) {
        setEditedImageUrl(resultUrl);
      } else {
        setError('The AI model did not return an image. Try a different prompt.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-slide-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">AI Image Studio</h2>
        <p className="text-slate-500 mt-1">Edit images with text prompts using Gemini 2.5 Flash Image.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Upload and Prompt */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col">
          {!originalImageUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragEvents}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`relative flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <ImagePlaceholder
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                text="Drag & drop your image here"
                subtext="or click to browse"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload Image"
              />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-200 mb-4">
                <img src={originalImageUrl} alt="Original upload" className="w-full h-full object-contain" />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Add a retro filter, remove the background..."
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                rows={3}
              />
              <div className="mt-4 flex space-x-2">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt}
                    className="flex-grow bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span>Generate</span>
                 </button>
                 <button onClick={resetState} className="bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                    Reset
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Result */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col relative aspect-square lg:aspect-auto">
          {isLoading && <Spinner />}
          {error && !isLoading && (
             <ImagePlaceholder
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                text="An Error Occurred"
                subtext={error}
            />
          )}
          {!isLoading && !error && editedImageUrl && (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-200">
                <img src={editedImageUrl} alt="AI edited result" className="w-full h-full object-contain" />
            </div>
          )}
          {!isLoading && !error && !editedImageUrl && (
            <ImagePlaceholder
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                text="Your edited image will appear here"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
