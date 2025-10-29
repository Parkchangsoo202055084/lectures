// src/components/MealMenu.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 🆕 5개 칸 고정
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DayCard = styled.div`
  background: ${props => props.$isToday ? '#fff9e6' : 'white'};
  border: ${props => props.$isToday ? '2px solid #401e83' : '1px solid #eee'};
  border-radius: 12px;
  padding: 14px; // 🆕 패딩 줄임
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  min-height: 300px; // 🆕 최소 높이 설정
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; // 🆕 줄임
  padding-bottom: 6px;
  border-bottom: 2px solid #f0f0f0;
`;

const DayName = styled.h3`
  margin: 0;
  font-size: 16px; // 🆕 폰트 크기 줄임
  color: ${props => props.$isToday ? '#401e83' : '#333'};
`;

const TodayBadge = styled.span`
  background: #401e83;
  color: white;
  padding: 3px 10px; // 🆕 크기 줄임
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
`;

const RestaurantSection = styled.div`
  margin-bottom: 12px; // 🆕 줄임

  &:last-child {
    margin-bottom: 0;
  }
`;

const RestaurantTitle = styled.h4`
  margin: 0 0 6px 0; // 🆕 줄임
  font-size: 13px; // 🆕 폰트 크기 줄임
  font-weight: bold;
  color: #401e83;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 5px 0; // 🆕 줄임
  color: #555;
  font-size: 12px; // 🆕 폰트 크기 줄임
  line-height: 1.4;
  border-bottom: 1px dashed #eee;
  word-break: keep-all; // 🆕 한글 단어 단위 줄바꿈
  overflow-wrap: break-word; // 🆕 긴 영문 줄바꿈

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
`;

export default function MealMenu({ texts, lang }) {
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dayNames = {
    ko: ['월요일', '화요일', '수요일', '목요일', '금요일'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  };

  const restaurantNames = {
    ko: {
      immanuel: '🏛️ 임마누엘관',
      jangjunha: '🏢 장준하통일관'
    },
    en: {
      immanuel: '🏛️ Emmanuel',
      jangjunha: '🏢 Jangjunha'
    }
  };

  useEffect(() => {
    fetchMealData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMealData = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      
      const monday = new Date(today);
      monday.setDate(today.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);

      const mealsRef = collection(db, 'meals');
      const q = query(
        mealsRef,
        where('date', '>=', monday),
        where('date', '<=', friday),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const meals = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date.toDate();
        const dayKey = date.getDay() - 1;
        
        if (dayKey >= 0 && dayKey < 5) {
          meals[dayKey] = {
            date: date,
            immanuel: data.immanuel || [],
            jangjunha: data.jangjunha || []
          };
        }
      });

      console.log('📊 Fetched meal data:', meals);
      setWeekData(meals);
    } catch (err) {
      console.error('Error fetching meal data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // 🆕 공백 제거 + 길이 조정 함수
const cleanAndTruncateText = (text, maxLength = 40) => {
  // 공백 여러 개를 하나로 줄이기
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
};

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          {lang === 'ko' ? '🍱 학식 메뉴를 불러오는 중...' : '🍱 Loading meal menu...'}
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          {lang === 'ko' ? '❌ 메뉴를 불러오는 중 오류가 발생했습니다.' : '❌ Error loading menu'}
          <br />
          <small>{error}</small>
        </ErrorMessage>
      </Container>
    );
  }

  if (!weekData || Object.keys(weekData).length === 0) {
    return (
      <Container>
        <NoDataMessage>
          {lang === 'ko' 
            ? '📋 이번 주 학식 메뉴가 아직 등록되지 않았습니다.' 
            : '📋 This week\'s meal menu has not been registered yet.'}
        </NoDataMessage>
      </Container>
    );
  }

  return (
    <Container>
      <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>
        {lang === 'ko' ? '🍱 이번 주 학식 메뉴' : '🍱 This Week\'s Meal Menu'}
      </h2>

      <DayGrid>
        {[0, 1, 2, 3, 4].map((dayIndex) => {
          const dayData = weekData[dayIndex];
          const today = dayData ? isToday(dayData.date) : false;

          return (
            <DayCard key={dayIndex} $isToday={today}>
              <DayHeader>
                <DayName $isToday={today}>
                  {dayNames[lang][dayIndex]}
                </DayName>
                {today && (
                  <TodayBadge>
                    {lang === 'ko' ? '오늘' : 'Today'}
                  </TodayBadge>
                )}
              </DayHeader>

              {dayData ? (
                <>
                  {/* 임마누엘관 */}
                  {dayData.immanuel && dayData.immanuel.length > 0 && (
                    <RestaurantSection>
                      <RestaurantTitle>
                        {restaurantNames[lang].immanuel}
                      </RestaurantTitle>
                      <MenuList>
                        {dayData.immanuel.map((item, idx) => (
                          <MenuItem key={idx} title={item.replace(/\s+/g, ' ').trim()}> 
                            {cleanAndTruncateText(item, 35)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </RestaurantSection>
                  )}

                  {/* 장준하통일관 */}
                  {dayData.jangjunha && dayData.jangjunha.length > 0 && (
                    <RestaurantSection>
                      <RestaurantTitle>
                        {restaurantNames[lang].jangjunha}
                      </RestaurantTitle>
                      <MenuList>
                        {dayData.jangjunha.map((item, idx) => (
                          <MenuItem key={idx} title={item.replace(/\s+/g, ' ').trim()}>
                            {cleanAndTruncateText(item, 35)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </RestaurantSection>
                  )}

                  {/* 둘 다 없으면 */}
                  {(!dayData.immanuel || dayData.immanuel.length === 0) && 
                   (!dayData.jangjunha || dayData.jangjunha.length === 0) && (
                    <div style={{ color: '#999', fontSize: '13px', padding: '10px 0' }}>
                      {lang === 'ko' ? '메뉴 정보 없음' : 'No menu available'}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: '#999', fontSize: '13px', padding: '10px 0' }}>
                  {lang === 'ko' ? '메뉴 정보 없음' : 'No menu available'}
                </div>
              )}
            </DayCard>
          );
        })}
      </DayGrid>
    </Container>
  );
}