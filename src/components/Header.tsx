import React from 'react';
import { Sparkles, Brain, Cpu, BookOpen, Clock, Wallet } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'architecture' | 'schema' | 'prompt';
  setActiveTab: (tab: 'simulator' | 'architecture' | 'schema' | 'prompt') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  UniLife Companion <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">EduFlow AI</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                AI Controller giải quyết &ldquo;Tam giác áp lực&rdquo; Sinh viên: Tài chính • Thời gian • Kiến thức
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Core: <b>Gemini 3.8 Flash</b></span>
            </div>
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              <Clock className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
              <BookOpen className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
              <span>4 Trụ cột State</span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-1 overflow-x-auto">
          <button
            id="tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-indigo-400 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Engine Simulator (Thử nghiệm Live)</span>
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-indigo-400 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Kiến trúc Hệ thống (Architecture)</span>
          </button>

          <button
            id="tab-schema"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-indigo-400 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Schema Student State (Data Model)</span>
          </button>

          <button
            id="tab-prompt"
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-indigo-400 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. System Prompt & Gemini JSON Schema</span>
          </button>
        </div>
      </div>
    </header>
  );
};
