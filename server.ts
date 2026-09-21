import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// System Prompt for UniLife Companion AI Controller
const SYSTEM_PROMPT = `Bạn là Động cơ Trí tuệ Nhân tạo Trung tâm (Central AI Engine) của "UniLife Companion" (EduFlow AI).
Nhiệm vụ tối thượng của bạn là giải quyết bài toán "Tam giác áp lực" của sinh viên:
[TÀI CHÍNH EO HẸP & CHI THU HÀNG NGÀY] + [QUỸ THỜI GIAN RẢNH THỰC TẾ] + [LỖ HỔNG KIẾN THỨC & LỘ TRÌNH THI CỬ THEO CHƯƠNG].

BẠN PHẢI TUÂN THỦ NGHIÊM NGẶT CÁC NGUYÊN TẮC SAU:
1. NGUYÊN TẮC BÁN KÍNH TÀI CHÍNH (Financial Radius Constraint):
   - Tính toán Hạn mức Chi tiêu An toàn mỗi ngày (Daily Safe Spending Limit):
     Daily Limit = (Thu nhập tháng - Mục tiêu tiết kiệm - Chi phí cố định hàng tháng - Chi tiêu lũy kế) / Số ngày còn lại trong tháng.
   - Cập nhật tự động dựa trên các khoản chi tiêu hàng ngày vừa ghi nhận.
   - Không gợi ý hàng quán đắt đỏ nếu ngân sách ngày hạn hẹp.

2. NGUYÊN TẮC LỘ TRÌNH ÔN THI DỰA TRÊN LƯỢNG KIẾN THỨC & THỜI GIAN CÒN LẠI:
   - Dựa trên danh sách các môn thi, số chương cần ôn (totalChapters, completedChapters), ước tính tổng số giờ cần học (estimatedTotalHoursNeeded), số ngày còn lại đến ngày thi (daysUntilExam), và số giờ rảnh mỗi ngày (totalFreeHoursToday).
   - Đưa ra khuyến nghị số giờ cần học mỗi ngày = Tổng giờ cần ôn / Số ngày còn lại.
   - Phân bổ lộ trình ôn tập thành các giai đoạn cụ thể (Nắm vững lý thuyết then chốt -> Luyện tập bài tập & dạng đề -> Luyện đề thi bấm giờ).

3. NGUYÊN TẮC CHIA NHỎ POMODORO:
   - Bẻ nhỏ kiến thức thành các phiên Pomodoro 25 phút trong quỹ giờ rảnh hôm nay.
   - TUYỆT ĐỐI KHÔNG TỰ ĐẶT LỊCH HỌC CỐ ĐỊNH SÁNG NAY (đã bị bãi bỏ theo yêu cầu của sinh viên). Thay vào đó, khớp vào các khung giờ rảnh và hoạt động sinh hoạt linh hoạt.

4. PHẢN HỒI BẰNG TIẾNG VIỆT CHUẨN MỰC, THỰC TẾ, CỤ THỂ VÀ TRUYỀN CẢM HỨNG.`;

