import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './hooks/useToast';
import LoginForm from './components/auth/LoginForm';
import Header from './components/common/Header';
import TimetableGrid from './components/timetable/TimetableGrid';
import AdminPanel from './components/admin/AdminPanel';
import MyPage from './components/common/MyPage';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [timetableKey, setTimetableKey] = useState(0);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleMyPageClick = () => {
    setShowMyPage(true);
  };

  const handleCloseAdmin = () => {
    setShowAdminPanel(false);
    // 관리자 패널을 닫을 때 시간표를 강제로 새로고침
    setTimetableKey(prev => prev + 1);
  };

  const handleCloseMyPage = () => {
    setShowMyPage(false);
    // 마이페이지를 닫을 때 시간표를 강제로 새로고침 (수강취소 등으로 인한 변경사항 반영)
    setTimetableKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="app">
      <Header 
        onAdminClick={handleAdminClick}
        onMyPageClick={handleMyPageClick}
        showAdminButton={!showAdminPanel}
      />
      
      <main className="main-content">
        {showAdminPanel ? (
          <AdminPanel onClose={handleCloseAdmin} />
        ) : (
          <TimetableGrid key={timetableKey} />
        )}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 서강대학교 AI·SW 대학원 수강신청 시스템</p>
      </footer>

      {/* MyPage Modal */}
      <MyPage
        isOpen={showMyPage}
        onClose={handleCloseMyPage}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
