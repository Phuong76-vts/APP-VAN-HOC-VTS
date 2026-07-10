import React, { useState } from 'react';
import { GitFork, Sparkles, Plus, Trash2, Save, Download, HelpCircle, FileText, Share2, CornerDownRight, Check, ListChecks } from 'lucide-react';
import { generateMindmapOutline } from '../gemini';
import { MindmapNode, UserProgress } from '../types';
import { DEFAULT_TOPICS } from '../data';
import Swal from 'sweetalert2';

interface MindmapBuilderProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  studentGrade: number;
}

export default function MindmapBuilder({ progress, onUpdateProgress, studentGrade }: MindmapBuilderProps) {
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMindmap, setActiveMindmap] = useState<MindmapNode | null>(null);
  const [mindmapTitle, setMindmapTitle] = useState('');
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [noteText, setNoteText] = useState('');

  // Lấy ra các đề có sẵn để gợi ý
  const presets = DEFAULT_TOPICS;

  const handleGenerateMindmap = async (title: string, context = '') => {
    if (!title.trim()) {
      Swal.fire('Chú ý', 'Vui lòng nhập tên đề bài hoặc chủ đề cần lập dàn ý!', 'warning');
      return;
    }

    setIsGenerating(true);
    setTopicInput(title);
    setMindmapTitle(title);

    try {
      const generated = await generateMindmapOutline(title, context, studentGrade);
      if (generated) {
        setActiveMindmap(generated);
        setSelectedNode(generated);
        setNoteText(generated.notes || '');
        
        Swal.fire({
          icon: 'success',
          title: 'Đã lập dàn ý sơ đồ!',
          text: 'Gemini AI đã phân tích cấu trúc luận điểm lý tưởng cho đề tài của em.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Lỗi lập sơ đồ', 'Trợ lý AI gặp gián đoạn tạm thời. Em vui lòng thử lại nhé!', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Đệ quy để tìm và cập nhật nốt cụ thể
  const updateNodeInTree = (root: MindmapNode, targetId: string, updatedFields: Partial<MindmapNode>): MindmapNode => {
    if (root.id === targetId) {
      return { ...root, ...updatedFields };
    }
    if (root.children) {
      return {
        ...root,
        children: root.children.map(child => updateNodeInTree(child, targetId, updatedFields))
      };
    }
    return root;
  };

  // Đệ quy để tìm và thêm nốt con
  const addChildToNode = (root: MindmapNode, parentId: string, newChild: MindmapNode): MindmapNode => {
    if (root.id === parentId) {
      const currentChildren = root.children || [];
      return {
        ...root,
        children: [...currentChildren, newChild]
      };
    }
    if (root.children) {
      return {
        ...root,
        children: root.children.map(child => addChildToNode(child, parentId, newChild))
      };
    }
    return root;
  };

  // Đệ quy để xóa nốt cụ thể
  const deleteNodeFromTree = (root: MindmapNode, targetId: string): MindmapNode | null => {
    if (root.id === targetId) {
      return null;
    }
    if (root.children) {
      const filtered = root.children
        .map(child => deleteNodeFromTree(child, targetId))
        .filter((c): c is MindmapNode => c !== null);
      return {
        ...root,
        children: filtered
      };
    }
    return root;
  };

  const handleSelectNode = (node: MindmapNode) => {
    setSelectedNode(node);
    setNoteText(node.notes || '');
  };

  const handleUpdateNodeLabel = (newLabel: string) => {
    if (!selectedNode || !activeMindmap) return;
    const updatedTree = updateNodeInTree(activeMindmap, selectedNode.id, { label: newLabel });
    setActiveMindmap(updatedTree);
    setSelectedNode(prev => prev ? { ...prev, label: newLabel } : null);
  };

  const handleUpdateNodeNotes = (newNotes: string) => {
    if (!selectedNode || !activeMindmap) return;
    setNoteText(newNotes);
    const updatedTree = updateNodeInTree(activeMindmap, selectedNode.id, { notes: newNotes });
    setActiveMindmap(updatedTree);
    setSelectedNode(prev => prev ? { ...prev, notes: newNotes } : null);
  };

  const handleAddChild = () => {
    if (!selectedNode || !activeMindmap) return;
    const newId = `node-${Date.now()}`;
    const newChild: MindmapNode = {
      id: newId,
      label: 'Ý phụ mới (Nhấp để sửa)',
      notes: ''
    };
    const updatedTree = addChildToNode(activeMindmap, selectedNode.id, newChild);
    setActiveMindmap(updatedTree);
    setSelectedNode(newChild);
    setNoteText('');
  };

  const handleDeleteNode = () => {
    if (!selectedNode || !activeMindmap) return;
    if (selectedNode.id === activeMindmap.id) {
      Swal.fire('Chú ý', 'Không thể xóa gốc sơ đồ tư duy!', 'warning');
      return;
    }

    Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Em có chắc muốn xóa ý kiến "${selectedNode.label}" cùng tất cả các nhánh con của nó không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Xóa ý này',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTree = deleteNodeFromTree(activeMindmap, selectedNode.id);
        setActiveMindmap(updatedTree);
        setSelectedNode(updatedTree);
        setNoteText(updatedTree?.notes || '');
      }
    });
  };

  const handleSaveToProgress = () => {
    if (!activeMindmap) return;
    
    const existingIndex = progress.savedOutlines.findIndex(o => o.title === mindmapTitle);
    let updatedOutlines = [...progress.savedOutlines];

    const outlineItem = {
      id: `outline-${Date.now()}`,
      title: mindmapTitle,
      rootNode: activeMindmap,
      date: new Date().toLocaleDateString('vi-VN')
    };

    if (existingIndex >= 0) {
      updatedOutlines[existingIndex] = outlineItem;
    } else {
      updatedOutlines.push(outlineItem);
    }

    onUpdateProgress({
      ...progress,
      savedOutlines: updatedOutlines
    });

    Swal.fire({
      icon: 'success',
      title: 'Đã lưu dàn ý thành công!',
      text: 'Bản thảo sơ đồ của em đã được cất giữ vào kho lưu trữ cá nhân.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Đệ quy để xuất dàn ý dạng danh sách text thụt đầu dòng
  const formatOutlineText = (node: MindmapNode, depth = 0): string => {
    const indent = '  '.repeat(depth);
    let text = `${indent}- **${node.label}**`;
    if (node.notes) {
      text += ` *(${node.notes})*`;
    }
    text += '\n';
    if (node.children) {
      node.children.forEach(child => {
        text += formatOutlineText(child, depth + 1);
      });
    }
    return text;
  };

  const handleExportText = () => {
    if (!activeMindmap) return;
    const formattedText = formatOutlineText(activeMindmap);
    
    navigator.clipboard.writeText(formattedText);
    Swal.fire({
      icon: 'success',
      title: 'Đã sao chép dàn ý văn bản!',
      text: 'Dàn ý đã được lưu vào bộ nhớ tạm. Em có thể dán trực tiếp vào bài làm.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Đệ quy render các nốt của Mindmap dưới dạng danh sách bento tương tác trực quan
  const renderMindmapTree = (node: MindmapNode, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    // Thiết lập màu sắc theo chiều sâu phân cấp
    const depthColors = [
      'bg-blue-600 text-white border-blue-700', // Gốc (Root)
      'bg-amber-100 text-amber-900 border-amber-300', // Nhánh chính (Mở, Thân, Kết)
      'bg-slate-50 text-slate-800 border-slate-200', // Ý phụ chính
      'bg-slate-100/50 text-slate-600 border-slate-100', // Ý bổ sung nhỏ
    ];

    const currentStyle = depthColors[Math.min(depth, depthColors.length - 1)];

    return (
      <div key={node.id} className="ml-4 md:ml-6 relative border-l-2 border-dashed border-slate-200 pl-4 py-1">
        {/* Connector indicator */}
        <div className="absolute left-0 top-6 w-3 h-0.5 border-t-2 border-dashed border-slate-200"></div>

        {/* Node container */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            handleSelectNode(node);
          }}
          className={`mindmap-node inline-flex flex-col p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer shadow-sm relative group hover:scale-[1.01] ${
            isSelected 
              ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02]' 
              : 'hover:border-blue-400'
          } ${currentStyle}`}
        >
          <span>{node.label}</span>
          {node.notes && (
            <span className="text-[10px] opacity-75 font-normal mt-1 line-clamp-1 italic max-w-xs">
              📝 {node.notes}
            </span>
          )}
        </div>

        {/* Children nodes */}
        {hasChildren && (
          <div className="mt-2 space-y-2">
            {node.children!.map(child => renderMindmapTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="mindmap-builder-container">
      {/* Introduction banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <GitFork className="w-6 h-6 text-blue-600" />
            <span>Dàn Ý Sơ Đồ Tư Duy Tự Động (Mindmap Builder)</span>
          </h2>
          <p className="text-sm text-slate-500">
            Phân tích đề bài, tự động rải luận điểm khoa học 3 phần hoàn thiện trước khi đặt bút viết văn.
          </p>
        </div>
      </div>

      {/* Input Form & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left pane: Control setup */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Thiết lập đề bài làm văn</span>
            </h3>

            {/* Input field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Nhập đề bài tự do của em:</label>
              <textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Nghị luận về ý chí vượt khó của học sinh trong cuộc sống hôm nay..."
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action button */}
            <button
              onClick={() => handleGenerateMindmap(topicInput)}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang phân tích đề bài...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Dựng sơ đồ tự động bằng AI</span>
                </>
              )}
            </button>

            {/* Presets suggestions */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500">Hoặc chọn từ kho đề chuẩn GDPT 2018:</span>
              <div className="space-y-1 max-h-[160px] overflow-y-auto border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleGenerateMindmap(preset.title, preset.context)}
                    className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors truncate"
                    title={preset.title}
                  >
                    📝 Lớp {preset.grade}: {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Saved outlines collection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm tracking-wider flex items-center space-x-2">
              <Save className="w-4 h-4 text-emerald-600" />
              <span>Kho lưu dàn ý của em ({progress.savedOutlines.length})</span>
            </h3>
            {progress.savedOutlines.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Chưa có dàn ý nào được lưu. Hãy lập sơ đồ tư duy và bấm "Lưu lại" nhé!
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {progress.savedOutlines.map((saved) => (
                  <div 
                    key={saved.id}
                    className="flex justify-between items-center p-2 rounded-lg border border-slate-100 bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer group"
                    onClick={() => {
                      setActiveMindmap(saved.rootNode);
                      setMindmapTitle(saved.title);
                      setSelectedNode(saved.rootNode);
                      setNoteText(saved.rootNode.notes || '');
                    }}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-bold text-slate-700 truncate">{saved.title}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{saved.date}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        Swal.fire({
                          title: 'Xác nhận xóa?',
                          text: `Xóa dàn ý "${saved.title}" khỏi kho lưu trữ?`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#ef4444',
                          confirmButtonText: 'Đồng ý xóa'
                        }).then((res) => {
                          if (res.isConfirmed) {
                            onUpdateProgress({
                              ...progress,
                              savedOutlines: progress.savedOutlines.filter(o => o.id !== saved.id)
                            });
                          }
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Interactive Mindmap Canvas rendering */}
        <div className="lg:col-span-2 space-y-4">
          {activeMindmap ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
              {/* Mindmap header Actions */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap justify-between items-center gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate leading-tight">
                    {mindmapTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nhấp vào bất kỳ nốt nào để thêm ý mới, sửa chữ hoặc bổ sung ghi chú học tập bên phải.</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleExportText}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1 text-xs font-bold"
                    title="Sao chép dàn ý bằng chữ"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span className="hidden sm:inline">Copy Dàn Ý Chữ</span>
                  </button>
                  <button
                    onClick={handleSaveToProgress}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-bold shadow-sm"
                    title="Lưu trữ sơ đồ này"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lưu Sơ Đồ</span>
                  </button>
                </div>
              </div>

              {/* Central container splitting visual and node configuration */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Scrollable Visual Tree Map area */}
                <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/20 max-h-[450px] md:max-h-none">
                  <div className="min-w-[400px]">
                    {/* Render root node */}
                    <div className="relative">
                      <div 
                        onClick={() => handleSelectNode(activeMindmap)}
                        className={`mindmap-node inline-flex flex-col p-4 rounded-2xl text-white border font-bold text-sm sm:text-base cursor-pointer shadow-md bg-gradient-to-tr from-blue-700 to-indigo-600 border-blue-800 relative ${
                          selectedNode?.id === activeMindmap.id ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                        }`}
                      >
                        👑 {activeMindmap.label}
                      </div>
                      
                      {activeMindmap.children && activeMindmap.children.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {activeMindmap.children.map(child => renderMindmapTree(child, 1))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right panel: Selected Node Configurations & Notes */}
                <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-200 p-4 space-y-4 bg-white shrink-0">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-100 text-slate-800 font-bold text-xs sm:text-sm tracking-wider">
                    <ListChecks className="w-4 h-4 text-blue-500" />
                    <span>Cấu hình ý đã chọn</span>
                  </div>

                  {selectedNode ? (
                    <div className="space-y-4">
                      {/* 1. Label edit */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Nội dung ý kiến:</label>
                        <input
                          type="text"
                          value={selectedNode.label}
                          onChange={(e) => handleUpdateNodeLabel(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* 2. Study notes edit */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Ghi chú viết (Gợi ý sâu):</label>
                        <textarea
                          value={noteText}
                          onChange={(e) => handleUpdateNodeNotes(e.target.value)}
                          rows={4}
                          placeholder="Mẹo viết của riêng em hoặc hướng dẫn từ AI..."
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                        />
                      </div>

                      {/* 3. Node Actions (Add sub-node, delete node) */}
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleAddChild}
                          className="w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 border border-slate-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm ý con bổ trợ</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteNode}
                          disabled={selectedNode.id === activeMindmap.id}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 border border-red-100 disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa ý này</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400">
                      Hãy bấm chọn một nốt trên sơ đồ bên trái để bắt đầu chỉnh sửa cấu trúc.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty state for mindmap canvas */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center h-[650px] flex flex-col justify-center items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                🧠
              </div>
              <h3 className="font-bold text-slate-800 text-lg sm:text-xl">Kiến Tạo Dàn Ý Sơ Đồ Tư Duy Ngay</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Hãy lựa chọn một đề bài từ cột bên trái hoặc nhập đề văn tự do của em, sau đó bấm nút <strong>"Dựng sơ đồ tự động"</strong> để được AI khai thông tư duy, phân bố luận điểm thông minh.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => handleGenerateMindmap(presets[0].title, presets[0].context)}
                  className="px-4 py-2 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  ⚡ Lập dàn ý bài văn: Tự Lập
                </button>
                <button
                  onClick={() => handleGenerateMindmap(presets[1].title, presets[1].context)}
                  className="px-4 py-2 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  ⚡ Lập dàn ý bài văn: Bạo Lực Học Đường
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
