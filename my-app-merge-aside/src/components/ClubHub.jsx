// FILE: src/components/ClubHub.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { CLUB_TEXTS } from "./ClubDetail";

import 공연 from "../images/공연분과.png";
import 학술 from "../images/학술분과.png";
import 운동 from "../images/운동분과.png";
import 종교 from "../images/종교분과.png";
import 봉사 from "../images/봉사분과.png";
import 전시 from "../images/전시분과.png";

const CATEGORY_IMAGES = {
  공연,
  전시,
  학술,
  운동,
  종교,
  봉사,
};

// 팝업 컴포넌트: 오른쪽 콘텐츠 위치에 고정 (2열 오른쪽)
const ClubPopup = ({ club }) => {
    if (!club) return null;

    const listWidth = 460; 
    const gap = 24; 
    const fixedTop = 94;

    return (
        <div
            style={{
                position: "absolute",
                left: `${listWidth + gap}px`,
                top: fixedTop, 
                zIndex: 10,
                // 이미지에 보이는 팝업 너비에 가깝게 조정
                width: 380, // 너비를 명확히 지정하여 이미지와 유사하게
                minHeight: 120, 
                padding: 20,
                // 팝업 자체만 반투명 배경
                background: "rgba(255,255,255,0.90)",
                border: "1px solid #ddd", 
                borderRadius: 12, 
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                backdropFilter: "blur(4px)", // 팝업 뒤 배경 블러 효과
            }}
            onClick={(e) => e.stopPropagation()} 
        >
            <h3 style={{ margin: "0 0 4px 0" }}>{club.name}</h3>
            <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#555" }}>
                {club.desc}
            </p>
            <div>{club.custom}</div> 
        </div>
    );
};

const CATEGORY_MAP = {
  ko: ["공연", "전시", "학술", "운동", "종교", "봉사"],
  en: ["Performance", "Exhibition", "Academic", "Sports", "Religion", "Service"],
};

export default function ClubHub({ texts = {}, lang = "ko", initialClub = null }) {
  const categories = CATEGORY_MAP[lang]; 
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedClub, setSelectedClub] = useState(initialClub);
  const clubListRef = useRef(null); 

  useEffect(() => {
    if (initialClub) {
      setSelectedClub(initialClub);
    }
  }, [initialClub]);

  const clubs = useMemo(
    () => CLUB_TEXTS[lang]?.[activeCategory] || [],
    [lang, activeCategory]
  );
  
  const handleClosePopup = (e) => {
    if (selectedClub && clubListRef.current && !clubListRef.current.contains(e.target)) {
        setSelectedClub(null);
    }
  };

  const koCategory = lang === "ko" ? activeCategory : CATEGORY_MAP.ko[CATEGORY_MAP.en.indexOf(activeCategory)];
  const bgUrl = CATEGORY_IMAGES[koCategory];

  const clubTexts = texts?.clubDetails || {}; 

  return (
    <div 
        style={{ position: "relative", minHeight: "72vh" }} 
        onClick={handleClosePopup}
    >
      
      {/* 배경 이미지: 전체를 덮습니다. (팝업 뒤로 비쳐 보임) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgUrl || ""})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          filter: "saturate(0.95)",
          transform: "translateZ(0)",
        }}
      />

      {/* ⚠️ 팝업이 활성화될 때 오른쪽 배경을 덮는 오버레이는 제거했습니다. */}
      {/* 이제 배경 이미지는 팝업 뒤에서 그대로 비쳐 보일 것입니다. */}

      {/* 내용 컨테이너 (1열 Full-Width 탭과 2열 왼쪽 리스트 포함) */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ margin: "6px 0 16px" }}>
          {clubTexts.centralClub?.title || (lang === "ko" ? "중앙 동아리" : "Central Clubs")}
        </h2>

        {/* 1열 상단 네비 영역 (분과 탭) - Full Width 유지 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveCategory(cat);
                    setSelectedClub(null);
                }}
                style={{
                  border: `1px solid ${isActive ? "#401e83" : "#ddd"}`,
                  background: isActive ? "#401e83" : "#fff",
                  color: isActive ? "#fff" : "#333",
                  padding: "6px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                  boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {cat} {clubTexts.categorySuffix || (lang === "ko" ? "분과" : "")}
              </button>
            );
          })}
        </div>

        {/* 2열 왼쪽 영역 (동아리 리스트) - maxWidth 460으로 제한 */}
        <div
          ref={clubListRef}
          style={{
            width: "100%",
            maxWidth: 460,
            // 사용자 요청: 리스트 영역의 반투명 배경 유지
            background: "rgba(255,255,255,0.15)",
            border: "1px solid #eee",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            backdropFilter: "blur(1px)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 12 }}>
            {clubs.map((club) => (
              <li key={club.name} style={{ padding: "10px 8px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClub(club);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: 15,
                    color: "#2b2b2b",
                  }}
                >
                  {club.name}
                  {club.desc && (
                    <div style={{ fontSize: 12, color: "#7a7a7a" }}>
                      {club.desc}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 2열 오른쪽 영역 (팝업) */}
      {selectedClub && <ClubPopup club={selectedClub} />}
      
    </div>
  );
}