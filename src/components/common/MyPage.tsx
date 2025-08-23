import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { RegistrationService, type EnrollmentDetail } from '../../services/registrationService';
import { useToast } from '../../hooks/useToast';
import { encrypt } from '../../utils/encryption';
import Modal from './Modal';

interface MyPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  name: string;
  studentId: string;
  batch: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const MyPage: React.FC<MyPageProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile');
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    studentId: '',
    batch: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState<EnrollmentDetail[]>([]);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
      loadMyRegistrations();
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const userData = await UserService.getUserById(parseInt(user.id));
      if (userData) {
        setFormData({
          name: userData.name,
          studentId: userData.studentId || '',
          batch: userData.batch || '',
          phone: userData.phone || '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('MyPage - Failed to load user data:', error);
      showError('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const loadMyRegistrations = async () => {
    if (!user) return;
    
    try {
      const registrations = await RegistrationService.getUserRegistrations(parseInt(user.id));
      setMyRegistrations(registrations);
      console.log('MyPage - Loaded user registrations:', registrations);
    } catch (error) {
      console.error('MyPage - Failed to load registrations:', error);
      showError('수강신청 내역을 불러오는데 실패했습니다.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = '학번을 입력해주세요.';
    }

    if (!formData.batch.trim()) {
      newErrors.batch = '기수를 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '핸드폰 번호를 입력해주세요.';
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 핸드폰 번호를 입력해주세요.';
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자리여야 합니다.';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsLoading(true);
    try {
      // 휴대폰 번호 암호화
      const cleanPhone = formData.phone.replace(/-/g, '');
      const encryptedPhone = encrypt(cleanPhone);
      
      const updates: any = {
        name: formData.name,
        studentId: formData.studentId,
        batch: formData.batch,
        phone: encryptedPhone
      };

      if (formData.password) {
        updates.password = formData.password;
      }

      await UserService.updateUser(parseInt(user.id), updates);
      
      setIsEditing(false);
      showSuccess('개인정보가 성공적으로 수정되었습니다.');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('MyPage - Failed to update user:', error);
      const errorMessage = error instanceof Error ? error.message : '개인정보 수정에 실패했습니다.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    loadUserData(); // Reset form data
  };

  const handleUnregister = async (courseCode: string, courseName: string) => {
    if (!user) return;
    
    if (confirm(`'${courseName}' 과목의 수강신청을 취소하시겠습니까?`)) {
      try {
        await RegistrationService.unregisterFromCourse(parseInt(user.id), courseCode);
        await loadMyRegistrations();
        showSuccess('수강신청이 취소되었습니다.');
      } catch (error) {
        console.error('MyPage - Failed to unregister:', error);
        showError('수강신청 취소에 실패했습니다.');
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="마이페이지"
      size="large"
    >
      <div className="mypage-content">
        {/* 탭 메뉴 */}
        <div className="mypage-tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          >
            개인정보 수정
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          >
            내 수강과목 ({myRegistrations.length})
          </button>
        </div>

        {/* 개인정보 수정 탭 */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <div className="user-info">
                <h3>{user.name}님의 개인정보</h3>
                <p className="student-id">학번: {user.studentId}</p>
                <p className="batch-info">기수: {user.batch}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  수정하기
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing || isLoading}
                  required
                />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="studentId">학번</label>
                <input
                  id="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  disabled={!isEditing || isLoading}
                  required
                />
                {errors.studentId && <div className="field-error">{errors.studentId}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="batch">기수</label>
                <input
                  id="batch"
                  type="text"
                  value={formData.batch}
                  onChange={(e) => handleInputChange('batch', e.target.value)}
                  disabled={!isEditing || isLoading}
                  placeholder="예: 32기"
                  required
                />
                {errors.batch && <div className="field-error">{errors.batch}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">핸드폰 번호</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing || isLoading}
                  placeholder="010-1234-5678"
                  required
                />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>

              {isEditing && (
                <>
                  <div className="form-group">
                    <label htmlFor="password">새 비밀번호 (선택사항)</label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isLoading}
                      placeholder="변경하지 않으려면 비워두세요"
                      minLength={6}
                    />
                    {errors.password && <div className="field-error">{errors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={isLoading}
                      placeholder="새 비밀번호를 다시 입력하세요"
                    />
                    {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="save-button"
                    >
                      {isLoading ? '저장 중...' : '저장하기'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="cancel-button"
                    >
                      취소
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        {/* 내 수강과목 탭 */}
        {activeTab === 'courses' && (
          <div className="courses-section">
            <h3>내 수강과목</h3>
            {myRegistrations.length > 0 ? (
              <div className="courses-table-container">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>과목코드</th>
                      <th>과목명</th>
                      <th>교수</th>
                      <th>시간</th>
                      <th>신청일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRegistrations.map((registration) => (
                      <tr key={registration.registration_id}>
                        <td>{registration.course_code}</td>
                        <td>{registration.course_name}</td>
                        <td>{registration.professor}</td>
                        <td>
                          {registration.day === 'monday' ? '월' : 
                           registration.day === 'tuesday' ? '화' :
                           registration.day === 'wednesday' ? '수' :
                           registration.day === 'thursday' ? '목' :
                           registration.day === 'friday' ? '금' : '토'}요일 {registration.time_slot}
                        </td>
                        <td>{new Date(registration.registered_at).toLocaleDateString('ko-KR')}</td>
                        <td>
                          <button
                            onClick={() => handleUnregister(registration.course_code, registration.course_name)}
                            className="unregister-button"
                          >
                            수강취소
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-courses">
                <p>수강신청한 과목이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MyPage;