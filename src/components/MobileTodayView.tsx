import React, { useState } from 'react';
import { StudentState, DailyActionPlan } from '../types';
import { 
  Sparkles, 
  Wallet, 
  BookOpen, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  MapPin, 
  BrainCircuit, 
  Flame, 
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  PlusCircle,
  Layers,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  UploadCloud
} from 'lucide-react';

interface MobileTodayViewProps {
  studentState: StudentState;
  actionPlan: DailyActionPlan | null;
  loading: boolean;
  onRefreshAi: () => void;
  onOpenOnboarding: () => void;
  onOpenStateTab: () => void;
  onOpenFinancialTracker: () => void;
  onOpenStudyGames: () => void;
  onOpenMaterialsModal?: (subjectId?: string) => void;
}

export const MobileTodayView: React.FC<MobileTodayViewProps> = ({
  studentState,
  actionPlan,
  loading,
  onRefreshAi,
  onOpenOnboarding,
  onOpenStateTab,
  onOpenFinancialTracker,
  onOpenStudyGames,
  onOpenMaterialsModal,
}) => {
  // Pomodoro Mini Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Safe daily quota computation
  const remainingSpendable =
    studentState.financial.monthlyIncome -
    studentState.financial.savingsTarget -
    studentState.financial.fixedExpensesMonthly -
    studentState.financial.currentSpentThisMonth;
  const daysRemaining = Math.max(1, studentState.financial.daysRemainingInMonth || 20);
  const dailyQuota = Math.max(
    0,
    Math.round(remainingSpendable / daysRemaining)
  );

  const subjects = studentState.learning.subjects || [];
  const primarySubject = subjects[0] || {
    subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
    subjectCode: 'DSA102',
    daysUntilExam: 14,
    totalChapters: 6,
    completedChapters: 2,
    estimatedTotalHoursNeeded: 18,
    targetGrade: 8.5,
    gaps: [{ topic: 'Cây AVL (Hệ số cân bằng BF & 4 phép xoay)' }],
  };

  const requiredDailyHours = Math.round(
    (primarySubject.estimatedTotalHoursNeeded / Math.max(1, primarySubject.daysUntilExam)) * 10
  ) / 10;

  const recentTransactions = (studentState.financial.transactions || []).slice(0, 2);

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Top Greeting & Quick Profile Access */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
            {studentState.fullName.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-slate-800">
                Chào {studentState.fullName.split(' ').pop()} 👋
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
              {studentState.personal.university}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition-all text-xs flex items-center space-x-1 cursor-pointer"
          title="Chỉnh sửa thông tin bản thân"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      {/* Pressure Triangle: 3 Status Pillars */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Pillar 1: Finance with Quick Add */}
        <div 
          onClick={onOpenFinancialTracker}
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer hover:border-amber-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between text-amber-700 font-bold text-[10px] uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <Wallet className="w-3 h-3" />
                <span>Hạn mức ngày</span>
              </div>
              <PlusCircle className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-sm font-extrabold text-amber-900 font-mono mt-1">
              {dailyQuota.toLocaleString('vi-VN')}đ
            </div>
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium flex items-center justify-between">
            <span>Đã chi: {(studentState.financial.currentSpentThisMonth / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Pillar 2: Exam & Subjects */}
        <div 
          onClick={onOpenStateTab}
          className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer hover:border-rose-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between text-rose-700 font-bold text-[10px] uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>Thi cử</span>
              </div>
              <span className="text-[9px] bg-rose-200/80 px-1 rounded text-rose-800">{subjects.length} môn</span>
            </div>
            <div className="text-sm font-extrabold text-rose-900 font-mono mt-1">
              {primarySubject.daysUntilExam} ngày
            </div>
          </div>
          <div className="text-[10px] text-rose-700/80 mt-1 font-medium truncate">
            {primarySubject.subjectCode}
          </div>
        </div>

        {/* Pillar 3: Time Free */}
        <div 
          onClick={onOpenStateTab}
          className="bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer hover:border-sky-300 transition-all"
        >
          <div>
            <div className="flex items-center space-x-1 text-sky-700 font-bold text-[10px] uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>Giờ rảnh</span>
            </div>
            <div className="text-sm font-extrabold text-sky-900 font-mono mt-1">
              {studentState.time.totalFreeHoursToday}h
            </div>
          </div>
          <div className="text-[10px] text-sky-700/80 mt-1 font-medium">
            Lịch trình tự do
          </div>
        </div>
      </div>

      {/* Quick Financial Update Pill */}
      <div className="bg-white rounded-2xl p-3 border border-amber-200/70 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Sổ thu chi hôm nay</span>
              <span className="text-[10px] font-mono text-slate-500">
                ({recentTransactions.length > 0 ? `${recentTransactions[0].note} -${recentTransactions[0].amount.toLocaleString()}đ` : 'Chưa có khoản chi mới'})
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ghi nhận để AI tự động tái cân bằng tiền ăn & cà phê
            </p>
          </div>
        </div>
        <button
          onClick={onOpenFinancialTracker}
          className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center space-x-1 transition-all cursor-pointer whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Ghi chi tiêu</span>
        </button>
      </div>

      {/* INTERACTIVE STUDY GAMES BANNER (Active Recall Flashcards & Quiz) */}
      <div 
        onClick={onOpenStudyGames}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-4 text-white shadow-md cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-all" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                  Game Ôn Thi
                </span>
                <span className="text-xs font-bold text-white">Active Recall</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                🎴 Thẻ Nhớ & 🧠 Đố Vui Tư Duy Môn Học
              </h3>
              <p className="text-[11px] text-indigo-100">
                Lật thẻ nhớ & trả lời câu hỏi tư duy củng cố kiến thức trước ngày thi
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-sm hover:bg-amber-300 transition-all shrink-0 ml-2">
            Chơi ngay →
          </button>
        </div>
      </div>

      {/* Main AI Generation CTA Button */}
      <button
        id="btn-trigger-ai"
        onClick={onRefreshAi}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>AI đang cân bằng thời gian thi cử & ngân sách...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Tối ưu lại Lịch trình & Lộ trình Ôn Thi</span>
          </>
        )}
      </button>

      {/* EXAM REVISION ROADMAP CARD (Lộ trình tư vấn ôn tập) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                Lộ Trình Ôn Thi Khuyến Nghị: {primarySubject.subjectName}
              </h3>
              <p className="text-[10px] text-slate-500">
                Dựa trên {primarySubject.totalChapters} chương ({primarySubject.estimatedTotalHoursNeeded}h) & {primarySubject.daysUntilExam} ngày còn lại
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-black text-rose-600 font-mono">
              ~{requiredDailyHours}h / ngày
            </span>
            <span className="text-[9px] text-slate-400 block">
              (Rảnh: {studentState.time.totalFreeHoursToday}h)
            </span>
          </div>
        </div>

        {/* Progress bar of chapters */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium">Tiến độ nắm vững kiến thức:</span>
            <span className="font-bold text-indigo-600">
              {primarySubject.completedChapters}/{primarySubject.totalChapters} chương (
              {Math.round((primarySubject.completedChapters / Math.max(1, primarySubject.totalChapters)) * 100)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.round(
                  (primarySubject.completedChapters / Math.max(1, primarySubject.totalChapters)) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* 3-Phase Roadmap Breakdown */}
        <div className="space-y-2 pt-1">
          {actionPlan?.examRoadmap && actionPlan.examRoadmap.length > 0 ? (
            actionPlan.examRoadmap.map((phase, pIdx) => (
              <div
                key={pIdx}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                      {pIdx + 1}
                    </span>
                    <span>{phase.phaseName}</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md font-bold">
                    {phase.daysRange}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{phase.strategy}</p>
                <div className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Cột mốc: {phase.keyMilestone}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="font-bold text-slate-800">Giai đoạn 1: Nền tảng & Bịt kín Lỗ hổng AVL</div>
              <p className="text-[11px] text-slate-600">
                Phân bổ {requiredDailyHours} giờ mỗi ngày trong 5 ngày tới để làm chủ các phép xoay cây và giải thuật đồ thị.
              </p>
            </div>
          )}
        </div>

        {/* Materials & Quizzes Provided for this Subject */}
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Tài liệu & Đề trắc nghiệm ({primarySubject.materials?.length || 0})</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenMaterialsModal?.(primarySubject.id)}
              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs flex items-center space-x-1 cursor-pointer transition-all"
            >
              <UploadCloud className="w-3 h-3 text-indigo-600" />
              <span>+ Quản lý / Nạp thêm</span>
            </button>
          </div>

          {primarySubject.materials && primarySubject.materials.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {primarySubject.materials.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center space-x-1 text-[10px] bg-white px-2 py-0.5 rounded-md border border-amber-200 text-slate-700 font-medium shadow-2xs"
                >
                  <span>{m.type === 'QUIZ' ? '📝' : m.type === 'TEXTBOOK' ? '📕' : '📊'}</span>
                  <span className="truncate max-w-[140px] font-semibold">{m.name}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-amber-800 leading-normal">
              💡 <b>Chưa có giáo trình môn này:</b> Cung cấp giáo trình hoặc đề trắc nghiệm giúp AI trích xuất câu hỏi ôn thi sát thực tế nhất.
            </p>
          )}
        </div>
      </div>

      {/* Focus Pomodoro Box */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-indigo-200">
            🎯 Phiên Pomodoro Trọng Tâm
          </span>
          <span className="text-xs text-indigo-200">
            Mục tiêu: {primarySubject.targetGrade}/10 điểm
          </span>
        </div>

        <h3 className="text-base font-bold text-white mt-1">
          {primarySubject.gaps[0]?.topic || 'Cây AVL (Phép xoay LL & RR)'}
        </h3>
        <p className="text-xs text-indigo-200 mt-0.5">
          {actionPlan?.learningFocus.studyStrategy || 'Chia nhỏ thành các phiên tập trung trong quỹ thời gian rảnh'}
        </p>

        {/* Timer Display */}
        <div className="mt-4 flex items-center justify-between bg-black/20 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
          <div>
            <div className="text-2xl font-mono font-black text-amber-300 tracking-wider">
              {formatTime(timerSeconds)}
            </div>
            <div className="text-[10px] text-indigo-200">
              {timerRunning ? 'Đang chạy phiên Pomodoro...' : 'Sẵn sàng hạ gục lỗ hổng'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTimer}
              className={`p-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                timerRunning
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}
            >
              {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Đặt lại 25 phút"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Timeline (Lịch trình hành động hôm nay - Tự do & Linh hoạt) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <span>Dòng Thời Gian Hành Động Hôm Nay</span>
          </h3>
          <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
            Lịch trình linh hoạt
          </span>
        </div>

        <div className="space-y-2.5">
          {actionPlan?.scheduleTimeline && actionPlan.scheduleTimeline.length > 0 ? (
            actionPlan.scheduleTimeline.map((block, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex items-start space-x-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    block.blockType === 'POMODORO_STUDY'
                      ? 'bg-rose-100 text-rose-600'
                      : block.blockType === 'MEAL_BREAK'
                      ? 'bg-amber-100 text-amber-600'
                      : block.blockType === 'REVIEW'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-sky-100 text-sky-600'
                  }`}
                >
                  {block.blockType === 'POMODORO_STUDY' ? (
                    <BrainCircuit className="w-4 h-4" />
                  ) : block.blockType === 'MEAL_BREAK' ? (
                    <Coffee className="w-4 h-4" />
                  ) : block.blockType === 'REVIEW' ? (
                    <Layers className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded-md">
                      {block.timeWindow}
                    </span>
                    {block.estimatedCostVND > 0 && (
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        ~{block.estimatedCostVND.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{block.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{block.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs bg-white rounded-2xl border border-slate-100">
              Bấm "AI Tối ưu lại Lịch trình" để phân bổ các khối học hôm nay.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
