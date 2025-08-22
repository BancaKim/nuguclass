-- 개발 중에 RLS를 비활성화하여 401 Unauthorized 문제 해결
-- 주의: 프로덕션 환경에서는 적절한 RLS 정책을 설정해야 합니다

-- courses 테이블의 RLS 비활성화
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- 확인: 테이블 정보 조회
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';