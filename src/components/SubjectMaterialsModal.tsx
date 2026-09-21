import React, { useState, useRef } from 'react';
import { StudentState, SubjectLearningState, SubjectMaterial } from '../types';
import { 
  BookOpen, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  X, 
  Plus, 
  Sparkles, 
  Layers, 
  HelpCircle,
  FileCheck,
  FileSpreadsheet,
  FileCode,
  FilePlus,
  AlertCircle
} from 'lucide-react';

interface SubjectMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentState: StudentState;
  onUpdateState: (updatedState: StudentState) => void;
  initialSubjectId?: string;
}

export const SubjectMaterialsModal: React.FC<SubjectMaterialsModalProps> = ({
  isOpen,
  onClose,
  studentState,
  onUpdateState,
  initialSubjectId,
}) => {
  const subjects = studentState.learning.subjects || [];
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || ''
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'PASTE_TEXT'>('UPLOAD');

  // Paste / Manual input form state
  const [materialType, setMaterialType] = useState<SubjectMaterial['type']>('TEXTBOOK');
  const [materialName, setMaterialName] = useState<string>('');
  const [materialSnippet, setMaterialSnippet] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const materialsList = currentSubject?.materials || [];

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Helper to add material to the current subject
  const addMaterialToCurrentSubject = (material: SubjectMaterial) => {
    if (!currentSubject) return;

    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === currentSubject.id) {
        return {
          ...sub,
          materials: [material, ...(sub.materials || [])],
        };
      }
      return sub;
    });

    onUpdateState({
      ...studentState,
      learning: {
        ...studentState.learning,
        subjects: updatedSubjects,
      },
    });

    showToast(`Đã thêm: "${material.name}"`);
  };

  // Delete material handler
  const handleDeleteMaterial = (materialId: string) => {
    if (!currentSubject) return;

    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === currentSubject.id) {
        return {
          ...sub,
          materials: (sub.materials || []).filter((m) => m.id !== materialId),
        };
      }
      return sub;
    });

    onUpdateState({
      ...studentState,
      learning: {
        ...studentState.learning,
        subjects: updatedSubjects,
      },
    });
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFilesSelected = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      // Deduce type based on file name
      let type: SubjectMaterial['type'] = 'TEXTBOOK';
      const lower = file.name.toLowerCase();
      if (lower.includes('trac_nghiem') || lower.includes('de_thi') || lower.includes('quiz') || lower.includes('cau_hoi')) {
        type = 'QUIZ';
      } else if (lower.includes('slide') || lower.includes('bai_giang') || lower.endsWith('.ppt') || lower.endsWith('.pptx')) {
        type = 'SLIDE';
      } else if (lower.endsWith('.txt') || lower.includes('note') || lower.includes('tom_tat')) {
        type = 'NOTE';
      }

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const newMaterial: SubjectMaterial = {
        id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        type,
        size: sizeStr,
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: `Tài liệu nạp trực tiếp: ${file.name}. AI đã đồng bộ cấu trúc đề thi.`,
      };

      addMaterialToCurrentSubject(newMaterial);
    });
  };

  // Submit manual / paste form
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) return;

    const newMaterial: SubjectMaterial = {
      id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: materialName.trim(),
      type: materialType,
      size: materialType === 'QUIZ' ? 'Bộ câu hỏi trắc nghiệm' : 'Văn bản nạp',
      uploadedAt: new Date().toISOString().split('T')[0],
      contentSnippet: materialSnippet.trim() || 'Nội dung giáo trình & câu hỏi do người dùng cung cấp.',
    };

    addMaterialToCurrentSubject(newMaterial);
    setMaterialName('');
    setMaterialSnippet('');
    setActiveTab('UPLOAD');
  };

  // Quick preset sample materials generator
  const handleLoadSampleMaterials = () => {
    if (!currentSubject) return;

    let sample1: SubjectMaterial;
    let sample2: SubjectMaterial;

    if (currentSubject.subjectCode.toUpperCase().includes('DSA')) {
      sample1 = {
        id: `mat-preset-${Date.now()}-1`,
        name: 'Giao_trinh_CTDL_GT_Chuan_2025.pdf',
        type: 'TEXTBOOK',
        size: '5.4 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: 'Giáo trình chuẩn: Cây nhị phân, Cây AVL, Bảng băm, Thuật toán Dijkstra.',
      };
      sample2 = {
        id: `mat-preset-${Date.now()}-2`,
        name: 'Bo_60_cau_trac_nghiem_on_thi_DSA_co_dap_an.docx',
        type: 'QUIZ',
        size: '60 câu trắc nghiệm',
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: 'Ngân hàng 60 câu trắc nghiệm ôn tập trọng tâm tính hệ số cân bằng BF và xoay cây AVL.',
      };
    } else {
      sample1 = {
        id: `mat-preset-${Date.now()}-1`,
        name: `Giao_trinh_chuan_${currentSubject.subjectCode}.pdf`,
        type: 'TEXTBOOK',
        size: '4.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: `Tài liệu giáo trình giảng dạy chính quy môn ${currentSubject.subjectName}.`,
      };
      sample2 = {
        id: `mat-preset-${Date.now()}-2`,
        name: `Ngan_hang_trac_nghiem_on_thi_${currentSubject.subjectCode}_50cau.docx`,
        type: 'QUIZ',
        size: '50 câu trắc nghiệm',
        uploadedAt: new Date().toISOString().split('T')[0],
        contentSnippet: `Bộ câu hỏi trắc nghiệm ôn tập và đáp án giải thích chi tiết.`,
      };
    }

    addMaterialToCurrentSubject(sample1);
    addMaterialToCurrentSubject(sample2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-lg w-full overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Tài Liệu, Giáo Trình & Đề Trắc Nghiệm
              </h2>
              <p className="text-xs text-indigo-100">
                Cung cấp dữ liệu để AI xây dựng đề ôn thi sát thực tế
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Alert */}
        {successToast && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 flex-1">
          {/* Requirement Callout */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <b>Yêu cầu cung cấp tài liệu (nếu có):</b> Vui lòng tải lên <b>giáo trình, slide bài giảng, hoặc bộ đề trắc nghiệm</b> của môn học. AI Engine sẽ bám sát tài liệu của trường bạn để mô phỏng câu hỏi thi và dự đoán các dạng bài cần ưu tiên.
            </div>
          </div>

          {/* Subject Selector Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Chọn môn học cần nạp tài liệu:
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {subjects.map((sub) => {
                const isSelected = sub.id === currentSubject?.id;
                const count = (sub.materials || []).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sub.subjectCode}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count} tài liệu
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Switch: Upload File vs Paste Text/Questions */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('UPLOAD')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'UPLOAD'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Tải file lên (Kéo thả)</span>
            </button>
            <button
              onClick={() => setActiveTab('PASTE_TEXT')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                activeTab === 'PASTE_TEXT'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Dán nội dung / Đề trắc nghiệm</span>
            </button>
          </div>

          {/* MODE 1: FILE DRAG & DROP / CLICK TO UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt,.pptx,.ppt,.zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesSelected(e.target.files);
                  }
                }}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Kéo thả tài liệu giáo trình hoặc đề trắc nghiệm vào đây
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hoặc bấm để chọn file từ máy tính (PDF, DOCX, PPTX, TXT)
                  </p>
                </div>
                <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Hỗ trợ cả tải lên nhiều file cùng lúc
                </span>
              </div>

              {/* Preset Sample Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Chưa có sẵn file trên máy?</span>
                <button
                  type="button"
                  onClick={handleLoadSampleMaterials}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nạp mẫu giáo trình & trắc nghiệm chuẩn</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: PASTE RAW TEXT / QUIZZES */}
          {activeTab === 'PASTE_TEXT' && (
            <form onSubmit={handleManualSubmit} className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Loại tài liệu</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="QUIZ">📝 Bộ đề trắc nghiệm / Câu hỏi</option>
                    <option value="TEXTBOOK">📕 Giáo trình / Đề cương</option>
                    <option value="SLIDE">📊 Slide bài giảng</option>
                    <option value="NOTE">📌 Ghi chú tóm tắt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tên tài liệu / Tiêu đề</label>
                  <input
                    type="text"
                    required
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Ví dụ: Đề trắc nghiệm 30 câu ôn thi..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nội dung câu hỏi trắc nghiệm hoặc tóm tắt kiến thức
                </label>
                <textarea
                  rows={4}
                  value={materialSnippet}
                  onChange={(e) => setMaterialSnippet(e.target.value)}
                  placeholder="Dán câu hỏi trắc nghiệm, các công thức cần nhớ hoặc nội dung tóm tắt từ giáo trình..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lưu tài liệu vào môn {currentSubject?.subjectCode}</span>
              </button>
            </form>
          )}

          {/* LIST OF CURRENTLY ATTACHED MATERIALS */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Tài liệu & Bộ đề đã cung cấp ({materialsList.length}):</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Môn: {currentSubject?.subjectName}
              </span>
            </div>

            {materialsList.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500 space-y-1">
                <p>Chưa có tài liệu hoặc đề trắc nghiệm nào được nạp cho môn này.</p>
                <p className="text-[11px] text-indigo-600 font-medium">
                  Hãy tải file hoặc bấm "Nạp mẫu giáo trình & trắc nghiệm" phía trên!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {materialsList.map((m) => {
                  let badge = { label: 'Giáo trình', bg: 'bg-blue-100 text-blue-700', icon: '📕' };
                  if (m.type === 'QUIZ') {
                    badge = { label: 'Đề trắc nghiệm', bg: 'bg-emerald-100 text-emerald-700', icon: '📝' };
                  } else if (m.type === 'SLIDE') {
                    badge = { label: 'Slide bài giảng', bg: 'bg-amber-100 text-amber-700', icon: '📊' };
                  } else if (m.type === 'NOTE') {
                    badge = { label: 'Ghi chú', bg: 'bg-purple-100 text-purple-700', icon: '📌' };
                  }

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start justify-between space-x-2 hover:bg-slate-100/70 transition-all"
                    >
                      <div className="flex items-start space-x-2.5">
                        <span className="text-base mt-0.5">{badge.icon}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{m.name}</h4>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${badge.bg}`}>
                              {badge.label}
                            </span>
                          </div>
                          {m.contentSnippet && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {m.contentSnippet}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                            {m.size && <span>{m.size}</span>}
                            <span>•</span>
                            <span>Đã tải lên: {m.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(m.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-all"
                        title="Xóa tài liệu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Dữ liệu tài liệu được bảo mật và chỉ dùng cho AI học tập cá nhân.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
