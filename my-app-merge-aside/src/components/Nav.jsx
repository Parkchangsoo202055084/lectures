// Nav.js
import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import { useMemo } from "react";
import { makeSearchIndex } from "../utils/searchIndex";
import { SearchBar } from "./SearchBar";
import { AuthControls } from "./AuthControls";

const fallbackTabs = [
    { id: "map", label: "캠퍼스 지도" },
    { id: "bus", label: "셔틀/버스" },
    { id: "newB", label: "학사정보" },
    { id: "club", label: "동아리" },
    { id: "assist", label: "학생지원" },
];

export const Nav = ({ activeTab, setActiveTab, onSearch, texts, onToggleLang }) => {
    
    const searchIndex = useMemo(() => makeSearchIndex(), []);

    const goToHome = () => setActiveTab("map");

    const isMobile = window.innerWidth <= 768; 

    const currentTabs = fallbackTabs.map(tab => ({
        ...tab,
        label: texts?.aside?.[tab.id]?.title || tab.label 
    }));

    return (
        <header className={styles.header}>
            <div className={`${styles["top-bar"]} ${isMobile ? styles["top-bar-mobile"] : ''}`}>
                
                <div className={styles["logo"]} onClick={goToHome} style={{ cursor: "pointer" }}>
                    <img src={logo} alt={texts.nav.logoAlt} width="80" height="60" />
                </div>

                {isMobile && <div style={{ flexGrow: 50 }} />} 

                <SearchBar 
                    onSearch={onSearch} 
                    texts={texts} 
                    searchIndex={searchIndex}
                    isMobile={isMobile} 
                />

                {/* ✅ 로그인/언어 컨트롤 (모달 포함) */}
                <AuthControls 
                    texts={texts} 
                    onToggleLang={onToggleLang}
                    isMobile={isMobile}
                />
            </div>

            {/* PC 환경에서만 탭 메뉴 렌더링 */}
            {!isMobile && (
                <nav className={styles["nav-bar"]}>
                    <ul>
                        {currentTabs.map((tab) => (
                            <li key={tab.id}>
                                <button 
                                    onClick={() => setActiveTab(tab.id)} 
                                    className={activeTab === tab.id ? styles["active-tab"] : ""}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
};