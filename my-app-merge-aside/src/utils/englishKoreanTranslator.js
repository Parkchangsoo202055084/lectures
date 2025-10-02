/**
 * src/utils/englishKoreanTranslator.js
 * * 영어 검색어를 한글로 번역하고, 입력 쿼리가 영어인지 확인하는 유틸리티입니다.
 */

const TRANSLATION_DICT = {
    // --- 건물 고유명사 및 구성 요소 (이미지 및 ASIDE_CONTENT 기반) ---
    janggong: '장공',
    pilheon: '필헌',
    manwoo: '만우',
    shalom: '살롬',
    emmanuel: '임마누엘',
    kyungsam: '경삼',
    songam: '송암',
    sotong: '소통',
    hanul: '한울',
    seongbin: '성빈학사',
    saeromteo: '새롬터', 
    haeoreum: '해오름',
    jangjunha: '장준하',
    neutbom: '늦봄',

    // 건물 관련 일반 단어
    hall: '관',
    main: '본관',
    library: '도서관',
    chapel: '채플',
    student: '학생',
    union: '회관',
    gym: '체육관', // 'gymnasium' 대신 'gym' 사용 시 대비
    dormitory: '생활관',
    
    // 복합 명사 구성 요소
    'learning & practice hall': '학습실습동', // 'Learning & Practice Hall' 전체 번역 (기존 & 버전)
    'learning and practice hall': '학습실습동', // 'Learning and Practice Hall' 변형 추가 (and 버전)
    'learning & practice': '학습실습',         // 'Learning & Practice' 복합어 번역 (기존 & 버전)
    'learning and practice': '학습실습',         // 'Learning and Practice' 변형 추가 (and 버전)
    learning: '학습', 
    practice: '실습',
    unification: '통일', // Jangjunha Unification Hall
    building: '건물', // map.title: "Buildings" 처리용 (기존 '관'보다 넓은 의미)

    // --- 편의 시설 (Facilities) 관련 추가/수정 ---
    facilities: '편의시설', // map.collapsible[1].title
    cafeteria: '식당', // Facilities.Cafeteria
    'student cafeteria': '학식', // 'Student Cafeteria' -> '학식' (단축어)
    cafe: '카페', // Facilities.Cafe
    cafeing: '카페ing',
    veratis: '베라티스',
    stay: '스테이',
    convenience: '편의',
    store: '점', // Convenience Store -> 편의점
    parking: '주차장', // Parking Lot
    lot: '', // Parking Lot에서 'Lot' 제거 (주차장 자체에 이미 포함)
    bank: '은행', // Bank/ATM
    atm: 'ATM',
    post: '우체국', // Post Office
    office: '국', // Post Office에서 'Office'를 '국'으로 (우체국)
    hospital: '병원', // Hospital/Pharmacy
    pharmacy: '약국',
    bookstore: '서점', // Bookstore/Stationery
    stationery: '문구',

    // --- 버스 정보 (Bus Info) 관련 추가/수정 ---
    bus: '버스',
    info: '정보',
    routes: '노선', // Bus Routes
    shuttle: '셔틀',
    schedule: '시간표', // Shuttle Schedule
    station: '역',
    suwon: '수원', // Suwon Station Shuttle
    dongtan: '동탄', // Dongtan Shuttle
    other: '기타', // Other Info
    byeongjeom: '병점역', // Byeongjeom Station Bus Info (고유명사)
    to: '', // 'Bus Info to School'에서 'to' 제거
    school: '학교',
    operating: '운행', // Shuttle Schedule -> 셔틀 운행 시간
    time: '시간', // Shuttle Schedule -> 셔틀 운행 시간
    
    // --- 재학생/동아리/학생지원 관련 추가/수정 ---
    current: '재학생', // Current Student Info
    academic: '학사', // Academic Calendar
    calendar: '일정',
    guide: '안내', // OT Guide
    ot: 'OT',
    club: '동아리',
    clubs: '동아리',
    central: '중앙', // Central Clubs
    how: '방법', // How to Join
    join: '가입',
    support: '지원', // Student Support
    scholarship: '장학금',
    counseling: '상담', // Counseling Center
    center: '센터',
    phone: '전화', // Phone Numbers
    numbers: '번호',
    community: '커뮤니티',
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 영어 검색어를 한글로 번역합니다.
 * @param {string} englishQuery - 번역할 영어 쿼리 문자열.
 * @returns {string} - 번역된 한글 문자열 또는 원본 쿼리.
 */
export function translateToKorean(englishQuery) {
    if (!englishQuery || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(englishQuery)) {
        return englishQuery;
    }

    const original = englishQuery;
    let translated = englishQuery.toLowerCase();
    let replacedCount = 0;

    Object.keys(TRANSLATION_DICT)
        // 긴 단어부터 먼저 치환하여 정확도 향상. 
        // 'learning and practice hall'과 같은 긴 복합어가 먼저 처리되도록 합니다.
        .sort((a, b) => b.length - a.length) 
        .forEach((eng) => {
            const kor = TRANSLATION_DICT[eng];
            
            let regex;
            if (eng.includes(' ')) {
                // 복합어는 공백을 포함해 정확히 일치하도록
                regex = new RegExp(escapeRegExp(eng), 'gi');
            } else {
                // 단일어는 단어 경계(\b)를 사용하여 부분 일치 방지
                regex = new RegExp(`\\b${escapeRegExp(eng)}\\b`, 'gi');
            }


            const matchCount = translated.match(regex)?.length || 0;
            if (matchCount > 0) {
                replacedCount += matchCount;
                translated = translated.replace(regex, kor);
            }
        });

    // 단어 사이 공백 제거 및 연속 공백 정리 (예: '학생 회관' -> '학생회관')
    // 이 로직은 여전히 '학습 실습동'을 '학습실습동'으로 붙여주는 역할을 합니다.
    translated = translated.replace(/(\S)\s+(\S)/g, '$1$2');
    translated = translated.replace(/\s+/g, ' ').trim();

    if (replacedCount === 0 || translated.toLowerCase() === original.toLowerCase()) {
        return original;
    }

    return translated;
}

/**
 * 입력 문자열에 영어(라틴 알파벳)가 포함되어 있고 한글이 없으면 true 반환
 * @param {string} query - 확인할 문자열.
 * @returns {boolean} - 영어 쿼리인 경우 true.
 */
export function isEnglishQuery(query) {
    // 쿼리가 비어있거나, 한글이 포함되어 있으면 false
    if (!query || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(query)) return false;
    // 알파벳(대소문자)이 포함되어 있으면 true
    return /[a-zA-Z]/.test(query);
}
