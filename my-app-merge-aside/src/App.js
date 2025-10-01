// FILE: src/App.js
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {Nav} from "./components/Nav";
import Aside from "./components/Aside";
import { useKakaoMap } from "./map/useKakaoMap";
import { MAP_CENTER, DEFAULT_LEVEL } from "./utils/constants";
import MapView from "./features/map/MapView";
import {
  makeHandleSelectBuilding,
  makeHandleSelectFacility,
} from "./features/map/handlers";
import MapDetailPanel from "./components/MapDetailPanel";
import BusInfo from "./components/BusInfo";
import CalendarPage from "./components/CalendarPage";
import OtInfo from "./components/OtInfo";
import ClubHub from "./components/ClubHub";
import AssistDetail from "./components/AssistDetail";

import { makeSearchIndex } from "./utils/searchIndex";
import { texts } from "./utils/texts";

const Container = styled.div`
  display: flex;
`;

const MapSection = styled.div`
  width: 100%;
  display: ${(props) => (props.active ? "block" : "none")};
`;

const MapLayout = styled.div`
  display: flex;
  gap: 16px;
`;

const MapBox = styled.div`
  flex: 2;
`;

const DetailBox = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
`;

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [detail, setDetail] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null); // 동아리 검색용
  const [lang, setLang] = useState("ko");

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === "ko" ? "en" : "ko"));
  };

  const { mapRef, markerRef, infoRef, ready, relayout } = useKakaoMap({
    activeTab,
    containerId: "map",
    center: MAP_CENTER,
    level: DEFAULT_LEVEL,
  });

  const handleSelectBuilding = useMemo(
    () =>
      makeHandleSelectBuilding({
        mapRef,
        markerRef,
        infoRef,
        ready,
        onDetail: setDetail,
      }),
    [mapRef, markerRef, infoRef, ready]
  );

  const handleSelectFacility = useMemo(
    () =>
      makeHandleSelectFacility({
        mapRef,
        markerRef,
        infoRef,
        ready,
        onDetail: setDetail,
      }),
    [mapRef, markerRef, infoRef, ready]
  );

  const searchIndexData = useMemo(() => makeSearchIndex(), []);

  const runSearch = (query) => {
    console.log('🔍 검색 시작:', query);
    
    const hit = searchIndexData.search(query);
    console.log('📊 검색 결과:', hit);
    
    if (!hit) {
      console.log('❌ 검색 결과 없음');
      alert(texts[lang].nav.searchNoResult);
      return;
    }
    
    console.log('✅ 검색 성공!');
    console.log('📍 결과 타입:', hit.type);
    console.log('📍 카테고리:', hit.category);
    console.log('📍 아이템:', hit.item);
    console.log('📍 이름:', hit.name);
    
    // 동아리 검색 처리
    if (hit.type === "club") {
      console.log('🎭 동아리 검색:', hit.name, '분과:', hit.category);
      setActiveTab("club");
      setSelectedItem(texts[lang].aside.club.items[0]); // "중앙동아리" 항목 선택
      setSelectedClub(hit); // 검색된 동아리 정보 저장
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 기존 검색 처리 (건물, 편의시설, 네비게이션)
    if (hit.type === "building" || hit.type === "facility") {
      setActiveTab("map");
    }

    const waitUntil = (cond, ms = 50, tries = 40) =>
      new Promise((res) => {
        let n = 0;
        const t = setInterval(() => {
          if (cond() || n++ > tries) {
            clearInterval(t);
            res();
          }
        }, ms);
      });

    waitUntil(() => ready && !!mapRef.current).then(() => {
      console.log('🗺️ 지도 준비 완료, 핸들러 호출 중...');
      
      if (hit.type === "building") {
        console.log('🏢 건물 핸들러 호출:', hit.name);
        const buildingNameMap = {
          "Janggong Hall (Main)": "장공관(본관)",
          "Pilhyeon Hall": "필현관", 
          "Manwoo Hall": "만우관",
          "Shalom Chapel": "샬롬채플",
          "Immanuel Hall (Student Union)": "임마누엘관(학생회관)",
          "Gyeongsam Hall (Library)": "경삼관(도서관)",
          "Songam Hall": "송암관",
          "Sotong Hall": "소통관", 
          "Learning Practice Building": "학습실습동",
          "Hanul Hall (Gymnasium)": "한울관(체육관)",
          "Seongbin Dormitory": "성빈학사(생활관)",
          "Saerometer": "새롬터",
          "Haeoreum Hall": "해오름관",
          "Jangjunha Unification Hall": "장준하통일관",
          "Neutbom Hall": "늦봄관"
        };
        
        const koreanName = buildingNameMap[hit.name] || hit.name;
        handleSelectBuilding(koreanName);
      } else if (hit.type === "facility") {
        console.log('🏪 편의시설 핸들러 호출:', hit.category, hit.item);
        handleSelectFacility(hit.category, hit.item);
      } else if (hit.type === "navigation") {
        console.log('📋 네비게이션 항목으로 이동:', hit.tab, hit.item);
        setActiveTab(hit.tab);
        setSelectedItem(hit.item);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "map" && ready && typeof relayout === "function") {
      requestAnimationFrame(() => relayout());
    }
  }, [activeTab, ready, relayout]);

  // 탭 변경 시 동아리 선택 초기화
  useEffect(() => {
    if (activeTab !== "club") {
      setSelectedClub(null);
    }
  }, [activeTab]);

  return (
    <>
      <Nav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearch={runSearch}
        lang={lang}
        texts={texts[lang]}
        onToggleLang={toggleLang}
      />
      <Container>
        <Aside
          activeTab={activeTab}
          onSelectBuilding={handleSelectBuilding}
          onSelectFacility={handleSelectFacility}
          onSelectItem={setSelectedItem}
          texts={texts[lang]}
        />

        <div style={{ padding: "20px", flexGrow: 1 }}>
          <MapSection active={activeTab === "map"}>
            <MapLayout>
              <MapBox>
                <MapView id="map" height={600} />
              </MapBox>
              <DetailBox>
                <MapDetailPanel detail={detail} texts={texts[lang].mapDetails} />
              </DetailBox>
            </MapLayout>
          </MapSection>

          {activeTab === "bus" && (
            <BusInfo selected={selectedItem} texts={texts[lang]} />
          )}

          {activeTab === "newB" && (
            <>
              {selectedItem === "학사일정" && (
                <CalendarPage texts={texts[lang].calendarPage} />
              )}
              {selectedItem === "OT 안내" && (
                <OtInfo texts={texts[lang].otInfo} />
              )}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].newB.notSelected}
                </div>
              )}
            </>
          )}

          {activeTab === "club" && (
            <>
              {selectedItem === texts[lang].aside.club.items[0] && (
                <ClubHub 
                  texts={texts[lang].clubDetails.centralClub}
                  initialClub={selectedClub}
                />
              )}
              {selectedItem === texts[lang].aside.club.items[1] && (
                <div style={{ padding: 20 }}>
                  <h2>{texts[lang].clubDetails.howToJoin.title}</h2>
                  <p>{texts[lang].clubDetails.howToJoin.body}</p>
                </div>
              )}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].clubDetails.selectPrompt}
                </div>
              )}
            </>
          )}

          {activeTab === "assist" && (
            <AssistDetail selected={selectedItem} texts={texts[lang]} />
          )}
        </div>
      </Container>
    </>
  );
}

export default App;