// FILE: src/utils/searchIndex.js

import { texts } from "./texts";
import { BUILDING_DETAILS } from "../data/buildingDetails";
import { levenshteinDistance } from "./levenshtein";

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
  const navigationIndex = new Map(); // 네비게이션 항목용 인덱스 추가

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
        // 영어 카테고리를 한국어로 변환
        const koreanCategory = CATEGORY_MAPPING[originalCategory] || originalCategory;
        
        console.log(`카테고리 매핑: ${originalCategory} -> ${koreanCategory}`);
        
        if (Array.isArray(node.children)) {
          node.children.forEach((leaf) => {
            facilityIndex.set(norm(leaf), { // 편의시설은 괄호 유지
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
    const busInfo = texts[lang].busInfo;
    Object.keys(busInfo).forEach((key) => {
      if (key !== 'notSelected' && key !== 'notReady' && key !== 'imageAlt' && busInfo[key].title) {
        // 키로만 검색 가능하게 (중복 방지)
        navigationIndex.set(norm(key), {
          type: "navigation",
          tab: "bus",
          item: key,
          title: busInfo[key].title
        });
      }
    });

    // 도움 정보 추가 (장학금, 상담센터 등)
    const assistDetails = texts[lang].assistDetails;
    Object.keys(assistDetails).forEach((key) => {
      if (key !== 'notSelected' && key !== 'notReady' && assistDetails[key].title) {
        // 키로만 검색 가능하게 (중복 방지)
        navigationIndex.set(norm(key), {
          type: "navigation",
          tab: "assist", 
          item: key,
          title: assistDetails[key].title
        });
      }
    });

    // 학사일정, OT 안내 추가
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

    // 동아리 관련 추가
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
  };

  // 한국어 먼저 처리하여 한국어 카테고리가 우선되도록
  handleLangData("ko");
  handleLangData("en");

  console.log('facilityIndex 내용:', Array.from(facilityIndex.entries()));
  console.log('navigationIndex 내용:', Array.from(navigationIndex.entries()));

  // 반환 객체에 검색 메소드를 추가합니다.
  return {
    buildingIndex,
    facilityIndex,
    navigationIndex,
    search: (query) => searchIndex({ buildingIndex, facilityIndex, navigationIndex }, query),
  };
}

// 검색 실행 (hit 반환)
export function searchIndex({ buildingIndex, facilityIndex, navigationIndex }, query) {
  const q = norm(query); // 편의시설용 정규화 (괄호 유지)
  const qBuilding = normBuilding(query); // 건물용 정규화 (괄호 제거)
  
  if (!q && !qBuilding) return null;

  // 1. 완전 일치 검색 - 순서: 건물 -> 편의시설 -> 네비게이션
  let hit = buildingIndex.get(qBuilding) || facilityIndex.get(q) || navigationIndex.get(q);
  if (hit) {
    console.log('완전 일치 검색 결과:', hit);
    return hit;
  }

  let bestHit = null;
  let minDistance = Infinity;
  const maxDistance = 3; // 허용 가능한 최대 오타 수 (조절 가능)

  // 2. Levenshtein 거리 기반 유사성 검색
  // 건물 검색 (괄호 제거된 쿼리로)
  for (const [key, value] of buildingIndex) {
    const distance = levenshteinDistance(qBuilding, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 편의시설 검색 (괄호 유지된 쿼리로)
  for (const [key, value] of facilityIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  // 네비게이션 검색 (괄호 유지된 쿼리로)
  for (const [key, value] of navigationIndex) {
    const distance = levenshteinDistance(q, key);
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      bestHit = value;
    }
  }

  if (bestHit) {
    console.log('유사성 검색 결과:', bestHit);
  }

  return bestHit;
}