// Nav.js
import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { makeSearchIndex, norm } from "../utils/searchIndex";
import { saveSuccessfulSearch, saveAllSearchAttempts, getPopularSearchTerms } from "../utils/searchAnalytics";

export const Nav = ({ activeTab, setActiveTab, onSearch, texts, onToggleLang }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [popularTerms, setPopularTerms] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { user, loading, loginWithGoogle, loginWithEmail, logout } = useAuth();
  
  // 팝업 로그인용 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false); // 👈 로그인 팝업 상태 추가

  // 검색 인덱스 생성 (메모이제이션)
  const searchIndex = useMemo(() => makeSearchIndex(), []);

  // 컴포넌트 마운트시 인기 검색어 로드
  useEffect(() => {
    loadPopularSearchTerms();
  }, []);

  // 인기 검색어 로드
  const loadPopularSearchTerms = async () => {
    setIsLoadingPopular(true);
    try {
      const popular = await getPopularSearchTerms(8);
      setPopularTerms(popular);
    } catch (error) {
      console.error('인기 검색어 로드 실패:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  // 연관 검색어 생성 함수
  const generateSuggestions = (inputQuery) => {
    if (!inputQuery.trim()) return [];

    const normalizedQuery = norm(inputQuery);
    const suggestions = [];
    const maxSuggestions = 6;

    // 건물 검색어 추가
    for (const [key, value] of searchIndex.buildingIndex) {
      if (suggestions.length >= maxSuggestions) break;
      
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        suggestions.push({
          text: value.name,
          type: "building",
          icon: "🏢",
          source: "index"
        });
      }
    }

    // 편의시설 검색어 추가
    for (const [key, value] of searchIndex.facilityIndex) {
      if (suggestions.length >= maxSuggestions) break;
      
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        suggestions.push({
          text: value.item,
          type: "facility",
          icon: "🏪",
          source: "index"
        });
      }
    }

    // 네비게이션 항목 추가
    for (const [key, value] of searchIndex.navigationIndex) {
      if (suggestions.length >= maxSuggestions) break;
      
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        suggestions.push({
          text: value.title,
          type: "navigation",
          icon: value.tab === "bus" ? "🚌" : value.tab === "assist" ? "ℹ️" : value.tab === "newB" ? "📅" : "🎭",
          source: "index"
        });
      }
    }

    return suggestions;
  };

  const tabs = [
    { id: "map", label: texts.aside.map.title },
    { id: "bus", label: texts.aside.bus.title },
    { id: "newB", label: texts.aside.newB.title },
    { id: "club", label: texts.aside.club.title },
    { id: "assist", label: texts.aside.assist.title },
  ];

  const submit = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    const trimmedQuery = searchQuery.trim();
    
    // 검색 인덱스에서 실제 검색 결과 확인 (유사성 검색 포함)
    const searchResult = searchIndex.search(trimmedQuery);
    const isSuccessful = searchResult !== null;
    
    console.log(`검색어: "${trimmedQuery}", 성공 여부: ${isSuccessful}`);
    if (searchResult) {
      console.log('검색 결과:', searchResult);
    }
    
    // 파이어베이스에 검색어 저장
    try {
      // 모든 검색 시도 저장 (오타 분석용)
      await saveAllSearchAttempts(trimmedQuery, isSuccessful);
      
      // 성공한 검색어만 별도 저장 (인기 검색어용)
      if (isSuccessful) {
        await saveSuccessfulSearch(trimmedQuery);
        // 성공한 검색어일 때만 인기 검색어 목록 새로고침
        loadPopularSearchTerms();
      }
    } catch (error) {
      console.error('검색어 저장 실패:', error);
    }
    
    // 기존 검색 기능 실행
    onSearch && onSearch(trimmedQuery);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      const newSuggestions = generateSuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      // 검색창이 비어있을 때 인기 검색어 표시
      setShowSuggestions(true);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.source === 'popular') {
      setQuery(suggestion.text);
      submit(suggestion.text);
    } else {
      setQuery(suggestion.text);
      submit(suggestion.text);
    }
  };

  const handlePopularTermClick = (term) => {
    setQuery(term.term);
    submit(term.term);
  };

  const onKeyDown = (e) => {
    const allItems = [...suggestions, ...popularTerms];
    
    if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < allItems.length) {
        if (selectedSuggestionIndex < suggestions.length) {
          handleSuggestionClick(allItems[selectedSuggestionIndex]);
        } else {
          handlePopularTermClick(allItems[selectedSuggestionIndex]);
        }
      } else {
        submit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < allItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : prev);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  const goToHome = () => {
    setActiveTab("map");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailLoginClick = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      setEmail("");
      setPassword("");
      setShowLoginModal(false); // 👈 로그인 성공 시 모달 닫기
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인 실패: " + error.message); 
    }
  };

  const handleGoogleLoginClick = async () => {
    try {
      await loginWithGoogle();
      setShowLoginModal(false); // 👈 로그인 성공 시 모달 닫기
    } catch (error) {
      console.error("Google login failed:", error);
      alert("구글 로그인 실패: " + error.message);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 검색 제안 드롭다운 닫기 로직
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
      
      // 모달 외부 클릭시 닫기 로직 (모달이 열려 있을 때만)
      if (showLoginModal) {
          const modal = document.querySelector(`.${styles["login-modal"]}`);
          const backdrop = document.querySelector(`.${styles["modal-backdrop"]}`);
          if (
              backdrop && backdrop.contains(event.target) && 
              (!modal || !modal.contains(event.target))
          ) {
              setShowLoginModal(false);
          }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLoginModal]); // showLoginModal 상태를 의존성 배열에 추가

  return (
    <header className={styles.header}>
      {/* 👈 로그인 모달 팝업 렌더링 */}
      {showLoginModal && (
        <div className={styles["modal-backdrop"]} onClick={() => setShowLoginModal(false)}>
          <div 
            className={styles["login-modal"]} 
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
          >
            <button 
              className={styles["close-button"]} 
              onClick={() => setShowLoginModal(false)}
            >
              &times;
            </button>
            <h2 className={styles["modal-title"]}>{texts.auth.login || "로그인"}</h2>
            
            <div className={styles["login-form"]}>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles["auth-input-modal"]}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles["auth-input-modal"]}
              />
              <button
                className={styles["auth-btn-modal"]}
                onClick={handleEmailLoginClick}
                disabled={loading}
              >
                {loading ? "..." : texts.auth.emailLogin || "이메일로 로그인"}
              </button>
            </div>

            <div className={styles["divider-modal"]}>또는</div>

            <button
              className={`${styles["auth-btn-modal"]} ${styles["google-btn"]}`}
              onClick={handleGoogleLoginClick}
              disabled={loading}
            >
              {loading ? "..." : "🔑 구글 계정으로 로그인"}
            </button>
            
          </div>
        </div>
      )}
      {/* 👆 로그인 모달 팝업 끝 */}
      
      <div className={styles["top-bar"]}>
        <div className={styles["logo"]} onClick={goToHome} style={{ cursor: "pointer" }}>
          <img src={logo} alt={texts.nav.logoAlt} width="80" height="60" />
        </div>
        
        <div className={styles["search-container"]}>
          <div className={styles["search-box"]}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={texts.nav.searchPlaceholder}
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
            <button
              className={styles["search-icon"]}
              onClick={() => submit()}
              aria-label={texts.nav.searchAriaLabel}
            >
              🔍
            </button>
          </div>
          
          {showSuggestions && (
            <div ref={suggestionsRef} className={styles["suggestions-dropdown"]}>
              {/* 연관 검색어 섹션 */}
              {suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`suggestion-${index}`}
                      className={`${styles["suggestion-item"]} ${
                        index === selectedSuggestionIndex ? styles["suggestion-selected"] : ""
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <span className={styles["suggestion-icon"]}>{suggestion.icon}</span>
                      <span className={styles["suggestion-text"]}>{suggestion.text}</span>
                      <span className={styles["suggestion-type"]}>
                        {suggestion.type === "building" ? "건물" : "편의시설"}
                      </span>
                    </div>
                  ))}
                  {popularTerms.length > 0 && <div className={styles["divider"]}></div>}
                </>
              )}
              
              {/* 인기 검색어 섹션 */}
              {popularTerms.length > 0 && (
                <>
                  {!query.trim() && (
                    <div className={styles["section-header"]}>
                      🔥 인기 검색어
                    </div>
                  )}
                  {popularTerms.map((term, index) => {
                    const actualIndex = suggestions.length + index;
                    return (
                      <div
                        key={`popular-${term.id}`}
                        className={`${styles["popular-item"]} ${
                          actualIndex === selectedSuggestionIndex ? styles["suggestion-selected"] : ""
                        }`}
                        onClick={() => handlePopularTermClick(term)}
                        onMouseEnter={() => setSelectedSuggestionIndex(actualIndex)}
                      >
                        <span className={styles["popular-rank"]}>{index + 1}</span>
                        <span className={styles["popular-text"]}>{term.term}</span>
                      </div>
                    );
                  })}
                </>
              )}
              
              {/* 로딩 상태 */}
              {isLoadingPopular && suggestions.length === 0 && (
                <div className={styles["loading-item"]}>
                  검색어 불러오는 중...
                </div>
              )}
              
              {/* 검색 결과 없음 */}
              {!isLoadingPopular && suggestions.length === 0 && popularTerms.length === 0 && query.trim() && (
                <div className={styles["no-results"]}>
                  검색 결과가 없습니다
                </div>
              )}
               {/* 빈 검색창 상태 */}
               {!isLoadingPopular && suggestions.length === 0 && popularTerms.length === 0 && !query.trim() && (
                <div className={styles["no-results"]}>
                  인기 검색어 로드 실패 또는 검색 기록 없음
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles["auth-lang-container"]}>
          {user ? (
            // 로그인 상태일 때
            <>
              <div className={styles["user-info"]}>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className={styles["profile-img"]}
                  />
                )}
                <span className={styles["user-name"]}>
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                className={styles["auth-btn"]}
                onClick={handleLogoutClick}
                disabled={loading}
              >
                {loading ? "..." : texts.auth.logout}
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때: "로그인" 버튼 하나만 표시
            <button
              className={styles["auth-btn"]}
              onClick={() => setShowLoginModal(true)} // 👈 클릭 시 모달 열기
              disabled={loading}
            >
              {loading ? "..." : texts.auth.login || "로그인"}
            </button>
          )}
          <button className={styles["lang-btn"]} onClick={onToggleLang}>
            {texts.nav.langButton}
          </button>
        </div>
      </div>

      <nav className={styles["nav-bar"]}>
        <ul>
          {tabs.map((tab) => (
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
    </header>
  );
};