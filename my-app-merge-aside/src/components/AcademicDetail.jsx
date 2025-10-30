// FILE: src/components/AcademicDetail.jsx

import React, { useState, useEffect, useRef } from "react";
import CalendarPage from "./CalendarPage";
import MealMenu from "./MealMenu";

// 모바일용 탭 메뉴 (햄버거 드롭다운)
const MobileTabMenu = ({ tabs, activeTab, setActiveTab, onClose, buttonRef }) => {
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
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 999,
          overflow: "hidden",
          minWidth: "180px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {tabs.map((section, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                onClose();
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: isActive ? "#401e83" : "white",
                color: isActive ? "white" : "#333",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "left",
                borderBottom: index < tabs.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              {section.title}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default function AcademicDetail({ selected, texts, lang, highlightEvent }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 마크다운 링크를 HTML 링크로 변환하는 함수
  const renderTextWithLinks = (text) => {
    if (typeof text !== 'string') return text;
    
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // 링크 앞의 텍스트
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // 링크
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: "#4285f4", 
            textDecoration: "underline",
            cursor: "pointer"
          }}
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    // 남은 텍스트
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  if (!selected) {
    return null;
  }

  // 학사일정은 CalendarPage 컴포넌트 사용
  if (selected === "학사일정" || selected === "Academic Calendar") {
    return <CalendarPage texts={texts.calendarPage} lang={lang} highlightEvent={highlightEvent} />;
  }

  // 나머지는 newB에서 데이터 가져오기
  const data = texts.newB[selected];

  if (!data) {
    return (
      <div
        style={{
          padding: 20,
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: "8px 0 12px" }}>{selected}</h2>
        <p>{texts.newB.notReady}</p>
      </div>
    );
  }

  // sections 구조가 있으면 탭으로 표시
  if (Array.isArray(data.body.sections)) {
    const currentSection = data.body.sections[activeTab];
    
    return (
      <div
        style={{
          padding: 20,
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        {/* 제목 + 모바일 햄버거 메뉴 */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <h2 style={{ margin: "8px 0 0" }}>{data.title}</h2>
          
          {isMobile && (
            <button
              ref={hamburgerRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsTabMenuOpen(true);
              }}
              style={{
                background: "#401e83",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "18px" }}>☰</span>
              <span>{currentSection.title}</span>
            </button>
          )}
        </div>

        <p>{data.body.intro}</p>
        
        {/* PC: 탭 버튼 */}
        {!isMobile && (
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            marginTop: "16px", 
            marginBottom: "16px", 
            flexWrap: "wrap",
            overflowX: "auto",
            paddingBottom: "8px"
          }}>
            {data.body.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  padding: activeTab === index ? "8px 16px" : "6px 14px",
                  background: activeTab === index ? "#401e83" : "#e0e0e0",
                  color: activeTab === index ? "white" : "#2b2b2b",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
        
        {/* 탭 내용 */}
        {/* 🍱 학식 메뉴 탭인 경우 MealMenu 컴포넌트 렌더링 */}
        {currentSection.title === "🍱 이번 주 학식 메뉴" || currentSection.title === "🍱 This Week's Meal Menu" ? (
          <MealMenu texts={texts} lang={lang} />
        ) : (
          /* 기존 list 스타일로 탭 내용 표시 */
          <ul style={{ lineHeight: 1.7, listStyle: "none", paddingLeft: 0 }}>
            {currentSection.items.map((item, index) => {
              // 빈 문자열은 섹션 구분용 여백
              if (item === "") {
                return <li key={index} style={{ height: "16px" }}></li>;
              }
              
              // 대괄호로 시작하는 항목은 서브 제목
              if (item.startsWith("[") && !item.includes("](")) {
                return (
                  <li key={index} style={{ fontWeight: "600", marginTop: "12px", marginLeft: "8px" }}>
                    {item}
                  </li>
                );
              }
              
              // 일반 항목은 들여쓰기
              return (
                <li key={index} style={{ marginLeft: "16px", color: "#555" }}>
                  {renderTextWithLinks(item)}
                </li>
              );
            })}
          </ul>
        )}

        {/* 모바일: 탭 메뉴 */}
        {isMobile && isTabMenuOpen && (
          <MobileTabMenu
            tabs={data.body.sections}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={() => setIsTabMenuOpen(false)}
            buttonRef={hamburgerRef}
          />
        )}
      </div>
    );
  }

  // 일반적인 구조 (intro + list)
  return (
    <div
      style={{
        padding: 20,
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ margin: "8px 0 12px" }}>{data.title}</h2>
      <p>{data.body.intro}</p>
      {Array.isArray(data.body.list) && (
        <ul style={{ lineHeight: 1.7, listStyle: "none", paddingLeft: 0 }}>
          {data.body.list.map((item, index) => {
            // 빈 문자열은 섹션 구분용 여백
            if (item === "") {
              return <li key={index} style={{ height: "16px" }}></li>;
            }
            
            // 이모지로 시작하는 항목은 섹션 제목
            if (item.match(/^[📍🌅]/)) {
              return (
                <li key={index} style={{ fontWeight: "bold", fontSize: "1.1em", marginTop: index > 0 ? "20px" : "0" }}>
                  {item}
                </li>
              );
            }
            
            // 링크([text](url))는 그대로 렌더링하고, 대괄호로 시작하지만 링크가 아닐 때만 서브 제목으로 처리
            if (item.startsWith("[") && !item.includes("](")) {
              return (
                <li key={index} style={{ fontWeight: "600", marginTop: "12px", marginLeft: "8px" }}>
                  {item}
                </li>
              );
            }
            
            // 일반 항목은 들여쓰기
            return (
              <li key={index} style={{ marginLeft: "16px", color: "#555" }}>
                {renderTextWithLinks(item)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}