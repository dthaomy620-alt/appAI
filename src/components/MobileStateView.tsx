import React from 'react';
import { StudentState } from '../types';
import { 
  Wallet, 
  BookOpen, 
  Clock, 
  Target, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Sliders, 
  Plus, 
  Layers,
  Calendar,
  AlertCircle,
  UploadCloud
} from 'lucide-react';

interface MobileStateViewProps {
  studentState: StudentState;
  onUpdateState: (newState: StudentState) => void;
  onOpenOnboarding: () => void;
  onOpenFinancialTracker: () => void;
  onOpenMaterialsModal?: (subjectId?: string) => void;
  onTriggerAi: () => void;
}

export const MobileStateView: React.FC<MobileStateViewProps> = ({
  studentState,
  onUpdateState,
  onOpenOnboarding,
  onOpenFinancialTracker,
  onOpenMaterialsModal,
  onTriggerAi,
}) => {
  const fin = studentState.financial;
  const remainingSpendable =
    fin.monthlyIncome - fin.savingsTarget - fin.fixedExpensesMonthly - fin.currentSpentThisMonth;
  const dailyLimit = Math.max(0, Math.round(remainingSpendable / Math.max(1, fin.daysRemainingInMonth)));

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">4 Trụ Cột Trạng Thái</h2>
          <p className="text-xs text-slate-500">Dữ liệu đầu vào để AI cân bằng lịch trình</p>
        </div>
        <button
          onClick={onOpenOnboarding}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 text-xs font-bold flex items-center space-x-1 hover:bg-indigo-100 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sửa hồ sơ</span>
        </button>
      </div>

      {/* 1. FINANCIAL PILLAR */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">1. Financial State</h3>
              <p className="text-[11px] text-slate-500">Bán kính chi tiêu bảo vệ tiết kiệm</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-medium">Hạn mức/ngày</span>
            <div className="text-base font-extrabold font-mono text-amber-600">
              {dailyLimit.toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Quick button to open tracker */}
        <button
          onClick={onOpenFinancialTracker}
          className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Cập nhật Thu / Chi Hàng Ngày ({(fin.transactions || []).length} giao dịch)</span>
        </button>

        {/* Sliders */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Thu nhập tháng</span>
              <span className="font-bold text-indigo-600 font-mono">
                {fin.monthlyIncome.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <input
              type="range"
              min="1500000"
              max="6000000"
              step="100000"
              value={fin.monthlyIncome}
              onChange={(e) =>
                onUpdateState({
                  ...studentState,
                  financial: { ...fin, monthlyIncome: Number(e.target.value) },
                })
              }
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Mục tiêu tiết kiệm</span>
              <span className="font-bold text-amber-600 font-mono">
                {fin.savingsTarget.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="2000000"
              step="50000"
              value={fin.savingsTarget}
              onChange={(e) =>
                onUpdateState({
                  ...studentState,
                  financial: { ...fin, savingsTarget: Number(e.target.value) },
                })
              }
              className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Chi tiêu lũy kế tháng này</span>
              <span className="font-bold text-rose-600 font-mono">
                {fin.currentSpentThisMonth.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4000000"
              step="50000"
              value={fin.currentSpentThisMonth}
              onChange={(e) =>
                onUpdateState({
                  ...studentState,
                  financial: { ...fin, currentSpentThisMonth: Number(e.target.value) },
                })
              }
              className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
            />
          </div>
        </div>
      </div>

      {/* 2. LEARNING PILLAR (Multi-Subjects & Knowledge Scope) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">2. Learning State</h3>
              <p className="text-[11px] text-slate-500">Danh sách môn thi & Lượng kiến thức</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
            {studentState.learning.subjects.length} môn thi
          </span>
        </div>

        {/* Subjects List */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          {studentState.learning.subjects.map((sub, idx) => {
            const dailyHours = Math.round(
              (sub.estimatedTotalHoursNeeded / Math.max(1, sub.daysUntilExam)) * 10
            ) / 10;

            return (
              <div
                key={sub.id || idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-[9px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{sub.subjectName} ({sub.subjectCode})</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Còn {sub.daysUntilExam} ngày
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Lượng kiến thức</span>
                    <span className="font-bold text-slate-700">{sub.totalChapters} chương</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Đã học xong</span>
                    <span className="font-bold text-emerald-600">{sub.completedChapters}/{sub.totalChapters} chương</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Cần học mỗi ngày</span>
                    <span className="font-bold text-indigo-600">~{dailyHours}h/ngày</span>
                  </div>
                </div>

                {sub.gaps && sub.gaps.length > 0 && (
                  <div className="text-[11px] text-rose-700 bg-rose-50/80 p-2 rounded-xl border border-rose-100 flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><b>Lỗ hổng:</b> {sub.gaps[0].topic}</span>
                  </div>
                )}

                {/* Materials & Quizzes Status */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] py-0.5">
                    {sub.materials && sub.materials.length > 0 ? (
                      sub.materials.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center space-x-1 text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md border border-indigo-100 whitespace-nowrap"
                        >
                          <span>{m.type === 'QUIZ' ? '📝' : m.type === 'TEXTBOOK' ? '📕' : '📊'}</span>
                          <span className="truncate max-w-[80px]">{m.name.split('.')[0]}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">
                        ⚠️ Chưa có giáo trình/đề trắc nghiệm
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenMaterialsModal?.(sub.id)}
                    className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 shrink-0 flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <UploadCloud className="w-3 h-3 text-indigo-600" />
                    <span>+ Tải tài liệu</span>
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={onOpenOnboarding}
            className="w-full py-2 rounded-xl border border-dashed border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm / Quản lý danh sách môn thi</span>
          </button>
        </div>
      </div>

      {/* 3. TIME PILLAR (Lịch trình tự do & Không còn lịch học cố định sáng nay) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-sky-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">3. Time State</h3>
              <p className="text-[11px] text-slate-500">Quỹ thời gian rảnh hôm nay (Linh hoạt)</p>
            </div>
          </div>
          <div className="text-sm font-extrabold font-mono text-sky-600">
            {studentState.time.totalFreeHoursToday} giờ rảnh
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Tổng giờ rảnh hôm nay</span>
            <span className="font-bold text-sky-600 font-mono">
              {studentState.time.totalFreeHoursToday} tiếng ({Math.round(studentState.time.totalFreeHoursToday * 60)} phút)
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="7.0"
            step="0.5"
            value={studentState.time.totalFreeHoursToday}
            onChange={(e) =>
              onUpdateState({
                ...studentState,
                time: {
                  ...studentState.time,
                  totalFreeHoursToday: Number(e.target.value),
                  freeWindows: [
                    {
                      start: '14:00',
                      end: `${14 + Math.floor(Number(e.target.value))}:00`,
                      durationMinutes: Math.round(Number(e.target.value) * 60),
                    },
                  ],
                },
              })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer mt-1"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 leading-relaxed">
          ✨ <b>Đã bãi bỏ lịch học cố định sáng nay:</b> AI sẽ tự do phân bổ các phiên học Pomodoro và giờ nghỉ trong toàn bộ quỹ {studentState.time.totalFreeHoursToday} giờ rảnh hôm nay.
        </div>
      </div>

      {/* 4. GOALS PILLAR */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-emerald-100 space-y-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">4. Goals</h3>
            <p className="text-[11px] text-slate-500">Mục tiêu 3 phương diện</p>
          </div>
        </div>

        <div className="text-xs space-y-1.5 text-slate-700">
          <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span><b>Học tập:</b> {studentState.goals.academicGoal}</span>
          </div>
          <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span><b>Tài chính:</b> {studentState.goals.financialGoal}</span>
          </div>
          <div className="p-2 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span><b>Sức khỏe:</b> {studentState.goals.wellbeingGoal}</span>
          </div>
        </div>
      </div>

      {/* Re-trigger AI Button */}
      <button
        onClick={onTriggerAi}
        className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Áp dụng Thay đổi & Tái Tính Lịch</span>
      </button>
    </div>
  );
};
