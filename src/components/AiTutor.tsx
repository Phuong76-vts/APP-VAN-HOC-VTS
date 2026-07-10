import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  FileCheck, 
  User, 
  GraduationCap, 
  Copy, 
  ArrowRight, 
  HelpCircle,
  Lightbulb,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';
import { chatWithTutor, suggestVocabularyAndCorrect } from '../gemini';
import { TutorMessage } from '../types';
import Swal from 'sweetalert2';

interface AiTutorProps {
  studentGrade: number;
}

export default function AiTutor({ studentGrade }: AiTutorProps) {
  const [activeSubMode, setActiveSubMode] = useState<'chat' | 'tuner'>('tuner');

  // Tuner (Expression Corrector) states
  const [tunerInput, setTunerInput] = useState('');
  const [isTuning, setIsTuning] = useState(false);
  const [tunedResult, setTunedResult] = useState<any | null>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Chào em! Cô là Cô Giáo Văn AI. Cô rất vui được đồng hành cùng em rèn luyện kỹ năng viết và tư duy lập luận môn Ngữ văn. Em có thắc mắc gì về các tác phẩm văn học hoặc phương pháp làm bài nghị luận cần cô giải đáp không?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Cuộn tin nhắn xuống cuối
  useEffect(() => {
    if (activeSubMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeSubMode]);

  // Starter prompts
  const starterQuestions = [
    'Cách viết mở bài gián tiếp cuốn hút',
    'Lấy dẫn chứng thời sự cho bài nghị luận xã hội',
    'Cách triển khai đoạn phản đề đắt giá',
    'Phân tích tâm lý bé Thu trong Chiếc lược ngà'
  ];

  const handleTuneExpression = async () => {
    if (!tunerInput.trim() || tunerInput.trim().length < 10) {
      Swal.fire('Văn bản quá ngắn', 'Em hãy nhập ít nhất một câu văn hoàn chỉnh từ 10 ký tự trở lên để cô rà soát và nâng tầm diễn đạt nhé!', 'warning');
      return;
    }

    setIsTuning(true);
    try {
      const result = await suggestVocabularyAndCorrect(tunerInput, studentGrade);
      if (result) {
        setTunedResult(result);
        Swal.fire({
          icon: 'success',
          title: 'Đã tối ưu câu chữ!',
          text: 'Văn bản đã được chỉnh sửa mượt mà và nâng cấp từ vựng.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Lỗi nâng cấp', 'Trợ lý AI gặp gián đoạn tạm thời. Em vui lòng thử lại nhé!', 'error');
    } finally {
      setIsTuning(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSending(true);

    try {
      // Đàm thoại lịch sử
      const chatHistory = chatMessages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const responseText = await chatWithTutor(chatHistory, textToSend, studentGrade);
      
      const assistantMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Đã sao chép vào bộ nhớ!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6" id="ai-tutor-container">
      {/* Tab Switcher Sub-navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <span>👩‍🏫</span>
            <span>Học Chuyên Sâu Cùng Trợ Lý AI</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Lựa chọn rèn luyện từ vựng thời gian thực hoặc đàm thoại phương pháp viết văn.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubMode('tuner')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubMode === 'tuner'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chữa diễn đạt & Từ vựng</span>
          </button>
          <button
            onClick={() => setActiveSubMode('chat')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubMode === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hỏi đáp lý thuyết</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE MODE */}
      {activeSubMode === 'tuner' ? (
        // MODE 1: Expression Corrector (Tuner)
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="expression-tuner-arena">
          
          {/* Left panel: Input area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[520px]">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Nâng tầm câu văn của em</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hãy viết thử một câu hoặc một đoạn văn nghị luận/biểu cảm ngắn mà em thấy còn mộc mạc, thô ráp hoặc sợ sai chính tả. 
                AI sẽ giúp em rà lỗi, đề xuất thay thế bằng từ vựng nâng cao và viết lại một đoạn văn hoàn mỹ.
              </p>

              <textarea
                value={tunerInput}
                onChange={(e) => setTunerInput(e.target.value)}
                rows={10}
                placeholder={`Ví dụ:\n"Bài Chiếc lược ngà cho ta thấy tình cha con rất sâu nặng. Ông Sáu xa nhà đi kháng chiến lâu ngày nhưng luôn yêu bé Thu. Khi gặp Thu ông rất mừng nhưng Thu không nhận ba làm ông rất buồn..."`}
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed text-slate-800"
              />
            </div>

            <button
              onClick={handleTuneExpression}
              disabled={isTuning}
              className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isTuning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang mài dũa câu từ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Sửa lỗi & Nâng tầm học thuật</span>
                </>
              )}
            </button>
          </div>

          {/* Right panel: Correction & Improved outputs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[520px] flex flex-col overflow-hidden">
            {tunedResult ? (
              <div className="space-y-5 h-full flex flex-col justify-between overflow-y-auto pr-1">
                <div className="space-y-4 flex-1">
                  
                  {/* Detailed Correction list */}
                  {tunedResult.corrections && tunedResult.corrections.length > 0 ? (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phân tích lỗi & Đề xuất từ thay thế:</h4>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        {tunedResult.corrections.map((corr: any, cIdx: number) => (
                          <div key={cIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                            <div className="flex flex-wrap items-center text-xs gap-1">
                              <span className="line-through text-red-500 font-medium">{corr.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{corr.replacement}</span>
                              <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded ml-auto">{corr.errorType}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal pl-1 border-l border-blue-400">
                              {corr.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-800 font-semibold">
                      ✨ Không phát hiện lỗi chính tả nghiêm trọng! Các câu chữ của em rất chuẩn xác.
                    </div>
                  )}

                  {/* Fully Improved Rich Output Paragraph */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Đoạn văn hoàn mỹ đề xuất:</span>
                      <button
                        onClick={() => copyToClipboard(tunedResult.improvedParagraph)}
                        className="text-[10px] text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy đoạn văn</span>
                      </button>
                    </h4>
                    <div className="p-4 bg-gradient-to-tr from-blue-50/20 to-indigo-50/30 border border-blue-100 rounded-xl text-slate-700 text-xs sm:text-sm leading-relaxed max-h-[220px] overflow-y-auto font-medium">
                      {tunedResult.improvedParagraph}
                    </div>
                  </div>

                </div>

                <div className="text-center text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-3 flex items-center justify-center space-x-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Em hãy đối chiếu đoạn văn gốc với đoạn văn sửa đổi để học hỏi cách rải từ đắt nhé!</span>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="h-full flex flex-col justify-center items-center text-center space-y-3 p-6 text-slate-400">
                <div className="text-4xl">💎</div>
                <h4 className="font-bold text-slate-700 text-sm">Hòm Thư Mài Dũa Văn Chương</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Nhập câu viết của em bên trái và bấm <strong>"Sửa lỗi"</strong>. Cô giáo AI sẽ phân tích cấu trúc ngữ pháp và viết lại đoạn văn tuyệt đẹp để em học hỏi vốn từ.
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        // MODE 2: Conversational AI Tutor Chat Box
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden" id="chat-box-area">
          {/* Header */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold">
                👩‍🏫
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">Cô Giáo Văn AI</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-2">Đang tuyến</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">Tự học Ngữ văn THCS 2018</div>
          </div>

          {/* Messages board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {chatMessages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} space-x-2.5 max-w-[85%] ${
                    isAssistant ? 'mr-auto' : 'ml-auto'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold shrink-0 text-xs self-start">
                      👩
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant 
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none' 
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                      {/* Có thể chứa markdown đơn giản, cô giáo trả về markdown */}
                      <div className="prose prose-sm max-w-none">
                        {msg.text}
                      </div>
                    </div>
                    <div className={`text-[9px] text-slate-400 font-medium ${isAssistant ? 'text-left pl-1' : 'text-right pr-1'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt starters panel */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-[10px] font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 px-2 py-1 rounded-full transition-colors"
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Input text box control */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập câu hỏi của em về phương pháp làm văn..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isSending || !chatInput.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-45"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
