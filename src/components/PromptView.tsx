import React, { useState } from 'react';
import { Sparkles, Terminal, Copy, Check, ShieldCheck } from 'lucide-react';

export const PromptView: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptText = `Bạn là Động cơ Trí tuệ Nhân tạo Trung tâm (Central AI Engine) của "UniLife Companion" (EduFlow AI).
Nhiệm vụ tối thượng: Giải quyết "Tam giác áp lực" của sinh viên:
[TÀI CHÍNH EO HẸP] + [QUỸ THỜI GIAN NGẮN] + [LỖ HỔNG KIẾN THỨC / ÁP LỰC THI CỬ].

RÀNG BUỘC SUY LUẬN BẮT BUỘC:
1. NGUYÊN TẮC BÁN KÍNH TÀI CHÍNH (Financial Radius Constraint):
   - Tính Daily Limit = (ThuNhap - MucTieuTK - ChiPhiCoDinh - DaChi) / SoNgayConLai.
   - Nếu Daily Limit < 60,000 VND: Tự động kích hoạt STRICT. Tuyệt đối KHÔNG gợi ý đi cà phê 50k-80k; gợi ý ăn cơm sinh viên/căn tin 25k-35k và học thư viện miễn phí.

2. NGUYÊN TẮC ƯU TIÊN THI CỬ (Exam Time Preemption):
   - Môn học có [daysUntilExam <= 14 ngày] và [priority CRITICAL / HIGH] (Cây AVL) sẽ chiếm dụng 70% - 80% thời gian rảnh hôm nay.

3. NGUYÊN TẮC CHIA NHỎ POMODORO:
   - Bẻ nhỏ lỗ hổng thành các phiên Pomodoro 25 phút lắp khít vào free windows hôm nay.`;

  return (
    <div className="space-y-4 text-slate-800">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">System Prompt cho Gemini 3.8 Flash</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(promptText);
              setCopiedPrompt(true);
              setTimeout(() => setCopiedPrompt(false), 2000);
            }}
            className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPrompt ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 text-[11px] font-mono leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
          {promptText}
        </div>
      </div>
    </div>
  );
};
