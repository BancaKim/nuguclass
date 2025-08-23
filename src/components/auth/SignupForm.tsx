import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { encrypt, testEncryption } from '../../utils/encryption';

interface SignupFormProps {
  onBack: () => void;
  onSignupSuccess: () => void;
}

interface SignupData {
  studentId: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  batch: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onBack, onSignupSuccess }) => {
  const [formData, setFormData] = useState<SignupData>({
    studentId: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    batch: ''
  });
  const [errors, setErrors] = useState<Partial<SignupData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // 컴포넌트 마운트 시 암호화 테스트 실행
  useEffect(() => {
    testEncryption();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupData> = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = '학번을 입력해주세요.';
    } else if (!/^[A-Za-z]\d{5}$/.test(formData.studentId)) {
      newErrors.studentId = '학번은 영문자 1자리 + 숫자 5자리여야 합니다. (예: A12345)';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자리여야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '핸드폰 번호를 입력해주세요.';
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 핸드폰 번호를 입력해주세요.';
    }

    if (!formData.batch.trim()) {
      newErrors.batch = '기수를 입력해주세요.';
    } else if (!/^\d+기$/.test(formData.batch)) {
      newErrors.batch = '기수는 숫자 + 기 형식으로 입력해주세요. (예: 72기)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 중복 학번 체크
      const { data: existingUser } = await supabase
        .from('users')
        .select('student_id')
        .eq('student_id', formData.studentId)
        .single();

      if (existingUser) {
        setErrors({ studentId: '이미 등록된 학번입니다.' });
        setIsLoading(false);
        return;
      }

      // 휴대폰 번호 암호화
      const cleanPhone = formData.phone.replace(/-/g, '');
      const encryptedPhone = encrypt(cleanPhone);
      
      console.log('회원가입 - 원본 번호:', cleanPhone);
      console.log('회원가입 - 암호화된 번호:', encryptedPhone);
      console.log('회원가입 - 암호화 성공:', encryptedPhone !== cleanPhone);

      // 새 사용자 등록
      const { error } = await supabase
        .from('users')
        .insert([{
          student_id: formData.studentId,
          password: formData.password, // 실제 운영에서는 암호화 필요
          name: formData.name,
          phone: encryptedPhone, // 암호화된 휴대폰 번호
          batch: formData.batch
        }]);

      if (error) {
        throw error;
      }

      alert('회원가입이 완료되었습니다!');
      onSignupSuccess();
    } catch (error) {
      console.error('Signup error:', error);
      setGeneralError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
              <span className="title-emoji">🎓</span>
            </h1>
            <div className="title-subtitle">새로운 멤버를 환영합니다</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group compact">
            <label htmlFor="studentId">학번 *</label>
            <input
              id="studentId"
              type="text"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              placeholder="학번을 입력하세요 (예: A12345)"
              disabled={isLoading}
              maxLength={6}
            />
            {errors.studentId && <div className="field-error">{errors.studentId}</div>}
          </div>

          <div className="form-group compact">
            <label htmlFor="name">이름 *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
              disabled={isLoading}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group compact">
            <label htmlFor="phone">핸드폰 번호 *</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="010-1234-5678"
              disabled={isLoading}
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className="form-group compact">
            <label htmlFor="batch">기수 *</label>
            <input
              id="batch"
              type="text"
              value={formData.batch}
              onChange={(e) => handleInputChange('batch', e.target.value)}
              placeholder="기수를 입력하세요 (예: 72기)"
              disabled={isLoading}
              maxLength={4}
            />
            {errors.batch && <div className="field-error">{errors.batch}</div>}
          </div>

          <div className="form-group compact">
            <label htmlFor="password">비밀번호 *</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="최소 6자리 비밀번호"
              disabled={isLoading}
              minLength={6}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="form-group compact">
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>
          
          {generalError && <div className="error-message">{generalError}</div>}
          
          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="signup-button">
              {isLoading ? '회원가입 중...' : '회원가입'}
            </button>
            <button type="button" onClick={onBack} disabled={isLoading} className="back-button">
              로그인으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;