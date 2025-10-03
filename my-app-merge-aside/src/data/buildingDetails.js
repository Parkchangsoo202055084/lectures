// FILE: src/data/buildingDetails.js (한국어 및 영문 다국어 구조로 변환된 최종 코드)

/**
 * 건물 상세 정보: 층별/시설 정보
 * 상세 정보는 handlers.js의 로직에 따라 한국어는 'ko', 영문은 'en' 속성 아래에 floors 배열을 포함합니다.
 * 키값은 Aside/BUILDINGS의 한국어 건물명과 정확히 일치해야 합니다.
 */
export const BUILDING_DETAILS = {
    // 1. 장공관(본관) / Janggong Hall (Main)
    "장공관(본관)": {
        alias: "1관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["총무팀", "교수연구팀", "입학인재발굴팀", "재무팀", "우편물보관실"], },
                { floor: "2F", rooms: ["총장실", "처장 본부장실", "법인사무국"] },
                { floor: "3F", rooms: ["대학평가팀", "기획예산팀", "브랜드홍보팀", "혁신성과관리팀"], },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["General Affairs Team", "Faculty Research Team", "Admissions and Talent Discovery Team", "Finance Team", "Mail Storage Room"], },
                { floor: "2F", rooms: ["President's Office", "Director/Headquarters Office", "Corporation Secretariat"] },
                { floor: "3F", rooms: ["University Evaluation Team", "Planning and Budget Team", "Brand & PR Team", "Innovation and Performance Management Team"], },
            ],
        },
    },

    // 2. 필현관 / Pilheon Hall
    필현관: {
        ko: {
            floors: [
                { floor: "1F", rooms: ["대학원교학팀", "대학원장실", "교수실", "ATM(우체국, 하나)", "복사기"], },
                { floor: "2F", rooms: ["강의실", "세미나실"] },
                { floor: "3F", rooms: ["교수실", "세미나실", "대학원연구실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Graduate School Academic Affairs Team", "Dean of Graduate School Office", "Faculty Office", "ATM (Post Office, Hana)", "Copier"], },
                { floor: "2F", rooms: ["Lecture Room", "Seminar Room"] },
                { floor: "3F", rooms: ["Faculty Office", "Seminar Room", "Graduate Research Room"] },
            ],
        },
    },

    // 3. 만우관 / Manwoo Hall
    만우관: {
        ko: {
            floors: [
                { floor: "1F", rooms: ["노동조합", "하늘땅", "시설관리실"] },
                { floor: "2F", rooms: ["강의실"] },
                { floor: "3F", rooms: ["학생회실", "강의실", "등빛(소극장)", "카페", "남학생휴게실", "복사기"], },
                { floor: "4F", rooms: ["학생회실", "강의실", "강사휴게실"] },
                { floor: "5F", rooms: ["학생회실", "실습실", "강의실", "교수실", "라운지"], },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Labor Union", "Haneulttang (Student Space)", "Facility Management Office"] },
                { floor: "2F", rooms: ["Lecture Room"] },
                { floor: "3F", rooms: ["Student Council Room", "Lecture Room", "Deungbit (Small Theater)", "Cafe", "Male Student Lounge", "Copier"], },
                { floor: "4F", rooms: ["Student Council Room", "Lecture Room", "Lecturer Lounge"] },
                { floor: "5F", rooms: ["Student Council Room", "Practice Room", "Lecture Room", "Faculty Office", "Lounge"], },
            ],
        },
    },

    // 4. 샬롬채플 / Shalom Chapel
    샬롬채플: {
        alias: "채플관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["교목실", "교목실장실", "합창단", "평화나눔센터"], },
                { floor: "2F", rooms: ["채플실"] },
                { floor: "3F", rooms: ["채플실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Chaplaincy", "Head of Chaplaincy Office", "Choir", "Peace Sharing Center"], },
                { floor: "2F", rooms: ["Chapel"] },
                { floor: "3F", rooms: ["Chapel"] },
            ],
        },
    },

    // 5. 임마누엘관(학생회관) / Emmanuel Hall (Student Union)
    "임마누엘관(학생회관)": {
        ko: {
            floors: [
                { floor: "B1F", rooms: ["임상심리연구센터", "AI빅데이터센터", "유라시아연구소"], },
                { floor: "1F", rooms: ["식당(학생식당)", "편의점"] },
                { floor: "2F", rooms: ["학생회", "동아리실"] },
                { floor: "3F", rooms: ["학생회", "동아리실"] },
            ],
        },
        en: {
            floors: [
                { floor: "B1F", rooms: ["Clinical Psychology Research Center", "AI Big Data Center", "Eurasia Research Institute"], },
                { floor: "1F", rooms: ["Cafeteria (Student Dining Hall)", "Convenience Store"] },
                { floor: "2F", rooms: ["Student Council", "Club Room"] },
                { floor: "3F", rooms: ["Student Council", "Club Room"] },
            ],
        },
    },

    // 6. 경삼관(도서관) / Kyungsam Hall (Library)
    "경삼관(도서관)": {
        ko: {
            floors: [
                { floor: "1F", rooms: ["수서행정실", "미디어자료실", "복사실", "학생장학팀", "대학일자리센터", "R&D사업단", "박물관 전시실", "카페", "ATM(KB)", "라운지"], },
                { floor: "2F", rooms: ["자료실", "스터디룸", "학생상담센터", "인권센터", "IPP센터", "교수학습지원센터", "교육성과관리센터"], },
                { floor: "3F", rooms: ["자료실", "스터디룸", "잡스페이스", "세미나실", "국제교류원", "열람실"], },
                { floor: "4F", rooms: ["소극장", "한신갤러리", "시설자산팀(3.5층)"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Acquisitions & Administration Office", "Media Resources Room", "Copy Room", "Student & Scholarship Team", "University Job Center", "R&D Project Group", "Museum Exhibition Room", "Cafe", "ATM (KB)", "Lounge"], },
                { floor: "2F", rooms: ["Archives/Data Room", "Study Room", "Student Counseling Center", "Human Rights Center", "IPP Center", "Teaching and Learning Support Center", "Educational Performance Management Center"], },
                { floor: "3F", rooms: ["Archives/Data Room", "Study Room", "Job Space", "Seminar Room", "International Exchange Center", "Reading Room"], },
                { floor: "4F", rooms: ["Small Theater", "Hanshin Gallery", "Facility Asset Team (3.5F)"] },
            ],
        },
    },

    // 7. 송암관 / Songam Hall
    송암관: {
        alias: "7관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["유사홀", "강의실", "실습실", "복사기"] },
                { floor: "2F", rooms: ["학생회실", "실습실", "강의실", "교수실"] },
                { floor: "3F", rooms: ["학생회실", "실습실", "강의실", "교수실", "연구실"], },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Yoosa Hall", "Lecture Room", "Practice Room", "Copier"] },
                { floor: "2F", rooms: ["Student Council Room", "Practice Room", "Lecture Room", "Faculty Office"] },
                { floor: "3F", rooms: ["Student Council Room", "Practice Room", "Lecture Room", "Faculty Office", "Research Lab"], },
            ],
        },
    },

    // 8. 소통관 / Sotong Hall
    소통관: {
        alias: "8관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["교무팀", "대학행정팀(이공계, AI·SW 제외)", "평화교양대학", "실습실", "강의실"], },
                { floor: "2~4F", rooms: ["교수실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Academic Affairs Team", "University Administration Team (Excl. Engineering, AI/SW)", "Peace & Liberal Arts College", "Practice Room", "Lecture Room"], },
                { floor: "2~4F", rooms: ["Faculty Office"] },
            ],
        },
    },

    // 9. 학습실습동 / Learning & Practice Hall (9관 (창업지원센터))
    학습실습동: {
        alias: "9관 (창업지원센터)",
        ko: {
            floors: [
                { floor: "1F", rooms: ["연구실"] },
                { floor: "2F", rooms: ["창업보육센터"] },
                { floor: "3F", rooms: ["소프트웨어융합학부 랩실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Research Lab / Office"] },
                { floor: "2F", rooms: ["Business Incubation Center"] },
                { floor: "3F", rooms: ["Software Convergence Department Lab"] },
            ],
        },
    },

    // 10. 한울관(체육관) / Hanul Hall (Gym)
    "한울관(체육관)": {
        alias: "10관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["예비군대대", "실습실", "교수실", "샤워실", "스쿼시장"], },
                { floor: "2F", rooms: ["강의실", "실습실", "에어로빅실", "특수체육학과 사무실"], },
                { floor: "3F", rooms: ["교수실", "총동문회 사무실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Reserve Forces Battalion", "Practice Room", "Faculty Office", "Shower Room", "Squash Court"], },
                { floor: "2F", rooms: ["Lecture Room", "Practice Room", "Aerobics Room", "Dept. of Special Physical Education Office"], },
                { floor: "3F", rooms: ["Faculty Office", "General Alumni Association Office"] },
            ],
        },
    },

    // 11. 성빈학사(생활관) / Seongbin (Dormitory)
    "성빈학사(생활관)": {
        ko: {
            floors: [
                { floor: "1F", rooms: ["생활관 사무실", "편의점", "복사기"] }
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Dormitory Office", "Convenience Store", "Copier"] }
            ],
        },
    },

    // 12. 새롬터 / Saeromteo
    새롬터: {
        alias: "한신공원",
        ko: {
            floors: [
                { floor: "2F", rooms: ["카페"] }
            ],
        },
        en: {
            floors: [
                { floor: "2F", rooms: ["Cafe"] }
            ],
        },
    },

    // 13. 해오름관 / Haeoreum Hall
    해오름관: {
        alias: "17관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["보건소", "우체국", "교수실", "여학생휴게실", "ATM(우체국, 하나)"], },
                { floor: "2F", rooms: ["강의실", "실습실"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Health Center", "Post Office", "Faculty Office", "Female Student Lounge", "ATM (Post Office, Hana)"], },
                { floor: "2F", rooms: ["Lecture Room", "Practice Room"] },
            ],
        },
    },

    // 14. 장준하통일관 / Jangjunha Unification Hall
    장준하통일관: {
        alias: "18관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["식당(현재 라운지로 공사중)", "편의점", "카페", "복사기", "강의실", "휴게실"], },
                { floor: "2F", rooms: ["학생회실", "강의실", "실습실", "외래교수휴게실", "연구원실(5층으로 이동 예정)"], },
                { floor: "3F", rooms: ["교수실", "강의실", "교수실", "실습실", "전산시스템실", "정보시스템팀"], },
                { floor: "4F", rooms: ["교수실", "강의실", "실험실습실", "대학행정팀(이공계, AI·SW)", "소프트웨어중심대학 사업단 사무실"], },
                { floor: "5F", rooms: ["교수실", "강의실", "실습실", "산업협력단(이동 예정)", "스마트창작실"], },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Cafeteria (Currently under construction as a lounge)", "Convenience Store", "Cafe", "Copier", "Lecture Room", "Lounge"], },
                { floor: "2F", rooms: ["Student Council Room", "Lecture Room", "Practice Room", "Visiting Faculty Lounge", "Researcher's Office (Planned relocation to 5F)"], },
                { floor: "3F", rooms: ["Faculty Office", "Lecture Room", "Faculty Office", "Practice Room", "Computer System Room", "Information Systems Team"], },
                { floor: "4F", rooms: ["Faculty Office", "Lecture Room", "Experiment and Practice Lab", "University Administration Team (Engineering, AI/SW)", "SW-oriented University Project Office"], },
                { floor: "5F", rooms: ["Faculty Office", "Lecture Room", "Practice Room", "Industry-Academic Cooperation Team (Planned relocation)", "Smart Creation Room"], },
            ],
        },
    },

    // 15. 늦봄관 / Neutbom Hall
    늦봄관: {
        alias: "20관",
        ko: {
            floors: [
                { floor: "1F", rooms: ["다목절실 / 늦봄스튜디오"] },
                { floor: "3F", rooms: ["강의실", "이러닝센터"] },
                { floor: "4F", rooms: ["강의실", "세미나실", "평생교육원", "복사기"] },
                { floor: "5F", rooms: ["강의실", "세미나실", "기록정보관"] },
            ],
        },
        en: {
            floors: [
                { floor: "1F", rooms: ["Multi-Purpose Room / Neutbom Studio"] },
                { floor: "3F", rooms: ["Lecture Room", "e-Learning Center"] },
                { floor: "4F", rooms: ["Lecture Room", "Seminar Room", "Continuing Education Center", "Copier"] },
                { floor: "5F", rooms: ["Lecture Room", "Seminar Room", "Archives and Records Center"] },
            ],
        },
    },
};

