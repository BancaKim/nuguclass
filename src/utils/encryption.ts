import CryptoJS from 'crypto-js';

// 환경변수에서 암호화 키를 가져오거나 기본값 사용
const ENCRYPTION_SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET_KEY || 'sogang-ai-sw-course-2025-secret32';

// AES 암호화
export const encrypt = (text: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('암호화에 실패했습니다.');
  }
};

// AES 복호화
export const decrypt = (encryptedText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_SECRET_KEY);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!originalText) {
      throw new Error('복호화 결과가 비어있습니다.');
    }
    
    return originalText;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

// 휴대폰 번호 포맷팅 (복호화된 번호를 표시용으로 변환)
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phoneNumber;
};

// 암호화 테스트 함수
export const testEncryption = () => {
  const testPhoneNumber = '01012345678';
  console.log('=== 암호화 테스트 ===');
  console.log('원본 번호:', testPhoneNumber);
  
  try {
    const encrypted = encrypt(testPhoneNumber);
    console.log('암호화된 데이터:', encrypted);
    console.log('암호화 성공:', encrypted !== testPhoneNumber);
    
    const decrypted = decrypt(encrypted);
    console.log('복호화된 번호:', decrypted);
    console.log('복호화 성공:', decrypted === testPhoneNumber);
    
    const formatted = formatPhoneNumber(decrypted);
    console.log('포맷팅된 번호:', formatted);
    
    console.log('전체 테스트 결과:', encrypted !== testPhoneNumber && decrypted === testPhoneNumber ? '성공' : '실패');
    return encrypted !== testPhoneNumber && decrypted === testPhoneNumber;
  } catch (error) {
    console.error('암호화 테스트 실패:', error);
    return false;
  }
};