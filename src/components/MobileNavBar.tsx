import React from 'react';
import { CalendarDays, BarChart3, UserCheck, Cpu } from 'lucide-react';

export type MobileTab = 'today' | 'state' | 'profile' | 'dev';

interface MobileNavBarProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'today' as MobileTab, label: 'Hôm nay', icon: CalendarDays },
    { id: 'state' as MobileTab, label: 'Trạng thái', icon: BarChart3 },
    { id: 'profile' as MobileTab, label: 'Cá nhân', icon: UserCheck },
    { id: 'dev' as MobileTab, label: 'Kiến trúc AI', icon: Cpu },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 flex items-center justify-around select-none shrink-0 z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'bg-transparent text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
