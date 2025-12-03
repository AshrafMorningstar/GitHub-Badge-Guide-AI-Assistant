import React, { useState, useRef, useEffect } from 'react';
import { AiMode, ChatMessage } from '../types';
import * as GeminiService from '../services/geminiService';

const AiSidepanel: React.FC = () => {
  const [mode, setMode] = useState<AiMode>(AiMode.FAST_CHAT);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Image Gen/Edit States
  const [selectedImageSize, setSelectedImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const ensureApiKeyForPro = async () => {
    const win = window as any;
    if (win.aistudio) {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await win.aistudio.openSelectKey();
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() && mode !== AiMode.IMAGE_EDIT) return;
    if (mode === AiMode.IMAGE_EDIT && !uploadedImage) {
        alert("Please upload an image to edit first.");
        return;
    }

    setIsLoading(true);
    const userMsg: ChatMessage = { role: 'user', text: input };
    
    // For chat modes, add to history immediately
    if (mode !== AiMode.IMAGE_GEN && mode !== AiMode.IMAGE_EDIT) {
       setMessages(prev => [...prev, userMsg]);
    }
    
    setInput('');

    try {
      if (mode === AiMode.FAST_CHAT) {
        const text = await GeminiService.generateFastResponse(userMsg.text);
        setMessages(prev => [...prev, { role: 'model', text }]);
      } 
      else if (mode === AiMode.THINKING_CHAT) {
        const text = await GeminiService.generateThinkingResponse(userMsg.text);
        setMessages(prev => [...prev, { role: 'model', text }]);
      } 
      else if (mode === AiMode.SEARCH_GROUNDING) {
        const { text, links } = await GeminiService.generateSearchResponse(userMsg.text);
        const groundingUrls = links.map((chunk: any) => ({
            title: chunk.web?.title || "Source",
            uri: chunk.web?.uri || "#"
        })).filter((l: any) => l.uri !== "#");
        
        setMessages(prev => [...prev, { role: 'model', text, groundingUrls }]);
      } 
      else if (mode === AiMode.IMAGE_GEN) {
        await ensureApiKeyForPro();
        const imgData = await GeminiService.generateImage(userMsg.text, selectedImageSize);
        setGeneratedImage(imgData);
      } 
      else if (mode === AiMode.IMAGE_EDIT) {
        if (uploadedImage) {
           const imgData = await GeminiService.editImage(uploadedImage, userMsg.text);
           setGeneratedImage(imgData);
        }
      }

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "An error occurred.";
      if (mode !== AiMode.IMAGE_GEN && mode !== AiMode.IMAGE_EDIT) {
          setMessages(prev => [...prev, { role: 'model', text: `System: ${errorMsg}` }]);
      } else {
          alert(`Error: ${errorMsg}`);
      }
      
      // Handle specific "Requested entity was not found" for API key race condition
      if (errorMsg.includes("Requested entity was not found") && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case AiMode.IMAGE_GEN:
        return (
          <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
             <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 p-4 rounded-2xl text-sm text-yellow-800 dark:text-yellow-200 shadow-sm">
               High-quality image generation active.
             </div>
             
             <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image Size</label>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {['1K', '2K', '4K'].map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedImageSize(size as any)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedImageSize === size ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl min-h-[250px] overflow-hidden relative">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-blue-500">Creating masterpiece...</span>
                    </div>
                ) : generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                         <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain" />
                         <a href={generatedImage} download="generated-image.png" className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-colors">Download</a>
                    </div>
                ) : (
                    <div className="text-center p-6 opacity-40">
                        <div className="text-4xl mb-2">🎨</div>
                        <p className="text-sm font-medium">Enter a prompt below</p>
                    </div>
                )}
             </div>
             
             <div className="flex flex-col gap-3">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe a gold octocat badge with neon lights..."
                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24"
                />
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    Generate Image
                </button>
             </div>
          </div>
        );

      case AiMode.IMAGE_EDIT:
        return (
            <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
                 <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-700/30 p-4 rounded-2xl text-sm text-purple-800 dark:text-purple-200 shadow-sm">
                    Image editing active. Upload a badge to remix it.
                </div>

                <div className="grid grid-cols-2 gap-4 h-[250px]">
                    <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center relative hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors bg-gray-50 dark:bg-white/5 cursor-pointer">
                        {uploadedImage ? (
                            <img src={uploadedImage} alt="Upload" className="max-w-full max-h-full object-contain p-2" />
                        ) : (
                            <>
                                <div className="w-8 h-8 mb-2 text-gray-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                                <span className="text-gray-500 text-xs font-medium">Upload Source</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <div className="border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-white/5 overflow-hidden">
                        {isLoading ? (
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : generatedImage ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                                <img src={generatedImage} alt="Result" className="max-w-full max-h-full object-contain" />
                                <a href={generatedImage} download="edited-image.png" className="absolute bottom-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-black transition-colors"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></a>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-xs">Result</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. Add a neon glow, remove background..."
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading || !uploadedImage || !input.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                    >
                        Edit Image
                    </button>
                </div>
            </div>
        );

      default: // Chat Modes
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.length === 0 && (
                        <div className="text-center mt-20 px-6">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How can I help you?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ask me about badge strategies, GitHub secrets, or generating new designs.</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <button onClick={() => setInput("How do I get the Pull Shark badge?")} className="text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-gray-600 dark:text-gray-300">Get Pull Shark</button>
                                <button onClick={() => setInput("List all retired badges")} className="text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-gray-600 dark:text-gray-300">Retired Badges</button>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-[#161b22] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/10 rounded-tl-none'
                            }`}>
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                            </div>
                            {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                                <div className="mt-2 text-xs flex flex-col gap-1 items-start w-full px-1">
                                    <span className="text-gray-400 font-medium text-[10px] uppercase tracking-wider pl-1">Sources</span>
                                    {msg.groundingUrls.map((url, i) => (
                                        <a key={i} href={url.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-full bg-blue-50 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/10 transition-colors">
                                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                                            {url.title || url.uri}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start">
                             <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/10 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {mode === AiMode.THINKING_CHAT ? "Thinking..." : "Typing..."}
                                </span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm">
                    <div className="flex gap-2 relative">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                            placeholder={mode === AiMode.SEARCH_GROUNDING ? "Ask about latest GitHub news..." : "Type your message..."}
                            className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                        />
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#161b22]/95 border-l border-gray-200/50 dark:border-white/10 w-[400px] backdrop-blur-xl transition-colors font-sans">
        <div className="p-5 border-b border-gray-200/50 dark:border-white/5 flex flex-col gap-1">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white tracking-tight">
                <span className="text-xl">✨</span> Smart Guide
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your personal expert</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 p-3 bg-gray-50/50 dark:bg-black/20 overflow-x-auto no-scrollbar border-b border-gray-200/50 dark:border-white/5">
             <button onClick={() => setMode(AiMode.FAST_CHAT)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === AiMode.FAST_CHAT ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 ring-1 ring-green-500/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5'}`}>
                ⚡ Fast
             </button>
             <button onClick={() => setMode(AiMode.THINKING_CHAT)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === AiMode.THINKING_CHAT ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5'}`}>
                🧠 Think
             </button>
             <button onClick={() => setMode(AiMode.SEARCH_GROUNDING)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === AiMode.SEARCH_GROUNDING ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5'}`}>
                🔎 Search
             </button>
             <button onClick={() => setMode(AiMode.IMAGE_GEN)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === AiMode.IMAGE_GEN ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-500/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5'}`}>
                🎨 Gen
             </button>
             <button onClick={() => setMode(AiMode.IMAGE_EDIT)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === AiMode.IMAGE_EDIT ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5'}`}>
                ✏️ Edit
             </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
        
        {/* API Key info/Disclaimer */}
        <div className="p-3 bg-gray-50/80 dark:bg-black/40 text-[10px] text-gray-500 dark:text-gray-500 text-center border-t border-gray-200/50 dark:border-white/5 backdrop-blur-sm">
             {mode === AiMode.IMAGE_GEN && <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-gray-700 dark:hover:text-gray-300">API Billing</a>}
        </div>
    </div>
  );
};

export default AiSidepanel;