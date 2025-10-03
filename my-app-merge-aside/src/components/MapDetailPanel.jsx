// FILE: src/components/MapDetailPanel.jsx

import React from "react";

export default function MapDetailPanel({ detail, texts = {}, lang = 'ko' }) {
  if (!detail) return null;

  const { type, title, subtitle, data, coords } = detail;

  const Section = ({ title, children }) => (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div
      style={{
        marginTop: 12,
        padding: "14px 16px",
        border: "1px solid #eee",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
          {subtitle}
        </div>
      )}

      {/* 건물 상세 안내 */}
      {type === "building" && data && (
        <>
              {data && (
                (() => {
                  const raw = data.raw || {};
                  const alias = (raw && ((raw[lang] && raw[lang].alias) || data.alias || raw.alias)) || data.alias;
                  const floors = (raw && ((raw[lang] && raw[lang].floors) || data.floors)) || data.floors;

                  return (
                    <>
                      {alias && (
                        <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
                          {texts.aliasLabel || "별칭:"} {alias}
                        </div>
                      )}
                      {Array.isArray(floors) && floors.length > 0 && (
                        <Section title={texts.floorsSection || "층별 안내"}>
                          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                            {floors.map((f) => (
                              <li key={f.floor} style={{ marginBottom: 4 }}>
                                <b>{f.floor}</b> :{" "}
                                {Array.isArray(f.rooms) ? f.rooms.join(", ") : f.rooms}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      )}
                    </>
                  );
                })()
              )}
        </>
      )}

      {/* 편의시설 상세 안내 */}
      {type === "facility" && data && (
        <>
          <Section title="상세 정보">
            <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
              {data.description || "정보 없음"}
            </p>
          </Section>
        </>
      )}

      {/* 좌표 출력(선택) */}
      {coords && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 10 }}>
          lat: {coords.lat}, lng: {coords.lng}
        </div>
      )}
    </div>
  );
}