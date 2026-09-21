import React, { useState } from 'react';
import { StudentState, Flashcard, QuizQuestion } from '../types';
import { INITIAL_FLASHCARDS, INITIAL_QUIZZES } from '../data/learningGames';
import { 
  Sparkles, 
  X, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  BrainCircuit, 
  Layers, 
  Lightbulb, 
  Flame, 
  Award, 
  ArrowRight, 
  Shuffle, 
  BookOpen,
  Check
} from 'lucide-react';

interface StudyGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentState: StudentState;
  onOpenMaterialsModal?: (subjectId?: string) => void;
}

export const StudyGamesModal: React.FC<StudyGamesModalProps> = ({
  isOpen,
  onClose,
  studentState,
  onOpenMaterialsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'FLASHCARD' | 'QUIZ'>('FLASHCARD');

  // Subjects filter
  const registeredSubjects = studentState.learning.subjects || [];
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('ALL');

  // Flashcard State
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Quiz State
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(INITIAL_QUIZZES);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  if (!isOpen) return null;

  // Filtered Flashcards
  const filteredCards = selectedSubjectCode === 'ALL'
    ? cards
    : cards.filter((c) => c.subjectCode === selectedSubjectCode);

  const currentCard = filteredCards[cardIndex] || filteredCards[0];

  // Filtered Quizzes
  const filteredQuizzes = selectedSubjectCode === 'ALL'
    ? quizzes
    : quizzes.filter((q) => q.subjectCode === selectedSubjectCode);

  const currentQuiz = filteredQuizzes[quizIndex] || filteredQuizzes[0];

  // Flashcard Actions
  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const handleShuffleCards = () => {
    setIsFlipped(false);
    setShowHint(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCardIndex(0);
  };

  const markCardMastery = (cardId: string, mastered: boolean) => {
    setMasteredCards((prev) => ({ ...prev, [cardId]: mastered }));
    handleNextCard();
  };

  // Quiz Actions
  const handleSelectQuizOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    if (index === currentQuiz?.correctIndex) {
      setQuizScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizIndex((prev) => (prev + 1) % Math.max(1, filteredQuizzes.length));
  };

  const masteredCount = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-lg w-full overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header with Mode Tabs */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md">
                <BrainCircuit className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-bold">Ôn Thi Tương Tác (Active Recall)</h3>
                <p className="text-xs text-indigo-100">Kích hoạt phản xạ & giải tỏa áp lực thi cử</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/20 backdrop-blur-sm p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('FLASHCARD')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'FLASHCARD'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Thẻ Nhớ (Flashcard)</span>
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'QUIZ'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Đố Vui Tư Duy (Quiz)</span>
            </button>
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center space-x-1.5 mt-3 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => {
                setSelectedSubjectCode('ALL');
                setCardIndex(0);
                setQuizIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedSubjectCode === 'ALL'
                  ? 'bg-white text-indigo-800 font-bold shadow-xs'
                  : 'bg-white/15 text-indigo-100 hover:bg-white/25'
              }`}
            >
              Tất cả môn
            </button>
            {registeredSubjects.map((sub) => (
              <button
                key={sub.id || sub.subjectCode}
                onClick={() => {
                  setSelectedSubjectCode(sub.subjectCode);
                  setCardIndex(0);
                  setQuizIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedSubjectCode === sub.subjectCode
                    ? 'bg-white text-indigo-800 font-bold shadow-xs'
                    : 'bg-white/15 text-indigo-100 hover:bg-white/25'
                }`}
              >
                {sub.subjectCode} ({sub.subjectName.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Context Banner: Based on provided materials & quizzes */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-indigo-100">
            <span className="truncate max-w-[270px]">
              📚 Đề ôn tập & thẻ nhớ bám sát giáo trình đã nạp
            </span>
            <button
              type="button"
              onClick={() => {
                const activeSub = registeredSubjects.find((s) => s.subjectCode === selectedSubjectCode) || registeredSubjects[0];
                onOpenMaterialsModal?.(activeSub?.id);
              }}
              className="text-amber-300 hover:text-white font-bold underline shrink-0 ml-1.5 cursor-pointer"
            >
              + Nạp thêm đề trắc nghiệm
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: FLASHCARD GAME */}
          {activeTab === 'FLASHCARD' && (
            <div className="space-y-4">
              {/* Progress & Counter */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Thẻ {filteredCards.length > 0 ? cardIndex + 1 : 0} / {filteredCards.length}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-600 font-medium">
                    Đã thuộc: {masteredCount} thẻ
                  </span>
                  <button
                    onClick={handleShuffleCards}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium"
                    title="Xáo trộn ngẫu nhiên"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Xáo thẻ</span>
                  </button>
                </div>
              </div>

              {/* Flashcard Component */}
              {currentCard ? (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[260px] p-6 rounded-3xl cursor-pointer transition-all duration-300 transform select-none flex flex-col justify-between shadow-md border ${
                    isFlipped
                      ? 'bg-gradient-to-br from-indigo-900 to-purple-950 text-white border-indigo-700'
                      : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-800 border-indigo-100 hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isFlipped
                          ? 'bg-indigo-700/60 text-indigo-200'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {currentCard.category} • {currentCard.subjectCode}
                    </span>
                    <span
                      className={`text-xs flex items-center space-x-1 font-medium ${
                        isFlipped ? 'text-indigo-300' : 'text-slate-400'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Chạm để xem câu hỏi' : 'Chạm để lật đáp án'}</span>
                    </span>
                  </div>

                  {/* Card Content (Question or Answer) */}
                  <div className="my-auto py-3">
                    {!isFlipped ? (
                      <div className="space-y-3">
                        <div className="text-[11px] font-bold uppercase text-slate-400">Câu hỏi khái niệm:</div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {currentCard.question}
                        </h4>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-[11px] font-bold uppercase text-amber-300">Bản chất đáp án:</div>
                        <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-medium">
                          {currentCard.answer}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Hint or Key Point */}
                  <div className="border-t pt-3 flex items-center justify-between text-xs">
                    {!isFlipped ? (
                      <div>
                        {showHint ? (
                          <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center space-x-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Gợi ý: {currentCard.keyHint}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowHint(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 text-xs"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Xem gợi ý then chốt</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-indigo-300 text-[11px] italic">
                        💡 Mẹo nhớ: {currentCard.keyHint}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isFlipped ? 'Mặt Sau' : 'Mặt Trước'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Chưa có thẻ nhớ nào cho môn học này.
                </div>
              )}

              {/* Action Buttons for Card */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => markCardMastery(currentCard.id, false)}
                  className="py-3 px-4 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Chưa thuộc (Cần ôn lại)</span>
                </button>
                <button
                  onClick={() => markCardMastery(currentCard.id, true)}
                  className="py-3 px-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã thuộc làu làu (+10 XP)</span>
                </button>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevCard}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  ← Thẻ trước
                </button>
                <button
                  onClick={handleNextCard}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-all flex items-center space-x-1"
                >
                  <span>Thẻ tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MIND QUIZ GAME */}
          {activeTab === 'QUIZ' && (
            <div className="space-y-4">
              {/* Score & Streak Header */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Điểm: {quizScore} XP</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-600">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>Chuỗi trả lời đúng: {streak} 🔥</span>
                </div>
              </div>

              {currentQuiz ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[10px]">
                        {currentQuiz.subjectCode} • {currentQuiz.subjectName}
                      </span>
                      <span>
                        Câu {quizIndex + 1} / {filteredQuizzes.length}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {currentQuiz.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQuiz.options.map((opt, i) => {
                      const isSelected = selectedOption === i;
                      const isCorrect = i === currentQuiz.correctIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={hasAnswered}
                          onClick={() => handleSelectQuizOption(i)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start space-x-3 cursor-pointer ${btnStyle}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                              hasAnswered && isCorrect
                                ? 'bg-emerald-500 text-white'
                                : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="leading-relaxed flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after answer */}
                  {hasAnswered && (
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
                        selectedOption === currentQuiz.correctIndex
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="font-bold flex items-center space-x-1">
                        {selectedOption === currentQuiz.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Chính xác tuyệt vời! (+10 XP)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span>Chưa chính xác. Cùng xem bản chất lý thuyết:</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-700">{currentQuiz.explanation}</p>

                      <div className="pt-2">
                        <button
                          onClick={handleNextQuiz}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
                        >
                          <span>Câu tiếp theo</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Chưa có câu hỏi đố vui cho môn này.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Học tập chủ động (Active Recall) tăng 80% khả năng ghi nhớ dài hạn
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
