// FILE: src/components/AcademicDetail.jsx

import React, { useState } from "react";
import CalendarPage from "./CalendarPage";

export default function AcademicDetail({ selected, texts, lang, highlightEvent }) {
  const [activeTab, setActiveTab] = useState(0);

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
        <h2 style={{ margin: "8px 0 12px" }}>{data.title}</h2>
        <p>{data.body.intro}</p>
        
        {/* 탭 버튼 */}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          {data.body.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              style={{
                padding: activeTab === index ? "8px 16px" : "6px 14px",
                background: activeTab === index ? "#401e83" : "transparent",
                color: activeTab === index ? "white" : "#2b2b2b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        {/* 탭 내용 - 기존 list 스타일 유지 */}
        <ul style={{ lineHeight: 1.7, listStyle: "none", paddingLeft: 0 }}>
          {currentSection.items.map((item, index) => {
            // 빈 문자열은 섹션 구분용 여백
            if (item === "") {
              return <li key={index} style={{ height: "16px" }}></li>;
            }
            
            // 대괄호로 시작하는 항목은 서브 제목
            if (item.startsWith("[")) {
              return (
                <li key={index} style={{ fontWeight: "600", marginTop: "12px", marginLeft: "8px" }}>
                  {item}
                </li>
              );
            }
            
            // 일반 항목은 들여쓰기
            return (
              <li key={index} style={{ marginLeft: "16px", color: "#555" }}>
                {item}
              </li>
            );
          })}
        </ul>
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
            
            // 대괄호로 시작하는 항목은 서브 제목
            if (item.startsWith("[")) {
              return (
                <li key={index} style={{ fontWeight: "600", marginTop: "12px", marginLeft: "8px" }}>
                  {item}
                </li>
              );
            }
            
            // 일반 항목은 들여쓰기
            return (
              <li key={index} style={{ marginLeft: "16px", color: "#555" }}>
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}