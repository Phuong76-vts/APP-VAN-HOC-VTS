import React, { useState } from 'react';
import { BookOpen, CheckCircle, Play, Star, Award, GraduationCap, ArrowRight, HelpCircle } from 'lucide-react';
import { DEFAULT_LESSONS } from '../data';
import { LearningLesson, UserProgress } from '../types';
import { marked } from 'marked';
import Swal from 'sweetalert2';

interface LearningPathProps {
  studentGrade: 6 | 7 | 8 | 9;
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

// Câu hỏi trắc nghiệm ôn tập cho các bài học
const LESSON_QUIZZES: Record<string, { question: string; options: string[]; answer: number; explanation: string }[]> = {
  'lesson-1': [
    {
      question: 'Bốn bước vàng triển khai phần Thân bài của bài văn nghị luận xã hội theo chương trình GDPT 2018 là gì?',
      options: [
        'A. Giới thiệu -> Phân tích -> Phản bác -> Khái quát',
        'B. Giải thích -> Phân tích & Chứng minh -> Phản đề & Mở rộng -> Bài học hành động',
        'C. Định nghĩa -> Liệt kê dẫn chứng -> Nêu cảm nghĩ -> Kết bài',
        'D. Kể chuyện -> Rút ra đạo lý -> Nhận xét tốt xấu -> Khuyên nhủ'
      ],
      answer: 1,
      explanation: 'Thứ tự đúng chuẩn khoa học rèn tư duy logic là: 1. Giải thích từ khóa; 2. Phân tích & Chứng minh bằng dẫn chứng thực tế; 3. Phản đề (bác bỏ khía cạnh tiêu cực hoặc bổ sung góc nhìn khác); 4. Rút ra bài học cho bản thân.'
    },
    {
      question: 'Quy tắc "3S" khi lựa chọn dẫn chứng thực tế cho bài văn bao gồm những yếu tố nào?',
      options: [
        'A. Sáng suốt, Sâu sắc, Song hành',
        'B. Sáng tạo, Súc tích, Siêu việt',
        'C. Specific (Cụ thể), Significant (Có tầm ảnh hưởng), Succinct (Ngắn gọn)',
        'D. Simple (Đơn giản), Social (Xã hội), Strong (Mạnh mẽ)'
      ],
      answer: 2,
      explanation: 'Dẫn chứng đắt giá cần phải: Cụ thể (tên tuổi, sự kiện rõ ràng), Có tầm ảnh hưởng (được xã hội công nhận) và Ngắn gọn (không kể lể lê thê dài dòng).'
    }
  ],
  'lesson-2': [
    {
      question: 'Công thức "LEAD" dùng để làm gì trong bài viết nghị luận?',
      options: [
        'A. Viết một mở bài gián tiếp nhanh chóng.',
        'B. Triển khai phân tích một dẫn chứng thực tế đắt giá kết nối sâu sắc với luận điểm.',
        'C. Kết luận và đưa ra thông điệp kết bài.',
        'D. Phản biện lại ý kiến trái chiều.'
      ],
      answer: 1,
      explanation: 'LEAD là công thức gồm: L-Link (Kết nối), E-Evidence (Nêu dẫn chứng), A-Analyze (Phân tích dẫn chứng) và D-Deduce (Rút ra kết luận chủ đề).'
    }
  ],
  'lesson-3': [
    {
      question: 'Phương pháp nào giúp bạn viết một mở bài gây ấn tượng mạnh với giám khảo chấm thi tuyển sinh vào lớp 10?',
      options: [
        'A. Mở bài trực tiếp ngắn gọn trong 1 câu duy nhất.',
        'B. Dẫn dắt bằng danh ngôn hoặc hình ảnh tương phản đối lập (ví dụ: cây tầm gửi vs. sự tự lập).',
        'C. Kể lại toàn bộ cốt truyện trước rồi mới nêu vấn đề.',
        'D. Viết thật dài dòng về lịch sử phát triển loài người.'
      ],
      answer: 1,
      explanation: 'Mở bài gián tiếp đi từ trích dẫn danh ngôn hoặc sử dụng hình ảnh đối lập vừa bộc lộ tư duy sắc bén, vừa kích thích sự tò mò, hứng thú của người chấm bài ngay lập tức.'
    }
  ],
  'lesson-4': [
    {
      question: 'Trong bài văn biểu cảm, làm thế nào để tránh cảm xúc sáo rỗng, hời hợt?',
      options: [
        'A. Dùng thật nhiều từ cảm thán như "Chao ôi!", "Ôi chao!" liên tiếp.',
        'B. Ca ngợi chung chung bằng những tính từ rập khuôn.',
        'C. Lồng ghép chi tiết miêu tả đắt giá (như đôi bàn tay chai sạn của mẹ) và kể lại một kỷ niệm chân thật.',
        'D. Nhờ người khác viết hộ cảm xúc.'
      ],
      answer: 2,
      explanation: 'Cảm xúc chỉ chạm tới trái tim người đọc khi nó bắt nguồn từ những chi tiết, kỷ niệm chân thực kết hợp miêu tả tinh tế, chứ không phải từ sự kể lể ca ngợi rập khuôn.'
    }
  ]
};

export default function LearningPath({ studentGrade, progress, onUpdateProgress }: LearningPathProps) {
  const [selectedGrade, setSelectedGrade] = useState<6 | 7 | 8 | 9>(studentGrade);
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Lọc bài học theo khối lớp đã chọn
  const filteredLessons = DEFAULT_LESSONS.filter(l => l.grade === selectedGrade);

  const handleOpenLesson = (lesson: LearningLesson) => {
    setActiveLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = (lessonId: string) => {
    const quizzes = LESSON_QUIZZES[lessonId] || [];
    if (quizzes.length === 0) {
      // Nếu không có trắc nghiệm, trực tiếp hoàn thành
      markLessonAsCompleted(lessonId);
      return;
    }

    // Kiểm tra đã làm đủ câu hỏi chưa
    if (Object.keys(quizAnswers).length < quizzes.length) {
      Swal.fire('Chú ý', 'Em vui lòng trả lời đầy đủ tất cả các câu hỏi trắc nghiệm nhé!', 'warning');
      return;
    }

    setQuizSubmitted(true);

    // Tính số câu đúng
    let correctCount = 0;
    quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    if (correctCount === quizzes.length) {
      Swal.fire({
        icon: 'success',
        title: 'Tuyệt vời! 100% Chính Xác',
        text: 'Em đã xuất sắc hoàn thành trắc nghiệm ôn tập bài học này.',
        confirmButtonColor: '#10b981'
      });
      markLessonAsCompleted(lessonId);
    } else {
      Swal.fire({
        icon: 'info',
        title: `Em đúng ${correctCount}/${quizzes.length} câu`,
        text: 'Có một số câu trả lời chưa chính xác. Em hãy đọc kỹ lại phần giải thích và thử làm lại nhé!',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const markLessonAsCompleted = (lessonId: string) => {
    if (progress.completedLessonIds.includes(lessonId)) {
      setActiveLesson(null);
      return;
    }

    const updatedIds = [...progress.completedLessonIds, lessonId];
    // Tăng nhẹ điểm tiến độ trung bình hoặc streak nếu hoàn thành bài học
    const newStreak = progress.streakDays === 0 ? 1 : progress.streakDays;
    
    onUpdateProgress({
      ...progress,
      completedLessonIds: updatedIds,
      streakDays: newStreak,
      lastActiveDate: new Date().toISOString()
    });

    setActiveLesson(null);
  };

  return (
    <div className="space-y-6" id="learning-path-container">
      {/* Welcome & Grade Filter Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span>Hành Trình Chinh Phục Ngữ Văn THCS</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lộ trình học tập thông minh cá nhân hóa bám sát khung chương trình giáo dục phổ thông GDPT 2018.
          </p>
        </div>

        {/* Grade Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {([6, 7, 8, 9] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                selectedGrade === grade
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Card Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Đang theo học</div>
            <div className="text-base font-bold text-slate-800">Chương trình Lớp {selectedGrade}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Bài học hoàn thành</div>
            <div className="text-base font-bold text-slate-800">
              {progress.completedLessonIds.filter(id => {
                const lesson = DEFAULT_LESSONS.find(l => l.id === id);
                return lesson && lesson.grade === selectedGrade;
              }).length} / {DEFAULT_LESSONS.filter(l => l.grade === selectedGrade).length} bài
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Danh hiệu hiện tại</div>
            <div className="text-base font-bold text-slate-800">
              {progress.completedLessonIds.length >= 3 ? 'Trí Giả Văn Khoa' : 'Học Sĩ Khởi Đầu'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Lessons */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
          <span>📖</span>
          <span>Học phần kỹ năng viết chuyên sâu lớp {selectedGrade}</span>
        </h3>

        {filteredLessons.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <div className="text-4xl">📚</div>
            <h4 className="font-bold text-slate-700 mt-3">Đang cập nhật thêm bài giảng</h4>
            <p className="text-xs text-slate-400 mt-1">Hệ thống bài kỹ năng chuẩn GDPT 2018 đang liên tục bổ sung.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => {
              const isCompleted = progress.completedLessonIds.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  id={`lesson-card-${lesson.id}`}
                  className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Đã học</span>
                    </div>
                  )}

                  <div className="space-y-2 pr-12">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      lesson.type === 'nghi-luan' 
                        ? 'bg-blue-100 text-blue-800' 
                        : lesson.type === 'bieu-cam' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {lesson.type === 'nghi-luan' ? 'Nghị luận' : lesson.type === 'bieu-cam' ? 'Biểu cảm' : 'Phương pháp'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-base leading-snug line-clamp-1">{lesson.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{lesson.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1 font-medium">
                      <span>⏱️</span>
                      <span>{lesson.durationMinutes} phút tự học</span>
                    </span>

                    <button
                      onClick={() => handleOpenLesson(lesson)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                        isCompleted 
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isCompleted ? 'Đọc lại' : 'Bắt đầu học'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lesson View Overlay Modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black/60 flex justify-end z-50 animate-fade-in" id="modal-lesson-study">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg line-clamp-1">{activeLesson.title}</h3>
                  <div className="text-xs text-white/80">Chương trình rèn luyện Ngữ văn Lớp {activeLesson.grade}</div>
                </div>
              </div>
              <button 
                onClick={() => setActiveLesson(null)}
                className="w-8 h-8 rounded-full bg-black/10 text-white flex items-center justify-center hover:bg-black/20 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Study Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Tutorial Markdown rendering */}
              <div 
                className="markdown-body text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200"
                dangerouslySetInnerHTML={{ __html: marked(activeLesson.content) }}
              />

              {/* Quiz Segment */}
              {LESSON_QUIZZES[activeLesson.id] && (
                <div className="bg-white border border-blue-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-blue-800 font-bold text-sm sm:text-base">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span>Trắc nghiệm ôn tập củng cố kiến thức</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hãy hoàn thành đúng tất cả các câu hỏi trắc nghiệm dưới đây dựa trên bài học để được phê duyệt hoàn thành bài học!
                  </p>

                  <div className="space-y-6 pt-3">
                    {LESSON_QUIZZES[activeLesson.id].map((quiz, qIdx) => (
                      <div key={qIdx} className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-800">
                          Câu {qIdx + 1}: {quiz.question}
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {quiz.options.map((option, optIdx) => {
                            const isSelected = quizAnswers[qIdx] === optIdx;
                            const isCorrect = optIdx === quiz.answer;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition-all ${
                                  isSelected 
                                    ? quizSubmitted
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                        : 'bg-red-50 border-red-400 text-red-800'
                                      : 'bg-blue-50 border-blue-400 text-blue-800'
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                            quizAnswers[qIdx] === quiz.answer ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            💡 <strong>Giải thích:</strong> {quiz.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer study bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-400 font-medium">Đọc kỹ kiến thức trước khi làm trắc nghiệm</span>
              <button
                type="button"
                onClick={() => handleSubmitQuiz(activeLesson.id)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <span>Xác nhận hoàn thành bài học</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