// 헬퍼 (언어 우선 정규화 반환)
/**
 * name에 해당하는 건물 상세를 반환합니다.
 * 반환 형식: { alias: string|null, floors: Array|null, raw: originalObject }
 * lang 우선순위: raw[lang] -> raw.floors -> raw.ko -> raw.en
 */
export function getBuildingDetail(name, lang = "ko") {
    const raw = BUILDING_DETAILS[name];
    if (!raw) return null;

    const floors = (raw && (
        (raw[lang] && raw[lang].floors) ||
        raw.floors ||
        (raw.ko && raw.ko.floors) ||
        (raw.en && raw.en.floors) ||
        null
    ));

    const alias = (raw && (
        (raw[lang] && raw[lang].alias) ||
        raw.alias ||
        (raw.ko && raw.ko.alias) ||
        (raw.en && raw.en.alias) ||
        null
    ));

        let finalAlias = alias || null;
        // simple english fallback: if requested lang is 'en' and alias looks like '숫자관' (e.g. '1관'), convert to 'Building N'
        if (lang === "en" && finalAlias) {
            const m = finalAlias.match(/^\s*(\d+)\s*관\s*$/);
            if (m) {
                finalAlias = `Building ${m[1]}`;
            }
        }

        return { alias: finalAlias, floors: floors || null, raw };
}