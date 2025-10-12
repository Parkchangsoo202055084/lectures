// FILE: src/components/SearchBar.jsx

import React, { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css"; 
import { norm } from "../utils/searchIndex"; 
import { saveSuccessfulSearch, saveAllSearchAttempts, getPopularSearchTerms } from "../utils/searchAnalytics";
import { translateToKorean, isEnglishQuery } from "../utils/englishKoreanTranslator";

export const SearchBar = ({ onSearch, texts, searchIndex, isMobile }) => {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [popularTerms, setPopularTerms] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    // ❌ showMobileSearchModal 상태 제거됨

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

    // 연관 검색어 생성 (로직 유지)
    const generateSuggestions = (inputQuery) => {
        if (!inputQuery.trim() || !searchIndex) return [];

        const normalizedQuery = norm(inputQuery);
        const suggestions = [];
        const maxSuggestions = 6;
        const seen = new Set();

        // 클럽
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

        // 🆕 학사일정 이벤트
        if (searchIndex.calendarIndex) {
            for (const [key, value] of searchIndex.calendarIndex) {
                if (suggestions.length >= maxSuggestions) break;
                const uniqueKey = `calendar-${value.title}`;
                if ((key.includes(normalizedQuery) || normalizedQuery.includes(key)) && !seen.has(uniqueKey)) {
                    suggestions.push({ 
                        text: value.title, 
                        type: "calendar", 
                        icon: "📅", 
                        source: "index",
                        eventType: value.eventType
                    });
                    seen.add(uniqueKey);
                }
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

    // 검색 실행 (모바일 모달 닫기 로직 제거)
    const submit = async (searchQuery = query) => {
        if (!searchQuery || !searchQuery.trim() || !searchIndex) return;
        const originalQuery = searchQuery.trim();
        let searchQueryForIndex = originalQuery;
        let translatedQuery = null;

        // 1) 영어 번역 시도
        if (isEnglishQuery(originalQuery)) {
            try {
                translatedQuery = await translateToKorean(originalQuery);
                if (translatedQuery && translatedQuery.trim()) {
                    searchQueryForIndex = translatedQuery.trim();
                }
            } catch (err) {
                console.error("번역 실패:", err);
            }
        }

        // 2) 검색 인덱스에서 조회 (로직 유지)
        let searchResult = null;
        try {
            searchResult = searchIndex.search(searchQueryForIndex);
            
            if (!searchResult && translatedQuery && originalQuery !== searchQueryForIndex) {
                searchResult = searchIndex.search(originalQuery);
            }

            if (!searchResult) {
                try {
                    const normOrig = norm(originalQuery);
                    const normTrans = translatedQuery ? norm(translatedQuery) : null;
                    if (normTrans && normTrans !== searchQueryForIndex) {
                        searchResult = searchIndex.search(normTrans);
                    }
                    if (!searchResult) {
                        searchResult = searchIndex.search(normOrig);
                    }
                } catch (e) {
                    // Ignore
                }
            }
        } catch (err) {
            console.error("검색 인덱스 조회 중 오류:", err);
        }

        const isSuccessful = !!searchResult;

        // 3) analytics 저장 (로직 유지)
        try {
            await saveAllSearchAttempts(originalQuery, isSuccessful);
            if (isSuccessful) {
                await saveSuccessfulSearch(originalQuery);
                loadPopularSearchTerms();
            }
        } catch (error) {
            console.error("검색어 저장 실패:", error);
        }

        // 4) onSearch 호출 (로직 유지)
        try {
            if (typeof onSearch === "function") {
                onSearch(searchQueryForIndex, searchResult);
            }
        } catch (err) {
            console.error("onSearch 실행 중 오류:", err);
        }
        
        // ❌ 모바일 모달 닫기 로직 제거됨
        // if (isMobile && isSuccessful) { closeMobileSearchModal(); } 

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
            setShowSuggestions(true); // ⭐️ 입력값이 없으면 인기 검색어 표시를 위해 열어둠 (수정됨)
        }
        setSelectedSuggestionIndex(-1);
    };

    // 포커스 핸들러 (모바일 모달 호출 로직 제거)
    const handleInputFocus = () => {
        if (query.trim()) {
            const newSuggestions = generateSuggestions(query);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
        } else {
            // 쿼리가 없으면 인기 검색어를 보여주기 위해 드롭다운을 엽니다.
            setShowSuggestions(true);
            setSuggestions([]); 
        }
        setSelectedSuggestionIndex(-1);
        
        // ❌ 모바일 모달 관련 로직 제거됨
        // if (isMobile && !showMobileSearchModal) {
        //     searchInputRef.current?.blur();
        //     handleMobileSearchClick();
        // }
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
    
    // 외부 클릭 시 드롭다운 닫기 (로직 유지)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                !searchInputRef.current?.contains(event.target)
            ) {
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []); 

    // ❌ 모바일 검색 클릭 및 모달 닫기 함수 제거됨
    // const handleMobileSearchClick = () => { ... }
    // const closeMobileSearchModal = () => { ... }

    // ⭐️ PC / Mobile 렌더링 분기
    // 모바일도 PC와 동일한 인라인 구조를 사용하도록 변경

    if (isMobile) {
        // ⭐️ 모바일 렌더링: 인라인 검색창 + 드롭다운 사용
        return (
            <div className={`${styles["search-container"]} ${styles["search-container-mobile"]}`}>
                
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

                {/* showSuggestions가 true일 때만 드롭다운 표시 */}
                {showSuggestions && (
                    <div 
                        ref={suggestionsRef} 
                        className={`${styles["suggestions-dropdown"]} ${styles["suggestions-dropdown-mobile"]}`}
                    >
                        {/* PC 렌더링과 동일한 드롭다운 내용 (아래 PC 렌더링 부분 참고하여 복사) */}
                        
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
                                            suggestion.type === "calendar" ? "학사일정" :
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
        );
    }
    
    // ⭐️ PC 렌더링: 기존 코드 유지
    return (
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
    );
};