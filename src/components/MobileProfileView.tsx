import React from 'react';
import { StudentState } from '../types';
import { 
  User, 
  Building2, 
  GraduationCap, 
  Sun, 
  Moon, 
  Home, 
  Utensils, 
  Smile, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface MobileProfileViewProps {
  studentState: StudentState;
  onOpenOnboarding: () => void;
  onResetToDemo: () => void;
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  studentState,
  onOpenOnboarding,
  onResetToDemo,
}) => {
  const p = studentState.personal;

  const getLivingText = (val: string) => {
    switch (val) {
      case 'RENTAL': return 'Phòng trọ riêng';
      case 'DORM': return 'Ký túc xá trường';
      case 'WITH_FAMILY': return 'Ở cùng gia đình';
      default: return val;
    }
  };

  const getCookingText = (val: string) => {
    switch (val) {
      case 'SELF_COOK': return 'Tự nấu ăn (tiết kiệm)';
      case 'EAT_OUT': return 'Ăn ngoài / căn tin';
      case 'MIXED': return 'Kết hợp tự nấu & ăn ngoài';
      default: return val;
    }
  };

  return (
    <div className="p-4 space-y-4 pb-12">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl border border-white/30 shadow-md">
            {studentState.fullName.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">{studentState.fullName}</h2>
            <p className="text-xs text-indigo-100">{studentState.major}</p>
            <span className="inline-block text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full mt-1">
              {p.university}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs text-indigo-100">Dữ liệu cá nhân hóa cho AI Engine</span>
          <button
            onClick={onOpenOnboarding}
            className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-indigo-50 transition-all flex items-center space-x-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Cập nhật hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Habits & Personal Environment Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Thói Quen Sinh Hoạt & Nhịp Sinh Học</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Giờ thức dậy</span>
              <div className="font-bold text-slate-800 font-mono">{p.wakeUpTime}</div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Giờ đi ngủ</span>
              <div className="font-bold text-slate-800 font-mono">{p.sleepTime}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-200/80 text-slate-600">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Nơi ăn ở</span>
              <div className="font-bold text-slate-800">{getLivingText(p.livingSituation)}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-200/80 text-slate-600">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Thói quen ăn</span>
              <div className="font-bold text-slate-800">{getCookingText(p.cookingHabit)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Personal Profile Matters Card */}
      <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-3xl p-4 text-xs text-indigo-900 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-indigo-800">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Tại sao thông tin bản thân quan trọng với AI?</span>
        </div>
        <p className="leading-relaxed text-[11px] text-indigo-800/90">
          AI Controller cần biết chính xác <b>giờ thức/ngủ</b> và <b>nơi ăn ở</b> để:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-900 font-medium">
          <li>Không xếp lịch Pomodoro đè vào giấc ngủ hoặc lúc chuẩn bị bữa ăn.</li>
          <li>Gợi ý thực đơn cơm sinh viên hoặc tự nấu dựa trên điều kiện phòng trọ/KTX.</li>
          <li>Khóa các gợi ý đắt tiền để đảm bảo mục tiêu tài chính cá nhân.</li>
        </ul>
      </div>

      {/* Quick Reset Action */}
      <button
        onClick={onResetToDemo}
        className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Khôi phục hồ sơ sinh viên mẫu ban đầu</span>
      </button>
    </div>
  );
};
