import React from 'react';
import { 
  Compass, 
  GitFork, 
  PenTool, 
  MessageSquare, 
  BarChart3, 
  Users, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentGrade: 6 | 7 | 8 | 9;
}

export default function Sidebar({ activeTab, setActiveTab, studentGrade }: SidebarProps) {
  const menuItems = [
    { id: 'path', label: 'Lộ trình cá nhân', icon: Compass, color: 'text-blue-500 bg-blue-50' },
    { id: 'mindmap', label: 'Lập dàn ý sơ đồ', icon: GitFork, color: 'text-purple-500 bg-purple-50' },
    { id: 'practice', label: 'Luyện viết văn', icon: PenTool, color: 'text-amber-500 bg-amber-50' },
    { id: 'tutor', label: 'Trợ lý rèn câu', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'dashboard', label: 'Báo cáo năng lực', icon: BarChart3, color: 'text-rose-500 bg-rose-50' },
    { id: 'community', label: 'Cộng đồng mẫu', icon: Users, color: 'text-indigo-500 bg-indigo-50' },
  ];

  return (
    <>
      {/* Lateral Sidebar for Tablet and Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 space-y-6 shrink-0" id="app-sidebar">
        {/* Info Grade Alert Card */}
        <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden shadow-sm">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>Chương trình 2018</span>
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Học tập Ngữ văn được cá nhân hóa cho học sinh lớp <strong>{studentGrade}</strong>.
          </p>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-blue-600">
            <GraduationCap className="w-16 h-16" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-white' : `${item.color}`
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  isActive ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="text-[10px] text-slate-400 text-center font-medium border-t border-slate-100 pt-3">
          Phiên bản thông minh v2.5<br />
          Rèn luyện tư duy Ngữ văn Việt Nam
        </div>
      </aside>

      {/* Bottom Navigation for Mobile Devices (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 z-40 flex justify-around items-center shadow-lg" id="mobile-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive 
                  ? 'text-blue-600 bg-blue-50/50' 
                  : 'text-slate-500'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-slate-500'}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold mt-0.5 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
