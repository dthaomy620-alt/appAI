export interface DailyTransaction {
  id: string;
  type: 'EXPENSE' | 'INCOME';
  amount: number;
  category: 'FOOD' | 'STUDY' | 'LIVING' | 'TRANSPORT' | 'ENTERTAINMENT' | 'SALARY_ALLOWANCE' | 'OTHER';
  note: string;
  timestamp: string; // e.g. "12:30"
  date: string; // "2026-09-21"
}

export interface FinancialState {
  monthlyIncome: number; // e.g. 3,000,000 VND
  savingsTarget: number; // e.g. 800,000 VND
  currentSpentThisMonth: number; // e.g. 450,000 VND
  daysRemainingInMonth: number; // e.g. 20 days
  emergencyFund: number; // e.g. 500,000 VND
  currency: string; // "VND"
  fixedExpensesMonthly: number; // e.g. 600,000 VND (tiền trọ/điện nước share)
  transactions: DailyTransaction[];
}

export interface KnowledgeGap {
  topic: string; // e.g. "Cây AVL (Cân bằng & Phép xoay LL, RR, LR, RL)"
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHoursNeeded: number; // e.g. 4.5 hours
  masteryPercentage: number; // e.g. 25%
}

export interface ChapterScope {
  id: string;
  title: string;
  estimatedHours: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';
}

export interface SubjectMaterial {
  id: string;
  name: string;
  type: 'TEXTBOOK' | 'QUIZ' | 'SLIDE' | 'NOTE' | 'LINK';
  size?: string;
  uploadedAt: string;
  contentSnippet?: string;
}

export interface SubjectLearningState {
  id: string;
  subjectCode: string; // "DSA102"
  subjectName: string; // "Cấu trúc Dữ liệu & Giải thuật"
  currentGradeEstimate: number; // 6.0 / 10
  targetGrade: number; // 8.5 / 10
  examDate: string; // "2026-10-05"
  daysUntilExam: number; // 14
  totalChapters: number; // e.g. 6 chapters
  completedChapters: number; // e.g. 2 chapters
  estimatedTotalHoursNeeded: number; // e.g. 20 hours
  difficultyLevel: 'HARD' | 'MEDIUM' | 'EASY';
  gaps: KnowledgeGap[];
  chapters: ChapterScope[];
  materials?: SubjectMaterial[];
}

export interface LearningState {
  subjects: SubjectLearningState[];
  preferredStudyPace: 'INTENSIVE' | 'BALANCED' | 'LIGHT';
  pomodoroDurationMinutes: number; // default 25
}

export interface TimeState {
  date: string; // "2026-09-21"
  dayOfWeek: string; // "Thứ Hai"
  totalFreeHoursToday: number; // e.g. 3.0
  freeWindows: { start: string; end: string; durationMinutes: number }[];
}

export interface StudentGoals {
  academicGoal: string; // "Đạt điểm A môn DSA, qua môn không phải thi lại"
  financialGoal: string; // "Tiết kiệm 800,000đ mua khóa học/đổi linh kiện laptop"
  wellbeingGoal: string; // "Ngủ trước 23:30, không bỏ bữa sáng"
}

export interface PersonalProfile {
  university: string; // "Đại học Bách Khoa (ĐHQG)"
  wakeUpTime: string; // "06:30"
  sleepTime: string; // "23:30"
  livingSituation: 'DORM' | 'RENTAL' | 'WITH_FAMILY';
  stressLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  cookingHabit: 'SELF_COOK' | 'EAT_OUT' | 'MIXED';
}

export interface StudentState {
  studentId: string;
  fullName: string;
  academicYear: string;
  major: string; // "Kỹ thuật Phần mềm / CNTT"
  personal: PersonalProfile;
  financial: FinancialState;
  learning: LearningState;
  time: TimeState;
  goals: StudentGoals;
}

// Flashcard and Mind Quiz models
export interface Flashcard {
  id: string;
  subjectCode: string;
  subjectName: string;
  question: string;
  answer: string;
  keyHint: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  subjectCode: string;
  subjectName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// AI Output Action Plan Models
export interface ScheduleBlock {
  timeWindow: string; // "14:00 - 14:50"
  blockType: 'POMODORO_STUDY' | 'MEAL_BREAK' | 'DEEP_WORK' | 'REVIEW' | 'REST';
  title: string;
  description: string;
  actionItems: string[];
  targetedGapTopic?: string;
  estimatedCostVND: number;
}

export interface LifestyleRecommendation {
  category: 'MEAL' | 'STUDY_LOCATION' | 'LEISURE';
  title: string;
  costVND: number;
  reasoning: string;
  fitsFinancialRadius: boolean;
}

export interface ExamRoadmapPhase {
  phaseName: string;
  daysRange: string;
  dailyFocusHours: number;
  strategy: string;
  keyMilestone: string;
}

export interface DailyActionPlan {
  planDate: string;
  financialMetrics: {
    safeDailySpendingLimitVND: number;
    budgetStatus: 'HEALTHY' | 'CAUTION' | 'STRICT';
    financialTip: string;
  };
  learningFocus: {
    primarySubject: string;
    targetedTopic: string;
    pomodoroSlotsAllocated: number;
    studyStrategy: string;
    totalHoursNeeded: number;
    dailyRecommendedHours: number;
  };
  examRoadmap: ExamRoadmapPhase[];
  scheduleTimeline: ScheduleBlock[];
  lifestyleRecommendations: LifestyleRecommendation[];
  aiArchitectReflection: {
    pressureTriangleAnalysis: string;
    tradeOffDecisions: string;
  };
}
