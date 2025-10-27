// FILE: src/components/AcademicDetail.jsx

import React from "react";
import CalendarPage from "./CalendarPage";

export default function AcademicDetail({ selected, texts, lang, highlightEvent }) {
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
        <ul style={{ lineHeight: 1.7 }}>
          {data.body.list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}