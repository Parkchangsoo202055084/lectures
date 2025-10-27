// FILE: src/utils/searchIndex.js

import { texts } from "./texts";
import { BUILDING_DETAILS } from "../data/buildingDetails";
import { levenshteinDistance } from "./levenshtein";
import { CLUBS_BY_CATEGORY } from "../data/clubData";
import eventsData from "../data/eventsData";
import { calendarEventTitles } from "./texts/calendarEventTitles";

// ==================== 상수 정의 ====================

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

// 검색어 길이에 따른 허용 오타 거리
const DISTANCE_THRESHOLD = [
  { maxLength: 2, distance: 0 },  // 2글자 이하: 완전 일치만
  { maxLength: 4, distance: 1 },  // 3-4글자: 오타 1개
  { maxLength: 6, distance: 2 },  // 5-6글자: 오타 2개
  { maxLength: Infinity, distance: 3 }  // 7글자 이상: 오타 3개
];

// ==================== 정규화 함수 ====================

export const norm = (s = "") =>
  s.toString().toLowerCase().replace(/\s+/g, "");

export const normBuilding = (s = "") =>
  s.toString().toLowerCase().replace(/\s+/g, "").replace(/\(.*?\)/g, "");

// ==================== 인덱스 생성 ====================

export function makeSearchIndex() {
  const indices = {
    buildingIndex: new Map(),
    facilityIndex: new Map(),
    navigationIndex: new Map(),
    clubIndex: new Map(),
    calendarIndex: new Map()
  };

  // 한국어 먼저 처리하여 한국어 우선순위 확보
  indexLanguage("ko", indices);
  indexLanguage("en", indices);

  logIndexSamples(indices);

  return {
    ...indices,
    search: (query) => searchIndex(indices, query)
  };
}

// 언어별 인덱싱
function indexLanguage(lang, indices) {
  const asideMap = texts[lang].aside.map;
  
  indexBuildings(asideMap.collapsible[0].items, indices.buildingIndex);
  indexFacilities(asideMap.collapsible[1], indices.facilityIndex);
  
  // 한국어만 인덱싱
  if (lang === "ko") {
    indexBusInfo(indices.navigationIndex);
    indexAssistInfo(indices.navigationIndex);
    indexBasicNavigation(indices.navigationIndex);
    indexClubs(indices.clubIndex);
  }
  
  indexNewBSection(lang, indices.navigationIndex);
  indexCalendarEvents(lang, indices.calendarIndex);
}

// 건물 인덱싱
function indexBuildings(buildings, index) {
  buildings.forEach((name) => {
    index.set(normBuilding(name), { type: "building", name });
    
    const alias = BUILDING_DETAILS[name]?.alias;
    if (alias) {
      index.set(normBuilding(alias), { type: "building", name });
    }
  });
}

// 편의시설 인덱싱
function indexFacilities(facilitySection, index) {
  facilitySection.items.forEach((node) => {
    if (typeof node !== "object") return;
    
    const originalCategory = node.label;
    const koreanCategory = CATEGORY_MAPPING[originalCategory] || originalCategory;
    
    // 카테고리 자체 등록
    index.set(norm(originalCategory), {
      type: "facility",
      category: koreanCategory,
      item: originalCategory
    });
    
    // 하위 항목 등록
    if (Array.isArray(node.children)) {
      node.children.forEach((leaf) => {
        index.set(norm(leaf), {
          type: "facility",
          category: koreanCategory,
          item: leaf
        });
      });
    }
  });
}

// 버스 정보 인덱싱
function indexBusInfo(index) {
  const busInfo = texts.ko.busInfo;
  const excludeKeys = ['notSelected', 'notReady', 'imageAlt'];
  
  Object.entries(busInfo).forEach(([key, value]) => {
    if (excludeKeys.includes(key) || !value.title) return;
    
    const navItem = {
      type: "navigation",
      tab: "bus",
      item: key,
      title: value.title
    };
    
    index.set(norm(value.title), navItem);
    index.set(norm(key), navItem);
  });
}

// 도움 정보 인덱싱
function indexAssistInfo(index) {
  const assistDetails = texts.ko.assistDetails;
  const excludeKeys = ['notSelected', 'notReady'];
  
  Object.entries(assistDetails).forEach(([key, value]) => {
    if (excludeKeys.includes(key) || !value.title) return;
    
    const navItem = {
      type: "navigation",
      tab: "assist",
      item: key,
      title: value.title
    };
    
    index.set(norm(value.title), navItem);
    index.set(norm(key), navItem);
  });
}

// 기본 네비게이션 항목 인덱싱
function indexBasicNavigation(index) {
  const items = [
    { key: "중앙동아리", tab: "club", title: texts.ko.aside.club.items[0] },
    { key: "동아리 가입방법", tab: "club", title: texts.ko.aside.club.items[1] }
  ];
  
  items.forEach(({ key, tab, title }) => {
    index.set(norm(key), { type: "navigation", tab, item: title, title });
  });
}

// newB 섹션 인덱싱
function indexNewBSection(lang, index) {
  const newB = texts[lang].aside.newB;
  if (!newB?.collapsible) return;
  
  newB.collapsible.forEach((section) => {
    if (!Array.isArray(section.items)) return;
    
    section.items.forEach((item) => {
      if (typeof item === "string") {
        index.set(norm(item), {
          type: "navigation",
          tab: "newB",
          item,
          title: item
        });
      }
    });
  });
}

