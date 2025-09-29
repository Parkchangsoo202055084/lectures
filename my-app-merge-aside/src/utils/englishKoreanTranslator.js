/**
 * 영어-한글 검색어 번역 사전
 * - proper-name(브랜드, 가게 등) 포함
 * - 사전에 매핑이 없으면 translateToKorean은 원문을 그대로 반환합니다 (fallback).
 */
const TRANSLATION_DICT = {
  // 건물
  janggong: '장공',
  hall: '관',
  main: '본관',
  library: '도서관',
  chapel: '채플',
  student: '학생',
  union: '회관',
  gymnasium: '체육관',
  dormitory: '생활관',
  building: '관',

  // 편의시설 일반
  convenience: '편의',
  store: '점',
  restaurant: '식당',
  cafe: '카페',
  parking: '주차장',
  bank: '은행',
  atm: 'ATM',
  post: '우체국',
  office: '실',
  hospital: '병원',
  pharmacy: '약국',
  bookstore: '서점',
  stationery: '문구',

  // 교통
  bus: '버스',
  shuttle: '셔틀',
  station: '역',
  suwon: '수원',
  dongtan: '동탄',
  schedule: '시간표',
  route: '노선',
  stop: '정류장',

  // 학교 서비스
  scholarship: '장학금',
  counseling: '상담',
  center: '센터',
  academic: '학습',
  support: '지원',
  phone: '전화',
  number: '번호',
  community: '커뮤니티',
  calendar: '학사일정',
  orientation: 'OT',
  club: '동아리',
  central: '중앙',
  how: '방법',
  join: '가입',

  // 일반 단어
  info: '안내',
  information: '정보',
  guide: '안내',
  time: '시간',
  table: '표',

  // --- 브랜드/고유명사 ---
  stay: '스테이',
  emart24: '이마트24',
  'seven-eleven': '세븐일레븐',
  cafeing: '카페ing',
  veratis: '베라티스',

};

/**
 * escapeRegExp
 * 정규식 메타문자를 이스케이프합니다.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * translateToKorean
 * 영어 검색어를 한글로 번역합니다.
 * - 입력에 한글이 포함되어 있으면 그대로 반환합니다.
 * - 사전에서 치환이 전혀 발생하지 않으면 원문(대소문자 유지)으로 반환합니다 (fallback).
 *
 * @param {string} englishQuery - 영어 검색어
 * @returns {string} - 번역된 한글 검색어 또는 원문 (fallback)
 */
export function translateToKorean(englishQuery) {
  if (!englishQuery) return englishQuery;

  // 이미 한글이 포함되어 있으면 그대로 반환
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(englishQuery)) {
    return englishQuery;
  }

  const original = englishQuery;
  let translated = englishQuery.toLowerCase();

  // ✅ 단어 경계(\b) 제거 → 단순 부분 일치로 변환
  Object.keys(TRANSLATION_DICT).forEach((eng) => {
    const kor = TRANSLATION_DICT[eng];
    const regex = new RegExp(escapeRegExp(eng), 'gi');
    translated = translated.replace(regex, kor);
  });

  // 공백 정리
  translated = translated.replace(/\s+/g, ' ').trim();

  // 치환이 전혀 일어나지 않았다면 원문 반환
  if (!translated || translated.toLowerCase() === original.toLowerCase()) {
    return original;
  }

  console.log(`번역: "${original}" → "${translated}"`);
  return translated;
}

/**
 * isEnglishQuery
 * 입력 문자열에 영어(라틴 알파벳)가 포함되어 있고 한글이 없으면 true 반환
 *
 * @param {string} query
 * @returns {boolean}
 */
export function isEnglishQuery(query) {
  if (!query) return false;
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(query)) return false;
  return /[a-zA-Z]/.test(query);
}
