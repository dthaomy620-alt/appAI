import React, { useState } from 'react';
import { ArchitectureView } from './ArchitectureView';
import { SchemaView } from './SchemaView';
import { PromptView } from './PromptView';
import { Cpu, FileJson, Sparkles } from 'lucide-react';

export const MobileDevView: React.FC = () => {
  const [subTab, setSubTab] = useState<'arch' | 'schema' | 'prompt'>('arch');

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Sub Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setSubTab('arch')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'arch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Kiến trúc
        </button>
        <button
          onClick={() => setSubTab('schema')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'schema' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Schema
        </button>
        <button
          onClick={() => setSubTab('prompt')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'prompt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Prompt
        </button>
      </div>

      {subTab === 'arch' && <ArchitectureView />}
      {subTab === 'schema' && <SchemaView />}
      {subTab === 'prompt' && <PromptView />}
    </div>
  );
};
