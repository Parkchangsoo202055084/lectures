// src/utils/englishKoreanTranslator.js

// 데이터 파일에서 번역 딕셔너리를 불러옵니다.
import { TRANSLATION_DICT } from "./translations/mainTranslations"; 

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 영어 검색어를 한글로 번역합니다.
 * @param {string} englishQuery - 번역할 영어 쿼리 문자열.
 * @returns {string} - 번역된 한글 문자열 또는 원본 쿼리.
 */
export function translateToKorean(englishQuery) {
    if (!englishQuery || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(englishQuery)) {
        return englishQuery;
    }

    const original = englishQuery;
    let translated = englishQuery.toLowerCase();
    let replacedCount = 0;

    Object.keys(TRANSLATION_DICT)
        // 긴 단어부터 먼저 치환하여 정확도 향상. 
        .sort((a, b) => b.length - a.length) 
        .forEach((eng) => {
            const kor = TRANSLATION_DICT[eng];
            
            let regex;
            if (eng.includes(' ')) {
                // 복합어는 정확히 일치하도록 (공백 포함)
                regex = new RegExp(escapeRegExp(eng), 'gi');
            } else {
                // 단일어는 단어 경계(\b)를 사용하여 부분 일치 방지
                regex = new RegExp(`\\b${escapeRegExp(eng)}\\b`, 'gi');
            }

            const matchCount = translated.match(regex)?.length || 0;
            if (matchCount > 0) {
                replacedCount += matchCount;
                translated = translated.replace(regex, kor);
            }
        });

    // 단어 사이 공백 제거 및 연속 공백 정리 (예: '학생 회관' -> '학생회관')
    translated = translated.replace(/(\S)\s+(\S)/g, '$1$2');
    translated = translated.replace(/\s+/g, ' ').trim();

    if (replacedCount === 0 || translated.toLowerCase() === original.toLowerCase()) {
        return original;
    }

    return translated;
}

/**
 * 입력 문자열에 영어(라틴 알파벳)가 포함되어 있고 한글이 없으면 true 반환
 * @param {string} query - 확인할 문자열.
 * @returns {boolean} - 영어 쿼리인 경우 true.
 */
export function isEnglishQuery(query) {
    // 쿼리가 비어있거나, 한글이 포함되어 있으면 false
    if (!query || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(query)) return false;
    // 알파벳(대소문자)이 포함되어 있으면 true
    return /[a-zA-Z]/.test(query);
}