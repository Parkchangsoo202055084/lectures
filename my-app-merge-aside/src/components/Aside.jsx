// FILE: src/components/Aside.jsx
import { useState, useEffect } from "react";
import styleA from "./Aside.module.css";

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
    onSelectFacility,
    onSelectItem,
    texts,
    onToggleSidebar,
    isSidebarOpen
}) => {
    const content = texts.aside[activeTab];
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

    // helper: 현재 탭이 지도 관련인지 판단
    const isMapContent = () => {
        if (activeTab === "map") return true;
        const title = content?.title || "";
        return /건물|Buildings/i.test(title);
    };

    // 트리 렌더링
    const renderTreeItems = (items, path = [], sectionTitle = null) => {
        return (
            <ul className={styleA.asideList} style={{ paddingLeft: path.length ? 12 : 0 }}>
                {items.map((item, idx) => {
                    // 문자열 leaf 노드
                    if (!isObjectNode(item)) {
                        const key = [...path, String(item)].join("/");
                        const handleClick = () => {
                            const topCategory =
                                path[0] || sectionTitle || content?.title || activeTab;

                            // ⭐️ 탭별 분기
                            if (activeTab === "bus") {
                                // 🚌 버스는 지도와 무관 → BusInfo 페이지로
                                if (onSelectItem) onSelectItem(item);
                            } else if (isMapContent() && onSelectBuilding) {
                                onSelectBuilding(String(item));
                            } else if (onSelectFacility) {
                                onSelectFacility(topCategory, String(item));
                            } else if (onSelectItem) {
                                onSelectItem(item);
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

                    // object node
                    const nodeKey = [...path, item.label].join("/");
                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                    const opened = !!openNodes[nodeKey];

                    const handleLabelClick = () => {
                        if (hasChildren) {
                            toggleNode(nodeKey);
                        } else {
                            if (activeTab === "bus") {
                                if (onSelectItem) onSelectItem(item.label);
                            } else if (isMapContent() && onSelectBuilding) {
                                onSelectBuilding(item.label);
                            } else if (onSelectFacility) {
                                onSelectFacility(item.label, item.label);
                            } else if (onSelectItem) {
                                onSelectItem(item.label);
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
                                        renderTreeItems(section.items, [], section.title)}
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <ul className={styleA.asideList}>
                    {content.items.map((item, idx) => (
                        <li key={idx}>
                            <button
                                className={styleA.itemButton}
                                onClick={() => {
                                    if (activeTab === "bus") {
                                        if (onSelectItem) onSelectItem(item);
                                    } else if (onSelectItem) {
                                        onSelectItem(item);
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
                        <span style={{ fontSize: "0.7em", marginTop: "2px" }}>메뉴</span>
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
                            <span style={{ fontSize: "0.7em", marginTop: "2px" }}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </nav>
            )}
        </>
    );
};

export default Aside;