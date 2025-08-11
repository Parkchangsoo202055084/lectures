import { useState } from "react";
import styleA from "./Aside.module.css";

const asideContent = {
  map: {
    title: "건물",
    collapsible: [
      {
        title: "건물 목록",
        items: [
          "장공관(본관)",
          "필현관",
          "만우관",
          "샬롬채플",
          "임마누엘관(학생회관)",
          "경삼관(도서관)",
          "송암관",
          "소통관",
          "학습실습동",
          "한울관(체육관)",
          "성빈학사(생활관)",
          "새롬터",
          "해오름관",
          "정준하통일관",
          "늦봄관",
        ],
      },
      {
        title: "식음료",
        items: ["식당", "카페/편의점"],
      },
      {
        title: "기타",
        items: ["은행/ATM/우체국", "병원/약국", "서점/문구"],
      },
    ],
  },
  bus: {
    title: "버스 노선",
    items: ["5511: 서울대 → 흑석동", "5513: 서울대 → 백산아파트"],
    extra: {
      title: "셔틀버스",
      items: ["통학 셔틀", "야간 셔틀"],
    },
  },
  newB: {
    title: "신입생 정보",
    items: ["학사일정", "OT 안내", "교재 정보"],
  },
  club: {
    title: "동아리",
    items: ["밴드부", "연극동아리", "영상제작부"],
  },
  assist: {
    title: "학생지원",
    items: ["장학금", "상담센터", "학습지원"],
  },
};

const Aside = ({ activeTab }) => {
  const content = asideContent[activeTab];
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (!content) return null;

  return (
    <aside className={styleA.aside}>
      <div className={styleA.asideSection}>
        <h3>{content.title}</h3>

        {content.collapsible ? (
          content.collapsible.map((section, idx) => (
            <div key={idx}>
              <h4
                onClick={() => toggleSection(section.title)}
                style={{ cursor: "pointer" }}
              >
                {section.title} {openSections[section.title] ? "▲" : "▼"}
              </h4>
              {openSections[section.title] && (
                <ul className={styleA.asideList}>
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <>
            <ul className={styleA.asideList}>
              {content.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {content.extra && (
              <>
                <h3>{content.extra.title}</h3>
                <ul className={styleA.asideList}>
                  {content.extra.items.map((item, index) => (
                    <li key={`extra-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Aside;