// Gemini response schema for structured output
const ACTION_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    planDate: { type: Type.STRING },
    financialMetrics: {
      type: Type.OBJECT,
      properties: {
        safeDailySpendingLimitVND: { type: Type.NUMBER, description: 'Hạn mức chi tiêu an toàn hôm nay (VND)' },
        budgetStatus: { type: Type.STRING, enum: ['HEALTHY', 'CAUTION', 'STRICT'] },
        financialTip: { type: Type.STRING, description: 'Lời khuyên tài chính thực tế cho sinh viên' },
      },
      required: ['safeDailySpendingLimitVND', 'budgetStatus', 'financialTip'],
    },
    learningFocus: {
      type: Type.OBJECT,
      properties: {
        primarySubject: { type: Type.STRING },
        targetedTopic: { type: Type.STRING, description: 'Chủ đề lỗ hổng kiến thức được ưu tiên giải quyết' },
        pomodoroSlotsAllocated: { type: Type.INTEGER, description: 'Số phiên Pomodoro 25p được phân bổ' },
        studyStrategy: { type: Type.STRING, description: 'Chiến thuật bẻ nhỏ bài toán học tập' },
        totalHoursNeeded: { type: Type.NUMBER, description: 'Tổng số giờ cần ôn tập toàn bộ môn' },
        dailyRecommendedHours: { type: Type.NUMBER, description: 'Số giờ khuyến nghị học mỗi ngày' },
      },
      required: ['primarySubject', 'targetedTopic', 'pomodoroSlotsAllocated', 'studyStrategy', 'totalHoursNeeded', 'dailyRecommendedHours'],
    },
    examRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseName: { type: Type.STRING },
          daysRange: { type: Type.STRING },
          dailyFocusHours: { type: Type.NUMBER },
          strategy: { type: Type.STRING },
          keyMilestone: { type: Type.STRING },
        },
        required: ['phaseName', 'daysRange', 'dailyFocusHours', 'strategy', 'keyMilestone'],
      },
    },
    scheduleTimeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timeWindow: { type: Type.STRING, description: 'Ví dụ: 14:00 - 14:50' },
          blockType: {
            type: Type.STRING,
            enum: ['POMODORO_STUDY', 'MEAL_BREAK', 'DEEP_WORK', 'REVIEW', 'REST'],
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          actionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          targetedGapTopic: { type: Type.STRING },
          estimatedCostVND: { type: Type.NUMBER },
        },
        required: ['timeWindow', 'blockType', 'title', 'description', 'actionItems', 'estimatedCostVND'],
      },
    },
    lifestyleRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['MEAL', 'STUDY_LOCATION', 'LEISURE'] },
          title: { type: Type.STRING },
          costVND: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          fitsFinancialRadius: { type: Type.BOOLEAN },
        },
        required: ['category', 'title', 'costVND', 'reasoning', 'fitsFinancialRadius'],
      },
    },
    aiArchitectReflection: {
      type: Type.OBJECT,
      properties: {
        pressureTriangleAnalysis: {
          type: Type.STRING,
          description: 'Phân tích cân bằng giữa Tiền bạc, Thời gian và Kiến thức',
        },
        tradeOffDecisions: {
          type: Type.STRING,
          description: 'Các quyết định đánh đổi mà AI đã đưa ra để bảo vệ mục tiêu sinh viên',
        },
      },
      required: ['pressureTriangleAnalysis', 'tradeOffDecisions'],
    },
  },
  required: [
    'planDate',
    'financialMetrics',
    'learningFocus',
    'examRoadmap',
    'scheduleTimeline',
    'lifestyleRecommendations',
    'aiArchitectReflection',
  ],
};

