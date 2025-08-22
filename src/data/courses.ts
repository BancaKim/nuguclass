import type { Course } from '../types';

export const courses: Course[] = [
// 2025학년도 2학기 AI∙SW대학원 강의시간표

// Monday (월)
{
  code: 'GITA385-01',
  name: '딥러닝기초-01',
  professor: '낭종호',
  assistant: '문의현',
  timeSlot: '18:30-20:00',
  day: 'monday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA393',
  name: '추천시스템',
  professor: '문의현',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'monday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITE312',
  name: '소프트웨어 프로젝트 관리',
  professor: '김진태',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'monday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA304',
  name: '파이썬 프로그래밍',
  professor: '강은숙',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'monday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA402',
  name: '베이즈 통계 모델링',
  professor: '서용덕',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'monday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITS316',
  name: '텐서플로우 활용기초',
  professor: '정화민',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'monday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITG372',
  name: '모바일 보안',
  professor: '이재광',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'monday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITH347',
  name: '블록체인 시스템 설계와 트릴레마 이론',
  professor: '한세진',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'monday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITG378',
  name: '클라우드 네이티브 이론과 실습I',
  professor: '도경화',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'monday',
  startTime: '20:10',
  endTime: '21:40'
},

// Tuesday (화)
{
  code: 'GITA305',
  name: '머신러닝Ⅰ',
  professor: '이영섭',
  assistant: '박석',
  timeSlot: '18:30-20:00',
  day: 'tuesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA386',
  name: '빅데이터마이닝',
  professor: '박석',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'tuesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITG341',
  name: '시스템 포렌직',
  professor: '손연형',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'tuesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA401',
  name: '강화학습의 기초',
  professor: '소정민',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'tuesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA317-01',
  name: '파이썬 머신러닝II',
  professor: '김종락',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'tuesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA306',
  name: '머신러닝Ⅱ',
  professor: '이영섭',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'tuesday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITE325',
  name: '전산감사의 국제표준',
  professor: '이영주',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'tuesday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITS377',
  name: '빅데이터 예측분석',
  professor: '정화민',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'tuesday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITG375',
  name: '금융보안 법규 및 정책',
  professor: '소현철',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'tuesday',
  startTime: '20:10',
  endTime: '21:40'
},

// Wednesday (수)
{
  code: 'GITA389',
  name: '인공지능 확률통계',
  professor: '서용덕',
  assistant: '정성원',
  timeSlot: '18:30-20:00',
  day: 'wednesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITS338',
  name: '공간정보처리시스템',
  professor: '정성원',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'wednesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITH351',
  name: '블록체인기초 및 실물자산 토큰화',
  professor: '장주욱',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'wednesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITG377',
  name: '정보보호개론II',
  professor: '도경화',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'wednesday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITH307',
  name: '블록체인 이론 및 응용II',
  professor: '윤석빈',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'wednesday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITE320',
  name: '소프트웨어 품질관리',
  professor: '황만수',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'wednesday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITA341',
  name: '자연언어처리',
  professor: '조은경',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'wednesday',
  startTime: '20:10',
  endTime: '21:40'
},

// Thursday (목)
{
  code: 'GITA388-01',
  name: '패턴인식',
  professor: '박운상',
  assistant: '고덕윤',
  timeSlot: '18:30-20:00',
  day: 'thursday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITH302',
  name: '블록체인기술과 디지털화폐',
  professor: '고덕윤',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'thursday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA385-02',
  name: '딥러닝기초',
  professor: '최준석',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'thursday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA330-02',
  name: '컴퓨터그래픽스',
  professor: '이주호',
  assistant: '',
  timeSlot: '18:30-20:00',
  day: 'thursday',
  startTime: '18:30',
  endTime: '20:00'
},
{
  code: 'GITA388-02',
  name: '패턴인식',
  professor: '최준석',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'thursday',
  startTime: '20:10',
  endTime: '21:40'
},
{
  code: 'GITH349-01',
  name: '웹3.0과 Responsible AI',
  professor: '서영일',
  assistant: '',
  timeSlot: '20:10-21:40',
  day: 'thursday',
  startTime: '20:10',
  endTime: '21:40'
},

// Saturday (토)
{
  code: 'GITA310',
  name: '인공지능 개론',
  professor: '양지훈',
  assistant: '김영재',
  timeSlot: '09:30-11:00',
  day: 'saturday',
  startTime: '09:30',
  endTime: '11:00'
},
{
  code: 'GITF345',
  name: '빅데이터 저장 시스템 및 응용',
  professor: '김영재',
  assistant: '',
  timeSlot: '09:30-11:00',
  day: 'saturday',
  startTime: '09:30',
  endTime: '11:00'
}
];

export const timeSlots = [
  { start: '18:30', end: '20:00', label: '1교시' },
  { start: '20:10', end: '21:40', label: '2교시' }
];

export const saturdayTimeSlots = [
  { start: '09:30', end: '11:00', label: '1교시' },
  { start: '11:10', end: '12:40', label: '2교시' }
];

export const daysOfWeek = [
  { key: 'monday', label: '월', name: '월요일' },
  { key: 'tuesday', label: '화', name: '화요일' },
  { key: 'wednesday', label: '수', name: '수요일' },
  { key: 'thursday', label: '목', name: '목요일' },
  { key: 'friday', label: '금', name: '금요일' },
  { key: 'saturday', label: '토', name: '토요일' }
];