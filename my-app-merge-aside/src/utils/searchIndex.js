// FILE: src/utils/searchIndex.js

import { texts } from "./texts";
import { BUILDING_DETAILS } from "../data/buildingDetails";
import { levenshteinDistance } from "./levenshtein";
import { CLUBS_BY_CATEGORY } from "../data/clubData";
import eventsData from "../data/eventsData";

// 문자열 정규화 - 편의시설은 괄호 유지
export const norm = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "");

// 건물명용 정규화 (괄호 제거)
export const normBuilding = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\(.*?\)/g, "");

// 영어 카테고리를 한국어로 매핑
const CATEGORY_MAPPING = {
  "Convenience Store": "편의점",
  "Restaurant": "식당",
  "Cafe": "카페",
  "Parking": "주차장",
  "Bank/ATM": "은행/ATM",
  "Post Office": "우체국",
  "Hospital/Pharmacy": "병원/약국",
  "Bookstore/Stationery": "서점/문구"
};

// 인덱스 생성 (App 마운트 시 1회만)
export function makeSearchIndex() {
  const buildingIndex = new Map();
  const facilityIndex = new Map();
  const navigationIndex = new Map();
  const clubIndex = new Map();
  const calendarIndex = new Map(); // 학사일정 인덱스 추가

  const handleLangData = (lang) => {
    const asideMap = texts[lang].aside.map;
    
    // 건물 - 괄호 제거한 버전으로 정규화
    const buildings = asideMap.collapsible[0].items;
    buildings.forEach((name) => {
      buildingIndex.set(normBuilding(name), { type: "building", name });
      if (BUILDING_DETAILS[name]?.alias) {
        buildingIndex.set(normBuilding(BUILDING_DETAILS[name].alias), { type: "building", name });
      }
    });

    // 편의시설 - 괄호 유지한 버전으로 정규화
    const facilitySection = asideMap.collapsible[1];
    facilitySection.items.forEach((node) => {
      if (typeof node === "object") {
        const originalCategory = node.label;
        const koreanCategory = CATEGORY_MAPPING[originalCategory] || originalCategory;
        
        console.log(`카테고리 매핑: ${originalCategory} -> ${koreanCategory}`);
        
        if (Array.isArray(node.children)) {
          node.children.forEach((leaf) => {
            facilityIndex.set(norm(leaf), {
              type: "facility",
              category: koreanCategory,
              item: leaf,
            });
          });
        }
        facilityIndex.set(norm(originalCategory), {
          type: "facility",
          category: koreanCategory,
          item: originalCategory,
        });
      }
    });

    // 네비게이션 항목 추가 (버스 정보, 학사일정 등)
    // 한국어만 등록 (영어는 검색 대상에서 제외)
    if (lang === "ko") {
      const busInfo = texts[lang].busInfo;
      Object.keys(busInfo).forEach((key) => {
        if (key !== 'notSelected' && key !== 'notReady' && key !== 'imageAlt' && busInfo[key].title) {
          // title로 검색 가능하게
          navigationIndex.set(norm(busInfo[key].title), {
            type: "navigation",
            tab: "bus",
            item: key,
            title: busInfo[key].title
          });
          // key로도 검색 가능하게
          navigationIndex.set(norm(key), {
            type: "navigation",
            tab: "bus",
            item: key,
            title: busInfo[key].title
          });
        }
      });
    }

    // 도움 정보 추가 (장학금, 상담센터 등)
    // 한국어만 등록
    if (lang === "ko") {
      const assistDetails = texts[lang].assistDetails;
      Object.keys(assistDetails).forEach((key) => {
        if (key !== 'notSelected' && key !== 'notReady' && assistDetails[key].title) {
          // title로 검색 가능하게
          navigationIndex.set(norm(assistDetails[key].title), {
            type: "navigation",
            tab: "assist", 
            item: key,
            title: assistDetails[key].title
          });
          // key로도 검색 가능하게
          navigationIndex.set(norm(key), {
            type: "navigation",
            tab: "assist", 
            item: key,
            title: assistDetails[key].title
          });
        }
      });
    }

    // 학사일정, OT 안내 추가
    if (lang === "ko") {
      navigationIndex.set(norm("학사일정"), {
        type: "navigation",
        tab: "newB",
        item: "학사일정",
        title: "학사일정"
      });

      navigationIndex.set(norm("OT 안내"), {
        type: "navigation", 
        tab: "newB",
        item: "OT 안내",
        title: "OT 안내"
      });

      navigationIndex.set(norm("OT안내"), {
        type: "navigation", 
        tab: "newB",
        item: "OT 안내",
        title: "OT 안내"
      });
    }

    // 영어 학사일정, OT 안내 추가
    if (lang === "en") {
      navigationIndex.set(norm("Academic Calendar"), {
        type: "navigation",
        tab: "newB",
        item: "Academic Calendar",
        title: "Academic Calendar"
      });

      navigationIndex.set(norm("OT Guide"), {
        type: "navigation", 
        tab: "newB",
        item: "OT Guide",
        title: "OT Guide"
      });
    }

    // 동아리 관련 추가
    if (lang === "ko") {
      // 동아리 카테고리
      navigationIndex.set(norm("중앙동아리"), {
        type: "navigation",
        tab: "club",
        item: texts[lang].aside.club.items[0],
        title: "중앙동아리"
      });

      navigationIndex.set(norm("동아리 가입방법"), {
        type: "navigation",
        tab: "club", 
        item: texts[lang].aside.club.items[1],
        title: "동아리 가입방법"
      });

      navigationIndex.set(norm("동아리가입방법"), {
        type: "navigation",
        tab: "club", 
        item: texts[lang].aside.club.items[1],
        title: "동아리 가입방법"
      });

      // 개별 동아리 등록
      Object.entries(CLUBS_BY_CATEGORY).forEach(([category, clubs]) => {
        clubs.forEach((club) => {
          const clubKey = norm(club.name);
          clubIndex.set(clubKey, {
            type: "club",
            name: club.name,
            desc: club.desc,
            category: category,
          });
        });
      });
    }

    // 🆕 학사일정 이벤트 인덱싱
    const langEvents = eventsData[lang] || eventsData.ko;
    langEvents.forEach((event) => {
      const eventKey = norm(event.title);
      calendarIndex.set(eventKey, {
        type: "calendar",
        title: event.title,
        start: event.start,
        end: event.end,
        eventType: event.type,
      });
    });
  };

  // 한국어 먼저 처리하여 한국어 카테고리가 우선되도록
  handleLangData("ko");
  handleLangData("en");

  console.log('📚 facilityIndex 내용:', Array.from(facilityIndex.entries()).slice(0, 5));
  console.log('🚌 navigationIndex 내용 (버스 관련):');
  const busRelated = Array.from(navigationIndex.entries()).filter(([key]) => 
    key.includes('수원') || key.includes('셔틀') || key.includes('버스') || key.includes('155')
  );
  console.log(busRelated);
  console.log('🎭 clubIndex 내용:', Array.from(clubIndex.entries()).slice(0, 10));
  console.log('📅 calendarIndex 내용:', Array.from(calendarIndex.entries()).slice(0, 10));

  return {
    buildingIndex,
    facilityIndex,
    navigationIndex,
    clubIndex,
    calendarIndex,
    search: (query) => searchIndex({ buildingIndex, facilityIndex, navigationIndex, clubIndex, calendarIndex }, query),
  };
}

