// FILE: src/components/Aside.jsx

import { useState, useEffect } from "react";
import styleA from "./Aside.module.css";
// 🚨 추가: 번역 및 쿼리 체크 함수 import
import { translateToKorean, isEnglishQuery } from "../utils/englishKoreanTranslator"; 

const fallbackTabs = [
    { id: "map", label: "캠퍼스 지도", icon: "🗺️" }, 
    { id: "bus", label: "셔틀/버스", icon: "🚌" },
    { id: "newB", label: "학사정보", icon: "📅" },
    { id: "club", label: "동아리", icon: "🎭" },
    { id: "assist", label: "학생지원", icon: "ℹ️" },
];

const Aside = ({
    activeTab,
    setActiveTab,
    onSelectBuilding,
    onSelectFacility, // <-- 카테고리와 항목 이름을 모두 받습니다.
    onSelectItem,
    texts,
    onToggleSidebar,
    isSidebarOpen,
    lang = 'ko',
}) => {
    // texts 구조를 확신할 수 없을 때 안전하게 접근
    const content = texts?.aside?.[activeTab]; 
    const [openSections, setOpenSections] = useState({});
    const [openNodes, setOpenNodes] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // 반응형 (모바일 여부 판정)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 모바일에서 사이드바 열리면 스크롤 방지
    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, isSidebarOpen]);

    const toggleSection = (title) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleNode = (key) => {
        setOpenNodes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isObjectNode = (item) =>
        item && typeof item === "object" && !Array.isArray(item);


    // 트리 렌더링
    const renderTreeItems = (items, path = [], sectionTitle = null) => {
        // 필수 데이터가 없을 경우 렌더링 중지
        if (!texts || !texts.aside.map || !content || !items) return null; 
        
        // '건물 목록' 섹션 타이틀을 시설과 구분하기 위해 가져옴
        const buildingSectionTitle = texts.aside.map.collapsible?.[0]?.title;
        
        return (
            <ul className={styleA.asideList} style={{ paddingLeft: path.length ? 12 : 0 }}>
                {items.map((item, idx) => {
                    // 문자열 leaf 노드 (최종 클릭 가능한 항목)
                    if (!isObjectNode(item)) {
                        const key = [...path, String(item)].join("/");
                        const handleClick = () => {
                            
                            let itemName = String(item);
                            
                            // 1. 영문 쿼리인 경우 한국어로 번역 적용
                            if (isEnglishQuery(itemName)) {
                                itemName = translateToKorean(itemName);
                            }
                            
                            // ⭐️ 2. 최종 정규화: 괄호 주변의 공백을 강제 제거하여 BUILDINGS 키와 일치
                            const normalizedName = itemName.replace(/\s*([()])\s*/g, '$1').trim();
                            
                            
                            // topCategory는 "건물 목록" 또는 "편의시설" 같은 최상위 섹션 타이틀이 됩니다.
                            const topCategory = sectionTitle 
                                ? sectionTitle // collapsible 섹션의 아이템일 경우, sectionTitle이 카테고리입니다.
                                : path[0] || content?.title || activeTab; // 일반 리스트나 트리 형태일 경우

                            // ⭐️ 탭별 분기
                            if (activeTab === "map") {
                                // 맵 탭에서만 건물/시설 분기 처리
                                
                                // '건물 목록' 섹션의 항목인 경우
                                if (topCategory === buildingSectionTitle) {
                                    if (onSelectBuilding) onSelectBuilding({ lookup: normalizedName, display: String(item), lang });
                                } 
                                // '편의시설' 섹션의 하위 항목인 경우
                                else if (onSelectFacility) {
                                    // path 배열의 마지막 요소를 사용하되, 없으면 TopCategory를 사용합니다.
                                    let facilityCategory = path[path.length - 1] || topCategory;
                                    
                                    // 카테고리도 영문이면 번역 적용
                                    if (isEnglishQuery(facilityCategory)) {
                                        facilityCategory = translateToKorean(facilityCategory);
                                    }
                                    
                                    // 카테고리도 괄호 공백 정규화
                                    facilityCategory = facilityCategory.replace(/\s*([()])\s*/g, '$1').trim();
                                    
                                    if (facilityCategory) {
                                        onSelectFacility(facilityCategory, normalizedName);
                                    }
                                }
                            } else if (activeTab === "bus") {
                                // 🚌 버스는 지도와 무관 
                                if (onSelectItem) onSelectItem(normalizedName);
                            } else if (onSelectItem) {
                                // 기타 탭의 단순 리스트 항목
                                if (onSelectItem) onSelectItem(normalizedName);
                            }

                            if (isMobile && onToggleSidebar) {
                                onToggleSidebar();
                            }
                        };

                        return (
                            <li key={key}>
                                <button
                                    type="button"
                                    className={styleA.itemButton}
                                    onClick={handleClick}
                                >
                                    {String(item)}
                                </button>
                            </li>
                        );
                    }

                    // object node (카테고리 또는 서브 메뉴)
                    const nodeKey = [...path, item.label].join("/");
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                    const opened = !!openNodes[nodeKey];

                    const handleLabelClick = () => {
                        if (hasChildren) {
                            // 자식이 있으면 노드 토글만 수행
                            toggleNode(nodeKey);
                            
                            // ⭐️ 추가: 자식이 있는 카테고리(예: "식당", "카페")를 클릭했을 때
                            // 해당 카테고리의 모든 지점 마커를 표시하기 위해 name=null로 호출
                            if (activeTab === "map" && onSelectFacility) {
                                let categoryName = item.label;
                                
                                // 영문 쿼리 번역
                                if (isEnglishQuery(categoryName)) {
                                    categoryName = translateToKorean(categoryName);
                                }
                                
                                // 괄호 공백 정규화
                                const normalizedCategory = categoryName.replace(/\s*([()])\s*/g, '$1').trim();
                                
                                // name을 null로 전달하여 카테고리 전체 마커 표시
                                onSelectFacility(normalizedCategory, null);
                            }
                        } else {
                            // 자식이 없는 카테고리(예: '은행/ATM')를 클릭한 경우, 이 자체가 핀 대상
                            let currentItemLabel = item.label;
                            
                            // 1. 영문 쿼리인 경우 한국어로 번역 적용
                            if (isEnglishQuery(currentItemLabel)) {
                                currentItemLabel = translateToKorean(currentItemLabel);
                            }
                            
                            // ⭐️ 2. 최종 정규화: 괄호 주변의 공백을 강제 제거
                            const normalizedName = currentItemLabel.replace(/\s*([()])\s*/g, '$1').trim();
                            
                            
                            const topCategory = sectionTitle 
                                ? sectionTitle 
                                : path[0] || content?.title || activeTab;

                            // ⭐️ 탭별 분기
                            if (activeTab === "map") {
                                // 맵 탭에서만 건물/시설 분기 처리
                                
                                // '건물 목록' 섹션의 항목인 경우: buildingSectionTitle과 현재 카테고리(topCategory) 비교
                                if (topCategory === buildingSectionTitle) {
                                    if (onSelectBuilding) onSelectBuilding({ lookup: normalizedName, display: item.label, lang });
                                } 
                                // '편의시설' 섹션의 항목인 경우 (자식이 없지만 핀 대상)
                                else if (onSelectFacility) {
                                    // 자식이 없는 항목은 자기 자신이 카테고리이자 항목명
                                    // 예: "은행/ATM" 클릭 시 -> category: "은행/ATM", item: "은행/ATM"
                                    onSelectFacility(normalizedName, normalizedName);
                                }
                            } else if (activeTab === "bus") {
                                if (onSelectItem) onSelectItem(normalizedName);
                            } else if (onSelectItem) {
                                if (onSelectItem) onSelectItem(normalizedName);
                            }

                            if (isMobile && onToggleSidebar) {
                                onToggleSidebar();
                            }
                        }
                    };

                    return (
                        <li key={nodeKey}>
                            <button
                                type="button"
                                className={styleA.treeButton}
                                onClick={handleLabelClick}
                                aria-expanded={opened}
                            >
                                <span
                                    className={styleA.caret}
                                    data-open={opened ? "true" : "false"}
                                />
                                <span>{item.label}</span>
                            </button>
                            {opened && hasChildren && (
                                <div>
                                    {renderTreeItems(
                                        item.children,
                                        [...path, item.label],
                                        sectionTitle 
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    if (!content) return null;

    const renderAsideContent = () => (
        <div className={styleA.asideSection}>
            <h3 className={styleA.title}>{content.title}</h3>
            {content.collapsible ? (
                content.collapsible.map((section, idx) => {
                    const opened = !!openSections[section.title];
                    return (
                        <div key={idx} className={styleA.section}>
                            <button
                                type="button"
                                className={styleA.sectionButton}
                                onClick={() => toggleSection(section.title)}
                                aria-expanded={opened}
                            >
                                <span
                                    className={styleA.caret}
                                    data-open={opened ? "true" : "false"}
                                />
                                <span>{section.title}</span>
                            </button>
                            {opened && (
                                <>
                                    {section.items &&
                                        // 📌 section.title을 sectionTitle 인수로 전달
                                        renderTreeItems(section.items, [], section.title)}
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                // 트리 구조가 아닌 단순 리스트 처리
                <ul className={styleA.asideList}>
                    {content.items.map((item, idx) => (
                                <li key={idx}>
                                    <button
                                        className={styleA.itemButton}
                                        onClick={() => {
                                            const displayName = String(item);

                                            // For map-related simple lists we may need to translate to Korean for lookup,
                                            // but for other tabs we should send the visible label (displayName) so App matches texts.
                                            if (activeTab === "bus") {
                                                // bus items are identifiers / names — keep as-is
                                                if (onSelectItem) onSelectItem(displayName);
                                            } else if (onSelectItem) {
                                                onSelectItem(displayName);
                                            }
                                            if (isMobile && onToggleSidebar) {
                                                onToggleSidebar();
                                            }
                                        }}
                                    >
                                        {item}
                                    </button>
                                </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const currentTabs = fallbackTabs.map((tab) => ({
        ...tab,
        label: texts?.aside?.[tab.id]?.title || tab.label,
    }));

    return (
        <>
            {/* PC 사이드바 */}
            {!isMobile && <aside className={styleA.aside}>{renderAsideContent()}</aside>}

            {/* 모바일 팝업 메뉴 */}
            {isMobile && isSidebarOpen && (
                <>
                    <div
                        className={styleA["mobile-menu-backdrop"]}
                        onClick={onToggleSidebar}
                        aria-hidden="true"
                    />
                    <div className={styleA["mobile-menu-popup"]}>
                        <div className={styleA["menu-content"]}>
                            {renderAsideContent()}
                        </div>
                    </div>
                </>
            )}

            {/* 모바일 하단 네비게이션 */}
            {isMobile && (
                <nav className={styleA.bottomNav}>
                    <button
                        className={`${styleA.navButton} ${
                            isSidebarOpen ? styleA.hamburgerActive : styleA.hamburgerButton
                        }`}
                        onClick={onToggleSidebar}
                        aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        <span style={{ fontSize: "1.5em" }}>
                            {isSidebarOpen ? "✕" : "☰"}
                        </span>
                    </button>

                    {currentTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styleA.navButton} ${
                                activeTab === tab.id ? styleA.activeTab : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span style={{ fontSize: "1.2em" }}>{tab.icon}</span>
                            <span style={{ fontSize: "0.7em" }}>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            )}
        </>
    );
};

export default Aside;