// 동아리 인덱싱
function indexClubs(index) {
  Object.entries(CLUBS_BY_CATEGORY).forEach(([category, clubs]) => {
    clubs.forEach((club) => {
      index.set(norm(club.name), {
        type: "club",
        name: club.name,
        desc: club.desc,
        category
      });
    });
  });
}

// 학사일정 인덱싱
function indexCalendarEvents(lang, index) {
  eventsData.forEach((event) => {
    const title = calendarEventTitles[lang]?.[event.id];
    if (!title) return;
    
    index.set(norm(title), {
      type: "calendar",
      title,
      start: event.start,
      end: event.end,
      eventType: event.type
    });
  });
}

// ==================== 검색 실행 ====================

export function searchIndex(indices, query) {
  const q = norm(query);
  const qBuilding = normBuilding(query);
  
  if (!q && !qBuilding) return null;
  
  console.log('🔍 검색:', { query, normalized: q, building: qBuilding });
  
  // 1. 완전 일치 검색 (우선순위: 학사일정 > 동아리 > 네비게이션 > 편의시설 > 건물)
  const exactMatch = findExactMatch(indices, q, qBuilding);
  if (exactMatch) {
    console.log('✅ 완전 일치:', exactMatch);
    return exactMatch;
  }
  
  // 2. 유사성 검색 (Levenshtein)
  const maxDistance = getMaxDistance(q.length);
  const similarMatch = findSimilarMatch(indices, q, qBuilding, maxDistance);
  if (similarMatch) {
    console.log('✅ 유사 검색:', similarMatch);
    return similarMatch;
  }
  
  // 3. 부분 일치 검색
  const partialMatch = findPartialMatch(indices, q, qBuilding);
  if (partialMatch) {
    console.log('✅ 부분 일치:', partialMatch);
    return partialMatch;
  }
  
  console.log('❌ 검색 결과 없음');
  return null;
}

// 완전 일치 검색
function findExactMatch(indices, q, qBuilding) {
  const { calendarIndex, clubIndex, navigationIndex, facilityIndex, buildingIndex } = indices;
  
  return (
    calendarIndex.get(q) ||
    clubIndex.get(q) ||
    navigationIndex.get(q) ||
    facilityIndex.get(q) ||
    buildingIndex.get(qBuilding)
  );
}

// 검색어 길이에 따른 최대 허용 거리
function getMaxDistance(queryLength) {
  const threshold = DISTANCE_THRESHOLD.find(t => queryLength <= t.maxLength);
  const distance = threshold.distance;
  
  console.log(`🎯 검색어 길이: ${queryLength}, 허용 오타: ${distance}`);
  return distance;
}

// 유사성 검색
function findSimilarMatch(indices, q, qBuilding, maxDistance) {
  let bestHit = null;
  let minDistance = Infinity;
  
  const indexOrder = [
    { index: indices.calendarIndex, queryKey: q },
    { index: indices.clubIndex, queryKey: q },
    { index: indices.navigationIndex, queryKey: q },
    { index: indices.facilityIndex, queryKey: q },
    { index: indices.buildingIndex, queryKey: qBuilding }
  ];
  
  for (const { index, queryKey } of indexOrder) {
    const result = findClosestMatch(index, queryKey, maxDistance, minDistance);
    if (result.distance < minDistance) {
      minDistance = result.distance;
      bestHit = result.value;
    }
  }
  
  return bestHit;
}

// 인덱스에서 가장 가까운 매치 찾기
function findClosestMatch(index, query, maxDistance, currentMin) {
  let minDistance = currentMin;
  let bestValue = null;
  
  for (const [key, value] of index) {
    const distance = levenshteinDistance(query, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestValue = value;
    }
  }
  
  return { distance: minDistance, value: bestValue };
}

// 부분 일치 검색
function findPartialMatch(indices, q, qBuilding) {
  const indexOrder = [
    { index: indices.calendarIndex, queryKey: q, name: '학사일정' },
    { index: indices.clubIndex, queryKey: q, name: '동아리' },
    { index: indices.navigationIndex, queryKey: q, name: '네비게이션' },
    { index: indices.facilityIndex, queryKey: q, name: '편의시설' },
    { index: indices.buildingIndex, queryKey: qBuilding, name: '건물' }
  ];
  
  for (const { index, queryKey, name } of indexOrder) {
    for (const [key, value] of index) {
      if (key.includes(queryKey) || queryKey.includes(key)) {
        console.log(`🔍 ${name} 부분 일치:`, key, '←', queryKey);
        return value;
      }
    }
  }
  
  return null;
}

// ==================== 디버깅 로그 ====================

function logIndexSamples(indices) {
  console.log('📚 facilityIndex:', Array.from(indices.facilityIndex.entries()).slice(0, 5));
  
  const busRelated = Array.from(indices.navigationIndex.entries())
    .filter(([key]) => ['수원', '셔틀', '버스', '155'].some(term => key.includes(term)));
  console.log('🚌 navigationIndex (버스):', busRelated);
  
  console.log('🎭 clubIndex:', Array.from(indices.clubIndex.entries()).slice(0, 10));
  console.log('📅 calendarIndex:', Array.from(indices.calendarIndex.entries()).slice(0, 10));
}