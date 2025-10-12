/**
 * src/utils/englishKoreanTranslator.js
 * * 영어 검색어를 한글로 번역하고, 입력 쿼리가 영어인지 확인하는 유틸리티입니다.
 */

const CLUB_TRANSLATIONS = {
    // 분과 카테고리
    performance: '공연',
    exhibition: '전시',
    academic: '학술',
    sports: '운동',
    religion: '종교',
    service: '봉사',
    
    // 동아리 이름 (영어로 검색 가능한 것들)
    band: '밴드',
    dance: '댄스',
    dio: 'DIO',
    muse: 'MUSE',
    fader: 'FADER',
    apex: 'APEX',
    gangster: '갱스터',
    'killer whales': '킬러웨일즈',
    'smash it': 'SMASH IT',
    ccc: 'CCC',
    ivf: 'IVF',
    rotaract: '로타랙트',
    
    // 동아리 관련 단어
    club: '동아리',
    clubs: '동아리',
    central: '중앙',
    volleyball: '배구',
    kendo: '검도',
    football: '축구',
    soccer: '축구',
    baseball: '야구',
    basketball: '농구',
    badminton: '배드민턴',
    'american football': '미식축구',
    
    // 활동 관련
    music: '음악',
    rock: '락',
    'hard rock': '하드락',
    'hip hop': '힙합',
    hiphop: '힙합',
    musical: '뮤지컬',
    traditional: '전통',
    percussion: '풍물',
    folk: '민중',
    song: '노래',
    
    // 예술/전시 관련
    art: '그림',
    drawing: '그림',
    photography: '사진',
    photo: '사진',
    fashion: '패션',
    tea: '차',
    'tea ceremony': '다도',
    'board game': '보드게임',
    mystery: '추리',
    'crime scene': '크라임씬',
    
    // 학술 관련
    advertising: '광고',
    ad: '광고',
    peace: '평화',
    'human rights': '인권',
    
    // 종교 관련
    christian: '기독교',
    christianity: '기독교',
};

const TRANSLATION_DICT = {
    // --- 건물 고유명사 및 구성 요소 (이미지 및 ASIDE_CONTENT 기반) ---
    janggong: '장공',
    pilheon: '필현',
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
    post: '우체', // Post Office
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
    CLUB_TRANSLATIONS, // 동아리 관련 번역 추가

    // --- 학사일정 관련 추가 ---
    // 학기 관련
    semester: '학기',
    fall: '2학기',
    'fall semester': '2학기',
    spring: '1학기',
    'spring semester': '1학기',
    summer: '여름',
    winter: '겨울',
    session: '계절학기',
    'winter session': '겨울계절학기',
    'summer session': '여름계절학기',
    starts: '개강',
    'semester starts': '개강',
    
    // 수강 관련
    course: '수강',
    registration: '신청',
    'course registration': '수강신청',
    'pre-registration': '예비수강신청',
    change: '변경',
    'course change': '수강신청변경',
    withdrawal: '취소',
    'course withdrawal': '수강신청취소',
    drop: '취소',
    
    // 시험 관련
    exam: '고사',
    midterm: '중간',
    'midterm exam': '중간고사',
    final: '기말',
    'final exam': '기말고사',
    evaluation: '평가',
    'course evaluation': '강의평가',
    'midterm course evaluation': '중간강의평가',
    'final course evaluation': '기말강의평가',
    
    // 성적 관련
    grade: '성적',
    entry: '입력',
    'grade entry': '성적입력',
    inquiry: '조회',
    'grade inquiry': '성적조회',
    appeal: '이의신청',
    
    // 학적 관련
    reinstatement: '복학',
    'leave of absence': '휴학',
    'leave': '휴학',
    absence: '휴학',
    transfer: '전과',
    'major transfer': '전과',
    major: '전공',
    'double major': '복수전공',
    'major application': '전공신청',
    readmission: '재입학',
    
    // 졸업 관련
    graduation: '졸업',
    'graduation day': '졸업일',
    'graduation ceremony': '학위수여식',
    ceremony: '식',
    commencement: '학위수여',
    degree: '학위',
    
    // 등록 관련
    tuition: '등록',
    payment: '납부',
    'tuition payment': '등록',
    'payment period': '등록기간',
    enrollment: '등록',
    
    // 신입생 관련
    freshman: '신입생',
    orientation: '오리엔테이션',
    admission: '입학',
    'new student': '신입생',
    'transfer student': '편입생',
    
    // 공휴일 관련
    holiday: '휴일',
    'liberation day': '광복절',
    'national foundation day': '개천절',
    'hangeul day': '한글날',
    chuseok: '추석',
    'lunar new year': '설날',
    christmas: '성탄절',
    'new year': '신정',
    "new year's day": '신정',
    'substitute holiday': '대체공휴일',
    
    // 기타
    period: '기간',
    deadline: '마감',
    application: '신청',
    completed: '완료',
    substitute: '대체',
    returning: '복학',
    students: '학생',
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
