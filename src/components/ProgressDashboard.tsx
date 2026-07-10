import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Flame, 
  BookmarkCheck, 
  AlertCircle, 
  History, 
  CheckCircle,
  BookOpen,
  Calendar,
  Compass
} from 'lucide-react';
import { UserProgress, EssaySubmission } from '../types';
import Swal from 'sweetalert2';

interface ProgressDashboardProps {
  progress: UserProgress;
  submissions: EssaySubmission[];
  setActiveTab: (tab: string) => void;
}

export default function ProgressDashboard({ progress, submissions, setActiveTab }: ProgressDashboardProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6.5) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 5.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreEvaluation = (score: number) => {
    if (score >= 8.5) return 'Xuất sắc (Đạt mức Giỏi ôn luyện 10)';
    if (score >= 7.0) return 'Khá (Lập luận tốt, cần trau chuốt từ vựng)';
    if (score >= 5.0) return 'Trung bình (Đầy đủ bố cục, cần tăng chiều sâu)';
    return 'Cần cải thiện nhiều (Thiếu luận điểm chính)';
  };

  // Vẽ biểu đồ SVG Score progression
  const renderScoreTrendChart = () => {
    if (submissions.length === 0) {
      return (
        <div className="h-48 flex flex-col justify-center items-center text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
          <TrendingUp className="w-8 h-8 text-slate-300 mb-1" />
          <span className="text-xs font-semibold">Chưa có dữ liệu thống kê điểm số</span>
          <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5">Em hãy viết ít nhất một bài văn và gửi chấm điểm để xem đồ thị tiến bộ nhé!</p>
        </div>
      );
    }

    // Lấy tối đa 6 bài làm gần nhất để biểu diễn, xếp từ cũ đến mới
    const chartData = [...submissions].reverse().slice(-6);
    const height = 150;
    const width = 500;
    const padding = 30;

    // Tính toán tọa độ điểm
    const points = chartData.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(1, chartData.length - 1);
      // Điểm từ 0 đến 10, ánh xạ vào chiều cao SVG
      const y = height - padding - (d.aiScore * (height - padding * 2)) / 10;
      return { x, y, score: d.aiScore, date: d.date.split(' ')[0] };
    });

    // Tạo đường nối
    const pathD = points.reduce((acc, p, index) => {
      return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Tạo mảng tô màu phía dưới
    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
      : '';

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đồ thị xu hướng điểm số (6 bài gần nhất)</h4>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px] h-36">
            {/* Grid lines */}
            {[2, 4, 6, 8, 10].map((level) => {
              const y = height - padding - (level * (height - padding * 2)) / 10;
              return (
                <g key={level}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    stroke="#e2e8f0" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padding - 10} 
                    y={y + 4} 
                    fontSize="9" 
                    fill="#94a3b8" 
                    fontWeight="bold" 
                    textAnchor="end"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Filled Area below curve */}
            {areaD && (
              <path 
                d={areaD} 
                fill="url(#score-gradient)" 
                opacity="0.1" 
              />
            )}

            {/* Main Score Line */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            )}

            {/* SVG Gradient declaration */}
            <defs>
              <linearGradient id="score-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Plot Dots & Labels */}
            {points.map((p, idx) => (
              <g key={idx} className="group">
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4" 
                  fill="#ffffff" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                />
                <text 
                  x={p.x} 
                  y={p.y - 8} 
                  fontSize="10" 
                  fill="#1e293b" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {p.score}
                </text>
                <text 
                  x={p.x} 
                  y={height - 8} 
                  fontSize="8" 
                  fill="#94a3b8" 
                  fontWeight="semibold" 
                  textAnchor="middle"
                >
                  {p.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const handleShowDetailReport = (sub: EssaySubmission) => {
    Swal.fire({
      title: `<span class="text-sm font-bold block text-slate-500">Lịch sử bài làm ngày ${sub.date.split(' ')[0]}</span><span class="text-base font-bold">${sub.topicTitle}</span>`,
      html: `
        <div class="text-left space-y-4 max-h-[60vh] overflow-y-auto p-2 text-xs">
          <div class="p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex justify-between font-bold items-center">
            <span>Điểm đánh giá AI:</span>
            <span class="text-lg text-amber-600">${sub.aiScore}/10</span>
          </div>

          <div class="space-y-1">
            <h5 class="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-blue-600">Bố cục:</h5>
            <p class="text-slate-600 leading-relaxed">${sub.aiFeedback.structure}</p>
          </div>

          <div class="space-y-1">
            <h5 class="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-amber-600">Tư duy lập luận:</h5>
            <p class="text-slate-600 leading-relaxed">${sub.aiFeedback.logic}</p>
          </div>

          <div class="space-y-1">
            <h5 class="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-purple-600">Vốn từ vựng:</h5>
            <p class="text-slate-600 leading-relaxed">${sub.aiFeedback.vocabulary}</p>
          </div>

          <div class="space-y-1">
            <h5 class="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-emerald-600">Đặt câu ngữ pháp:</h5>
            <p class="text-slate-600 leading-relaxed">${sub.aiFeedback.grammar}</p>
          </div>

          <div class="space-y-1">
            <h5 class="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-indigo-600">Bài làm văn của em:</h5>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap max-h-36 overflow-y-auto italic text-slate-600 leading-relaxed">${sub.contentText}</div>
          </div>
        </div>
      `,
      confirmButtonText: 'Đóng',
      confirmButtonColor: '#3b82f6',
      width: '600px'
    });
  };

  return (
    <div className="space-y-6" id="progress-dashboard-container">
      {/* Title banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Phân Tích Tiến Độ & Năng Lực Học Tập</span>
          </h2>
          <p className="text-sm text-slate-500">
            Tổng hợp dữ liệu bài tập rèn luyện, thống kê điểm số và đề xuất bài học cải thiện năng lực thời gian thực.
          </p>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center md:text-left">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto md:mx-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã luyện viết</div>
            <div className="text-2xl font-extrabold text-slate-800">{progress.totalAttempts} bài</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center md:text-left">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto md:mx-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm trung bình</div>
            <div className="text-2xl font-extrabold text-slate-800">{progress.averageScore || 'N/A'}/10</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center md:text-left">
          <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mx-auto md:mx-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Học tập đều đặn</div>
            <div className="text-2xl font-extrabold text-slate-800">{progress.streakDays} ngày liên tiếp</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center md:text-left">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto md:mx-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài học đã thuộc</div>
            <div className="text-2xl font-extrabold text-slate-800">{progress.completedLessonIds.length} bài</div>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Lessons and Score Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended & AI recommendations (Col 1) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* AI Tutor Intelligent Recommendation card */}
          <div className="bg-gradient-to-tr from-slate-900 to-blue-950 p-5 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col justify-between h-[300px]">
            <div className="space-y-3 z-10">
              <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                Đặc quyền Trí Tuệ AI
              </span>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg leading-snug">
                Phân Tích Năng Lực & Đề Xuất Cá Nhân Hóa
              </h3>
              
              {progress.weakTopics.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dựa trên các bài tập viết đã làm, AI nhận diện các mảng nội dung em cần gia cố thêm:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {progress.weakTopics.map((topic, index) => (
                      <span key={index} className="bg-white/10 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/15">
                        ⚠️ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  Em đang có phong độ học tập văn học tuyệt vời! Hãy duy trì thói quen viết văn bộc lộ cảm xúc và lập luận sắc bén hàng ngày.
                </p>
              )}
            </div>

            {/* Action pointer */}
            <div className="pt-3 z-10">
              <button
                onClick={() => setActiveTab('path')}
                className="w-full bg-white text-slate-900 py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem thêm gợi ý ôn tập của cô</span>
              </button>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white">
              <Award className="w-36 h-36" />
            </div>
          </div>

        </div>

        {/* Chart progress (Col 2 & 3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[300px] flex flex-col justify-between">
            {renderScoreTrendChart()}
          </div>
        </div>

      </div>

      {/* Attempt History section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center space-x-2">
          <History className="w-5 h-5 text-slate-600" />
          <span>Nhật ký rèn luyện & Phản hồi văn học ({submissions.length})</span>
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Chưa có bài văn nào được ghi nhận. Em hãy sang mục <strong>"Luyện viết văn"</strong> để thử sức ngay nhé!
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {submissions.map((sub) => (
              <div 
                key={sub.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer gap-3 group"
                onClick={() => handleShowDetailReport(sub)}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
                    {sub.topicTitle}
                  </h4>
                  <div className="flex flex-wrap space-x-4 items-center text-[10px] font-bold text-slate-400">
                    <span className="flex items-center space-x-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{sub.date}</span>
                    </span>
                    <span>•</span>
                    <span>Độ dài: {sub.wordCount} chữ</span>
                    <span>•</span>
                    <span>Thời gian hoàn thành: {Math.round(sub.timeSpent / 60)} phút</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold text-center ${getScoreColor(sub.aiScore)}`}>
                    <div>{sub.aiScore}/10</div>
                    <div className="text-[8px] uppercase tracking-wider opacity-80">{sub.aiScore >= 8.0 ? 'Khuyên dùng' : 'Cần sửa'}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold hidden md:block">
                    {getScoreEvaluation(sub.aiScore)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
