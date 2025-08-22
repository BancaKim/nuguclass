import React, { useState, useEffect } from 'react';
import type { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { RegistrationService, type EnrollmentDetail } from '../../services/registrationService';
import Modal from '../common/Modal';

interface CourseModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onRegistrationUpdate: () => void;
  isRegistered: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  course,
  onClose,
  onRegistrationUpdate,
  isRegistered
}) => {
  const { user } = useAuth();
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState<EnrollmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    if (showEnrollment) {
      loadEnrolledUsers();
    }
  }, [showEnrollment, course.code]);

  const loadEnrolledUsers = async () => {
    try {
      setIsLoading(true);
      const enrolled = await RegistrationService.getCourseEnrollments(course.code);
      const count = await RegistrationService.getCourseEnrollmentCount(course.code);
      setEnrolledUsers(enrolled);
      setEnrollmentCount(count);
      console.log('CourseModal - Loaded enrolled users:', enrolled);
    } catch (error) {
      console.error('CourseModal - Failed to load enrolled users:', error);
      alert('수강인원 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isRegistered) {
        await RegistrationService.unregisterFromCourse(parseInt(user.id), course.code);
      } else {
        await RegistrationService.registerForCourse(parseInt(user.id), course.code);
      }
      
      // Update the parent component's registration state
      onRegistrationUpdate();
      
      // Update enrolled users list if enrollment view is currently shown
      if (showEnrollment) {
        await loadEnrolledUsers();
      }
      
      // Show success message
      alert(isRegistered ? '수강 취소되었습니다.' : '수강 신청되었습니다.');
    } catch (error) {
      console.error('CourseModal - Registration error:', error);
      alert(error instanceof Error ? error.message : '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowEnrollment = () => {
    setShowEnrollment(true);
  };

  const handleBack = () => {
    setShowEnrollment(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showEnrollment ? '수강인원 확인' : '과목 정보'}
      size="medium"
    >
      {!showEnrollment ? (
        <div className="course-modal-content">
          <div className="course-details">
            <div className="course-detail-row">
              <label>과목코드:</label>
              <span>{course.code}</span>
            </div>
            <div className="course-detail-row">
              <label>과목명:</label>
              <span>{course.name}</span>
            </div>
            <div className="course-detail-row">
              <label>담당교수:</label>
              <span>{course.professor}</span>
            </div>
            <div className="course-detail-row">
              <label>조교:</label>
              <span>{course.assistant}</span>
            </div>
            <div className="course-detail-row">
              <label>시간:</label>
              <span>{course.day === 'monday' ? '월' : 
                     course.day === 'tuesday' ? '화' :
                     course.day === 'wednesday' ? '수' :
                     course.day === 'thursday' ? '목' :
                     course.day === 'friday' ? '금' : '토'}요일 {course.timeSlot}</span>
            </div>
            {isRegistered && (
              <div className="registration-status">
                <span className="registered-indicator">✅ 수강 중</span>
              </div>
            )}
          </div>

          <div className="course-modal-actions">
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`register-button ${isRegistered ? 'cancel' : 'register'}`}
            >
              {isLoading ? '처리 중...' : (isRegistered ? '수강 취소' : '수강 신청')}
            </button>
            <button
              onClick={handleShowEnrollment}
              className="enrollment-button"
            >
              수강인원 확인
            </button>
          </div>
        </div>
      ) : (
        <div className="enrollment-modal-content">
          <div className="enrollment-header">
            <h4>{course.name} ({course.code})</h4>
            <p>총 {enrollmentCount}명 수강 중</p>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <p>수강인원 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="enrollment-list">
              {enrolledUsers.length > 0 ? (
                <table className="enrollment-table">
                  <thead>
                    <tr>
                      <th>순번</th>
                      <th>이름</th>
                      <th>수강신청일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledUsers.map((enrollment, index) => (
                      <tr key={enrollment.registration_id}>
                        <td>{index + 1}</td>
                        <td>{enrollment.user_name}</td>
                        <td>{new Date(enrollment.registered_at).toLocaleDateString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-enrollment">
                  <p>아직 수강 신청한 학생이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          <div className="enrollment-actions">
            <button onClick={handleBack} className="back-button">
              뒤로 가기
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CourseModal;