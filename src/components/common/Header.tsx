import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onAdminClick?: () => void;
  onMyPageClick?: () => void;
  showAdminButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, onMyPageClick, showAdminButton = false }) => {
  const { user, logout } = useAuth();
  
  // 디버깅을 위한 콘솔 로그
  console.log('Header - Current user:', user);
  console.log('Header - showAdminButton:', showAdminButton);
  console.log('Header - user?.isAdmin:', user?.isAdmin);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>서강대학교 AI·SW 대학원</h1>
          <h2>누가 뭐듣지? 📚</h2>
          <p className="semester">2025학년도 2학기 수강신청</p>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="welcome">안녕하세요!</span>
            <span className="user-name">{user?.name}님</span>
            <span className="user-id">({user?.studentId})</span>
            {user?.isAdmin && <span className="admin-badge">관리자</span>}
          </div>
          
          <div className="header-buttons">
            <button 
              onClick={onMyPageClick}
              className="mypage-button"
            >
              마이페이지
            </button>
            {showAdminButton && user?.isAdmin && (
              <button 
                onClick={onAdminClick}
                className="admin-button"
              >
                관리자 패널
              </button>
            )}
            <button onClick={logout} className="logout-button">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;