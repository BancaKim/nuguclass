import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import SignupForm from './SignupForm';

const LoginForm: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const { login, isLoading } = useAuth();
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(studentId, password);
    if (!success) {
      setError('학번 또는 비밀번호가 올바르지 않습니다.');
      showError('학번 또는 비밀번호가 올바르지 않습니다.', 4000);
    } else {
      showSuccess('로그인되었습니다!', 2000);
    }
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    showSuccess('회원가입이 완료되었습니다. 로그인해주세요.', 3000);
  };


  if (showSignup) {
    return (
      <SignupForm 
        onBack={() => setShowSignup(false)}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <div className="university-info">
            <h2>서강대학교</h2>
            <h3>AI·SW 대학원</h3>
          </div>
          <div className="app-title">
            <h1>
              <span className="title-main">누가 뭐 듣지?</span>
              <span className="title-emoji">📚</span>
            </h1>
            <div className="title-subtitle">수강신청의 새로운 경험</div>
          </div>
          <div className="semester-badge">
            <span>2025학년도 2학기</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">학번</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="학번을 입력하세요 (예: A12345)"
              disabled={isLoading}
              maxLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowSignup(true)} 
              disabled={isLoading} 
              className="signup-link-button"
            >
              회원가입
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default LoginForm;