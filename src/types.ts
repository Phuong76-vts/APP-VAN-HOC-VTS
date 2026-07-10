export interface MindmapNode {
  id: string;
  label: string;
  notes?: string;
  children?: MindmapNode[];
  type?: 'main' | 'branch' | 'sub';
}

export interface EssayTopic {
  id: string;
  title: string;
  type: 'nghi-luan-xa-hoi' | 'nghi-luan-van-hoc' | 'bieu-cam';
  grade: 6 | 7 | 8 | 9;
  context: string;
  suggestedOutline?: string; // Markdown suggested outline
  sampleEssay?: string; // Markdown sample essay
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  targetExam?: boolean; // Bám sát đề thi vào lớp 10
}

export interface EssaySubmission {
  id: string;
  topicId: string;
  topicTitle: string;
  contentText: string;
  aiScore: number; // 0 - 100 or 0 - 10 scale (standard VN system is 10, we can use 10 for VN style but show details)
  aiFeedback: {
    structure: string; // Nhận xét bố cục (Mở bài, Thân bài, Kết bài)
    logic: string; // Nhận xét tư duy lập luận
    vocabulary: string; // Nhận xét từ vựng & diễn đạt
    grammar: string; // Nhận xét chính tả & ngữ pháp
    suggestions: string[]; // Các câu gợi ý sửa đổi cụ thể
  };
  wordCount: number;
  timeSpent: number; // in seconds
  date: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: 'Học sinh' | 'Giáo viên';
  avatarUrl?: string;
  grade?: 6 | 7 | 8 | 9;
  title: string;
  content: string; // markdown or text
  category: 'nghi-luan' | 'bieu-cam' | 'chia-se-kinh-nghiem' | 'de-thi-vao-10';
  likes: number;
  likedByMe?: boolean;
  comments: {
    id: string;
    author: string;
    role: 'Học sinh' | 'Giáo viên';
    content: string;
    date: string;
  }[];
  date: string;
  isSampleEssay?: boolean;
}

export interface LearningLesson {
  id: string;
  title: string;
  description: string;
  grade: 6 | 7 | 8 | 9;
  type: 'nghi-luan' | 'bieu-cam' | 'ly-thuyet';
  content: string; // Markdown tutorial
  durationMinutes: number;
  isCompleted?: boolean;
}

export interface UserProgress {
  studentName: string;
  studentGrade: 6 | 7 | 8 | 9;
  totalAttempts: number;
  averageScore: number;
  streakDays: number;
  lastActiveDate: string;
  weakTopics: string[];
  completedLessonIds: string[];
  savedOutlines: { id: string; title: string; rootNode: MindmapNode; date: string }[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'general' | 'correction' | 'vocabulary';
  payload?: any; // For structured corrections
}
