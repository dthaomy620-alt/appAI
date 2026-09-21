import { Flashcard, QuizQuestion } from '../types';

export const UNIVERSITY_SUGGESTIONS = [
  'Đại học Bách Khoa (ĐHQG-HCM)',
  'Đại học Bách Khoa Hà Nội (HUST)',
  'Đại học Kinh tế Quốc dân (NEU)',
  'Đại học Ngoại thương (FTU)',
  'Đại học Công nghệ - ĐHQGHN (UET)',
  'Đại học Khoa học Tự nhiên (ĐHQG-HCM)',
  'Đại học Kinh tế TP.HCM (UEH)',
  'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
  'Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)',
  'Đại học Cần Thơ (CTU)',
  'Đại học FPT',
  'Đại học Quốc tế (ĐHQG-HCM)',
  'Đại học Sài Gòn (SGU)',
  'Đại học Tôn Đức Thắng (TDTU)',
  'Đại học Giao thông Vận tải',
  'Đại học Xây dựng Hà Nội',
  'Học viện Tài chính (AOF)',
  'Đại học Ngân hàng TP.HCM (HUB)',
];

export const SUBJECT_PRESETS = [
  {
    code: 'DSA102',
    name: 'Cấu trúc Dữ liệu & Giải thuật',
    totalChapters: 6,
    defaultGaps: ['Cây AVL (Hệ số cân bằng BF & 4 phép xoay)', 'Đồ thị (Dijkstra & Kruskal)'],
    chapters: [
      { id: 'c1', title: 'Chương 1: Phân tích độ phức tạp thuật toán O(n)', estimatedHours: 3, status: 'MASTERED' as const },
      { id: 'c2', title: 'Chương 2: Danh sách liên kết & Ngăn xếp (Stack/Queue)', estimatedHours: 4, status: 'MASTERED' as const },
      { id: 'c3', title: 'Chương 3: Cây nhị phân tìm kiếm & Cây AVL', estimatedHours: 6, status: 'IN_PROGRESS' as const },
      { id: 'c4', title: 'Chương 4: Bảng băm (Hash Table & Collision)', estimatedHours: 4, status: 'NOT_STARTED' as const },
      { id: 'c5', title: 'Chương 5: Đồ thị & Duyệt BFS/DFS, Dijkstra', estimatedHours: 6, status: 'NOT_STARTED' as const },
      { id: 'c6', title: 'Chương 6: Quy hoạch động (Dynamic Programming)', estimatedHours: 5, status: 'NOT_STARTED' as const },
    ]
  },
  {
    code: 'DB201',
    name: 'Hệ Quản trị Cơ sở Dữ liệu',
    totalChapters: 5,
    defaultGaps: ['Chuẩn hóa dữ liệu (3NF & BCNF)', 'Transaction & Khóa ACID'],
    chapters: [
      { id: 'c1', title: 'Chương 1: Mô hình thực thể kết hợp ERD', estimatedHours: 3, status: 'MASTERED' as const },
      { id: 'c2', title: 'Chương 2: Đại số quan hệ & Truy vấn SQL nâng cao', estimatedHours: 5, status: 'IN_PROGRESS' as const },
      { id: 'c3', title: 'Chương 3: Phụ thuộc hàm & Chuẩn hóa 1NF-BCNF', estimatedHours: 6, status: 'IN_PROGRESS' as const },
      { id: 'c4', title: 'Chương 4: Quản lý Giao dịch (Transaction & ACID)', estimatedHours: 4, status: 'NOT_STARTED' as const },
      { id: 'c5', title: 'Chương 5: Lập chỉ mục (B-Tree Indexing) & Tối ưu SQL', estimatedHours: 4, status: 'NOT_STARTED' as const },
    ]
  },
  {
    code: 'MATH104',
    name: 'Toán Rời rạc & Lý thuyết Đồ thị',
    totalChapters: 5,
    defaultGaps: ['Lý thuyết tổ hợp & Đẳng thức truy hồi', 'Chu trình Euler & Hamilton'],
    chapters: [
      { id: 'c1', title: 'Chương 1: Logic mệnh đề & Phương pháp chứng minh quy nạp', estimatedHours: 3, status: 'MASTERED' as const },
      { id: 'c2', title: 'Chương 2: Quan hệ & Ánh xạ', estimatedHours: 3, status: 'IN_PROGRESS' as const },
      { id: 'c3', title: 'Chương 3: Đại số Bool & Mạch logic', estimatedHours: 4, status: 'NOT_STARTED' as const },
      { id: 'c4', title: 'Chương 4: Tổ hợp & Phương trình sai phân', estimatedHours: 6, status: 'NOT_STARTED' as const },
      { id: 'c5', title: 'Chương 5: Đồ thị phẳng & Tô màu đồ thị', estimatedHours: 5, status: 'NOT_STARTED' as const },
    ]
  },
  {
    code: 'OS301',
    name: 'Hệ Điều hành (Operating Systems)',
    totalChapters: 5,
    defaultGaps: ['Điều phối tiến trình CPU & Semaphore', 'Quản lý Bộ nhớ ảo (Paging & LRU)'],
    chapters: [
      { id: 'c1', title: 'Chương 1: Cấu trúc hệ điều hành & System Call', estimatedHours: 3, status: 'MASTERED' as const },
      { id: 'c2', title: 'Chương 2: Tiến trình, Luồng & IPC', estimatedHours: 4, status: 'IN_PROGRESS' as const },
      { id: 'c3', title: 'Chương 3: Đồng bộ hóa, Mutex & Deadlock', estimatedHours: 6, status: 'NOT_STARTED' as const },
      { id: 'c4', title: 'Chương 4: Bộ nhớ chính & Thuật toán thay thế trang LRU', estimatedHours: 5, status: 'NOT_STARTED' as const },
      { id: 'c5', title: 'Chương 5: Hệ thống tập tin (File System & Disk Scheduling)', estimatedHours: 4, status: 'NOT_STARTED' as const },
    ]
  },
  {
    code: 'NET202',
    name: 'Mạng Máy tính (Computer Networks)',
    totalChapters: 5,
    defaultGaps: ['Phân chia mạng con Subnetting & CIDR', 'Cơ chế bắt tay 3 bước TCP vs UDP'],
    chapters: [
      { id: 'c1', title: 'Chương 1: Mô hình OSI & TCP/IP 5 tầng', estimatedHours: 3, status: 'MASTERED' as const },
      { id: 'c2', title: 'Chương 2: Tầng Ứng dụng (DNS, HTTP/HTTPS)', estimatedHours: 4, status: 'IN_PROGRESS' as const },
      { id: 'c3', title: 'Chương 3: Tầng Giao vận (TCP Flow Control, Congestion)', estimatedHours: 5, status: 'NOT_STARTED' as const },
      { id: 'c4', title: 'Chương 4: Tầng Mạng (IP Addressing & Routing)', estimatedHours: 6, status: 'NOT_STARTED' as const },
      { id: 'c5', title: 'Chương 5: Tầng Liên kết dữ liệu & An ninh mạng', estimatedHours: 4, status: 'NOT_STARTED' as const },
    ]
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subjectCode: 'DSA102',
    subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
    question: 'Hệ số cân bằng (Balance Factor - BF) của một node trong Cây AVL được tính như thế nào?',
    answer: 'BF(Node) = Chiều cao Cây con Trái - Chiều cao Cây con Phải. Cây AVL hợp lệ khi BF thuộc {-1, 0, 1}.',
    keyHint: 'BF = Height(Left) - Height(Right)',
    category: 'Cây AVL'
  },
  {
    id: 'fc-2',
    subjectCode: 'DSA102',
    subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
    question: 'Khi nào cần thực hiện phép Xoay Kép LR (Left-Right Rotation) trong Cây AVL?',
    answer: 'Khi node mất cân bằng có BF = +2 (lệch Trái) và node con Trái có BF = -1 (lệch Phải). Ta xoay Trái node con trước, sau đó xoay Phải node gốc.',
    keyHint: 'Trái - Phải (+2, -1) -> Xoay kép LR',
    category: 'Cây AVL'
  },
  {
    id: 'fc-3',
    subjectCode: 'DB201',
    subjectName: 'Cơ sở Dữ liệu',
    question: 'Điều kiện để một lược đồ quan hệ đạt Dạng chuẩn 3 (3NF) là gì?',
    answer: 'Phải đạt 2NF và KHÔNG chứa bất kỳ phụ thuộc bắc cầu nào từ thuộc tính không khóa vào khóa chính.',
    keyHint: 'Đạt 2NF + Triệt tiêu phụ thuộc bắc cầu',
    category: 'Chuẩn hóa CSDL'
  },
  {
    id: 'fc-4',
    subjectCode: 'DB201',
    subjectName: 'Cơ sở Dữ liệu',
    question: 'Thuộc tính ACID trong Transaction quản lý CSDL viết tắt của 4 từ nào?',
    answer: 'Atomicity (Nguyên tử), Consistency (Nhất quán), Isolation (Cô lập), Durability (Bền vững).',
    keyHint: 'A-C-I-D: Tất cả hoặc không gì cả',
    category: 'Giao dịch CSDL'
  },
  {
    id: 'fc-5',
    subjectCode: 'MATH104',
    subjectName: 'Toán Rời rạc',
    question: 'Một đồ thị vô hướng liên thông có chu trình Euler khi và chỉ khi thỏa mãn điều kiện nào?',
    answer: 'Mọi đỉnh của đồ thị đều có BẬC CHẴN (Degree là số chẵn).',
    keyHint: 'Tất cả các đỉnh có bậc chẵn',
    category: 'Lý thuyết Đồ thị'
  },
  {
    id: 'fc-6',
    subjectCode: 'OS301',
    subjectName: 'Hệ Điều hành',
    question: '4 điều kiện cần để xảy ra Deadlock (Khóa chết) giữa các tiến trình là gì?',
    answer: 'Mutual Exclusion (Độc quyền), Hold and Wait (Giữ và chờ), No Preemption (Không tước đoạt), Circular Wait (Chờ đợi vòng tròn).',
    keyHint: '4 điều kiện kinh điển Coffman',
    category: 'Tiến trình & Deadlock'
  },
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-1',
    subjectCode: 'DSA102',
    subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
    question: 'Cho cây AVL có node gốc X với chiều cao cây con trái là 4, chiều cao cây con phải là 2. Kết luận nào sau đây đúng?',
    options: [
      'Cây vẫn cân bằng vì chênh lệch là 2',
      'Node X bị mất cân bằng vì BF = +2 (cần thực hiện phép xoay)',
      'Cây tự động biến thành cây nhị phân đỏ đen',
      'Độ phức tạp tìm kiếm giảm về O(1)'
    ],
    correctIndex: 1,
    explanation: 'Hệ số cân bằng BF = 4 - 2 = +2. Trong cây AVL, BF chỉ được phép là -1, 0 hoặc +1. Do BF = +2, node X đã vi phạm tính cân bằng và cần tái cân bằng ngay lập tức.'
  },
  {
    id: 'qz-2',
    subjectCode: 'DB201',
    subjectName: 'Cơ sở Dữ liệu',
    question: 'Trong cơ chế khóa ACID, tính chất "Atomicity" (Nguyên tử) đảm bảo điều gì?',
    options: [
      'Giao dịch chạy đồng thời với tốc độ ánh sáng',
      'Mọi thao tác trong giao dịch hoặc là thành công trọn vẹn, hoặc là bị hủy bỏ hoàn toàn (không có trạng thái dở dang)',
      'Dữ liệu tự động sao lưu sang ổ cứng ngoài',
      'Không ai có thể xem dữ liệu kể cả người quản trị'
    ],
    correctIndex: 1,
    explanation: 'Atomicity (Tính nguyên tử) đảm bảo "All or Nothing": nếu có bất kỳ lỗi nào xảy ra giữa chừng, toàn bộ các bước trước đó sẽ được Rollback về trạng thái ban đầu.'
  },
  {
    id: 'qz-3',
    subjectCode: 'DSA102',
    subjectName: 'Cấu trúc Dữ liệu & Giải thuật',
    question: 'Thuật toán Dijkstra tìm đường đi ngắn nhất không thể áp dụng chính xác cho loại đồ thị nào?',
    options: [
      'Đồ thị có chu trình',
      'Đồ thị có trọng số cạnh ÂM (Negative edge weights)',
      'Đồ thị vô hướng',
      'Đồ thị có nhiều hơn 100 đỉnh'
    ],
    correctIndex: 1,
    explanation: 'Dijkstra hoạt động dựa trên thuật toán tham lam (Greedy). Khi đồ thị có trọng số âm, giả định "đỉnh đã duyệt là tối ưu" bị phá vỡ. Để giải bài toán này cần dùng Bellman-Ford hoặc Floyd-Warshall.'
  },
];
