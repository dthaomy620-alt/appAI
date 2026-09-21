import React, { useState } from 'react';
import { StudentState, DailyTransaction } from '../types';
import { 
  Wallet, 
  PlusCircle, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  X, 
  DollarSign, 
  Tag, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface FinancialTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentState: StudentState;
  onUpdateState: (updatedState: StudentState) => void;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  FOOD: { label: 'Ăn uống', icon: '🍲', color: 'bg-orange-100 text-orange-700' },
  TRANSPORT: { label: 'Đi lại & Xăng xe', icon: '🛵', color: 'bg-blue-100 text-blue-700' },
  STUDY: { label: 'Giáo trình & Học tập', icon: '📚', color: 'bg-purple-100 text-purple-700' },
  LIVING: { label: 'Trọ & Sinh hoạt', icon: '🏠', color: 'bg-amber-100 text-amber-700' },
  ENTERTAINMENT: { label: 'Giải trí & Bạn bè', icon: '☕', color: 'bg-pink-100 text-pink-700' },
  SALARY_ALLOWANCE: { label: 'Lương & Trợ cấp', icon: '💵', color: 'bg-emerald-100 text-emerald-700' },
  OTHER: { label: 'Khác', icon: '🏷️', color: 'bg-slate-100 text-slate-700' },
};

export const FinancialTrackerModal: React.FC<FinancialTrackerModalProps> = ({
  isOpen,
  onClose,
  studentState,
  onUpdateState,
}) => {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<DailyTransaction['category']>('FOOD');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const fin = studentState.financial;
  const transactions = fin.transactions || [];

  // Live calculation of spendable balance & daily quota
  const remainingSpendable = fin.monthlyIncome - fin.savingsTarget - fin.fixedExpensesMonthly - fin.currentSpentThisMonth;
  const daysRemaining = Math.max(1, fin.daysRemainingInMonth || 20);
  const dailyQuota = Math.max(0, Math.round(remainingSpendable / daysRemaining));

  const quickAmounts = [15000, 25000, 35000, 50000, 100000];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateString = now.toISOString().split('T')[0];

    const newTx: DailyTransaction = {
      id: `tx-${Date.now()}`,
      type,
      amount: Number(amount),
      category,
      note: note.trim() || (type === 'EXPENSE' ? 'Chi tiêu sinh hoạt' : 'Thu nhập thêm'),
      timestamp: timeString,
      date: dateString,
    };

    let newSpent = fin.currentSpentThisMonth;
    let newIncome = fin.monthlyIncome;

    if (type === 'EXPENSE') {
      newSpent += Number(amount);
    } else {
      newIncome += Number(amount);
    }

    const updatedFinancial = {
      ...fin,
      currentSpentThisMonth: newSpent,
      monthlyIncome: newIncome,
      transactions: [newTx, ...transactions],
    };

    onUpdateState({
      ...studentState,
      financial: updatedFinancial,
    });

    // Reset inputs
    setAmount('');
    setNote('');
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    let newSpent = fin.currentSpentThisMonth;
    let newIncome = fin.monthlyIncome;

    if (target.type === 'EXPENSE') {
      newSpent = Math.max(0, newSpent - target.amount);
    } else {
      newIncome = Math.max(0, newIncome - target.amount);
    }

    const updatedFinancial = {
      ...fin,
      currentSpentThisMonth: newSpent,
      monthlyIncome: newIncome,
      transactions: transactions.filter((t) => t.id !== id),
    };

    onUpdateState({
      ...studentState,
      financial: updatedFinancial,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 max-w-md w-full overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Cập Nhật Thu Chi Hàng Ngày</h3>
              <p className="text-xs text-amber-100">Bảo toàn Hạn mức an toàn & Quỹ tiết kiệm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Safe Quota Display Banner */}
        <div className="bg-amber-50/80 p-4 border-b border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
              Hạn mức Chi tiêu An toàn Hôm nay
            </span>
            <div className="text-2xl font-black font-mono text-amber-900 mt-0.5">
              {dailyQuota.toLocaleString('vi-VN')}đ
              <span className="text-xs font-normal text-amber-700 ml-1">/ ngày</span>
            </div>
            <span className="text-[10px] text-amber-700">
              (Còn {daysRemaining} ngày • Đã chi: {fin.currentSpentThisMonth.toLocaleString('vi-VN')}đ)
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Mục tiêu tiết kiệm</span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              +{fin.savingsTarget.toLocaleString('vi-VN')}đ
            </span>
            {dailyQuota < 40000 && (
              <div className="flex items-center space-x-1 text-[10px] font-bold text-rose-600 mt-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Ngân sách hẹp</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Quick Add Transaction Form */}
          <form onSubmit={handleAddTransaction} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Ghi nhận giao dịch mới</span>
              </span>

              {/* Toggle Expense / Income */}
              <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    type === 'EXPENSE'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  - Khoản Chi
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    type === 'INCOME'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  + Khoản Thu
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số tiền (VNĐ)</label>
              <div className="relative">
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  required
                  placeholder="Ví dụ: 30000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 text-base font-bold font-mono rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 bg-white"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center space-x-1.5 mt-2 overflow-x-auto pb-1">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all font-mono whitespace-nowrap"
                  >
                    {(q / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Note */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.icon} {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ghi chú nhanh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cơm trưa, Xăng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{type === 'EXPENSE' ? 'Lưu Khoản Chi & Tái tính hạn mức' : 'Lưu Khoản Thu & Cộng ngân sách'}</span>
            </button>
          </form>

          {/* History List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Lịch sử thu chi gần đây</span>
              <span className="text-[10px] text-slate-500">{transactions.length} giao dịch</span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Chưa có giao dịch nào hôm nay. Hãy thêm khoản chi đầu tiên!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {transactions.map((t) => {
                  const cat = CATEGORY_LABELS[t.category] || CATEGORY_LABELS.OTHER;
                  const isExpense = t.type === 'EXPENSE';
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${cat.color}`}>
                          {cat.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{t.note}</div>
                          <div className="text-[10px] text-slate-400">
                            {cat.label} • {t.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-mono font-extrabold ${
                            isExpense ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {t.amount.toLocaleString('vi-VN')}đ
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                          title="Xóa giao dịch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Đóng bảng thu chi
          </button>
        </div>
      </div>
    </div>
  );
};
