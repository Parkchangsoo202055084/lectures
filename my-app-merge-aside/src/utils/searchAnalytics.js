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

export async function saveSearchTerm(searchTerm) {
  try {
    console.log('검색어 저장:', searchTerm);
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    if (!normalizedTerm) return;

    const searchStatsRef = doc(db, 'searchStats', normalizedTerm);
    const searchStatsDoc = await getDoc(searchStatsRef);

    if (searchStatsDoc.exists()) {
      await updateDoc(searchStatsRef, {
        count: increment(1),
        lastSearched: serverTimestamp()
      });
    } else {
      await setDoc(searchStatsRef, {
        term: searchTerm,
        normalizedTerm: normalizedTerm,
        count: 1,
        firstSearched: serverTimestamp(),
        lastSearched: serverTimestamp()
      });
    }

    console.log('검색어 저장 완료:', searchTerm);
  } catch (error) {
    console.error('검색어 저장 실패:', error);
  }
}

export async function getPopularSearchTerms(limitCount = 10) {
  try {
    console.log('인기 검색어 조회 중...');
    
    const searchStatsRef = collection(db, 'searchStats');
    const q = query(
      searchStatsRef, 
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