import React, { useState } from 'react';
import type { Course } from '../../types';
import { daysOfWeek, timeSlots, saturdayTimeSlots } from '../../data/courses';

interface CourseFormProps {
  course?: Course;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState<Course>({
    code: course?.code || '',
    name: course?.name || '',
    professor: course?.professor || '',
    assistant: course?.assistant || '',
    timeSlot: course?.timeSlot || '',
    day: course?.day || 'monday',
    startTime: course?.startTime || '',
    endTime: course?.endTime || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = '과목 코드는 필수입니다.';
    }
    if (!formData.name.trim()) {
      newErrors.name = '과목명은 필수입니다.';
    }
    if (!formData.professor.trim()) {
      newErrors.professor = '교수명은 필수입니다.';
    }
    if (!formData.startTime) {
      newErrors.startTime = '시작 시간은 필수입니다.';
    }
    if (!formData.endTime) {
      newErrors.endTime = '종료 시간은 필수입니다.';
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const timeSlot = `${formData.startTime}-${formData.endTime}`;
      onSubmit({
        ...formData,
        timeSlot
      });
    }
  };

  const handleChange = (field: keyof Course, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getAvailableTimeSlots = () => {
    return formData.day === 'saturday' ? saturdayTimeSlots : timeSlots;
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    const [start, end] = timeSlot.split('-');
    setFormData(prev => ({
      ...prev,
      timeSlot,
      startTime: start,
      endTime: end
    }));
  };

  return (
    <div className="course-form-overlay">
      <div className="course-form">
        <h3>{isEditing ? '과목 수정' : '과목 추가'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">과목 코드 *</label>
            <input
              type="text"
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              disabled={isEditing}
              placeholder="예: GITA385-01"
              className={errors.code ? 'error' : ''}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">과목명 *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="예: 딥러닝기초"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="professor">교수명 *</label>
            <input
              type="text"
              id="professor"
              value={formData.professor}
              onChange={(e) => handleChange('professor', e.target.value)}
              placeholder="예: 홍길동"
              className={errors.professor ? 'error' : ''}
            />
            {errors.professor && <span className="error-message">{errors.professor}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="assistant">조교명</label>
            <input
              type="text"
              id="assistant"
              value={formData.assistant}
              onChange={(e) => handleChange('assistant', e.target.value)}
              placeholder="예: 김조교 (선택사항)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="day">요일 *</label>
              <select
                id="day"
                value={formData.day}
                onChange={(e) => handleChange('day', e.target.value as Course['day'])}
              >
                {daysOfWeek.map(day => (
                  <option key={day.key} value={day.key}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timeSlot">시간대 *</label>
              <select
                id="timeSlot"
                value={formData.timeSlot}
                onChange={(e) => handleTimeSlotChange(e.target.value)}
              >
                <option value="">시간 선택</option>
                {getAvailableTimeSlots().map(slot => (
                  <option key={`${slot.start}-${slot.end}`} value={`${slot.start}-${slot.end}`}>
                    {slot.label} ({slot.start}-{slot.end})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">시작 시간 *</label>
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className={errors.startTime ? 'error' : ''}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">종료 시간 *</label>
              <input
                type="time"
                id="endTime"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              취소
            </button>
            <button type="submit" className="submit-button">
              {isEditing ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;