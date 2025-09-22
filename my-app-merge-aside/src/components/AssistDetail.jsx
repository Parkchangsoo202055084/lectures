// FILE: src/components/AssistDetail.jsx
import React from "react";
import QA from "./QA";

export default function AssistDetail({ selected, texts }) {
  if (!selected) {
    return (
      <div style={{ padding: 20, color: "#666" }}>
        {texts.assistDetails.notSelected}
      </div>
    );
  }

  // ✅ Q&A 항목 확인을 더 안전하게 처리
  if (selected === "Q&A" || selected === "QA") {
    return <QA texts={texts.assistDetails["Q&A"]} />;
  }

  // ✅ 그 외 항목에 대한 데이터를 찾습니다.
  const data = texts.assistDetails[selected];

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ margin: "6px 0 12px" }}>{selected}</h2>
        <p>{texts.assistDetails.notReady}</p>
      </div>
    );
  }

  // ✅ 일반 항목의 내용을 렌더링합니다.
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
      <h2 style={{ margin: "6px 0 12px" }}>{data.title}</h2>
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