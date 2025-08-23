import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

// Supabase 설정
const supabaseUrl = 'https://bfviyfzfrdupbkpkfzag.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdml5ZnpmcmR1cGJrcGtmemFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwMDc4NSwiZXhwIjoyMDcxMjc2Nzg1fQ.hsy2kOLsD6GPuK_fBTBgzZW9fObggzoZ8B8GlgUf1Yg';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// 암호화 키 (프론트엔드와 동일)
const ENCRYPTION_SECRET_KEY = 'sogang-ai-sw-course-2025-secret32';

// AES 암호화 함수
const encrypt = (text) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('암호화에 실패했습니다.');
  }
};

// 전화번호가 이미 암호화되어 있는지 확인하는 함수
const isEncrypted = (phone) => {
  // 숫자와 하이픈만으로 구성된 경우 평문으로 간주
  return !/^[\d-]+$/.test(phone);
};

// 메인 마이그레이션 함수
async function migratePhoneNumbers() {
  try {
    console.log('🔄 핸드폰 번호 암호화 마이그레이션 시작...');
    
    // 1. 모든 사용자 데이터 조회
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, phone, name')
      .not('phone', 'is', null)
      .not('phone', 'eq', '');

    if (fetchError) {
      throw new Error(`데이터 조회 실패: ${fetchError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('✅ 암호화할 핸드폰 번호가 없습니다.');
      return;
    }

    console.log(`📱 총 ${users.length}개의 사용자 데이터를 처리합니다.`);
    
    let encryptedCount = 0;
    let alreadyEncryptedCount = 0;
    let errors = [];

    // 2. 각 사용자의 핸드폰 번호 처리
    for (const user of users) {
      try {
        console.log(`\n처리 중: 사용자 ${user.name} (ID: ${user.id})`);
        console.log(`원본 번호: ${user.phone}`);

        // 이미 암호화되어 있는지 확인
        if (isEncrypted(user.phone)) {
          console.log('✓ 이미 암호화된 번호입니다.');
          alreadyEncryptedCount++;
          continue;
        }

        // 하이픈 제거 및 정리
        const cleanPhone = user.phone.replace(/-/g, '');
        
        // 암호화
        const encryptedPhone = encrypt(cleanPhone);
        console.log(`암호화된 번호: ${encryptedPhone}`);

        // 3. 데이터베이스 업데이트
        const { error: updateError } = await supabase
          .from('users')
          .update({ phone: encryptedPhone })
          .eq('id', user.id);

        if (updateError) {
          throw new Error(`업데이트 실패: ${updateError.message}`);
        }

        console.log('✅ 암호화 완료');
        encryptedCount++;

        // 처리 간 잠시 대기 (API 제한 방지)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ 사용자 ${user.id} 처리 실패:`, error.message);
        errors.push({ userId: user.id, name: user.name, error: error.message });
      }
    }

    // 4. 결과 요약
    console.log('\n' + '='.repeat(50));
    console.log('🎉 마이그레이션 완료!');
    console.log(`✅ 새로 암호화된 번호: ${encryptedCount}개`);
    console.log(`ℹ️  이미 암호화된 번호: ${alreadyEncryptedCount}개`);
    
    if (errors.length > 0) {
      console.log(`❌ 실패한 항목: ${errors.length}개`);
      errors.forEach(err => {
        console.log(`  - ${err.name} (ID: ${err.userId}): ${err.error}`);
      });
    }

    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
    process.exit(1);
  }
}

// 확인 메시지와 함께 실행
console.log('📋 핸드폰 번호 암호화 마이그레이션 스크립트');
console.log('⚠️  이 스크립트는 데이터베이스의 모든 평문 핸드폰 번호를 암호화합니다.');
console.log('');

// 즉시 실행
migratePhoneNumbers().then(() => {
  console.log('스크립트 종료');
  process.exit(0);
});