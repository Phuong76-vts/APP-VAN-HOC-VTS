import React, { useState, useEffect } from 'react';
import { Settings, Key, ShieldCheck, ShieldAlert, Download, Upload, User, GraduationCap, Eye, EyeOff, RefreshCw, Zap, Brain, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { AI_MODELS, AI_MODEL_LABELS } from '../gemini';

interface HeaderProps {
  studentName: string;
  studentGrade: 6 | 7 | 8 | 9;
  onProfileChange: (name: string, grade: 6 | 7 | 8 | 9) => void;
  onBackup: () => void;
  onRestore: (jsonData: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  studentName,
  studentGrade,
  onProfileChange,
  onBackup,
  onRestore,
  activeTab,
  setActiveTab
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  // Modal bắt buộc nhập key khi chưa có
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'not-set' | 'valid' | 'invalid'>('not-set');

  const [editName, setEditName] = useState(studentName);
  const [editGrade, setEditGrade] = useState<6 | 7 | 8 | 9>(studentGrade);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
    const savedModel = localStorage.getItem('gemini_selected_model') || 'gemini-3-flash-preview';
    setSelectedModel(savedModel);

    if (savedKey) {
      setKeyStatus('valid');
    } else {
      // Hiện modal bắt buộc nhập key khi chưa có
      setKeyStatus('not-set');
      setShowFirstTimeModal(true);
    }
  }, []);

  useEffect(() => {
    setEditName(studentName);
    setEditGrade(studentGrade);
  }, [studentName, studentGrade]);

  const handleSaveSettings = () => {
    if (!apiKey.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa nhập API Key',
        text: 'Vui lòng nhập API Key Gemini để kích hoạt tất cả tính năng AI của ứng dụng!',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_selected_model', selectedModel);
    onProfileChange(editName.trim() || 'Học sinh', editGrade);

    Swal.fire({
      icon: 'success',
      title: 'Đã lưu cấu hình!',
      text: 'Trợ lý AI và hồ sơ học tập của bạn đã sẵn sàng hoạt động.',
      timer: 1500,
      showConfirmButton: false
    });
    setShowSettings(false);
    setShowFirstTimeModal(false);
    setKeyStatus('valid');
  };

  const handleSaveFirstTime = () => {
    if (!apiKey.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Bắt buộc nhập API Key',
        html: 'Ứng dụng cần API Key Gemini để hoạt động.<br/>Vào <a href="https://aistudio.google.com/api-keys" target="_blank" class="text-blue-600 font-bold underline">aistudio.google.com/api-keys</a> để lấy key miễn phí!',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_selected_model', selectedModel);
    onProfileChange(editName.trim() || 'Học sinh', editGrade);
    setKeyStatus('valid');
    setShowFirstTimeModal(false);
    Swal.fire({
      icon: 'success',
      title: '🎉 Chào mừng đến với Học Văn AI!',
      text: 'API Key đã được lưu. Tất cả tính năng AI đã sẵn sàng cho em!',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      Swal.fire('Chú ý', 'Vui lòng nhập API Key trước khi kiểm tra!', 'warning');
      return;
    }
    setIsTesting(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Xin chào' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        }
      );
      if (response.ok) {
        setKeyStatus('valid');
        Swal.fire({ icon: 'success', title: 'Kết nối thành công!', text: 'API Key của bạn hoạt động hoàn hảo.', timer: 1500, showConfirmButton: false });
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `Mã lỗi: ${response.status}`;
        setKeyStatus('invalid');
        Swal.fire('Lỗi kết nối', `API Key không hợp lệ hoặc model gặp sự cố.\n${errMsg}`, 'error');
      }
    } catch {
      setKeyStatus('invalid');
      Swal.fire('Lỗi mạng', 'Không thể kết nối đến máy chủ Google Gemini. Vui lòng thử lại!', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => onRestore(event.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  // Render phần chọn model dạng Cards
  const ModelCards = () => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-600 tracking-wider">Chọn Model AI:</label>
      <div className="space-y-2">
        {AI_MODELS.map(model => {
          const info = AI_MODEL_LABELS[model];
          const isSelected = selectedModel === model;
          return (
            <button
              key={model}
              type="button"
              onClick={() => setSelectedModel(model)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {model === 'gemini-3-flash-preview' ? (
                    <Zap className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-amber-500'}`} />
                  ) : model === 'gemini-3-pro-preview' ? (
                    <Brain className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-purple-500'}`} />
                  ) : (
                    <RefreshCw className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  )}
                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                    {info?.name || model}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {info?.badge || ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">{info?.desc || ''}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('path')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-105 transition-transform">
              🎓
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                Học Văn AI
              </span>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1">
                Chuẩn GDPT 2018
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Profile chip */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{studentName}</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Lớp {studentGrade}
              </span>
            </div>

            {/* API Key button — luôn hiển thị với màu đỏ khi chưa có key */}
            <button
              id="btn-api-key"
              onClick={() => setShowSettings(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:shadow-sm ${
                keyStatus === 'valid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : keyStatus === 'invalid'
                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                  : 'bg-red-50 text-red-600 border-red-300'
              }`}
            >
              {keyStatus === 'valid' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {keyStatus === 'valid' ? 'AI Hoạt Động' : 'Lấy API key để sử dụng app'}
              </span>
            </button>

            {/* Settings icon */}
            <button
              id="btn-settings-open"
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all"
              title="Cài đặt"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL BẮT BUỘC NHẬP KEY LẦN ĐẦU ===== */}
      {showFirstTimeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h2 className="font-extrabold text-xl">Chào mừng đến với Học Văn AI!</h2>
              <p className="text-sm text-white/85 mt-1">Nhập API Key Gemini để bắt đầu học tập</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Hướng dẫn lấy key */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5" />
                  <span>Lấy API Key miễn phí tại:</span>
                </p>
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold underline break-all"
                >
                  https://aistudio.google.com/api-keys
                </a>
                <p className="text-slate-500">Đăng nhập Google → Tạo API Key → Sao chép và dán vào đây.</p>
              </div>

              {/* Input API Key */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Google Gemini API Key:</label>
                <div className="relative">
                  <input
                    type={isKeyVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsKeyVisible(!isKeyVisible)} className="absolute right-3 top-2.5 text-slate-400">
                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Chọn Model */}
              <ModelCards />

              {/* Tên học sinh */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Họ tên của em:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lớp học:</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(parseInt(e.target.value) as 6 | 7 | 8 | 9)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveFirstTime}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 shadow-md transition-all"
              >
                🚀 Bắt đầu học ngay!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL CÀI ĐẶT CHÍNH ===== */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" id="modal-settings">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-up">
            <div className="bg-gradient-to-r from-blue-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <h3 className="font-bold text-lg">Cài đặt & Hồ sơ học tập</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-white/80 hover:text-white font-medium text-lg">✕</button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* API Key */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 tracking-wider flex items-center space-x-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>Gemini API Key</span>
                </h4>

                {/* Badge đỏ luôn hiện hướng lấy key */}
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Lấy API key để sử dụng app → aistudio.google.com/api-keys</span>
                </a>

                <div className="relative">
                  <input
                    type={isKeyVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setIsKeyVisible(!isKeyVisible)} className="absolute right-2 top-2 text-slate-400">
                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTesting}
                  className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-md font-semibold border border-slate-200 hover:border-blue-200 transition-colors flex items-center space-x-1 disabled:opacity-50"
                >
                  {isTesting ? (
                    <><RefreshCw className="w-3 h-3 animate-spin" /><span>Đang kiểm tra...</span></>
                  ) : (
                    <span>🔌 Kiểm tra kết nối</span>
                  )}
                </button>
              </div>

              {/* Model Selection Cards */}
              <div className="space-y-2">
                <ModelCards />
              </div>

              <hr className="border-slate-100" />

              {/* Profile */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 tracking-wider flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>Hồ sơ người học</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Họ và tên:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nhập tên em..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Cấp học:</label>
                    <select
                      value={editGrade}
                      onChange={(e) => setEditGrade(parseInt(e.target.value) as 6 | 7 | 8 | 9)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value={6}>Lớp 6</option>
                      <option value={7}>Lớp 7</option>
                      <option value={8}>Lớp 8</option>
                      <option value={9}>Lớp 9 (Luyện thi 10)</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Backup & Restore */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 tracking-wider flex items-center space-x-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Sao lưu & Khôi phục</span>
                </h4>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onBackup}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Sao Lưu (JSON)</span>
                  </button>
                  <label className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập dữ liệu</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                id="btn-settings-save"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-md transition-all"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
