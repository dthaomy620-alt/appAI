import React from 'react';
import { Smartphone, Server, Database, Sparkles, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Layers } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Executive Summary Card */}
      <div className="bg-white border border-indigo-100 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Kiến trúc Hệ thống UniLife Companion</h2>
            <p className="text-xs text-slate-500">Mô hình Event-Driven kết hợp Central AI Controller</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Hệ thống được thiết kế theo kiến trúc <strong>Offline-First Mobile Client (Flutter / React Native)</strong> kết nối với 
          <strong> Central AI Orchestration Gateway</strong>. AI đóng vai trò 
          <strong> Solver Engine (Bộ giải quyết ràng buộc)</strong>: cân bằng toán học giữa Ngân sách hàng ngày, 
          Quỹ thời gian rảnh và Mức độ khẩn cấp của lỗ hổng kiến thức trước ngày thi.
        </p>
      </div>

      {/* 4-Layer Architecture Cards */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center">
          <Cpu className="w-4 h-4 text-indigo-600 mr-2" />
          Sơ đồ 4 Tầng Luồng Dữ liệu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Layer 1: Mobile Client */}
          <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">TẦNG 1: MOBILE</span>
                <Smartphone className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Flutter / React Native</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>State: <b>Riverpod</b> / <b>Redux Toolkit</b></li>
                <li>Offline Storage: SQLite / Isar / Watermelon</li>
                <li>Widget Pomodoro Timer & Timeline</li>
              </ul>
            </div>
          </div>

          {/* Layer 2: Backend Gateway */}
          <div className="bg-cyan-50/40 border border-cyan-100 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">TẦNG 2: BACKEND</span>
                <Server className="w-4 h-4 text-cyan-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Cloud Run Gateway (Node/Go)</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>JWT Authentication & Rate Limiter</li>
                <li>Bộ tiền xử lý Toán học (Daily Limit Quota)</li>
                <li>State Aggregator 4 trụ cột</li>
              </ul>
            </div>
          </div>

          {/* Layer 3: Gemini AI Engine */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">TẦNG 3: AI CORE</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Gemini 3.8 Flash</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li><b>Structured Outputs</b> (JSON Schema)</li>
                <li>Khóa chặt Bán kính Tài chính</li>
                <li>Bẻ nhỏ Lỗ hổng AVL ➔ Khối Pomodoro</li>
              </ul>
            </div>
          </div>

          {/* Layer 4: Persistence */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">TẦNG 4: DATABASE</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Firestore / Supabase</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>Collection: <code>students/{'{id}'}</code></li>
                <li>Subcollections: <code>dailyPlans</code>, <code>expenses</code></li>
                <li>Realtime Sync 2 chiều về thiết bị</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Core Mathematical Algorithms */}
      <div className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">1. Thuật toán Bán kính Tài chính (Financial Radius)</h4>
              <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-indigo-700">
                DailyLimit = (ThuNhap - MucTieuTK - ChiPhiCoDinh - DaChi) / SoNgayConLai
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Ví dụ: (3M - 800k - 600k - 450k) / 20 = <strong>57.500 VND/ngày</strong>. AI sẽ khóa chặt không gợi ý đi cà phê 60k-80k, hướng dẫn ăn cơm sinh viên 30k để bảo toàn 800k tiết kiệm.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">2. Thuật toán Chiếm dụng Thời gian & Bẻ nhỏ Pomodoro</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Môn học có ngày thi &le; 14 ngày (DSA) được ưu tiên chiếm dụng 80% quỹ thời gian rảnh. Lỗ hổng Cây AVL được chia thành 3 khối Pomodoro 25 phút lắp khít vào 3 tiếng rảnh hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
