import Swal from 'sweetalert2';

// Danh sách models theo thứ tự ưu tiên (AI_INSTRUCTIONS.md)
// Default: gemini-3-flash-preview → fallback: gemini-3-pro-preview → gemini-2.5-flash
export const AI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

// Tên hiển thị thân thiện cho từng model
export const AI_MODEL_LABELS: Record<string, { name: string; badge: string; desc: string }> = {
  'gemini-3-flash-preview': {
    name: 'Gemini 3 Flash',
    badge: 'Mặc định · Nhanh nhất',
    desc: 'Phản hồi nhanh, phù hợp luyện viết & chấm bài hàng ngày'
  },
  'gemini-3-pro-preview': {
    name: 'Gemini 3 Pro',
    badge: 'Thông minh nhất',
    desc: 'Phân tích sâu, đánh giá bài văn chi tiết & chính xác hơn'
  },
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng',
    desc: 'Sử dụng khi các model trên gặp sự cố hoặc hết quota'
  }
};

/**
 * Hàm gọi API Gemini với cơ chế fallback tự động giữa các models
 */
export async function callGeminiRaw(prompt: string, systemInstruction?: string, modelIndex = 0, isJson = false): Promise<string | null> {
  const apiKey = localStorage.getItem('gemini_api_key') || '';
  if (!apiKey) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu API Key',
      text: 'Vui lòng cấu hình API Key trong mục Cài đặt (góc trên bên phải) để kích hoạt Trợ lý AI!',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Đồng ý'
    });
    return null;
  }

  const model = AI_MODELS[modelIndex];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: isJson ? 'application/json' : 'text/plain'
          }
        })
      }
    );

    // Xử lý lỗi dịch vụ tạm thời (500, 503, 504) -> Fallback sang model tiếp theo
    if ([500, 503, 504].includes(response.status) && modelIndex < AI_MODELS.length - 1) {
      console.warn(`Model ${model} bị lỗi ${response.status}. Đang chuyển sang model dự phòng: ${AI_MODELS[modelIndex + 1]}`);
      return callGeminiRaw(prompt, systemInstruction, modelIndex + 1, isJson);
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key không hợp lệ hoặc đã hết hạn.');
    }
    if (response.status === 429) {
      throw new Error('Đã hết quota hoặc vượt quá giới hạn tần suất gọi API (Rate limit).');
    }
    if (!response.ok) {
      throw new Error(`Lỗi kết nối API: mã trạng thái ${response.status}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error('Không nhận được phản hồi hợp lệ từ mô hình AI.');
    }

    return textOutput;
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini:', error);
    
    // Nếu còn model dự phòng khác thì thử tiếp tục
    if (modelIndex < AI_MODELS.length - 1) {
      console.warn(`Đang kích hoạt cơ chế dự phòng sau khi gặp lỗi: ${error.message}`);
      return callGeminiRaw(prompt, systemInstruction, modelIndex + 1, isJson);
    }

    // Thông báo lỗi tiếng Việt trực quan
    Swal.fire({
      icon: 'error',
      title: 'Lỗi Trợ lý AI',
      html: `Không thể kết nối với Gemini AI.<br/><b class="text-red-500">${error.message}</b><br/><br/><span class="text-xs text-gray-500">Mẹo: Hãy kiểm tra lại API Key hoặc đổi sang một model khác trong mục Cài đặt.</span>`,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Đóng'
    });
    return null;
  }
}

/**
 * Tính năng 1: Tạo dàn ý sơ đồ tư duy (Mindmap Outline) tự động
 */
export async function generateMindmapOutline(topicTitle: string, topicContext: string, grade: number): Promise<any> {
  const systemInstruction = `Bạn là chuyên gia giảng dạy Ngữ văn THCS cấp cao theo chương trình GDPT 2018 tại Việt Nam.
Hãy lập dàn ý chi tiết cho đề văn được yêu cầu dưới dạng một cây thư mục JSON hợp lệ để vẽ sơ đồ tư duy (mindmap).
Cấu trúc JSON bắt buộc phải có dạng như sau:
{
  "id": "root",
  "label": "Tên đề tài rút gọn",
  "notes": "Nhận xét tổng quan hoặc định hướng viết bài",
  "children": [
    {
      "id": "node-1",
      "label": "Mở bài",
      "notes": "Mục tiêu cần đạt ở mở bài",
      "children": [
        { "id": "node-1-1", "label": "Ý chính 1 (ví dụ: Dẫn dắt vấn đề)", "notes": "Gợi ý viết" },
        { "id": "node-1-2", "label": "Ý chính 2 (ví dụ: Trích dẫn luận đề)", "notes": "Gợi ý viết" }
      ]
    },
    {
      "id": "node-2",
      "label": "Thân bài",
      "notes": "Lập luận chính",
      "children": [
        {
          "id": "node-2-1",
          "label": "Giải thích vấn đề",
          "children": [
            { "id": "node-2-1-1", "label": "Khái niệm tự lập là gì" }
          ]
        },
        {
          "id": "node-2-2",
          "label": "Phân tích & Chứng minh",
          "children": [
            { "id": "node-2-2-1", "label": "Biểu hiện trong học tập" },
            { "id": "node-2-2-2", "label": "Biểu hiện trong sinh hoạt" }
          ]
        },
        {
          "id": "node-2-3",
          "label": "Phản đề và bác bỏ",
          "children": [
            { "id": "node-2-3-1", "label": "Phê phán lối sống ỷ lại" }
          ]
        }
      ]
    },
    {
      "id": "node-3",
      "label": "Kết bài",
      "notes": "Tổng kết cảm xúc/thông điệp",
      "children": [
        { "id": "node-3-1", "label": "Khẳng định lại giá trị đức tính" },
        { "id": "node-3-2", "label": "Thông điệp gửi gắm thế hệ trẻ" }
      ]
    }
  ]
}

Lưu ý: Bạn phải phản hồi HOÀN TOÀN bằng một đối tượng JSON hợp lệ duy nhất, không bao bọc trong mã markdown \`\`\`json hay bất kỳ chữ nào bên ngoài. Tất cả nội dung phải viết bằng tiếng Việt chuẩn mực, phù hợp học sinh lớp ${grade}.`;

  const prompt = `Hãy lập dàn ý mindmap cho đề bài sau:
Tiêu đề: ${topicTitle}
Yêu cầu chi tiết: ${topicContext}
Hãy đảm bảo dàn ý có tính logic cao, phân chia rõ rệt Mở bài, Thân bài (có các ý giải thích, bàn luận, chứng minh bằng dẫn chứng thực tế, phản đề bác bỏ), Kết bài (thông điệp sáng tạo).`;

  const responseText = await callGeminiRaw(prompt, systemInstruction, 0, true);
  if (!responseText) return null;

  try {
    // Làm sạch chuỗi trước khi parse phòng hờ AI vẫn trả về khối ```json ... ```
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Lỗi khi parse JSON dàn ý từ AI:', e, responseText);
    return null;
  }
}

/**
 * Tính năng 2: Chấm điểm bài viết tự động & Phản hồi chi tiết theo thang điểm chuẩn GDPT 2018
 */
export async function gradeEssayResponse(topicTitle: string, topicContext: string, essayContent: string, grade: number): Promise<any> {
  const systemInstruction = `Bạn là Trưởng ban chấm thi môn Ngữ văn cấp THCS chuẩn GDPT 2018 tại Việt Nam.
Hãy đọc kỹ đề bài và bài làm của học sinh lớp ${grade} để thực hiện đánh giá, cho điểm chi tiết.
Hệ thống tính điểm từ 0 đến 10 (mức lẻ 0.25, ví dụ: 7.25, 8.5).
Hãy phản hồi dưới định dạng JSON duy nhất chứa cấu trúc sau:
{
  "score": 8.25,
  "feedback": {
    "structure": "Nhận xét sâu sắc về bố cục 3 phần của bài viết. Có đầy đủ mở bài, thân bài, kết bài hay chưa? Các đoạn văn có sự liên kết mạch lạc không?",
    "logic": "Đánh giá về tư duy logic, lập luận, hệ thống luận điểm có sắc bén, thuyết phục không? Dẫn chứng thực tế được đưa vào bài thế nào (có cụ thể và có tính thời sự không)?",
    "vocabulary": "Đánh giá về vốn từ vựng, mức độ chuyên sâu của các từ ngữ văn học, cách diễn đạt có trôi chảy, giàu hình ảnh biểu cảm không?",
    "grammar": "Đánh giá chi tiết về chính tả, cách đặt câu, ngắt dấu câu và cấu trúc ngữ pháp tiếng Việt.",
    "suggestions": [
      "Câu gợi ý sửa đổi 1: Chỉ rõ câu sai trong bài của học sinh và viết lại một câu mới hay hơn thay thế.",
      "Câu gợi ý sửa đổi 2: Gợi ý thay thế các từ vựng sáo rỗng bằng từ chuyên sâu hơn.",
      "Câu gợi ý sửa đổi 3: Ý kiến đóng góp nâng cao lập luận phản đề."
    ]
  }
}

Yêu cầu chấm nghiêm túc, khách quan, chỉ ra rõ cả ưu điểm và nhược điểm thực tế của bài văn để học sinh tiến bộ. Không được viết thêm văn bản nào khác ngoài JSON hợp lệ.`;

  const prompt = `Hãy chấm bài viết của học sinh lớp ${grade} dựa trên đề bài sau:
ĐỀ BÀI: ${topicTitle}
Yêu cầu đề: ${topicContext}

BÀI LÀM CỦA HỌC SINH:
${essayContent}

Hãy phân tích kỹ lưỡng các luận điểm, phát hiện lỗi chính tả/diễn đạt và phản hồi JSON chi tiết.`;

  const responseText = await callGeminiRaw(prompt, systemInstruction, 0, true);
  if (!responseText) return null;

  try {
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Lỗi khi parse JSON kết quả chấm điểm từ AI:', e, responseText);
    return null;
  }
}

/**
 * Tính năng 3: Gợi ý từ vựng chuyên sâu & sửa lỗi diễn đạt thời gian thực
 */
export async function suggestVocabularyAndCorrect(textToImprove: string, grade: number): Promise<any> {
  const systemInstruction = `Bạn là Trợ lý AI rèn luyện Kỹ năng Viết văn Ngữ văn THCS.
Nhiệm vụ của bạn là phân tích đoạn văn/câu văn ngắn của học sinh, phát hiện các lỗi diễn đạt, lỗi lặp từ, từ vựng thông thường sáo rỗng, và đề xuất cách viết tối ưu hơn, nâng tầm học thuật (từ vựng chuyên sâu, cách diễn đạt truyền cảm).

Hãy trả về một đối tượng JSON duy nhất có cấu trúc như sau:
{
  "originalText": "Văn bản gốc của học sinh",
  "corrections": [
    {
      "original": "Cụm từ hoặc câu bị lỗi/chưa hay",
      "errorType": "Lỗi diễn đạt lặp từ / Từ vựng sáo rỗng / Lỗi ngữ pháp",
      "explanation": "Giải thích ngắn gọn tại sao câu/từ này chưa đạt và cần cải thiện",
      "replacement": "Cụm từ/câu gợi ý sửa đổi tốt hơn"
    }
  ],
  "improvedParagraph": "Cả đoạn văn sau khi đã được bạn tối ưu và viết lại một cách nhuần nhuyễn, mượt mà, giàu cảm xúc và đầy tính triết lý sâu sắc phù hợp lớp ${grade}."
}

Hãy viết bằng tiếng Việt chuẩn mực, thân thiện, dễ thương và khuyến khích học sinh rèn luyện. Trả về đúng JSON.`;

  const prompt = `Hãy phân tích và nâng tầm đoạn văn sau của học sinh:
"${textToImprove}"`;

  const responseText = await callGeminiRaw(prompt, systemInstruction, 0, true);
  if (!responseText) return null;

  try {
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Lỗi khi parse JSON gợi ý từ vựng:', e, responseText);
    return null;
  }
}

/**
 * Tính năng 4: Chat với Trợ lý học tập văn học (AI Tutor Chat)
 */
export async function chatWithTutor(history: { sender: 'user' | 'assistant'; text: string }[], userInput: string, grade: number): Promise<string> {
  const systemInstruction = `Bạn là Cô Giáo Văn AI - một Trợ lý dạy học môn Ngữ văn cấp THCS (lớp 6-9) tận tâm, am hiểu sâu sắc chương trình GDPT 2018.
Nhiệm vụ của bạn là:
1. Giải đáp các thắc mắc của học sinh về lý thuyết văn học, cách làm văn nghị luận xã hội, nghị luận văn học, văn biểu cảm.
2. Hướng dẫn học sinh cách tìm ý tưởng, lập dàn ý, cách mở bài ấn tượng, lấy dẫn chứng thực tế đắt giá bám sát đề thi vào lớp 10.
3. Luôn sử dụng ngôn ngữ dịu dàng, khích lệ học sinh, xưng "Cô" và gọi học sinh là "em" hoặc "các em".
4. Câu trả lời của cô cần có cấu trúc rõ ràng, sử dụng các gạch đầu dòng và định dạng in đậm để dễ theo dõi.
5. Nếu học sinh hỏi ngoài phạm vi Ngữ văn THCS, hãy khéo léo định hướng lại cuộc trò chuyện về chủ đề học tập Văn học một cách vui vẻ.`;

  // Định dạng lịch sử trò chuyện cho API
  const historyText = history.map(h => `${h.sender === 'user' ? 'Học sinh' : 'Cô Giáo Văn AI'}: ${h.text}`).join('\n');
  const prompt = `${historyText}\nHọc sinh: ${userInput}\nCô Giáo Văn AI:`;

  const responseText = await callGeminiRaw(prompt, systemInstruction, 0, false);
  return responseText || 'Cô đang gặp một chút gián đoạn mạng, em vui lòng gửi lại câu hỏi nhé!';
}
