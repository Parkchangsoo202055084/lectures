// FILE: src/data/ClubDetail.jsx

import { CLUB_LINKS, CLUB_NAME_TO_ID } from "./clubDetailData";
import { clubDetailTexts } from "../utils/texts/clubDetailTexts";

export function extLink(url, text) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#401e83" }}>
      {text}
    </a>
  );
}

// 동아리 데이터를 언어와 동아리명으로 가져오는 헬퍼 함수
export function getClubDetail(clubName, lang = "ko") {
  const clubId = CLUB_NAME_TO_ID[clubName];
  if (!clubId) return null;
  
  const textData = clubDetailTexts[lang][clubId];
  const links = CLUB_LINKS[clubId] || {};
  
  return {
    name: textData.name,
    desc: textData.desc,
    custom: renderClubContent(textData.content, links, lang)
  };
}

// 컨텐츠와 링크를 렌더링하는 함수
function renderClubContent(content, links, lang) {
  return (
    <div style={{ whiteSpace: "pre-line" }}>
      {content}
      {Object.keys(links).length > 0 && (
        <div style={{ marginTop: 10 }}>
          {links.youtube && (
            <div>
              {lang === "ko" ? "유튜브" : "YouTube"}: {extLink(links.youtube, links.youtube)}
            </div>
          )}
          {links.instagram && (
            <div>
              {lang === "ko" ? "인스타" : "Instagram"}: {extLink(links.instagram, links.instagram)}
            </div>
          )}
          {links.linktree && (
            <div>
              Linktree: {extLink(links.linktree, links.linktree)}
            </div>
          )}
          {links.kakao && (
            <div>
              {lang === "ko" ? "오픈채팅방" : "Open Chat"}: {extLink(links.kakao, links.kakao)}
            </div>
          )}
          {links.littly && (
            <div>
              Litt.ly: {extLink(links.littly, links.littly)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 기존 CLUB_TEXTS 호환성을 위한 함수
export function getCLUB_TEXTS(lang = "ko") {
  const result = {};
  const categories = lang === "ko" 
    ? ["공연", "전시", "학술", "운동", "종교", "봉사"]
    : ["Performance", "Exhibition", "Academic", "Sports", "Religion", "Service"];
  
  const categoryMap = {
    ko: {
      "공연": "공연",
      "전시": "전시",
      "학술": "학술",
      "운동": "운동",
      "종교": "종교",
      "봉사": "봉사"
    },
    en: {
      "Performance": "공연",
      "Exhibition": "전시",
      "Academic": "학술",
      "Sports": "운동",
      "Religion": "종교",
      "Service": "봉사"
    }
  };
  
  categories.forEach(category => {
    const koreanCategory = categoryMap[lang][category];
    result[category] = [];
    
    // 각 카테고리에 속한 동아리 찾기
    Object.entries(clubDetailTexts[lang]).forEach(([clubId, clubData]) => {
      // 카테고리별로 동아리를 분류 (간단한 로직)
      const clubName = clubData.name;
      const links = CLUB_LINKS[clubId] || {};
      
      result[category].push({
        name: clubName,
        desc: clubData.desc,
        custom: renderClubContent(clubData.content, links, lang)
      });
    });
  });
  
  return result;
}

// 카테고리별 동아리 ID 매핑 (정확한 분류)
const CATEGORY_CLUBS = {
  공연: ["soriari", "metropolis", "muse", "fader", "dio", "borasung", "ilgwanori", "asterism"],
  전시: ["mongdang", "wewear", "nokyeon", "minal", "crimescene"],
  학술: ["ssoa", "adsun", "peacenabi"],
  운동: ["bisang", "gibaek", "apex", "gangster", "killerwhales", "smashit", "theflight"],
  종교: ["ccc", "ivf"],
  봉사: ["rotaract"]
};

// 개선된 버전: 카테고리별로 정확하게 분류
export function getCLUB_TEXTS_BY_CATEGORY(lang = "ko") {
  const categoryNames = {
    ko: {
      공연: "공연",
      전시: "전시",
      학술: "학술",
      운동: "운동",
      종교: "종교",
      봉사: "봉사"
    },
    en: {
      공연: "Performance",
      전시: "Exhibition",
      학술: "Academic",
      운동: "Sports",
      종교: "Religion",
      봉사: "Service"
    }
  };
  
  const result = {};
  
  Object.entries(CATEGORY_CLUBS).forEach(([koCategory, clubIds]) => {
    const categoryName = categoryNames[lang][koCategory];
    result[categoryName] = clubIds.map(clubId => {
      const textData = clubDetailTexts[lang][clubId];
      const links = CLUB_LINKS[clubId] || {};
      
      return {
        name: textData.name,
        desc: textData.desc,
        custom: renderClubContent(textData.content, links, lang)
      };
    });
  });
  
  return result;
}

// 기존 CLUB_TEXTS export (하위 호환성)
export const CLUB_TEXTS = {
  ko: getCLUB_TEXTS_BY_CATEGORY("ko"),
  en: getCLUB_TEXTS_BY_CATEGORY("en")
};