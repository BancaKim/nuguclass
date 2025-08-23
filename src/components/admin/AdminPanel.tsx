import React, { useState, useEffect } from 'react';
import type { User, Course } from '../../types';
import { CourseService } from '../../services/courseService';
import { UserService } from '../../services/userService';
import { RegistrationService } from '../../services/registrationService';
import { useToast } from '../../hooks/useToast';
import CourseForm from './CourseForm';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'registrations'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load data from Supabase
      const loadedUsers = await UserService.getAllUsers();
      const loadedRegistrations = await RegistrationService.getAllRegistrations();
      const loadedCourses = await CourseService.getAllCourses();
      
      console.log('AdminPanel - Loaded users from DB:', loadedUsers.length);
      console.log('AdminPanel - Loaded registrations from DB:', loadedRegistrations.length);
      console.log('AdminPanel - Loaded courses from DB:', loadedCourses.length);
      
      setUsers(loadedUsers);
      setRegistrations(loadedRegistrations);
      setDbCourses(loadedCourses);
    } catch (error) {
      console.error('AdminPanel - Failed to load data:', error);
      showError('데이터 로딩에 실패했습니다.');
      // Set empty arrays on error to prevent UI crashes
      setUsers([]);
      setRegistrations([]);
      setDbCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRegistrations = (userId: string) => {
    return registrations.filter(reg => reg.user_id.toString() === userId);
  };

  const getCourseRegistrations = (courseCode: string) => {
    return registrations.filter(reg => reg.course_code === courseCode);
  };

  const handleDeleteRegistration = async () => {
    if (confirm('이 수강 신청을 삭제하시겠습니까?')) {
      try {
        // Note: We need to implement soft delete in RegistrationService
        // For now, this will need to be updated when we implement admin delete functionality
        showError('수강신청 삭제 기능은 현재 개발 중입니다.');
        // TODO: Implement admin registration deletion
        // await RegistrationService.deleteRegistrationById(regId);
        // await loadData();
        // showSuccess('수강신청이 삭제되었습니다.');
      } catch (error) {
        console.error('AdminPanel - Failed to delete registration:', error);
        showError('수강신청 삭제에 실패했습니다.');
      }
    }
  };

  // Helper functions removed as they were unused

  const handleAddCourse = async (course: Course) => {
    console.log('AdminPanel - Adding course:', course);
    try {
      const newCourse = await CourseService.addCourse(course);
      console.log('AdminPanel - Course added successfully:', newCourse);
      
      await loadData();
      console.log('AdminPanel - Data reloaded after adding course');
      
      setShowCourseForm(false);
      showSuccess('과목이 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('AdminPanel - Failed to add course:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      showError(`과목 추가에 실패했습니다: ${errorMessage}`);
    }
  };

  const handleUpdateCourse = async (course: Course) => {
    if (!editingCourse) return;
    
    try {
      await CourseService.updateCourse(editingCourse.code, course);
      await loadData();
      setShowCourseForm(false);
      setEditingCourse(null);
      showSuccess('과목이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update course:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      showError(`과목 수정에 실패했습니다: ${errorMessage}`);
    }
  };

  const handleDeleteCourse = async (courseCode: string) => {
    const deleteType = confirm('완전 삭제하시겠습니까?\n\n확인: 완전 삭제 (데이터베이스에서 영구 제거)\n취소: 비활성화 (숨김 처리, 복구 가능)');
    
    const action = deleteType ? '완전 삭제' : '비활성화';
    if (confirm(`정말로 이 과목을 ${action}하시겠습니까?`)) {
      try {
        if (deleteType) {
          await CourseService.hardDeleteCourse(courseCode);
        } else {
          await CourseService.deleteCourse(courseCode);
        }
        
        await loadData();
        showSuccess(`과목이 성공적으로 ${action}되었습니다.`);
      } catch (error) {
        console.error('Failed to delete course:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
        showError(`과목 ${action}에 실패했습니다: ${errorMessage}`);
      }
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCancelCourseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>관리자 패널</h2>
        <button onClick={onClose} className="close-admin-button">
          닫기
        </button>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('users')}
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
        >
          사용자 관리 ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
        >
          과목 관리 ({dbCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`tab-button ${activeTab === 'registrations' ? 'active' : ''}`}
        >
          수강신청 관리 ({registrations.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-management">
            <h3>사용자 목록</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>학번</th>
                    <th>이메일</th>
                    <th>권한</th>
                    <th>수강과목 수</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.studentId}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.isAdmin ? 'admin' : 'student'}`}>
                          {user.isAdmin ? '관리자' : '학생'}
                        </span>
                      </td>
                      <td>{getUserRegistrations(user.id).length}개</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-management">
            <div className="management-header">
              <h3>과목 목록</h3>
              <button 
                onClick={() => setShowCourseForm(true)}
                className="add-button"
              >
                + 과목 추가
              </button>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>과목코드</th>
                    <th>과목명</th>
                    <th>교수</th>
                    <th>조교</th>
                    <th>요일/시간</th>
                    <th>수강인원</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {dbCourses.map(course => (
                    <tr key={course.code}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.professor}</td>
                      <td>{course.assistant || '-'}</td>
                      <td>
                        {course.day === 'monday' ? '월' : 
                         course.day === 'tuesday' ? '화' :
                         course.day === 'wednesday' ? '수' :
                         course.day === 'thursday' ? '목' :
                         course.day === 'friday' ? '금' : '토'}요일 {course.timeSlot}
                      </td>
                      <td>{getCourseRegistrations(course.code).length}명</td>
                      <td>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="edit-button"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.code)}
                          className="delete-button"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dbCourses.length === 0 && (
                <div className="no-data">
                  <p>등록된 과목이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="registrations-management">
            <h3>수강신청 목록</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>학생명</th>
                    <th>학번</th>
                    <th>과목코드</th>
                    <th>과목명</th>
                    <th>신청일시</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(registration => (
                    <tr key={registration.registration_id}>
                      <td>{registration.user_name}</td>
                      <td>{registration.student_id}</td>
                      <td>{registration.course_code}</td>
                      <td>{registration.course_name}</td>
                      <td>
                        {new Date(registration.registered_at).toLocaleString('ko-KR')}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteRegistration()}
                          className="delete-button"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {registrations.length === 0 && (
                <div className="no-data">
                  <p>수강신청 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCourseForm && (
        <CourseForm
          course={editingCourse || undefined}
          onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
          onCancel={handleCancelCourseForm}
          isEditing={!!editingCourse}
        />
      )}
    </div>
  );
};

export default AdminPanel;