import React, { useState } from 'react';
import { StudentState, DailyActionPlan } from '../types';
import { initialStudentState } from '../data/mockStudentState';
import { 
  Play, 
  RefreshCw, 
  Wallet, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  MapPin, 
  Coffee, 
  BrainCircuit, 
  Sparkles,
  Info
} from 'lucide-react';

export const LiveSimulator: React.FC = () => {
  const [studentState, setStudentState] = useState<StudentState>(initialStudentState);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionPlan, setActionPlan] = useState<DailyActionPlan | null>(null);
  const [engineSource, setEngineSource] = useState<string>('');
  const [engineMessage, setEngineMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Quick helper to run AI Engine
  const runAiEngine = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentState),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setActionPlan(data.plan);
      setEngineSource(data.source || 'AI Engine');
      setEngineMessage(data.message || '');
    } catch (err: any) {
      console.error('Lỗi khi chạy AI Engine:', err);
      setError(err.message || 'Không thể kết nối đến AI Engine');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first mount if not yet run
  React.useEffect(() => {
    if (!actionPlan) {
      runAiEngine();
    }
  }, []);

  // Quick state modifiers for interactive testing
  const updateIncome = (val: number) => {
    setStudentState(prev => ({
      ...prev,
      financial: { ...prev.financial, monthlyIncome: val },
    }));
  };

  const updateSavings = (val: number) => {
    setStudentState(prev => ({
      ...prev,
      financial: { ...prev.financial, savingsTarget: val },
    }));
  };

  const updateFreeHours = (val: number) => {
    setStudentState(prev => ({
      ...prev,
      time: {
        ...prev.time,
        totalFreeHoursToday: val,
        freeWindows: [
          {
            start: '14:00',
            end: `${14 + Math.floor(val)}:${(val % 1) * 60 === 0 ? '00' : '30'}`,
            durationMinutes: Math.round(val * 60),
          },
        ],
      },
    }));
  };

  const updateExamDays = (days: number) => {
    setStudentState(prev => ({
      ...prev,
      learning: {
        ...prev.learning,
        subjects: prev.learning.subjects.map((sub, idx) =>
          idx === 0 ? { ...sub, daysUntilExam: days } : sub
        ),
      },
    }));
  };

  // Computed budget stats
  const remainingSpendable =
    studentState.financial.monthlyIncome -
    studentState.financial.savingsTarget -
    studentState.financial.fixedExpensesMonthly -
    studentState.financial.currentSpentThisMonth;
  const estimatedDailyQuota = Math.round(
    remainingSpendable / Math.max(1, studentState.financial.daysRemainingInMonth)
  );

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Banner / Quick Scenario Controls */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Kịch bản Mẫu: Sinh viên IT
              </span>
              <span className="text-xs text-slate-400">ID: {studentState.studentId} • {studentState.fullName}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Thử nghiệm Bàn điều khiển AI Controller & Sinh Lịch Trình
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Điều chỉnh các tham số 4 trụ cột bên dưới và bấm &ldquo;Kích hoạt AI Engine&rdquo; để xem phản hồi thời gian thực.
            </p>
          </div>

          <button
            id="btn-run-ai"
            onClick={runAiEngine}
            disabled={loading}
            className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all ${
              loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer active:scale-98'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                <span>Đang phân tích 4 trụ cột...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Kích hoạt AI Engine (Gemini 3.8)</span>
              </>
            )}
          </button>
        </div>

        {/* Quick parameters interactive sliders / inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>Thu nhập tháng</span>
              <span className="text-indigo-400 font-mono font-bold">{(studentState.financial.monthlyIncome / 1000000).toFixed(1)}M</span>
            </label>
            <input
              type="range"
              min="2000000"
              max="6000000"
              step="200000"
              value={studentState.financial.monthlyIncome}
              onChange={(e) => updateIncome(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>Mục tiêu tiết kiệm</span>
              <span className="text-amber-400 font-mono font-bold">{(studentState.financial.savingsTarget / 1000).toFixed(0)}k</span>
            </label>
            <input
              type="range"
              min="400000"
              max="1500000"
              step="50000"
              value={studentState.financial.savingsTarget}
              onChange={(e) => updateSavings(Number(e.target.value))}
              className="w-full mt-2 accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>Quỹ thời gian rảnh</span>
              <span className="text-sky-400 font-mono font-bold">{studentState.time.totalFreeHoursToday} giờ</span>
            </label>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={studentState.time.totalFreeHoursToday}
              onChange={(e) => updateFreeHours(Number(e.target.value))}
              className="w-full mt-2 accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>Ngày đến kỳ thi DSA</span>
              <span className="text-rose-400 font-mono font-bold">{studentState.learning.subjects[0]?.daysUntilExam} ngày</span>
            </label>
            <input
              type="range"
              min="3"
              max="30"
              step="1"
              value={studentState.learning.subjects[0]?.daysUntilExam || 14}
              onChange={(e) => updateExamDays(Number(e.target.value))}
              className="w-full mt-2 accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Engine status pill */}
        {engineMessage && (
          <div className="mt-4 flex items-center justify-between text-xs px-3 py-2 bg-slate-900/60 rounded-lg border border-slate-700/60 text-slate-300">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{engineMessage}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">{engineSource}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Lỗi: {error}</span>
        </div>
      )}

      {/* 4 Pillars Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pillar 1: Financial */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <Wallet className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> 1. FINANCIAL
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">Bán kính</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {estimatedDailyQuota.toLocaleString('vi-VN')}đ
            <span className="text-xs font-normal text-slate-400">/ngày</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
            <div>Thu nhập: <b>{(studentState.financial.monthlyIncome).toLocaleString('vi-VN')}đ</b></div>
            <div>Mục tiêu TK: <b className="text-amber-400">{(studentState.financial.savingsTarget).toLocaleString('vi-VN')}đ</b></div>
            <div>Đã chi: {(studentState.financial.currentSpentThisMonth).toLocaleString('vi-VN')}đ (còn {studentState.financial.daysRemainingInMonth} ngày)</div>
          </div>
        </div>

        {/* Pillar 2: Learning */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <BookOpen className="w-3.5 h-3.5 text-rose-400 mr-1.5" /> 2. LEARNING
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">Khẩn cấp</span>
          </div>
          <div className="text-sm font-bold text-rose-300 truncate">
            {studentState.learning.subjects[0]?.gaps[0]?.topic.split('(')[0]}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
            <div>Môn: <b>DSA (Thi sau {studentState.learning.subjects[0]?.daysUntilExam} ngày)</b></div>
            <div>Hiện tại: {studentState.learning.subjects[0]?.currentGradeEstimate} ➔ Mục tiêu: <b className="text-emerald-400">{studentState.learning.subjects[0]?.targetGrade}</b></div>
            <div>Mức độ nắm: <b className="text-rose-400">{studentState.learning.subjects[0]?.gaps[0]?.masteryPercentage}%</b> (Cần {studentState.learning.subjects[0]?.gaps[0]?.estimatedHoursNeeded}h)</div>
          </div>
        </div>

        {/* Pillar 3: Time */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <Clock className="w-3.5 h-3.5 text-sky-400 mr-1.5" /> 3. TIME
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">Khớp lịch</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {studentState.time.totalFreeHoursToday} tiếng rảnh
          </div>
          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
            <div>Khung rảnh: <b>14:00 - 17:00 (180p)</b></div>
            <div>Học sáng: 07:30 - 11:30 (Phòng B2)</div>
            <div>Làm thêm: 18:00 - 19:30 (Thư viện)</div>
          </div>
        </div>

        {/* Pillar 4: Goals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center">
              <Target className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> 4. GOALS
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Bảo toàn</span>
          </div>
          <div className="text-xs font-semibold text-emerald-300 line-clamp-1">
            {studentState.goals.academicGoal}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
            <div className="truncate">Tài chính: {studentState.goals.financialGoal}</div>
            <div className="truncate">Sức khỏe: {studentState.goals.wellbeingGoal}</div>
          </div>
        </div>
      </div>

      {/* Main AI Generated Action Plan */}
      {actionPlan && (
        <div className="space-y-6">
          {/* Highlight metrics banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Wallet className="w-4 h-4" />
                <span>Hạn Mức Chi Tiêu An Toàn Hôm Nay</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {actionPlan.financialMetrics.safeDailySpendingLimitVND.toLocaleString('vi-VN')}
                <span className="text-sm font-normal text-slate-400 ml-1">VND</span>
              </div>
              <div className="mt-2 text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                {actionPlan.financialMetrics.financialTip}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/15 via-slate-800/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Chiến Thuật Bẻ Khóa Lỗ Hổng Kiến Thức</span>
              </div>
              <div className="text-sm font-bold text-white mb-1">
                {actionPlan.learningFocus.targetedTopic}
              </div>
              <div className="text-xs text-indigo-200 mb-2">
                Phân bổ: <strong className="text-amber-300">{actionPlan.learningFocus.pomodoroSlotsAllocated} phiên Pomodoro</strong> (75 - 90 phút tập trung cao độ)
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                {actionPlan.learningFocus.studyStrategy}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/15 via-slate-800/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BrainCircuit className="w-4 h-4" />
                <span>Phân Tích Đánh Đổi (Trade-Off Logic)</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {actionPlan.aiArchitectReflection.tradeOffDecisions}
              </div>
              <div className="mt-3 text-[11px] text-slate-400 italic border-t border-slate-700/60 pt-2">
                &ldquo;{actionPlan.aiArchitectReflection.pressureTriangleAnalysis}&rdquo;
              </div>
            </div>
          </div>

          {/* Schedule Timeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-md font-bold text-white flex items-center">
                  <Clock className="w-5 h-5 text-indigo-400 mr-2" />
                  Lịch Trình Hành Động Hàng Ngày (Action Timeline)
                </h3>
                <p className="text-xs text-slate-400">
                  Tự động điều chỉnh linh hoạt khớp vào 3 tiếng rảnh hôm nay và hạn mức chi tiêu.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Ngày {actionPlan.planDate}
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {actionPlan.scheduleTimeline.map((block, idx) => {
                const isStudy = block.blockType === 'POMODORO_STUDY';
                const isMeal = block.blockType === 'MEAL_BREAK';
                return (
                  <div key={idx} className="relative pl-9 group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-2.5 top-2.5 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 transition-transform group-hover:scale-125 ${
                        isStudy
                          ? 'bg-indigo-500 border-indigo-300 shadow-md shadow-indigo-500/50'
                          : isMeal
                          ? 'bg-amber-500 border-amber-300'
                          : 'bg-slate-600 border-slate-400'
                      }`}
                    />

                    <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 hover:border-slate-600 transition-all shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                            {block.timeWindow}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            isStudy ? 'bg-indigo-500/20 text-indigo-300' : isMeal ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {block.blockType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-1">
                          <span>Dự trù chi phí:</span>
                          <b className={block.estimatedCostVND > 0 ? 'text-amber-400 font-mono' : 'text-emerald-400'}>
                            {block.estimatedCostVND === 0 ? '0 VND (Miễn phí)' : `${block.estimatedCostVND.toLocaleString('vi-VN')} VND`}
                          </b>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{block.title}</h4>
                      <p className="text-xs text-slate-300 mb-3">{block.description}</p>

                      {block.actionItems && block.actionItems.length > 0 && (
                        <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800/80">
                          <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Nhiệm vụ cụ thể:</span>
                          <ul className="mt-1 space-y-1">
                            {block.actionItems.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-xs text-slate-200 flex items-start space-x-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle Recommendations within Financial Radius */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-md font-bold text-white mb-2 flex items-center">
              <Coffee className="w-5 h-5 text-amber-400 mr-2" />
              Gợi ý Lối sống & Học tập (Khóa theo Bán kính Tài chính)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              AI chỉ chọn lọc những địa điểm và thực đơn có chi phí phù hợp hạn mức để bảo toàn mục tiêu tiết kiệm 800.000đ.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {actionPlan.lifestyleRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase">
                        {rec.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {rec.costVND === 0 ? '0 VND' : `${rec.costVND.toLocaleString('vi-VN')} VND`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{rec.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{rec.reasoning}</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center text-[11px] text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Nằm trong bán kính an toàn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
