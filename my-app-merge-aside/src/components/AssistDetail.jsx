// FILE: src/components/AssistDetail.jsx
import React from "react";
import Community from "./Community";

export default function AssistDetail({ selected, texts }) {
  if (!selected) {
    return null;
  }

  // 커뮤니티 체크
  if (selected === "커뮤니티" || selected === "Community") {
    return <Community texts={texts.assistDetails[selected]} />;
  }

  const data = texts.assistDetails[selected];

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
        <p>{texts.assistDetails.notReady}</p>
      </div>
    );
  }

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