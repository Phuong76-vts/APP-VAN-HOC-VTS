import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LearningPath from './components/LearningPath';
import MindmapBuilder from './components/MindmapBuilder';
import EssayPractice from './components/EssayPractice';
import AiTutor from './components/AiTutor';
import ProgressDashboard from './components/ProgressDashboard';
import CommunityForum from './components/CommunityForum';
import { UserProgress, EssaySubmission } from './types';
import Swal from 'sweetalert2';

export default function App() {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<string>('path');

  // Student Profile State
  const [studentName, setStudentName] = useState<string>('Khánh Huyền');
  const [studentGrade, setStudentGrade] = useState<6 | 7 | 8 | 9>(9);

  // User Progress Analytics State
  const [progress, setProgress] = useState<UserProgress>({
    studentName: 'Khánh Huyền',
    studentGrade: 9,
    totalAttempts: 0,
    averageScore: 0,
    streakDays: 3, // Dựng sẵn 3 ngày streak demo cho hấp dẫn
    lastActiveDate: new Date().toISOString(),
    weakTopics: ['Nghị luận văn học'], // Dựng sẵn đề tài yếu demo
    completedLessonIds: ['lesson-1'], // Đã hoàn thành sẵn bài 1 demo
    savedOutlines: []
  });

  // Graded Submissions List State
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);

  // Load state from LocalStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('viet_lit_student_name');
    const savedGrade = localStorage.getItem('viet_lit_student_grade');
    if (savedName) setStudentName(savedName);
    if (savedGrade) setStudentGrade(parseInt(savedGrade) as 6 | 7 | 8 | 9);

    const savedProgress = localStorage.getItem('viet_lit_progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Lỗi khi tải tiến độ:', e);
      }
    }

    const savedSubs = localStorage.getItem('viet_lit_submissions');
    if (savedSubs) {
      try {
        setSubmissions(JSON.parse(savedSubs));
      } catch (e) {
        console.error('Lỗi khi tải nhật ký chấm bài:', e);
      }
    }
  }, []);

  // Sync state changes with LocalStorage
  const handleProfileChange = (name: string, grade: 6 | 7 | 8 | 9) => {
    setStudentName(name);
    setStudentGrade(grade);
    localStorage.setItem('viet_lit_student_name', name);
    localStorage.setItem('viet_lit_student_grade', grade.toString());

    const updatedProgress = {
      ...progress,
      studentName: name,
      studentGrade: grade
    };
    setProgress(updatedProgress);
    localStorage.setItem('viet_lit_progress', JSON.stringify(updatedProgress));
  };

  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('viet_lit_progress', JSON.stringify(newProgress));
  };

  const handleAddSubmission = (newSub: EssaySubmission) => {
    const updatedSubs = [newSub, ...submissions];
    setSubmissions(updatedSubs);
    localStorage.setItem('viet_lit_submissions', JSON.stringify(updatedSubs));
  };

  // Backup state to local JSON file
  const handleBackupData = () => {
    const backupObj = {
      studentName,
      studentGrade,
      progress,
      submissions,
      apiKey: localStorage.getItem('gemini_api_key') || '',
      selectedModel: localStorage.getItem('gemini_selected_model') || 'gemini-3.5-flash'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hoc_tot_ngu_van_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    Swal.fire({
      icon: 'success',
      title: 'Đã xuất dữ liệu sao lưu!',
      text: 'File sao lưu .json đã được tải về máy của em.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Restore state from uploaded JSON file
  const handleRestoreData = (jsonData: string) => {
    try {
      const restored = JSON.parse(jsonData);
      if (restored.studentName) setStudentName(restored.studentName);
      if (restored.studentGrade) setStudentGrade(restored.studentGrade);
      if (restored.progress) setProgress(restored.progress);
      if (restored.submissions) setSubmissions(restored.submissions);
      if (restored.apiKey) localStorage.setItem('gemini_api_key', restored.apiKey);
      if (restored.selectedModel) localStorage.setItem('gemini_selected_model', restored.selectedModel);

      // Save to localStorage immediately
      if (restored.studentName) localStorage.setItem('viet_lit_student_name', restored.studentName);
      if (restored.studentGrade) localStorage.setItem('viet_lit_student_grade', restored.studentGrade.toString());
      if (restored.progress) localStorage.setItem('viet_lit_progress', JSON.stringify(restored.progress));
      if (restored.submissions) localStorage.setItem('viet_lit_submissions', JSON.stringify(restored.submissions));

      Swal.fire({
        icon: 'success',
        title: 'Khôi phục thành công!',
        text: 'Toàn bộ dữ liệu học tập và API Key của bạn đã được tải lên hoàn tất.',
        confirmButtonColor: '#10b981'
      });
    } catch (e) {
      Swal.fire('Lỗi tệp tin', 'Không thể đọc hiểu file sao lưu JSON. Vui lòng tải lên đúng định dạng!', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" id="app-root-layout">
      {/* App bar with profile and settings */}
      <Header
        studentName={studentName}
        studentGrade={studentGrade}
        onProfileChange={handleProfileChange}
        onBackup={handleBackupData}
        onRestore={handleRestoreData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main split dashboard view */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          studentGrade={studentGrade}
        />

        {/* Tab view Panel container with padding scroll */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-x-hidden" id="app-main-content">
          {activeTab === 'path' && (
            <LearningPath
              studentGrade={studentGrade}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeTab === 'mindmap' && (
            <MindmapBuilder
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              studentGrade={studentGrade}
            />
          )}

          {activeTab === 'practice' && (
            <EssayPractice
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              submissions={submissions}
              onAddSubmission={handleAddSubmission}
              studentGrade={studentGrade}
            />
          )}

          {activeTab === 'tutor' && (
            <AiTutor
              studentGrade={studentGrade}
            />
          )}

          {activeTab === 'dashboard' && (
            <ProgressDashboard
              progress={progress}
              submissions={submissions}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'community' && (
            <CommunityForum
              studentName={studentName}
            />
          )}
        </main>
      </div>
    </div>
  );
}
