import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Send, 
  Plus, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  Bookmark,
  BookOpen
} from 'lucide-react';
import { ForumPost } from '../types';
import { DEFAULT_FORUM_POSTS } from '../data';
import Swal from 'sweetalert2';

interface CommunityForumProps {
  studentName: string;
}

export default function CommunityForum({ studentName }: CommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(DEFAULT_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddPost, setShowAddPost] = useState(false);

  // New post form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'nghi-luan' | 'bieu-cam' | 'chia-se-kinh-nghiem' | 'de-thi-vao-10'>('nghi-luan');
  const [newContent, setNewContent] = useState('');

  // Comment input fields map (postId -> text)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Lọc bài đăng theo category
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'samples') return post.isSampleEssay;
    return post.category === selectedCategory;
  });

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByMe;
        return {
          ...post,
          likedByMe: liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      Swal.fire('Chú ý', 'Vui lòng viết đầy đủ tiêu đề và nội dung bài đăng thảo luận!', 'warning');
      return;
    }

    const createdPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: studentName,
      role: 'Học sinh',
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 0,
      comments: [],
      date: new Date().toLocaleDateString('vi-VN'),
      isSampleEssay: newCategory === 'nghi-luan' || newCategory === 'bieu-cam' // Tự tạo văn mẫu tham khảo
    };

    setPosts([createdPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowAddPost(false);

    Swal.fire({
      icon: 'success',
      title: 'Đăng bài thành công!',
      text: 'Bài viết của em đã được đăng lên bảng tin thảo luận chung.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              author: studentName,
              role: 'Học sinh',
              content: text,
              date: new Date().toLocaleDateString('vi-VN')
            }
          ]
        };
      }
      return post;
    }));

    // Reset comment input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'nghi-luan': return 'Nghị luận';
      case 'bieu-cam': return 'Biểu cảm';
      case 'chia-se-kinh-nghiem': return 'Chia sẻ kinh nghiệm';
      case 'de-thi-vao-10': return 'Luyện thi vào 10';
      default: return 'Khác';
    }
  };

  return (
    <div className="space-y-6" id="community-forum-container">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Cộng Đồng Học Tập & Thảo Luận Ngữ Văn</span>
          </h2>
          <p className="text-sm text-slate-500">
            Nơi học sinh chia sẻ các bài văn mẫu đắt giá, trao đổi phương pháp học tập và bàn luận chủ đề nghị luận xã hội.
          </p>
        </div>

        <button
          onClick={() => setShowAddPost(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5 self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Chia sẻ bài viết mới</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
            selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          Tất cả bài viết
        </button>
        <button
          onClick={() => setSelectedCategory('samples')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
            selectedCategory === 'samples' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          📝 Bài văn mẫu hay
        </button>
        <button
          onClick={() => setSelectedCategory('nghi-luan')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
            selectedCategory === 'nghi-luan' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          Nghị luận xã hội
        </button>
        <button
          onClick={() => setSelectedCategory('de-thi-vao-10')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
            selectedCategory === 'de-thi-vao-10' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          Luyện thi vào 10
        </button>
      </div>

      {/* Grid of posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <div className="text-4xl">💭</div>
            <h4 className="font-bold text-slate-700 mt-2">Chưa có bài viết nào trong chủ đề này</h4>
            <p className="text-xs text-slate-400 mt-1">Hãy là người đầu tiên chia sẻ văn mẫu hoặc đặt câu hỏi thảo luận!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              id={`post-card-${post.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
            >
              {/* Author header info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                    post.role === 'Giáo viên' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {post.author.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-800 text-sm">{post.author}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        post.role === 'Giáo viên' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {post.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">{post.date}</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {getCategoryLabel(post.category)}
                  </span>
                  {post.isSampleEssay && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Bài viết tham khảo</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">{post.title}</h3>
                <div className="text-xs sm:text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-150 font-medium">
                  {post.content}
                </div>
              </div>

              {/* Like / Comment count panel */}
              <div className="flex items-center space-x-6 border-y border-slate-100 py-3 text-xs font-bold text-slate-500">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center space-x-1.5 transition-colors ${
                    post.likedByMe ? 'text-indigo-600' : 'hover:text-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.likedByMe ? 'fill-current' : ''}`} />
                  <span>Yêu thích ({post.likes})</span>
                </button>
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>Bình luận ({post.comments.length})</span>
                </div>
              </div>

              {/* Comments Thread list */}
              {post.comments.length > 0 && (
                <div className="space-y-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-1 pl-2 border-l-2 border-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <strong className="text-slate-800 font-bold">{comment.author}</strong>
                        <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded font-semibold text-slate-400">
                          {comment.role}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium ml-auto">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment inline form */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Viết câu trả lời thảo luận của em..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/30"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Share/Add Post Modal popup */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" id="modal-add-post">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-slate-100 animate-scale-up">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-lg">Chia sẻ bài viết thảo luận mới</h3>
              </div>
              <button 
                onClick={() => setShowAddPost(false)}
                className="text-white/80 hover:text-white font-medium text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPost} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Tiêu đề bài viết:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Làm sao để mở bài gián tiếp ấn tượng cho đề Lòng tự trọng?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Chủ đề bài đăng:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="nghi-luan">Nghị luận xã hội</option>
                  <option value="bieu-cam">Văn Biểu cảm</option>
                  <option value="chia-se-kinh-nghiem">Chia sẻ kinh nghiệm</option>
                  <option value="de-thi-vao-10">Luyện thi vào 10</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Nội dung chi tiết (Có thể viết văn mẫu):</label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={8}
                  placeholder="Em hãy viết nội dung bài mẫu hoặc ý kiến thảo luận tại đây..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPost(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Đăng bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
