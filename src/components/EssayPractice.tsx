import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, 
  BookOpen, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  HelpCircle, 
  FileText,
  BadgeAlert,
  Loader2,
  Bookmark,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { DEFAULT_TOPICS } from '../data';
import { EssayTopic, EssaySubmission, UserProgress } from '../types';
import { gradeEssayResponse } from '../gemini';
import { marked } from 'marked';
import Swal from 'sweetalert2';

interface EssayPracticeProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  submissions: EssaySubmission[];
  onAddSubmission: (sub: EssaySubmission) => void;
  studentGrade: number;
}

export default function EssayPractice({
  progress,
  onUpdateProgress,
  submissions,
  onAddSubmission,
  studentGrade
}: EssayPracticeProps) {
  const [selectedTopic, setSelectedTopic] = useState<EssayTopic | null>(null);
  const [showDocType, setShowDocType] = useState<'outline' | 'sample' | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [essayContent, setEssayContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Timer configuration
  const [timerMode, setTimerMode] = useState<45 | 90 | 0>(45); // in minutes, 0 means unlimited
  const [timeLeft, setTimeLeft] = useState(2700); // in seconds (45 min default)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Grading states
  const [isGrading, setIsGrading] = useState(false);
  const [gradingReport, setGradingReport] = useState<any | null>(null);

  // Tính số lượng từ thời gian thực
  useEffect(() => {
    const words = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [essayContent]);

  // Xử lý đếm ngược thời gian
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            Swal.fire({
              icon: 'warning',
              title: 'Hết thời gian làm bài!',
              text: 'Đã hết thời gian làm bài của em. Hãy kiểm tra lại và nộp bài để AI chấm điểm nhé.',
              confirmButtonColor: '#3b82f6'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const handleStartWriting = (topic: EssayTopic) => {
    setSelectedTopic(topic);
    setIsWriting(true);
    setEssayContent('');
    setGradingReport(null);
    setShowDocType(null);

    // Cấu hình thời gian đếm ngược
    if (timerMode > 0) {
      setTimeLeft(timerMode * 60);
      setIsTimerRunning(true);
    } else {
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToTopics = () => {
    if (isWriting && essayContent.trim().length > 50) {
      Swal.fire({
        title: 'Rời phòng luyện viết?',
        text: 'Nội dung em đang viết dở dang sẽ bị mất. Em có chắc muốn quay lại không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Ở lại viết tiếp'
      }).then((result) => {
        if (result.isConfirmed) {
          setIsWriting(false);
          setSelectedTopic(null);
          setIsTimerRunning(false);
        }
      });
    } else {
      setIsWriting(false);
      setSelectedTopic(null);
      setIsTimerRunning(false);
    }
  };

  const handleSubmitEssay = async () => {
    if (!essayContent.trim() || wordCount < 50) {
      Swal.fire('Bài viết quá ngắn', 'Bài văn nghị luận của em cần tối thiểu 50 từ để AI có đủ dữ kiện chấm điểm!', 'warning');
      return;
    }

    if (!selectedTopic) return;

    setIsTimerRunning(false);
    setIsGrading(true);

    try {
      const gradingResponse = await gradeEssayResponse(
        selectedTopic.title,
        selectedTopic.context,
        essayContent,
        studentGrade
      );

      if (gradingResponse) {
        setGradingReport(gradingResponse);

        // Lưu kết quả chấm điểm vào danh sách bài thi lịch sử
        const timeSpent = timerMode > 0 ? (timerMode * 60 - timeLeft) : 600; // Ước lượng 10 phút nếu không tính giờ
        const submission: EssaySubmission = {
          id: `sub-${Date.now()}`,
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          contentText: essayContent,
          aiScore: gradingResponse.score,
          aiFeedback: gradingResponse.feedback,
          wordCount: wordCount,
          timeSpent: timeSpent,
          date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };

        onAddSubmission(submission);

        // Cập nhật thống kê học lực của học sinh
        const allSubs = [submission, ...submissions];
        const avg = parseFloat((allSubs.reduce((acc, curr) => acc + curr.aiScore, 0) / allSubs.length).toFixed(2));
        
        // Thống kê chủ đề yếu nếu điểm thấp hơn 6.5
        let weak = [...progress.weakTopics];
        if (gradingResponse.score < 6.5 && !weak.includes(selectedTopic.type)) {
          weak.push(selectedTopic.type === 'nghi-luan-xa-hoi' ? 'Nghị luận xã hội' : selectedTopic.type === 'nghi-luan-van-hoc' ? 'Nghị luận văn học' : 'Văn biểu cảm');
        }

        onUpdateProgress({
          ...progress,
          totalAttempts: allSubs.length,
          averageScore: avg,
          weakTopics: weak,
          lastActiveDate: new Date().toISOString()
        });

        Swal.fire({
          icon: 'success',
          title: 'Đã hoàn thành chấm điểm!',
          text: `Bài viết của em đạt điểm số: ${gradingResponse.score}/10. Hãy xem báo cáo chi tiết nhé!`,
          confirmButtonColor: '#10b981'
        });
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Lỗi chấm bài', 'Có lỗi xảy ra khi truyền bài sang AI chấm điểm. Vui lòng nộp lại bài làm của em!', 'error');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6" id="essay-practice-container">
      {!isWriting ? (
        // 1. TOPICS VIEW: Display list of prompts
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <PenTool className="w-6 h-6 text-amber-500" />
                <span>Kho Đề Thi Văn Nghị Luận & Biểu Cảm</span>
              </h2>
              <p className="text-sm text-slate-500">
                Thử sức với các đề thi đắt giá, bám sát cấu trúc đề thi tuyển sinh vào lớp 10 chương trình GDPT 2018.
              </p>
            </div>

            {/* Timer quick setter */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 pl-2">Hẹn giờ thi:</span>
              <button
                onClick={() => setTimerMode(45)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timerMode === 45 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                45 phút
              </button>
              <button
                onClick={() => setTimerMode(90)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timerMode === 90 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                90 phút
              </button>
              <button
                onClick={() => setTimerMode(0)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timerMode === 0 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Tự do
              </button>
            </div>
          </div>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEFAULT_TOPICS.map((topic) => (
              <div 
                key={topic.id}
                id={`topic-card-${topic.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category badging */}
                  <div className="flex justify-between items-center">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      topic.type === 'nghi-luan-xa-hoi'
                        ? 'bg-blue-100 text-blue-800'
                        : topic.type === 'nghi-luan-van-hoc'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {topic.type === 'nghi-luan-xa-hoi' ? 'Nghị luận xã hội' : topic.type === 'nghi-luan-van-hoc' ? 'Nghị luận văn học' : 'Biểu cảm'}
                    </span>

                    {topic.targetExam && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-amber-200">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>Trọng tâm tuyển sinh 10</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {topic.context}
                  </p>

                  {/* Metadata display */}
                  <div className="flex space-x-4 text-[11px] font-bold text-slate-400">
                    <span>Lớp {topic.grade}</span>
                    <span>•</span>
                    <span className={`${
                      topic.difficulty === 'Dễ' ? 'text-emerald-500' : topic.difficulty === 'Trung bình' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      Độ khó: {topic.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card controls */}
                <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-3">
                  <div className="flex space-x-2">
                    {topic.suggestedOutline && (
                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setShowDocType('outline');
                        }}
                        className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem dàn ý mẫu</span>
                      </button>
                    )}
                    {topic.sampleEssay && (
                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setShowDocType('sample');
                        }}
                        className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Bài văn mẫu</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartWriting(topic)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Luyện viết ngay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Doc View Drawer (for Outline or Sample Essay) */}
          {showDocType && selectedTopic && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" id="modal-doc-viewer">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 animate-scale-up">
                <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-1">
                      {showDocType === 'outline' ? 'Dàn ý chi tiết chuẩn mực' : 'Bài viết mẫu tham khảo điểm 9+'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Mẫu cho đề bài: {selectedTopic.title}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowDocType(null);
                      setSelectedTopic(null);
                    }}
                    className="text-slate-400 hover:text-slate-700 font-medium text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div 
                    className="markdown-body text-slate-700 text-sm sm:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: marked(showDocType === 'outline' ? selectedTopic.suggestedOutline || '' : selectedTopic.sampleEssay || '') 
                    }}
                  />
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      const topic = selectedTopic;
                      setShowDocType(null);
                      handleStartWriting(topic);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-1.5"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Luyện viết với đề này</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // 2. IMMERSIVE WRITING ARENA
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="writing-arena">
          {/* Main Writing Board (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
              {/* Header inside arena */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <button
                  onClick={handleBackToTopics}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại kho đề</span>
                </button>

                {/* Countdown Timer widget */}
                {timerMode > 0 ? (
                  <div className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
                    timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>Đồng hồ: {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 border border-slate-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Thời gian tự do</span>
                  </div>
                )}

                <div className="text-xs font-semibold text-slate-400">
                  Đếm từ: <strong className="text-slate-800 text-sm">{wordCount}</strong> từ
                </div>
              </div>

              {/* Central Text Editor area */}
              <div className="flex-1 p-5 bg-slate-50/20">
                <textarea
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder={`Em hãy bắt đầu viết bài văn tại đây nhé...\n\nLời khuyên:\n- Triển khai đầy đủ bố cục 3 phần (Mở bài, Thân bài, Kết bài).\n- Sử dụng lý lẽ sâu sắc và rải dẫn chứng cụ thể thực tế.\n- Áp dụng các câu hỏi tu từ, biện pháp tu từ để lời văn truyền cảm và đạt điểm tuyệt đối.`}
                  className="w-full h-full p-4 border border-slate-200 rounded-2xl bg-white shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm sm:text-base leading-relaxed font-sans"
                />
              </div>

              {/* Footer submission bar */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  onClick={handleSubmitEssay}
                  disabled={isGrading}
                  className="bg-gradient-to-r from-blue-600 to-amber-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Nộp bài & AI Chấm điểm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar inside arena: Prompt context & Outline helper */}
          <div className="lg:col-span-1 space-y-4">
            {/* Prompt details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs tracking-wider text-blue-600">Đề bài đang viết:</h4>
              <h3 className="font-bold text-slate-800 text-sm leading-snug">
                {selectedTopic?.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-h-[140px] overflow-y-auto bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedTopic?.context}
              </p>
            </div>

            {/* Quick Suggested Outline Helper checklist */}
            {selectedTopic?.suggestedOutline && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 h-[390px] flex flex-col">
                <h4 className="font-bold text-slate-800 text-xs tracking-wider text-amber-600 shrink-0 flex items-center space-x-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Nhắc nhở dàn ý mẫu cần đạt:</span>
                </h4>
                <div className="flex-1 overflow-y-auto text-xs leading-relaxed border border-slate-100 rounded-lg p-3 bg-amber-50/10">
                  <div 
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: marked(selectedTopic.suggestedOutline) }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Full Loading Grader View */}
          {isGrading && (
            <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    📝
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-lg sm:text-xl">Cô Giáo AI đang chấm bài</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Cô đang đọc kỹ từng luận điểm của em, rà soát cấu trúc 3 phần, kiểm tra lỗi lập luận, lỗi chính tả và chuẩn bị báo cáo góp ý chi tiết...
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Quét cấu trúc Mở - Thân - Kết bài</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Phân tích tính chặt chẽ của lập luận</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Dò tìm lỗi ngữ pháp & dấu câu tiếng Việt</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scorecard Grading Report Modal */}
          {gradingReport && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="modal-grading-report">
              <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 animate-scale-up">
                {/* Header panel */}
                <div className="bg-gradient-to-tr from-blue-700 to-indigo-800 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl">Kết Quả Đánh Giá Năng Lực Viết</h3>
                      <p className="text-xs text-white/85">Theo hệ thống chuẩn chương trình GDPT 2018</p>
                    </div>
                  </div>

                  {/* Circle Score Box */}
                  <div className="bg-white/15 px-6 py-2 rounded-2xl text-center border border-white/20">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{gradingReport.score}</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Điểm văn số (10)</div>
                  </div>
                </div>

                {/* Main feedback body scrolls */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  
                  {/* Evaluation Grid items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Structure score card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-slate-800 text-xs tracking-wider text-blue-600">
                        <FileText className="w-4 h-4" />
                        <span>Bố cục & Liên kết ý</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gradingReport.feedback.structure}
                      </p>
                    </div>

                    {/* Logic score card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-slate-800 text-xs tracking-wider text-amber-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Tư duy lập luận & Dẫn chứng</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gradingReport.feedback.logic}
                      </p>
                    </div>

                    {/* Vocabulary card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-slate-800 text-xs tracking-wider text-purple-600">
                        <BookOpen className="w-4 h-4" />
                        <span>Vốn từ vựng & Sức biểu cảm</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gradingReport.feedback.vocabulary}
                      </p>
                    </div>

                    {/* Grammar card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-slate-800 text-xs tracking-wider text-emerald-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Chính tả, đặt câu & Ngữ pháp</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gradingReport.feedback.grammar}
                      </p>
                    </div>

                  </div>

                  {/* Sentence correction ideas list */}
                  {gradingReport.feedback.suggestions && gradingReport.feedback.suggestions.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Gợi ý sửa câu chi tiết của cô giáo:</span>
                      </h4>
                      <div className="space-y-2">
                        {gradingReport.feedback.suggestions.map((sug: string, sIdx: number) => (
                          <div key={sIdx} className="bg-amber-50/40 p-3 rounded-lg border border-amber-100 text-xs text-slate-700 leading-relaxed">
                            💡 {sug}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setGradingReport(null);
                      setIsWriting(false);
                      setSelectedTopic(null);
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                  >
                    Đóng báo cáo & Hoàn thành
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
