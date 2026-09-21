import React, { useState } from 'react';
import { StudentState, SubjectLearningState, SubjectMaterial } from '../types';
import { UNIVERSITY_SUGGESTIONS, SUBJECT_PRESETS } from '../data/learningGames';
import { 
  User, 
  Wallet, 
  BookOpen, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Sun, 
  Plus, 
  Trash2, 
  Calendar, 
  Target, 
  Flame, 
  Layers,
  ChevronDown,
  UploadCloud,
  AlertCircle
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentState: StudentState;
  onSaveState: (updatedState: StudentState) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  studentState,
  onSaveState,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<StudentState>(studentState);
  const [showUniDropdown, setShowUniDropdown] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onSaveState(formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Quick Preset filling
  const fillQuickPreset = () => {
    setFormData({
      ...studentState,
      fullName: 'Nguyễn Văn An',
      major: 'Kỹ thuật Phần mềm (CNTT)',
      academicYear: '',
      personal: {
        university: 'Đại học Bách Khoa (ĐHQG-HCM)',
        wakeUpTime: '06:30',
        sleepTime: '23:30',
        livingSituation: 'RENTAL',
        stressLevel: 'HIGH',
        cookingHabit: 'MIXED',
      },
      financial: {
        ...studentState.financial,
        monthlyIncome: 3000000,
        savingsTarget: 800000,
        fixedExpensesMonthly: 600000,
        currentSpentThisMonth: 520000,
        daysRemainingInMonth: 20,
      },
      learning: {
        ...studentState.learning,
        subjects: [
          {
            id: 'sub-dsa',
            subjectCode: 'DSA102',
            subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
            currentGradeEstimate: 6.0,
            targetGrade: 8.5,
            examDate: '2026-10-05',
            daysUntilExam: 14,
            totalChapters: 6,
            completedChapters: 2,
            estimatedTotalHoursNeeded: 18,
            difficultyLevel: 'HARD',
            gaps: [
              {
                topic: 'Cây AVL (Hệ số cân bằng BF & 4 phép xoay LL, RR, LR, RL)',
                priority: 'CRITICAL',
                estimatedHoursNeeded: 4.5,
                masteryPercentage: 25,
              },
            ],
            chapters: [],
          },
          {
            id: 'sub-db',
            subjectCode: 'DB201',
            subjectName: 'Hệ Quản trị Cơ sở Dữ liệu',
            currentGradeEstimate: 7.0,
            targetGrade: 8.0,
            examDate: '2026-10-22',
            daysUntilExam: 31,
            totalChapters: 5,
            completedChapters: 2,
            estimatedTotalHoursNeeded: 12,
            difficultyLevel: 'MEDIUM',
            gaps: [
              {
                topic: 'Chuẩn hóa dữ liệu (3NF & BCNF)',
                priority: 'MEDIUM',
                estimatedHoursNeeded: 3.0,
                masteryPercentage: 60,
              },
            ],
            chapters: [],
          },
        ],
      },
      time: {
        ...studentState.time,
        totalFreeHoursToday: 3.5,
      },
    });
  };

  // Add new subject to learning state
  const handleAddSubject = () => {
    const newSubject: SubjectLearningState = {
      id: `sub-${Date.now()}`,
      subjectCode: 'MÔN_MỚI',
      subjectName: 'Môn học cần ôn thi',
      currentGradeEstimate: 6.0,
      targetGrade: 8.0,
      examDate: '2026-10-15',
      daysUntilExam: 20,
      totalChapters: 5,
      completedChapters: 1,
      estimatedTotalHoursNeeded: 15,
      difficultyLevel: 'MEDIUM',
      gaps: [
        {
          topic: 'Lỗ hổng trọng tâm cần bẻ nhỏ',
          priority: 'HIGH',
          estimatedHoursNeeded: 3.0,
          masteryPercentage: 30,
        },
      ],
      chapters: [],
    };

    setFormData({
      ...formData,
      learning: {
        ...formData.learning,
        subjects: [...formData.learning.subjects, newSubject],
      },
    });
  };

  const handleRemoveSubject = (index: number) => {
    if (formData.learning.subjects.length <= 1) return;
    const updated = formData.learning.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      learning: { ...formData.learning, subjects: updated },
    });
  };

  const applySubjectPreset = (index: number, preset: (typeof SUBJECT_PRESETS)[0]) => {
    const updated = [...formData.learning.subjects];
    updated[index] = {
      ...updated[index],
      subjectCode: preset.code,
      subjectName: preset.name,
      totalChapters: preset.totalChapters,
      completedChapters: 1,
      estimatedTotalHoursNeeded: preset.totalChapters * 3,
      gaps: [
        {
          topic: preset.defaultGaps[0] || 'Khái niệm trọng tâm',
          priority: 'CRITICAL',
          estimatedHoursNeeded: 3.5,
          masteryPercentage: 30,
        },
      ],
      chapters: preset.chapters,
    };

    setFormData({
      ...formData,
      learning: { ...formData.learning, subjects: updated },
    });
  };

  // Material upload handlers for a subject
  const handleSubjectFileUpload = (idx: number, fileList: FileList) => {
    const updated = [...formData.learning.subjects];
    const targetSub = updated[idx];
    if (!targetSub) return;

    const newMaterials: SubjectMaterial[] = Array.from(fileList).map((file) => {
      let type: SubjectMaterial['type'] = 'TEXTBOOK';
      const lower = file.name.toLowerCase();
      if (
        lower.includes('trac_nghiem') ||
        lower.includes('de_thi') ||
        lower.includes('quiz') ||
        lower.includes('cau_hoi')
      ) {
        type = 'QUIZ';
      } else if (
        lower.includes('slide') ||
        lower.includes('bai_giang') ||
        lower.endsWith('.ppt') ||
        lower.endsWith('.pptx')
      ) {
        type = 'SLIDE';
      } else if (lower.endsWith('.txt') || lower.includes('note')) {
        type = 'NOTE';
      }

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        type,
        size: sizeStr,
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: `Tài liệu nạp trực tiếp: ${file.name}`,
      };
    });

    updated[idx] = {
      ...targetSub,
      materials: [...newMaterials, ...(targetSub.materials || [])],
    };

    setFormData({
      ...formData,
      learning: { ...formData.learning, subjects: updated },
    });
  };

  const handleAddSampleMaterialsToSubject = (idx: number) => {
    const updated = [...formData.learning.subjects];
    const targetSub = updated[idx];
    if (!targetSub) return;

    const sample1: SubjectMaterial = {
      id: `mat-sample-${Date.now()}-1`,
      name: `Giao_trinh_chuan_${targetSub.subjectCode || 'MonHoc'}.pdf`,
      type: 'TEXTBOOK',
      size: '4.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      contentSnippet: `Giáo trình lý thuyết & bài tập chuẩn môn ${targetSub.subjectName}.`,
    };
    const sample2: SubjectMaterial = {
      id: `mat-sample-${Date.now()}-2`,
      name: `Bo_50_cau_trac_nghiem_on_thi_${targetSub.subjectCode || 'MonHoc'}.docx`,
      type: 'QUIZ',
      size: '50 câu trắc nghiệm',
      uploadedAt: new Date().toISOString().split('T')[0],
      contentSnippet: `50 câu trắc nghiệm bao quát các chương trọng tâm kèm lời giải.`,
    };

    updated[idx] = {
      ...targetSub,
      materials: [sample1, sample2, ...(targetSub.materials || [])],
    };

    setFormData({
      ...formData,
      learning: { ...formData.learning, subjects: updated },
    });
  };

  // Filtered universities for auto-suggest
  const filteredUnis = UNIVERSITY_SUGGESTIONS.filter((u) =>
    u.toLowerCase().includes((formData.personal.university || '').toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-xl w-full overflow-hidden flex flex-col my-auto transition-all max-h-[90vh]">
        {/* Header with progress */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-bold">Thiết lập Hồ sơ Sinh viên</h3>
                <p className="text-xs text-indigo-100">Cá nhân hóa lộ trình ôn thi & tài chính</p>
              </div>
            </div>
            <button
              onClick={fillQuickPreset}
              className="text-[11px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full border border-white/30 flex items-center space-x-1 transition-all cursor-pointer"
            >
              <span>⚡ Điền mẫu nhanh</span>
            </button>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between space-x-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    step >= i ? 'bg-amber-300' : 'bg-white/30'
                  }`}
                />
                <span className="text-[10px] mt-1 text-indigo-100 font-medium">
                  {i === 1 && 'Bản thân'}
                  {i === 2 && 'Tài chính'}
                  {i === 3 && 'Môn thi & Lượng kiến thức'}
                  {i === 4 && 'Quỹ giờ rảnh'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* STEP 1: Bản thân & Trường học với Gợi ý tự động */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-sm">
                <User className="w-4 h-4" />
                <span>Bước 1: Thông tin bản thân & Trường Đại học</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên của bạn</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50/50"
                />
              </div>

              {/* University with Auto-Suggest List */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trường Đại học (Có danh sách gợi ý tự động)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.personal.university}
                    onFocus={() => setShowUniDropdown(true)}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, university: e.target.value },
                      });
                      setShowUniDropdown(true);
                    }}
                    placeholder="Gõ để tìm trường Đại học..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50/50 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUniDropdown(!showUniDropdown)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* University Suggestions Dropdown */}
                {showUniDropdown && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                      Gợi ý trường Đại học phổ biến:
                    </div>
                    {filteredUnis.length > 0 ? (
                      filteredUnis.map((uni) => (
                        <button
                          key={uni}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              personal: { ...formData.personal, university: uni },
                            });
                            setShowUniDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all flex items-center justify-between"
                        >
                          <span>{uni}</span>
                          {formData.personal.university === uni && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400">Không tìm thấy, bạn có thể gõ tên trường tự do.</div>
                    )}
                  </div>
                )}

                {/* Popular Pills */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {UNIVERSITY_SUGGESTIONS.slice(0, 5).map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          personal: { ...formData.personal, university: uni },
                        })
                      }
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                        formData.personal.university === uni
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {uni.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chuyên ngành học</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Kỹ thuật Phần mềm / Công nghệ thông tin"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ thức dậy quen thuộc</label>
                  <div className="relative">
                    <Sun className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
                    <input
                      type="time"
                      value={formData.personal.wakeUpTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personal: { ...formData.personal, wakeUpTime: e.target.value },
                        })
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ đi ngủ mục tiêu</label>
                  <input
                    type="time"
                    value={formData.personal.sleepTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, sleepTime: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Tài chính */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 font-semibold text-sm">
                <Wallet className="w-4 h-4" />
                <span>Bước 2: Tài chính sinh viên & Bán kính chi tiêu</span>
              </div>

              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                💡 <b>Công thức Bán kính Tài chính:</b> Hạn mức mỗi ngày = (Thu nhập - Tiết kiệm - Phí cố định trọ - Đã chi) ÷ Số ngày còn lại.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thu nhập / Trợ cấp (tháng)</label>
                  <input
                    type="number"
                    step="100000"
                    value={formData.financial.monthlyIncome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financial: { ...formData.financial, monthlyIncome: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mục tiêu muốn tiết kiệm</label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.financial.savingsTarget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financial: { ...formData.financial, savingsTarget: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tiền trọ & điện nước cố định</label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.financial.fixedExpensesMonthly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financial: { ...formData.financial, fixedExpensesMonthly: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đã chi tiêu tháng này</label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.financial.currentSpentThisMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financial: { ...formData.financial, currentSpentThisMonth: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-rose-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thói quen ăn uống</label>
                <select
                  value={formData.personal.cookingHabit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, cookingHabit: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs bg-slate-50"
                >
                  <option value="SELF_COOK">Tự nấu ăn tại trọ (tiết kiệm nhất)</option>
                  <option value="MIXED">Kết hợp tự nấu & ăn ngoài bình dân</option>
                  <option value="EAT_OUT">Chủ yếu ăn ngoài / cơm căn tin</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Thêm nhiều môn học & Cung cấp Lượng kiến thức ôn thi */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-600 font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Bước 3: Môn thi & Lượng kiến thức cần ôn tập</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm môn học</span>
                </button>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 text-xs text-rose-900 leading-relaxed">
                📚 <b>Lộ trình Ôn Thi Dựa Trên Lượng Kiến Thức:</b> Nhập số chương và số giờ cần ôn. AI sẽ chia nhỏ số giờ cần học mỗi ngày dựa trên ngày thi và quỹ giờ rảnh của bạn.
              </div>

              {/* Subjects List */}
              <div className="space-y-4">
                {formData.learning.subjects.map((sub, idx) => {
                  const requiredDailyHours = Math.round(
                    (sub.estimatedTotalHoursNeeded / Math.max(1, sub.daysUntilExam)) * 10
                  ) / 10;

                  return (
                    <div
                      key={sub.id || idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 relative hover:border-rose-300 transition-all"
                    >
                      {/* Header of Subject */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span>Môn thi #{idx + 1}</span>
                        </span>

                        {formData.learning.subjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-all"
                            title="Xóa môn này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Quick Presets for this subject */}
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px]">
                        <span className="text-slate-400 shrink-0">Chọn mẫu nhanh:</span>
                        {SUBJECT_PRESETS.map((p) => (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => applySubjectPreset(idx, p)}
                            className={`px-2 py-0.5 rounded-md border font-medium whitespace-nowrap transition-all ${
                              sub.subjectCode === p.code
                                ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {p.code} ({p.name.split(' ')[0]})
                          </button>
                        ))}
                      </div>

                      {/* Name & Code */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tên môn học</label>
                          <input
                            type="text"
                            value={sub.subjectName}
                            onChange={(e) => {
                              const updated = [...formData.learning.subjects];
                              updated[idx] = { ...updated[idx], subjectName: e.target.value };
                              setFormData({
                                ...formData,
                                learning: { ...formData.learning, subjects: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                            placeholder="Cấu trúc Dữ liệu & Giải thuật"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mã môn</label>
                          <input
                            type="text"
                            value={sub.subjectCode}
                            onChange={(e) => {
                              const updated = [...formData.learning.subjects];
                              updated[idx] = { ...updated[idx], subjectCode: e.target.value };
                              setFormData({
                                ...formData,
                                learning: { ...formData.learning, subjects: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
                            placeholder="DSA102"
                          />
                        </div>
                      </div>

                      {/* Knowledge Volume (Lượng kiến thức môn thi) */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Lượng kiến thức & Khối lượng ôn tập</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Tổng số chương</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={sub.totalChapters || 6}
                              onChange={(e) => {
                                const updated = [...formData.learning.subjects];
                                updated[idx] = { ...updated[idx], totalChapters: Number(e.target.value) };
                                setFormData({
                                  ...formData,
                                  learning: { ...formData.learning, subjects: updated },
                                });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Đã nắm vững</label>
                            <input
                              type="number"
                              min="0"
                              max={sub.totalChapters || 6}
                              value={sub.completedChapters || 2}
                              onChange={(e) => {
                                const updated = [...formData.learning.subjects];
                                updated[idx] = { ...updated[idx], completedChapters: Number(e.target.value) };
                                setFormData({
                                  ...formData,
                                  learning: { ...formData.learning, subjects: updated },
                                });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center text-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Ước tính giờ ôn</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={sub.estimatedTotalHoursNeeded || 18}
                              onChange={(e) => {
                                const updated = [...formData.learning.subjects];
                                updated[idx] = { ...updated[idx], estimatedTotalHoursNeeded: Number(e.target.value) };
                                setFormData({
                                  ...formData,
                                  learning: { ...formData.learning, subjects: updated },
                                });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center text-indigo-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gaps & Days until exam */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Lỗ hổng khẩn cấp nhất
                          </label>
                          <input
                            type="text"
                            value={sub.gaps[0]?.topic || ''}
                            onChange={(e) => {
                              const updated = [...formData.learning.subjects];
                              if (updated[idx]?.gaps[0]) {
                                updated[idx].gaps[0] = { ...updated[idx].gaps[0], topic: e.target.value };
                              }
                              setFormData({
                                ...formData,
                                learning: { ...formData.learning, subjects: updated },
                              });
                            }}
                            placeholder="Ví dụ: Cây AVL, Phép xoay cây"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Còn lại (ngày)</label>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={sub.daysUntilExam}
                              onChange={(e) => {
                                const updated = [...formData.learning.subjects];
                                updated[idx] = { ...updated[idx], daysUntilExam: Number(e.target.value) };
                                setFormData({
                                  ...formData,
                                  learning: { ...formData.learning, subjects: updated },
                                });
                              }}
                              className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-rose-600 text-center"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Điểm mục tiêu</label>
                            <input
                              type="number"
                              step="0.5"
                              min="5"
                              max="10"
                              value={sub.targetGrade}
                              onChange={(e) => {
                                const updated = [...formData.learning.subjects];
                                updated[idx] = { ...updated[idx], targetGrade: Number(e.target.value) };
                                setFormData({
                                  ...formData,
                                  learning: { ...formData.learning, subjects: updated },
                                });
                              }}
                              className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600 text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PROVIDED MATERIALS, TEXTBOOKS & QUIZZES (Yêu cầu tài liệu, giáo trình, trắc nghiệm) */}
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/90 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-bold text-amber-900 flex items-center space-x-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>Tài liệu, Giáo trình & Đề trắc nghiệm (Nếu có)</span>
                          </div>
                          <span className="text-[10px] text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full font-bold">
                            {(sub.materials || []).length} mục
                          </span>
                        </div>

                        <p className="text-[10px] text-amber-800/90 leading-normal">
                          💡 <b>Yêu cầu tài liệu:</b> Vui lòng tải lên giáo trình, slide hoặc đề trắc nghiệm (PDF, DOCX, PPTX, TXT) để AI tạo ngân hàng câu hỏi và lộ trình học bám sát 100% chương trình thi của bạn.
                        </p>

                        {/* Attached materials chips */}
                        {sub.materials && sub.materials.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {sub.materials.map((m) => (
                              <span
                                key={m.id}
                                className="inline-flex items-center space-x-1 text-[10px] font-medium bg-white px-2 py-0.5 rounded-lg border border-amber-200 text-slate-700 shadow-2xs"
                              >
                                <span>{m.type === 'QUIZ' ? '📝' : m.type === 'TEXTBOOK' ? '📕' : '📊'}</span>
                                <span className="max-w-[130px] truncate font-semibold">{m.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.learning.subjects];
                                    updated[idx] = {
                                      ...updated[idx],
                                      materials: (updated[idx].materials || []).filter((item) => item.id !== m.id),
                                    };
                                    setFormData({ ...formData, learning: { ...formData.learning, subjects: updated } });
                                  }}
                                  className="text-slate-400 hover:text-rose-600 ml-1 font-bold"
                                  title="Xóa tài liệu này"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Upload file + Quick preset buttons */}
                        <div className="flex items-center space-x-2 pt-1">
                          <label className="cursor-pointer text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center space-x-1 transition-all">
                            <UploadCloud className="w-3 h-3" />
                            <span>+ Tải file / Kéo thả</span>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.docx,.doc,.txt,.pptx,.ppt"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleSubjectFileUpload(idx, e.target.files);
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleAddSampleMaterialsToSubject(idx)}
                            className="text-[10px] font-bold text-amber-900 hover:bg-amber-100 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center space-x-1 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>+ Nạp giáo trình & trắc nghiệm mẫu</span>
                          </button>
                        </div>
                      </div>

                      {/* Roadmap Summary Pill */}
                      <div className="text-[11px] bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-100 flex items-center justify-between text-indigo-900">
                        <span>🎯 Lộ trình AI đề xuất:</span>
                        <span className="font-bold font-mono">
                          ~{requiredDailyHours} giờ học / ngày (Còn {sub.daysUntilExam} ngày)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Quỹ thời gian rảnh (ĐÃ LOẠI BỎ LỊCH HỌC CỐ ĐỊNH SÁNG NAY) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sky-600 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>Bước 4: Quỹ thời gian rảnh thực tế hôm nay</span>
              </div>

              <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 text-xs text-sky-900 leading-relaxed">
                🎯 <b>Lên Lịch Tự Do & Tự Chủ:</b> Đã bãi bỏ lịch học cố định gò bó. AI sẽ khớp các phiên Pomodoro 25 phút dựa vào tổng số tiếng rảnh thực tế của bạn hôm nay.
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Tổng thời gian rảnh hôm nay để học & nghỉ
                  </label>
                  <span className="text-sm font-mono font-bold text-sky-600">
                    {formData.time.totalFreeHoursToday} tiếng ({Math.round(formData.time.totalFreeHoursToday * 60)} phút)
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.5"
                  value={formData.time.totalFreeHoursToday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time: {
                        ...formData.time,
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
                  className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                {/* Preset buttons */}
                <div className="flex items-center justify-between mt-2">
                  {[2.0, 3.0, 3.5, 4.5, 6.0].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          time: {
                            ...formData.time,
                            totalFreeHoursToday: hours,
                          },
                        })
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all ${
                        formData.time.totalFreeHoursToday === hours
                          ? 'bg-sky-500 text-white border-sky-500 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Balance Roadmap vs Free Time Check */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Đối chiếu Nhu cầu Ôn thi vs Quỹ Giờ Rảnh:
                </div>
                {formData.learning.subjects.map((sub, i) => {
                  const neededHoursDaily = Math.round(
                    (sub.estimatedTotalHoursNeeded / Math.max(1, sub.daysUntilExam)) * 10
                  ) / 10;
                  const isOverload = neededHoursDaily > formData.time.totalFreeHoursToday;

                  return (
                    <div
                      key={sub.id || i}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-100"
                    >
                      <span className="font-semibold text-slate-700">
                        {sub.subjectCode} ({sub.subjectName.split(' ')[0]})
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-500">Cần {neededHoursDaily}h/ngày</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOverload
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isOverload ? 'Cần tăng giờ' : 'Khả thi'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center space-x-1 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>{step === 4 ? 'Hoàn tất & Khởi chạy AI' : 'Tiếp tục'}</span>
            {step === 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
