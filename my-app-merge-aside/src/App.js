// App.js
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

  @media (min-width: 769px) {
    margin-top: 120px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 60px; 
  }
`;

const MapSection = styled.div`
  width: 100%;
  display: ${(props) => (props.active ? "block" : "none")};

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 60px;
    z-index: 1;
    overflow: hidden;
  }
`;

const MapLayout = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    height: 100%;
    width: 100%;
  }
`;

const MapBox = styled.div`
  flex: 2;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    
    & > div {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

const DetailBox = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 600px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobilePopup = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    max-height: 70vh;
    z-index: 1001;
    animation: slideUp 0.3s ease-out;

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const PopupHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 8px auto 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #000;
  }
`;

const PopupContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const PopupOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [detail, setDetail] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [lang, setLang] = useState("ko");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

  // 모바일 여부 체크 (useState로 반응형 처리)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === "ko" ? "en" : "ko"));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const openMobilePopup = () => {
    setIsMobilePopupOpen(true);
  };

  const closeMobilePopup = () => {
    setIsMobilePopupOpen(false);
  };

  const { mapRef, markerRef, infoRef, ready, relayout } = useKakaoMap({
    activeTab,
    containerId: "map",
    center: MAP_CENTER,
    level: isMobile ? 4 : DEFAULT_LEVEL,
  });

  // detail이 변경될 때 모바일 팝업 열기
  useEffect(() => {
    if (detail && isMobile) {
      openMobilePopup();
    }
  }, [detail, isMobile]);

  // 모바일에서 지도 탭일 때 body 스크롤 방지
  useEffect(() => {
    if (isMobile && activeTab === 'map') {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [activeTab, isMobile]);

  const handleSelectBuilding = useMemo(
    () =>
      makeHandleSelectBuilding({
        mapRef,
        markerRef,
        infoRef,
        ready,
        onDetail: setDetail,
        lang,
      }),
    [mapRef, markerRef, infoRef, ready, lang]
  );

  const handleSelectFacility = useMemo(
    () =>
      makeHandleSelectFacility({
        mapRef,
        markerRef,
        infoRef,
        ready,
        onDetail: setDetail,
        lang,
      }),
    [mapRef, markerRef, infoRef, ready, lang]
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
    
    if (hit.type === "club") {
      console.log('🎭 동아리 검색:', hit.name, '분과:', hit.category);
      setActiveTab("club");
      setSelectedItem(texts[lang].aside.club.items[0]);
      setSelectedClub(hit);
      setIsSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (hit.type === "building" || hit.type === "facility") {
      setActiveTab("map");
      setIsSidebarOpen(false);
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
        handleSelectBuilding({ lookup: koreanName, display: hit.name });
      } else if (hit.type === "facility") {
        console.log('🏪 편의시설 핸들러 호출:', hit.category, hit.item);
        handleSelectFacility(hit.category, hit.item);
      } else if (hit.type === "navigation") {
        console.log('📋 네비게이션 항목으로 이동:', hit.tab, hit.item);
        setActiveTab(hit.tab);
        setSelectedItem(hit.item);
        setIsSidebarOpen(false);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const normalize = (s) => (s || "").toString().trim().toLowerCase();
  const getAsideItems = (tab) => {
    const aside = texts[lang]?.aside?.[tab];
    if (!aside) return [];
    if (Array.isArray(aside.items)) return aside.items;
    if (Array.isArray(aside.collapsible)) {
      const items = [];
      aside.collapsible.forEach((c) => {
        if (Array.isArray(c.items)) items.push(...c.items);
      });
      if (items.length) return items;
    }
    return [];
  };

  useEffect(() => {
    if (activeTab === "map" && ready && typeof relayout === "function") {
      requestAnimationFrame(() => relayout());
    }
  }, [activeTab, ready, relayout]);

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
        texts={texts[lang]}
        onToggleLang={toggleLang}
      />
      <Container>
        <Aside
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectBuilding={handleSelectBuilding}
          onSelectFacility={handleSelectFacility}
          onSelectItem={setSelectedItem}
          texts={texts[lang]}
          lang={lang}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <div style={{ 
            padding: "20px", 
            flexGrow: 1, 
        }}>
          <MapSection active={activeTab === "map"}>
            <MapLayout>
              <MapBox>
                <MapView id="map" height={600} />
              </MapBox>
              <DetailBox>
                <MapDetailPanel detail={detail} texts={texts[lang].mapDetails} lang={lang} />
              </DetailBox>
            </MapLayout>

            <PopupOverlay isOpen={isMobilePopupOpen} onClick={closeMobilePopup} />
            <MobilePopup isOpen={isMobilePopupOpen}>
              <PopupHandle />
              <PopupHeader>
                <h3 style={{ margin: 0, fontSize: "18px" }}>
                  {detail?.title || "상세 정보"}
                </h3>
                <CloseButton onClick={closeMobilePopup}>×</CloseButton>
              </PopupHeader>
              <PopupContent>
                <MapDetailPanel detail={detail} texts={texts[lang].mapDetails} lang={lang} />
              </PopupContent>
            </MobilePopup>
          </MapSection>

          {activeTab === "bus" && (
            <>
              {getAsideItems('bus').some(item => normalize(selectedItem) === normalize(item)) && (
                <BusInfo selected={selectedItem} texts={texts[lang]} />
              )}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].busInfo.notSelected}
                </div>
              )}
            </>
          )}

          {activeTab === "newB" && (
            <>
              {(() => {
                const newBItems = getAsideItems('newB');
                console.log('newBItems:', newBItems, 'selectedItem:', selectedItem);
                return (
                  <>
                    {normalize(selectedItem) === normalize(newBItems[0]) && (
                      <CalendarPage texts={texts[lang].calendarPage} />
                    )}
                    {normalize(selectedItem) === normalize(newBItems[1]) && (
                      <OtInfo texts={texts[lang].otInfo} />
                    )}
                  </>
                );
              })()}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].newB.notSelected}
                </div>
              )}
            </>
          )}

          {activeTab === "club" && (
            <>
              {console.log('club tab selectedItem:', selectedItem, 'labels:', getAsideItems('club'))}
              {normalize(selectedItem) === normalize(getAsideItems('club')[0]) && (
                <ClubHub 
                  texts={texts[lang]}
                  lang={lang}
                  initialClub={selectedClub}
                />
              )}
              {normalize(selectedItem) === normalize(getAsideItems('club')[1]) && (
                <div style={{ padding: 20 }}>
                  <h2>{texts[lang].clubDetails.howToJoin.title}</h2>
                  <p>{texts[lang].clubDetails.howToJoin.body}</p>
                </div>
              )}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].clubDetails.notSelected}
                </div>
              )}
            </>
          )}

          {activeTab === "assist" && (
            <>
              {console.log('assist tab selectedItem:', selectedItem, 'labels:', getAsideItems('assist'))}
              {getAsideItems('assist').some(item => normalize(selectedItem) === normalize(item)) && (
                <AssistDetail selected={selectedItem} texts={texts[lang]} />
              )}
              {!selectedItem && (
                <div style={{ padding: 20, color: "#666" }}>
                  {texts[lang].assistDetails.notSelected}
                </div>
              )}
            </>
          )}

        </div>
      </Container>
    </>
  );
}

export default App;