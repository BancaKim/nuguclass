import React, { useState, useEffect } from 'react';
import type { Course } from '../../types';
import { timeSlots, saturdayTimeSlots, daysOfWeek } from '../../data/courses';
import { useAuth } from '../../contexts/AuthContext';
import { CourseService } from '../../services/courseService';
import { RegistrationService } from '../../services/registrationService';
import CourseModal from './CourseModal';

const TimetableGrid: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
    if (user) {
      loadUserRegistrations();
    }
  }, [user]);

  // 관리자 패널에서 돌아왔을 때 데이터 새로고침
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('TimetableGrid - Page became visible, reloading courses');
        loadCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const loadedCourses = await CourseService.getAllCourses();
      console.log('TimetableGrid - Loaded courses:', loadedCourses.length);
      setCourses(loadedCourses);
    } catch (error) {
      console.error('TimetableGrid - Failed to load courses:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRegistrations = async () => {
    if (!user) return;
    
    try {
      const registrations = await RegistrationService.getUserRegistrations(parseInt(user.id));
      const courseCodes = registrations.map(reg => reg.course_code);
      setUserRegistrations(courseCodes);
      console.log('TimetableGrid - Loaded user registrations:', courseCodes);
    } catch (error) {
      console.error('TimetableGrid - Failed to load user registrations:', error);
      setUserRegistrations([]);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handleRegistrationUpdate = () => {
    if (user) {
      loadUserRegistrations();
    }
  };

  const isUserRegistered = (courseCode: string) => {
    return userRegistrations.includes(courseCode);
  };

  const getCoursesForTimeSlot = (day: string, timeSlot: string) => {
    return courses.filter(course => 
      course.day === day && course.timeSlot === timeSlot
    );
  };

  const renderTimeSlot = (day: string, timeSlot: string, slotIndex: number) => {
    const coursesInSlot = getCoursesForTimeSlot(day, timeSlot);
    
    return (
      <div 
        key={`${day}-${slotIndex}`} 
        className={`time-slot ${coursesInSlot.length > 0 ? 'has-course' : 'empty-slot'}`}
      >
        {coursesInSlot.length > 0 ? (
          <div className="course-list">
            {coursesInSlot.map((course, index) => {
              const isRegistered = isUserRegistered(course.code);
              const isHovered = hoveredCourse === course.code;
              return (
                <div 
                  key={course.code}
                  className={`course-info ${index > 0 ? 'course-separator' : ''} ${isRegistered ? 'course-registered' : ''} ${isHovered ? 'course-hovered' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseClick(course);
                  }}
                  onMouseEnter={() => setHoveredCourse(course.code)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <div className="course-code">{course.code}</div>
                  <div className="course-name">{course.name}</div>
                  <div className="course-professor">{course.professor}</div>
                  {isRegistered && <div className="registered-badge">수강중</div>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-slot-content">
            <span>-</span>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="timetable-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>시간표를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timetable-container">
      <div className="timetable-grid">
        {/* Header row */}
        <div className="header-row">
          <div className="time-header">시간</div>
          {daysOfWeek.map(day => (
            <div key={day.key} className="day-header">
              <div className="day-short">{day.label}</div>
              <div className="day-full">{day.name}</div>
            </div>
          ))}
        </div>

        {/* Time slots for weekdays */}
        {timeSlots.map((slot, slotIndex) => (
          <div key={`weekday-${slotIndex}`} className="time-row">
            <div className="time-label">
              <div className="time-period">{slot.label}</div>
              <div className="time-range">{slot.start}-{slot.end}</div>
            </div>
            {daysOfWeek.slice(0, 5).map(day => 
              renderTimeSlot(day.key, slot.start + '-' + slot.end, slotIndex)
            )}
            {/* Saturday column for weekday slots */}
            <div className="time-slot empty-slot saturday-empty">
              <span>-</span>
            </div>
          </div>
        ))}

        {/* Saturday specific time slots */}
        {saturdayTimeSlots.map((slot, slotIndex) => (
          <div key={`saturday-${slotIndex}`} className="time-row saturday-row">
            <div className="time-label">
              <div className="time-period">토{slotIndex + 1}</div>
              <div className="time-range">{slot.start}-{slot.end}</div>
            </div>
            {/* Empty slots for weekdays */}
            {daysOfWeek.slice(0, 5).map(day => (
              <div key={`${day.key}-saturday-empty`} className="time-slot empty-slot">
                <span>-</span>
              </div>
            ))}
            {/* Saturday slot */}
            {renderTimeSlot('saturday', slot.start + '-' + slot.end, slotIndex)}
          </div>
        ))}
      </div>

      {selectedCourse && (
        <CourseModal
          isOpen={!!selectedCourse}
          course={selectedCourse}
          onClose={handleCloseModal}
          onRegistrationUpdate={handleRegistrationUpdate}
          isRegistered={isUserRegistered(selectedCourse.code)}
        />
      )}
    </div>
  );
};

export default TimetableGrid;