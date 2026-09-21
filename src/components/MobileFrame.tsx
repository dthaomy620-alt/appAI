import React, { useState } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Sparkles, SlidersHorizontal, Wallet, BrainCircuit, BookOpen } from 'lucide-react';
import { MobileNavBar, MobileTab } from './MobileNavBar';
import { MobileTodayView } from './MobileTodayView';
import { MobileStateView } from './MobileStateView';
import { MobileProfileView } from './MobileProfileView';
import { MobileDevView } from './MobileDevView';
import { FinancialTrackerModal } from './FinancialTrackerModal';
import { StudyGamesModal } from './StudyGamesModal';
import { SubjectMaterialsModal } from './SubjectMaterialsModal';
import { StudentState, DailyActionPlan } from '../types';

interface MobileFrameProps {
  studentState: StudentState;
  actionPlan: DailyActionPlan | null;
  loading: boolean;
  onRefreshAi: () => void;
  onUpdateState: (newState: StudentState) => void;
  onOpenOnboarding: () => void;
  onResetToDemo: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  studentState,
  actionPlan,
  loading,
  onRefreshAi,
  onUpdateState,
  onOpenOnboarding,
  onResetToDemo,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('today');
  const [isPhoneMockup, setIsPhoneMockup] = useState<boolean>(true);
  const [showFinancialModal, setShowFinancialModal] = useState<boolean>(false);
  const [showGamesModal, setShowGamesModal] = useState<boolean>(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState<boolean>(false);
  const [selectedMaterialSubjectId, setSelectedMaterialSubjectId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-slate-50 to-purple-50/50 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 text-slate-800">
      {/* Top Bar for Mode Switching & Co-founder info */}
      <div className="w-full max-w-md sm:max-w-xl flex items-center justify-between py-2 px-1 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            U
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight flex items-center space-x-1.5">
              <span>UniLife Companion</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full">
                AI Mobile
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => {
              setSelectedMaterialSubjectId(undefined);
              setShowMaterialsModal(true);
            }}
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
            title="Tài liệu giáo trình & Đề trắc nghiệm môn học"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Tài liệu & Đề thi</span>
          </button>

          <button
            onClick={() => setShowGamesModal(true)}
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
            title="Chơi trò chơi thẻ nhớ & đố vui"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Game Ôn Thi</span>
          </button>

          <button
            onClick={() => setShowFinancialModal(true)}
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
            title="Sổ thu chi hàng ngày"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Thu Chi</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hồ sơ</span>
          </button>

          <button
            onClick={() => setIsPhoneMockup(!isPhoneMockup)}
            className="text-xs font-semibold px-2 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
            title={isPhoneMockup ? 'Chuyển sang dạng tràn màn hình' : 'Chuyển sang khung mô phỏng điện thoại'}
          >
            {isPhoneMockup ? (
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Mobile Device Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneMockup
            ? 'max-w-[420px] rounded-[44px] shadow-2xl shadow-indigo-500/10 border-[9px] border-slate-900 bg-slate-900 overflow-hidden ring-1 ring-slate-800/10'
            : 'max-w-md rounded-3xl shadow-lg border border-slate-200 bg-white overflow-hidden'
        }`}
      >
        {/* Phone Screen Canvas */}
        <div className="w-full bg-slate-50 flex flex-col h-[760px] max-h-[85vh] overflow-hidden relative select-none">
          {/* Status Bar (Simulating iOS/Android top bar) */}
          <div className="bg-white/95 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between text-xs text-slate-800 shrink-0 border-b border-slate-100/80 z-20">
            <span className="font-bold font-mono text-[11px] tracking-tight">09:41</span>

            {/* Dynamic Island / Notch Simulation in mockup mode */}
            {isPhoneMockup && (
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500/80 animate-pulse" />
                <span className="text-[8px] font-mono text-white/90">EduFlow</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 text-slate-700">
              <span className="text-[9px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            </div>
          </div>

          {/* Scrollable Mobile Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {activeTab === 'today' && (
              <MobileTodayView
                studentState={studentState}
                actionPlan={actionPlan}
                loading={loading}
                onRefreshAi={onRefreshAi}
                onOpenOnboarding={onOpenOnboarding}
                onOpenStateTab={() => setActiveTab('state')}
                onOpenFinancialTracker={() => setShowFinancialModal(true)}
                onOpenStudyGames={() => setShowGamesModal(true)}
                onOpenMaterialsModal={(subId) => {
                  setSelectedMaterialSubjectId(subId);
                  setShowMaterialsModal(true);
                }}
              />
            )}
            {activeTab === 'state' && (
              <MobileStateView
                studentState={studentState}
                onUpdateState={onUpdateState}
                onOpenOnboarding={onOpenOnboarding}
                onOpenFinancialTracker={() => setShowFinancialModal(true)}
                onOpenMaterialsModal={(subId) => {
                  setSelectedMaterialSubjectId(subId);
                  setShowMaterialsModal(true);
                }}
                onTriggerAi={onRefreshAi}
              />
            )}
            {activeTab === 'profile' && (
              <MobileProfileView
                studentState={studentState}
                onOpenOnboarding={onOpenOnboarding}
                onResetToDemo={onResetToDemo}
              />
            )}
            {activeTab === 'dev' && <MobileDevView />}
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <MobileNavBar activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Home Indicator bar on modern phones */}
          <div className="bg-white pb-1 pt-0.5 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* MODALS */}
      <FinancialTrackerModal
        isOpen={showFinancialModal}
        onClose={() => setShowFinancialModal(false)}
        studentState={studentState}
        onUpdateState={onUpdateState}
      />

      <StudyGamesModal
        isOpen={showGamesModal}
        onClose={() => setShowGamesModal(false)}
        studentState={studentState}
        onOpenMaterialsModal={(subId) => {
          setSelectedMaterialSubjectId(subId);
          setShowMaterialsModal(true);
        }}
      />

      <SubjectMaterialsModal
        isOpen={showMaterialsModal}
        onClose={() => setShowMaterialsModal(false)}
        studentState={studentState}
        onUpdateState={onUpdateState}
        initialSubjectId={selectedMaterialSubjectId}
      />
    </div>
  );
};
