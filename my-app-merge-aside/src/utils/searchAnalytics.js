// FILE: src/utils/searchAnalytics.js

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// 검색 성공한 검색어만 저장 (인기 검색어용)
export async function saveSuccessfulSearch(searchTerm) {
  try {
    console.log('성공한 검색어 저장:', searchTerm);
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    if (!normalizedTerm) return;

    const successfulSearchRef = doc(db, 'successfulSearches', normalizedTerm);
    const searchDoc = await getDoc(successfulSearchRef);

    if (searchDoc.exists()) {
      await updateDoc(successfulSearchRef, {
        count: increment(1),
        lastSearched: serverTimestamp()
      });
    } else {
      await setDoc(successfulSearchRef, {
        term: searchTerm,
        normalizedTerm: normalizedTerm,
        count: 1,
        firstSearched: serverTimestamp(),
        lastSearched: serverTimestamp()
      });
    }

    console.log('성공한 검색어 저장 완료:', searchTerm);
  } catch (error) {
    console.error('성공한 검색어 저장 실패:', error);
  }
}

// 모든 검색어 저장 (오타 분석용)
export async function saveAllSearchAttempts(searchTerm, isSuccessful) {
  try {
    console.log('모든 검색 시도 저장:', searchTerm, '성공 여부:', isSuccessful);
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    if (!normalizedTerm) return;

    const allSearchRef = doc(db, 'allSearchAttempts', normalizedTerm);
    const searchDoc = await getDoc(allSearchRef);

    if (searchDoc.exists()) {
      const updateData = {
        count: increment(1),
        lastSearched: serverTimestamp()
      };
      
      if (isSuccessful) {
        updateData.successCount = increment(1);
      } else {
        updateData.failCount = increment(1);
      }
      
      await updateDoc(allSearchRef, updateData);
    } else {
      await setDoc(allSearchRef, {
        term: searchTerm,
        normalizedTerm: normalizedTerm,
        count: 1,
        successCount: isSuccessful ? 1 : 0,
        failCount: isSuccessful ? 0 : 1,
        firstSearched: serverTimestamp(),
        lastSearched: serverTimestamp()
      });
    }

    console.log('모든 검색 시도 저장 완료:', searchTerm);
  } catch (error) {
    console.error('모든 검색 시도 저장 실패:', error);
  }
}

// 인기 검색어 조회 (성공한 검색어만)
export async function getPopularSearchTerms(limitCount = 10) {
  try {
    console.log('인기 검색어 조회 중...');
    
    const successfulSearchRef = collection(db, 'successfulSearches');
    const q = query(
      successfulSearchRef, 
      orderBy('count', 'desc'), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const popularTerms = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      popularTerms.push({
        id: doc.id,
        term: data.term,
        lastSearched: data.lastSearched
      });
    });
    
    console.log('인기 검색어 조회 완료:', popularTerms.length + '개');
    return popularTerms;
  } catch (error) {
    console.error('인기 검색어 조회 실패:', error);
    return [];
  }
}

// 실패한 검색어 분석용 조회
export async function getFailedSearchTerms(limitCount = 20) {
  try {
    console.log('실패한 검색어 조회 중...');
    
    const allSearchRef = collection(db, 'allSearchAttempts');
    const q = query(
      allSearchRef, 
      orderBy('failCount', 'desc'), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const failedTerms = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.failCount > 0) {
        failedTerms.push({
          id: doc.id,
          term: data.term,
          failCount: data.failCount,
          totalCount: data.count,
          lastSearched: data.lastSearched
        });
      }
    });
    
    console.log('실패한 검색어 조회 완료:', failedTerms.length + '개');
    return failedTerms;
  } catch (error) {
    console.error('실패한 검색어 조회 실패:', error);
    return [];
  }
}

export async function addSampleSearchData() {
  try {
    // 성공한 검색어 샘플
    const successfulSamples = [
      { term: '한신대학교', count: 15 },
      { term: '도서관', count: 12 },
      { term: '학생회관', count: 10 },
      { term: '식당', count: 8 },
      { term: '카페', count: 6 },
      { term: '편의점', count: 5 }
    ];

    for (const item of successfulSamples) {
      const successfulSearchRef = doc(db, 'successfulSearches', item.term.toLowerCase());
      await setDoc(successfulSearchRef, {
        term: item.term,
        normalizedTerm: item.term.toLowerCase(),
        count: item.count,
        firstSearched: serverTimestamp(),
        lastSearched: serverTimestamp()
      });
    }
    
    // 모든 검색 시도 샘플 (성공 + 실패)
    const allAttemptsSamples = [
      { term: '한신대학교', count: 15, successCount: 15, failCount: 0 },
      { term: '도서관', count: 12, successCount: 12, failCount: 0 },
      { term: '휴게소', count: 8, successCount: 0, failCount: 8 }, // 실패 예시
      { term: 'ㅈㄱㄱ', count: 5, successCount: 0, failCount: 5 }, // 오타 예시
      { term: '장공관', count: 3, successCount: 3, failCount: 0 }
    ];

    for (const item of allAttemptsSamples) {
      const allSearchRef = doc(db, 'allSearchAttempts', item.term.toLowerCase());
      await setDoc(allSearchRef, {
        term: item.term,
        normalizedTerm: item.term.toLowerCase(),
        count: item.count,
        successCount: item.successCount,
        failCount: item.failCount,
        firstSearched: serverTimestamp(),
        lastSearched: serverTimestamp()
      });
    }
    
    console.log('테스트 데이터 추가 완료!');
    alert('테스트 데이터가 추가되었습니다!');
  } catch (error) {
    console.error('테스트 데이터 추가 실패:', error);
  }
}