// POST /api/ai/schedule
app.post('/api/ai/schedule', async (req, res) => {
  try {
    const studentState = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic simulation based on formula & dynamic student state
      const fin = studentState.financial || {
        monthlyIncome: 3000000,
        savingsTarget: 800000,
        fixedExpensesMonthly: 600000,
        currentSpentThisMonth: 520000,
        daysRemainingInMonth: 20,
      };

      const remainingSpendable = fin.monthlyIncome - fin.savingsTarget - fin.fixedExpensesMonthly - fin.currentSpentThisMonth;
      const dailyLimit = Math.max(25000, Math.round(remainingSpendable / Math.max(1, fin.daysRemainingInMonth || 20)));

      // Find urgent subject (shortest daysUntilExam or with critical gaps)
      const subjects = studentState.learning?.subjects || [];
      const urgentSubject = subjects.length > 0
        ? [...subjects].sort((a, b) => (a.daysUntilExam || 99) - (b.daysUntilExam || 99))[0]
        : {
            subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
            subjectCode: 'DSA102',
            daysUntilExam: 14,
            totalChapters: 6,
            completedChapters: 2,
            estimatedTotalHoursNeeded: 18,
            gaps: [{ topic: 'Cây AVL (Hệ số cân bằng BF & 4 phép xoay)' }],
          };

      const gapTopic = urgentSubject.gaps?.[0]?.topic || 'Lỗ hổng trọng tâm môn thi';
      const daysUntilExam = urgentSubject.daysUntilExam || 14;
      const totalHoursNeeded = urgentSubject.estimatedTotalHoursNeeded || 18;
      const freeHoursToday = studentState.time?.totalFreeHoursToday || 3.5;
      const dailyRecommendedHours = Math.min(
        freeHoursToday,
        Math.max(1.5, Math.round((totalHoursNeeded / Math.max(1, daysUntilExam)) * 10) / 10)
      );

      const pomodoroSlots = Math.min(6, Math.max(2, Math.round((dailyRecommendedHours * 60) / 30)));
      const studentName = studentState.fullName || 'Bạn';
      const university = studentState.personal?.university || 'Trường Đại học';

      const fallbackPlan = {
        planDate: new Date().toISOString().split('T')[0],
        financialMetrics: {
          safeDailySpendingLimitVND: dailyLimit,
          budgetStatus: dailyLimit < 55000 ? 'STRICT' : 'CAUTION',
          financialTip: `Hạn mức hôm nay: ${dailyLimit.toLocaleString('vi-VN')}đ (sau khi trừ các khoản chi tiêu mới). Hãy giữ kỷ luật ăn uống tiết kiệm để bảo toàn mục tiêu ${(fin.savingsTarget || 800000).toLocaleString('vi-VN')}đ.`,
        },
        learningFocus: {
          primarySubject: `${urgentSubject.subjectName} (${urgentSubject.subjectCode})`,
          targetedTopic: gapTopic,
          pomodoroSlotsAllocated: pomodoroSlots,
          totalHoursNeeded: totalHoursNeeded,
          dailyRecommendedHours: dailyRecommendedHours,
          studyStrategy: `Còn ${daysUntilExam} ngày trước kỳ thi, cần hoàn thành ${totalHoursNeeded}h ôn tập. Với ${freeHoursToday}h rảnh hôm nay, AI phân bổ ${dailyRecommendedHours}h (${pomodoroSlots} phiên Pomodoro) bẻ khóa chuyên sâu vào "${gapTopic}".`,
        },
        examRoadmap: [
          {
            phaseName: 'Giai đoạn 1: Bịt kín lỗ hổng & Nắm chắc lý thuyết cốt lõi',
            daysRange: `Ngày 1 - ${Math.max(2, Math.round(daysUntilExam * 0.4))} (Còn ${daysUntilExam} ngày)`,
            dailyFocusHours: dailyRecommendedHours,
            strategy: `Tập trung giải quyết dứt điểm các lỗ hổng: ${gapTopic}. Đọc giáo trình và viết tóm tắt tay.`,
            keyMilestone: `Nắm vững 100% khái niệm và vượt qua bài kiểm tra trắc nghiệm thử thách.`,
          },
          {
            phaseName: 'Giai đoạn 2: Luyện giải bài tập dạng đề thi & Viết code mẫu',
            daysRange: `Ngày ${Math.round(daysUntilExam * 0.4) + 1} - ${Math.round(daysUntilExam * 0.75)}`,
            dailyFocusHours: dailyRecommendedHours,
            strategy: 'Giải các bài tập tự luận và thuật toán kinh điển trong đề thi các năm trước.',
            keyMilestone: 'Tự tay giải đúng 85% các câu hỏi mức độ trung bình - khó.',
          },
          {
            phaseName: 'Giai đoạn 3: Bấm giờ thi thử & Rà soát tổng lực',
            daysRange: `Ngày ${Math.round(daysUntilExam * 0.75) + 1} - Ngày thi`,
            dailyFocusHours: Math.max(1, dailyRecommendedHours - 0.5),
            strategy: 'Làm đề thi thử trọn vẹn dưới áp lực thời gian thật. Giữ tinh thần thoải mái, ngủ đủ giấc.',
            keyMilestone: 'Sẵn sàng tự tin bước vào phòng thi đạt điểm mục tiêu!',
          },
        ],
        scheduleTimeline: [
          {
            timeWindow: '08:00 - 08:30',
            blockType: 'REVIEW',
            title: 'Khởi động trí nhớ & Ôn thẻ nhớ (Flashcard)',
            description: `Dành 25 phút lướt nhanh thẻ nhớ kiến thức môn ${urgentSubject.subjectName} để kích hoạt não bộ`,
            actionItems: ['Lật 10 thẻ nhớ khái niệm', 'Uống 1 cốc nước ấm và vươn vai'],
            estimatedCostVND: 0,
          },
          {
            timeWindow: '08:45 - 11:30',
            blockType: 'POMODORO_STUDY',
            title: `Phiên Pomodoro Chuyên sâu 1: ${gapTopic}`,
            description: `Đào sâu lý thuyết bản chất của ${gapTopic} tại không gian yên tĩnh`,
            actionItems: ['Đọc tài liệu và gạch chân từ khóa', 'Vẽ sơ đồ tư duy liên kết các ý'],
            targetedGapTopic: gapTopic,
            estimatedCostVND: 0,
          },
          {
            timeWindow: '12:00 - 13:00',
            blockType: 'MEAL_BREAK',
            title: 'Bữa trưa dinh dưỡng tiết kiệm & Nghỉ trưa',
            description: `Cơm sinh viên bình dân hoặc tự nấu gần ${university}`,
            actionItems: ['Suất cơm 30k đủ protein và rau xanh', 'Nghỉ ngơi 20 phút để phục hồi trí não'],
            estimatedCostVND: 30000,
          },
          {
            timeWindow: '14:30 - 16:30',
            blockType: 'POMODORO_STUDY',
            title: `Phiên Pomodoro Chuyên sâu 2: Luyện giải bài tập thực tế`,
            description: `Áp dụng ${gapTopic} vào giải bài tập và làm câu hỏi trắc nghiệm tư duy`,
            actionItems: ['Thực hành 3 bài tập mẫu', 'Trả lời câu hỏi trắc nghiệm thử thách trên app'],
            targetedGapTopic: gapTopic,
            estimatedCostVND: 0,
          },
          {
            timeWindow: '17:30 - 18:30',
            blockType: 'REST',
            title: 'Vận động thể chất & Tái tạo năng lượng',
            description: 'Đi bộ nhẹ nhàng, nghe nhạc hoặc thể dục tại ký túc xá/phòng trọ',
            actionItems: ['Vận động 30 phút xả stress', 'Tách khỏi màn hình máy tính'],
            estimatedCostVND: 0,
          },
          {
            timeWindow: '19:30 - 20:30',
            blockType: 'REVIEW',
            title: 'Tổng kết ngày & Kiểm tra mức độ ghi nhớ',
            description: 'Ghi chép những gì đã học hôm nay và đối chiếu tiến độ với lộ trình ôn thi',
            actionItems: ['Cập nhật các khoản chi tiêu phát sinh trong ngày', 'Đi ngủ đúng giờ trước 23:30'],
            estimatedCostVND: 0,
          },
        ],
        lifestyleRecommendations: [
          {
            category: 'MEAL',
            title: `Quán cơm bình dân sinh viên gần ${university}`,
            costVND: 30000,
            reasoning: 'Nằm gọn trong hạn mức daily an toàn, bảo toàn ví tiền.',
            fitsFinancialRadius: true,
          },
          {
            category: 'STUDY_LOCATION',
            title: `Thư viện ${university} (Khu tự học có máy lạnh)`,
            costVND: 0,
            reasoning: 'Hoàn toàn miễn phí, wifi mạnh, yên tĩnh tối đa cho các phiên Pomodoro.',
            fitsFinancialRadius: true,
          },
          {
            category: 'LEISURE',
            title: 'Đi bộ hoặc chạy cự ly ngắn 1.5km',
            costVND: 0,
            reasoning: 'Giúp não bộ thư giãn, tăng tuần hoàn máu và ngủ sâu hơn.',
            fitsFinancialRadius: true,
          },
        ],
        aiArchitectReflection: {
          pressureTriangleAnalysis: `Sinh viên có ${freeHoursToday}h rảnh hôm nay và ${daysUntilExam} ngày trước kỳ thi ${urgentSubject.subjectName}. AI phân bổ ${dailyRecommendedHours}h học trực diện vào lỗ hổng "${gapTopic}". Hạn mức chi tiêu ngày được giữ ở mức ${dailyLimit.toLocaleString('vi-VN')}đ để bảo toàn mục tiêu tiết kiệm.`,
          tradeOffDecisions: `Đánh đổi: Ưu tiên môn có hạn thi gần nhất (${urgentSubject.subjectName}). Đã loại bỏ lịch học cố định gò bó, phân bổ các phiên học linh hoạt trong ngày để sinh viên không bị quá tải.`,
        },
      };

      return res.json({
        plan: fallbackPlan,
        source: 'SIMULATED_LOCAL_ENGINE',
        message: 'Kế hoạch tính toán chuẩn xác từ thuật toán cân bằng của UniLife Companion.',
      });
    }

    // Call Gemini 3.8 Flash
    const prompt = `Dưới đây là Dữ liệu Trạng thái Sinh viên (Student State System):
${JSON.stringify(studentState, null, 2)}

Hãy phân tích toàn diện 4 trụ cột, lưu ý:
- Phân tích chi tiết danh sách tất cả các môn thi, số chương cần ôn (totalChapters), lượng kiến thức, giáo trình/tài liệu/đề trắc nghiệm đã nạp (materials), và số ngày còn lại đến kỳ thi.
- Tính toán Hạn mức Chi tiêu An toàn mỗi ngày dựa trên các khoản chi tiêu mới nhất.
- Đưa ra Lộ trình Ôn thi Từng Giai Đoạn (examRoadmap) cụ thể bám sát giáo trình và dạng đề trắc nghiệm đã cung cấp.
- Phân bổ các phiên Pomodoro vào quỹ thời gian rảnh hôm nay. KHÔNG xếp đè lên lịch cố định nào.
Xuất ra Kế hoạch hành động chi tiết hôm nay theo schema JSON đã định nghĩa.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: ACTION_PLAN_SCHEMA,
        temperature: 0.2,
      },
    });

    const parsedPlan = JSON.parse(response.text || '{}');
    return res.json({
      plan: parsedPlan,
      source: 'GEMINI_3_8_FLASH',
      message: 'Kế hoạch được tạo thành công từ Google Gemini 3.8 Flash API.',
    });
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    res.status(500).json({
      error: 'Không thể tạo kế hoạch',
      details: error.message || 'Lỗi xử lý AI',
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniLife Companion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