// 검색 실행 (hit 반환)
export function searchIndex({ buildingIndex, facilityIndex, navigationIndex, clubIndex, calendarIndex }, query) {
  const q = norm(query);
  const qBuilding = normBuilding(query);
  
  console.log('🔍 검색 쿼리:', query);
  console.log('🔍 정규화된 쿼리 (q):', q);
  console.log('🔍 정규화된 쿼리 (qBuilding):', qBuilding);
  
  if (!q && !qBuilding) return null;

  // 1. 완전 일치 검색 - 순서: 학사일정 -> 동아리 -> 네비게이션 -> 편의시설 -> 건물
  let hit = calendarIndex.get(q) || clubIndex.get(q) || navigationIndex.get(q) || facilityIndex.get(q) || buildingIndex.get(qBuilding);
  if (hit) {
    console.log('✅ 완전 일치 검색 성공:', hit);
    return hit;
  }
  
  console.log('❌ 완전 일치 검색 실패, navigationIndex 확인:');
  console.log('navigationIndex에 있는 키들:', Array.from(navigationIndex.keys()).slice(0, 10));

  let bestHit = null;
  let minDistance = Infinity;
  
  // 검색어 길이에 따라 동적으로 maxDistance 설정
  const queryLength = q.length;
  let maxDistance;
  if (queryLength <= 2) {
    maxDistance = 0; // 2글자 이하: 완전 일치만
  } else if (queryLength <= 4) {
    maxDistance = 1; // 3-4글자: 오타 1개까지
  } else if (queryLength <= 6) {
    maxDistance = 2; // 5-6글자: 오타 2개까지
  } else {
    maxDistance = 3; // 7글자 이상: 오타 3개까지
  }
  
  console.log(`🎯 검색어 길이: ${queryLength}, 허용 오타: ${maxDistance}`);

  // 2. Levenshtein 거리 기반 유사성 검색
  // 학사일정 우선 검색
  for (const [key, value] of calendarIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 동아리 검색
  for (const [key, value] of clubIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 네비게이션 검색
  for (const [key, value] of navigationIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 편의시설 검색
  for (const [key, value] of facilityIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 건물 검색
  for (const [key, value] of buildingIndex) {
    const distance = levenshteinDistance(qBuilding, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 3. 부분 일치 검색 (특히 버스 번호 등)
  if (!bestHit || minDistance > 1) { 
    // 학사일정 부분 일치 검색
    for (const [key, value] of calendarIndex) {
      if (key.includes(q) || q.includes(key)) {
        console.log('🔍 학사일정 부분 일치:', key, '←', q);
        return value;
      }
    }

    // 동아리 부분 일치 검색
    for (const [key, value] of clubIndex) {
      if (key.includes(q) || q.includes(key)) {
        console.log('🔍 동아리 부분 일치:', key, '←', q);
        return value;
      }
    }

    // 네비게이션 항목에서 부분 일치 검색
    for (const [key, value] of navigationIndex) {
      if (key.includes(q) || q.includes(key)) {
        console.log('🔍 네비게이션 부분 일치:', key, '←', q);
        return value;
      }
    }
    
    // 편의시설에서 부분 일치 검색
    for (const [key, value] of facilityIndex) {
      if (key.includes(q) || q.includes(key)) {
        console.log('🔍 편의시설 부분 일치:', key, '←', q);
        return value;
      }
    }
    
    // 건물에서 부분 일치 검색
    for (const [key, value] of buildingIndex) {
      if (key.includes(qBuilding) || qBuilding.includes(key)) {
        console.log('🔍 건물 부분 일치:', key, '←', qBuilding);
        return value;
      }
    }
  }

  if (bestHit) {
    console.log(`✅ 유사성 검색 결과 (거리: ${minDistance}):`, bestHit);
  }

  return bestHit;
}