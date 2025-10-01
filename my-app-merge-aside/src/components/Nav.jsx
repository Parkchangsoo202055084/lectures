// Nav.js
import logo from "../images/hanshin.png";
import styles from "./Nav.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { makeSearchIndex, norm } from "../utils/searchIndex";
import { saveSuccessfulSearch, saveAllSearchAttempts, getPopularSearchTerms } from "../utils/searchAnalytics";
import { translateToKorean, isEnglishQuery } from "../utils/englishKoreanTranslator";

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

  // 로그인 모달 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 검색 인덱스 생성
  const searchIndex = useMemo(() => makeSearchIndex(), []);

  // 인기 검색어 로드
  useEffect(() => {
    loadPopularSearchTerms();
  }, []);

  const loadPopularSearchTerms = async () => {
    setIsLoadingPopular(true);
    try {
      const popular = await getPopularSearchTerms(8);
      setPopularTerms(popular);
    } catch (error) {
      console.error("인기 검색어 로드 실패:", error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  // 연관 검색어 생성
  // generateSuggestions 함수 수정 부분만

const generateSuggestions = (inputQuery) => {
  if (!inputQuery.trim()) return [];

  const normalizedQuery = norm(inputQuery);
  const suggestions = [];
  const maxSuggestions = 6;
  const seen = new Set();

  // 동아리 우선 검색
  for (const [key, value] of searchIndex.clubIndex) {
    if (suggestions.length >= maxSuggestions) break;
    const uniqueKey = `club-${value.name}`;
    if ((key.includes(normalizedQuery) || normalizedQuery.includes(key)) && !seen.has(uniqueKey)) {
      suggestions.push({ 
        text: value.name, 
        type: "club", 
        icon: "🎭", 
        source: "index",
        category: value.category
      });
      seen.add(uniqueKey);
    }
  }

  // 건물
  for (const [key, value] of searchIndex.buildingIndex) {
    if (suggestions.length >= maxSuggestions) break;
    if ((key.includes(normalizedQuery) || normalizedQuery.includes(key)) && !seen.has(value.name)) {
      suggestions.push({ text: value.name, type: "building", icon: "🏢", source: "index" });
      seen.add(value.name);
    }
  }

  // 편의시설
  for (const [key, value] of searchIndex.facilityIndex) {
    if (suggestions.length >= maxSuggestions) break;
    if ((key.includes(normalizedQuery) || normalizedQuery.includes(key)) && !seen.has(value.item)) {
      suggestions.push({ text: value.item, type: "facility", icon: "🏪", source: "index" });
      seen.add(value.item);
    }
  }

  // 네비게이션
  for (const [key, value] of searchIndex.navigationIndex) {
    if (suggestions.length >= maxSuggestions) break;
    const uniqueKey = `${value.tab}-${value.item}`;
    if ((key.includes(normalizedQuery) || normalizedQuery.includes(key)) && !seen.has(uniqueKey)) {
      suggestions.push({
        text: value.title || value.item,
        type: "navigation",
        icon: value.tab === "bus" ? "🚌" : value.tab === "assist" ? "ℹ️" : value.tab === "newB" ? "📅" : "🎭",
        source: "index",
        category: value.tab
      });
      seen.add(uniqueKey);
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

  // 검색 실행 (개선)
  const submit = async (searchQuery = query) => {
    if (!searchQuery || !searchQuery.trim()) return;
    const originalQuery = searchQuery.trim();
    let searchQueryForIndex = originalQuery;
    let translatedQuery = null;

    // 1) 영어 여부 판단 후 번역(시도)
    if (isEnglishQuery(originalQuery)) {
      try {
        translatedQuery = await translateToKorean(originalQuery);
        if (translatedQuery && translatedQuery.trim()) {
          searchQueryForIndex = translatedQuery.trim();
        }
        console.log(`번역 시도: "${originalQuery}" -> "${translatedQuery}"`);
      } catch (err) {
        console.error("번역 실패:", err);
      }
    }

    // 2) 검색 인덱스에서 여러 후보로 시도 (번역된 것 먼저, 원본도 시도)
    let searchResult = null;
    try {
      // 첫 시도: 번역된(또는 원본) 문자열로 검색
      searchResult = searchIndex.search(searchQueryForIndex);
      console.log(`인덱스 검색 시도 1: "${searchQueryForIndex}" ->`, !!searchResult);

      // 두 번째 시도: 번역이 있었고 아직 결과가 없으면 원본으로도 검색
      if (!searchResult && translatedQuery && originalQuery !== searchQueryForIndex) {
        searchResult = searchIndex.search(originalQuery);
        console.log(`인덱스 검색 시도 2 (원본): "${originalQuery}" ->`, !!searchResult);
      }

      // 세 번째 시도(안정성 보완): norm(original) / norm(translated) 시도 (인덱스 impl에 따라 유효)
      if (!searchResult) {
        try {
          const normOrig = norm(originalQuery);
          const normTrans = translatedQuery ? norm(translatedQuery) : null;
          if (normTrans && normTrans !== searchQueryForIndex) {
            searchResult = searchIndex.search(normTrans);
            console.log(`인덱스 검색 시도 3 (normTrans): "${normTrans}" ->`, !!searchResult);
          }
          if (!searchResult) {
            searchResult = searchIndex.search(normOrig);
            console.log(`인덱스 검색 시도 4 (normOrig): "${normOrig}" ->`, !!searchResult);
          }
        } catch (e) {
          // norm() 사용이 불필요하거나 실패하면 무시
        }
      }
    } catch (err) {
      console.error("검색 인덱스 조회 중 오류:", err);
    }

    const isSuccessful = !!searchResult;
    console.log(`최종 검색어(인덱스용): "${searchQueryForIndex}", 성공: ${isSuccessful}`, searchResult || null);

    // 3) analytics 저장 (원본 쿼리로 저장)
    try {
      await saveAllSearchAttempts(originalQuery, isSuccessful);
      if (isSuccessful) {
        await saveSuccessfulSearch(originalQuery);
        loadPopularSearchTerms();
      }
    } catch (error) {
      console.error("검색어 저장 실패:", error);
    }

    // 4) 기존 onSearch 호출 (하위 호환 유지: 첫 인자 = 문자열, 두 번째 인자 = searchResult)
    try {
      if (typeof onSearch === "function") {
        // 기존 핸들러가 문자열만 기대하는 경우에도 문제없도록 첫 인자는 문자열 전달
        onSearch(searchQueryForIndex, searchResult);
      }
    } catch (err) {
      console.error("onSearch 실행 중 오류:", err);
    }

    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // 입력 핸들러
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
      setShowSuggestions(true);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    submit(suggestion.text);
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
      setSelectedSuggestionIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  const goToHome = () => setActiveTab("map");

  // 로그인 관련
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

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
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인 실패: " + (error?.message || error));
    }
  };

  const handleGoogleLoginClick = async () => {
    try {
      await loginWithGoogle();
      setShowLoginModal(false);
    } catch (error) {
      console.error("Google login failed:", error);
      alert("구글 로그인 실패: " + (error?.message || error));
    }
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  // 외부 클릭 시 드롭다운/모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
      if (showLoginModal) {
        const modal = document.querySelector(`.${styles["login-modal"]}`);
        const backdrop = document.querySelector(`.${styles["modal-backdrop"]}`);
        if (backdrop && backdrop.contains(event.target) && (!modal || !modal.contains(event.target))) {
          setShowLoginModal(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLoginModal]);

  return (
    <header className={styles.header}>
      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className={styles["modal-backdrop"]} onClick={() => setShowLoginModal(false)}>
          <div className={styles["login-modal"]} onClick={(e) => e.stopPropagation()}>
            <button className={styles["close-button"]} onClick={() => setShowLoginModal(false)}>
              &times;
            </button>
            <h2 className={styles["modal-title"]}>{texts.auth.login || "로그인"}</h2>

            <div className={styles["login-form"]}>
              <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className={styles["auth-input-modal"]} />
              <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className={styles["auth-input-modal"]} />
              <button className={styles["auth-btn-modal"]} onClick={handleEmailLoginClick} disabled={loading}>
                {loading ? "..." : texts.auth.emailLogin || "이메일로 로그인"}
              </button>
            </div>

            <div className={styles["divider-modal"]}>또는</div>

            <button className={`${styles["auth-btn-modal"]} ${styles["google-btn"]}`} onClick={handleGoogleLoginClick} disabled={loading}>
              {loading ? "..." : "🔑 구글 계정으로 로그인"}
            </button>
          </div>
        </div>
      )}

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
            <button className={styles["search-icon"]} onClick={() => submit()} aria-label={texts.nav.searchAriaLabel}>
              🔍
            </button>
          </div>

          {showSuggestions && (
            <div ref={suggestionsRef} className={styles["suggestions-dropdown"]}>
              {suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`suggestion-${index}`}
                      className={`${styles["suggestion-item"]} ${index === selectedSuggestionIndex ? styles["suggestion-selected"] : ""}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <span className={styles["suggestion-icon"]}>{suggestion.icon}</span>
                      <span className={styles["suggestion-text"]}>{suggestion.text}</span>
                      <span className={styles["suggestion-type"]}>
                        {suggestion.type === "building" ? "건물" : 
                         suggestion.type === "facility" ? "편의시설" :
                         suggestion.type === "club" ? `동아리 (${suggestion.category})` : 
                         suggestion.type === "navigation" ? 
                           (suggestion.category === "bus" ? "버스 정보" : 
                            suggestion.category === "assist" ? "학생지원" : 
                            suggestion.category === "newB" ? "재학생 정보" : 
                            suggestion.category === "club" ? "동아리" : "기타") : 
                         "기타"}
                      </span>
                    </div>
                  ))}
                  {popularTerms.length > 0 && <div className={styles["divider"]}></div>}
                </>
              )}

              {popularTerms.length > 0 && (
                <>
                  {!query.trim() && <div className={styles["section-header"]}>🔥 인기 검색어</div>}
                  {popularTerms.map((term, index) => {
                    const actualIndex = suggestions.length + index;
                    return (
                      <div
                        key={`popular-${term.id}`}
                        className={`${styles["popular-item"]} ${actualIndex === selectedSuggestionIndex ? styles["suggestion-selected"] : ""}`}
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

              {isLoadingPopular && suggestions.length === 0 && <div className={styles["loading-item"]}>검색어 불러오는 중...</div>}

              {!isLoadingPopular && suggestions.length === 0 && popularTerms.length === 0 && query.trim() && (
                <div className={styles["no-results"]}>검색 결과가 없습니다</div>
              )}

              {!isLoadingPopular && suggestions.length === 0 && popularTerms.length === 0 && !query.trim() && (
                <div className={styles["no-results"]}>인기 검색어 로드 실패 또는 검색 기록 없음</div>
              )}
            </div>
          )}
        </div>

        <div className={styles["auth-lang-container"]}>
          {user ? (
            <>
              <div className={styles["user-info"]}>
                {user.photoURL && <img src={user.photoURL} alt="Profile" className={styles["profile-img"]} />}
                <span className={styles["user-name"]}>{user.displayName || user.email}</span>
              </div>
              <button className={styles["auth-btn"]} onClick={handleLogoutClick} disabled={loading}>
                {loading ? "..." : texts.auth.logout}
              </button>
            </>
          ) : (
            <button className={styles["auth-btn"]} onClick={() => setShowLoginModal(true)} disabled={loading}>
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
              <button onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? styles["active-tab"] : ""}>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
