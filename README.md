# 누가 뭐듣지? - 서강대학교 AI·SW 대학원 수강신청 시스템

서강대학교 AI·SW 대학원 2025학년도 2학기 수강신청을 위한 웹 애플리케이션입니다.

## 🚀 주요 기능

### 🔐 인증 시스템
- 실제 로그인/로그아웃 기능
- 관리자와 학생 계정 구분
- 세션 관리

### 📚 과목 정보
- 서강대학교 AI·SW 대학원 실제 시간표 데이터
- 월-금 (18:30-20:00, 20:10-21:40), 토 (9:30-11:00, 11:10-12:40) 시간대
- 과목코드, 과목명, 교수, 조교 정보 포함

### 📅 시간표 인터페이스
- 서강대학교 크림슨 레드 테마
- 반응형 그리드 레이아웃
- 직관적인 한국어 UI
- 모바일 친화적 디자인

### 🎯 수강신청 기능
- 과목 클릭 → 모달 팝업
- "수강신청" 버튼으로 즉시 신청
- "수강인원 확인" 버튼으로 수강생 목록 조회
- 수강 제한 없음 (무제한 신청 가능)
- 시간 충돌 검사 없음

### 🛠 관리자 패널
- 사용자 관리 (전체 사용자 목록)
- **과목 관리** (Supabase 연동)
  - 과목 추가/수정/삭제
  - 실시간 수강인원 통계
  - 과목 데이터베이스 관리
- 수강신청 관리 (전체 수강신청 내역, 삭제 기능)
- 실시간 통계 표시

## 🎨 디자인 특징

- **테마**: 서강대학교 공식 크림슨 레드 컬러
- **폰트**: Noto Sans KR (한글 전용)
- **UI**: 깔끔하고 친근한 디자인
- **반응형**: 데스크톱/모바일 완벽 지원

## 📱 기술 스택

- **Frontend**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: 순수 CSS (CSS Variables)
- **상태 관리**: React Context API
- **데이터베이스**: Supabase (PostgreSQL)
- **데이터 저장**: localStorage + Supabase

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
cd sogang-course-registration
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일에 Supabase 정보를 입력하세요:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
```

### 3. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 4. Supabase 데이터베이스 설정
Supabase 프로젝트를 생성하고 `supabase/schema.sql` 파일의 내용을 SQL 에디터에서 실행하세요.

### 5. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### 6. 빌드
```bash
npm run build
# 또는
yarn build
```

## 🔧 Supabase 설정 가이드

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Project Settings > API에서 URL과 anon key 복사
3. SQL Editor에서 `supabase/schema.sql` 파일 내용 실행
4. `.env` 파일에 설정 정보 입력
5. 관리자 패널에서 기존 과목 데이터를 데이터베이스로 마이그레이션

## 🔑 테스트 계정

### 관리자 계정
- **이메일**: admin@sogang.ac.kr
- **비밀번호**: admin123
- **권한**: 전체 시스템 관리

### 학생 계정
- **이메일**: student1@sogang.ac.kr
- **비밀번호**: password
- **권한**: 수강신청 및 조회

추가 테스트 계정:
- student2@sogang.ac.kr / password
- student3@sogang.ac.kr / password

## 📋 데이터 구조

### User (사용자)
```typescript
{
  id: string;
  name: string;        // 이름
  studentId: string;   // 학번
  email: string;       // 이메일
  isAdmin: boolean;    // 관리자 여부
}
```

### Course (과목)
```typescript
{
  code: string;        // 과목코드 (예: GITA385-01)
  name: string;        // 과목명 (예: 딥러닝기초)
  professor: string;   // 교수명
  assistant: string;   // 조교명
  timeSlot: string;    // 시간 (예: 18:30-20:00)
  day: string;         // 요일 (monday-saturday)
}
```

### Registration (수강신청)
```typescript
{
  id: string;
  userId: string;      // 사용자 ID
  courseCode: string;  // 과목코드
  registeredAt: Date;  // 신청일시
}
```

## 🎯 주요 화면

### 1. 로그인 화면
- 서강대학교 브랜딩
- 테스트 계정 안내
- 반응형 디자인

### 2. 시간표 메인 화면
- 전체 과목 그리드 표시
- 수강신청한 과목은 하이라이트
- 과목 클릭으로 상세 정보 모달

### 3. 과목 상세 모달
- 과목 정보 표시
- 수강신청/취소 버튼
- 수강인원 확인 기능

### 4. 관리자 패널
- 사용자 관리 탭
- 과목 관리 탭  
- 수강신청 관리 탭

## 🔧 개발자 정보

- **개발**: AI Assistant (Claude)
- **요청자**: 사용자 요구사항에 따른 맞춤 개발
- **라이선스**: MIT

## 📞 지원

이슈나 기능 요청은 GitHub Issues를 통해 제보해주세요.

---

**🎓 서강대학교 AI·SW 대학원 수강신청 시스템**  
*2025학년도 2학기 - 누가 뭐듣지? 📚*
