// FILE: src/components/ClubHub.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { CLUB_TEXTS } from "../data/ClubDetail";

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

const CATEGORY_MAP = {
  ko: ["공연", "전시", "학술", "운동", "종교", "봉사"],
  en: ["Performance", "Exhibition", "Academic", "Sports", "Religion", "Service"],
};

// PC용 팝업 (오른쪽 고정)
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
                width: 380,
                minHeight: 120, 
                padding: 20,
                background: "rgba(255,255,255,0.90)",
                border: "1px solid #ddd", 
                borderRadius: 12, 
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                backdropFilter: "blur(4px)",
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

// 모바일용 하단 팝업
const MobileClubPopup = ({ club, onClose }) => {
    if (!club) return null;

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.3)",
                    zIndex: 999,
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: "fixed",
                    bottom: "60px",
                    left: 0,
                    right: 0,
                    background: "white",
                    borderRadius: "20px 20px 0 0",
                    boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
                    height: "35vh",
                    zIndex: 1001,
                    display: "flex",
                    flexDirection: "column",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ 
                    width: "40px", 
                    height: "4px", 
                    background: "#ddd", 
                    borderRadius: "2px", 
                    margin: "8px auto 0",
                    flexShrink: 0,
                }} />
                
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid #eee",
                    flexShrink: 0,
                }}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>{club.name}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "#666",
                            padding: 0,
                            width: "32px",
                            height: "32px",
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{
                    padding: "20px",
                    overflowY: "auto",
                    flex: 1,
                    WebkitOverflowScrolling: "touch",
                }}>
                    {club.desc && (
                        <p style={{ 
                            margin: "0 0 12px 0", 
                            fontSize: 14, 
                            color: "#555",
                            whiteSpace: "pre-wrap",
                        }}>
                            {club.desc}
                        </p>
                    )}
                    <div style={{ 
                        fontSize: 14,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}>
                        {club.custom}
                    </div>
                </div>
            </div>
        </>
    );
};

// 모바일용 카테고리 메뉴 (작은 드롭다운)
const MobileCategoryMenu = ({ categories, activeCategory, setActiveCategory, onClose, suffix, buttonRef }) => {
    const [position, setPosition] = useState({ top: 0, right: 0 });

    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                right: window.innerWidth - rect.right,
            });
        }
    }, [buttonRef]);

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "transparent",
                    zIndex: 998,
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: "fixed",
                    top: `${position.top}px`,
                    right: `${position.right}px`,
                    background: "white",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 999,
                    overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                onClose();
                            }}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px 16px",
                                border: "none",
                                background: isActive ? "#401e83" : "white",
                                color: isActive ? "white" : "#333",
                                cursor: "pointer",
                                fontSize: "14px",
                                textAlign: "left",
                                borderBottom: "1px solid #f0f0f0",
                            }}
                        >
                            {cat} {suffix}
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default function ClubHub({ texts = {}, lang = "ko", initialClub = null }) {
  const categories = CATEGORY_MAP[lang]; 
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedClub, setSelectedClub] = useState(initialClub);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const clubListRef = useRef(null);
  const hamburgerRef = useRef(null); 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      
      {/* 배경 이미지 */}
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

      {/* 내용 컨테이너 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 제목 + 모바일 햄버거 메뉴 */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          margin: "6px 0 16px" 
        }}>
          <h2 style={{ margin: 0 }}>
            {clubTexts.centralClub?.title || (lang === "ko" ? "중앙 동아리" : "Central Clubs")}
          </h2>
          
          {isMobile && (
            <button
              ref={hamburgerRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsCategoryMenuOpen(true);
              }}
              style={{
                background: "#401e83",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>☰</span>
              <span style={{ fontSize: "14px" }}>
                {activeCategory} {clubTexts.categorySuffix || (lang === "ko" ? "분과" : "")}
              </span>
            </button>
          )}
        </div>

        {/* PC: 카테고리 탭 */}
        {!isMobile && (
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
        )}

        {/* 동아리 리스트 */}
        <div
          ref={clubListRef}
          style={{
            width: "100%",
            maxWidth: isMobile ? "100%" : 460,
            background: isMobile ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)",
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
      
      {/* PC: 오른쪽 팝업 */}
      {!isMobile && selectedClub && <ClubPopup club={selectedClub} />}
      
      {/* 모바일: 하단 팝업 */}
      {isMobile && selectedClub && (
        <MobileClubPopup 
          club={selectedClub} 
          onClose={() => setSelectedClub(null)} 
        />
      )}

      {/* 모바일: 카테고리 메뉴 */}
      {isMobile && isCategoryMenuOpen && (
        <MobileCategoryMenu
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onClose={() => setIsCategoryMenuOpen(false)}
          suffix={clubTexts.categorySuffix || (lang === "ko" ? "분과" : "")}
          buttonRef={hamburgerRef}
        />
      )}
      
    </div>
  );
}