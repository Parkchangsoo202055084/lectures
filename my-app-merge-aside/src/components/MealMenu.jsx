// src/components/MealMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  
  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  /* 스크롤바 숨기기 (선택사항) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 769px) {
    width: 100%;
    max-width: 1400px;
  }

  @media (max-width: 768px) {
    margin: 0 -20px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
  }
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, minmax(280px, 1fr));
    grid-auto-flow: column;
    width: max-content;
  }
`;

const DayCard = styled.div`
  background: ${props => props.$isToday ? '#fff9e6' : 'white'};
  border: ${props => props.$isToday ? '2px solid #401e83' : '1px solid #eee'};
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  min-height: 300px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    min-height: 350px;
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #f0f0f0;
`;

const DayName = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${props => props.$isToday ? '#401e83' : '#333'};
`;

const TodayBadge = styled.span`
  background: #401e83;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
`;

const RestaurantSection = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RestaurantTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 13px;
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
  padding: 5px 0;
  color: #555;
  font-size: 12px;
  line-height: 1.4;
  border-bottom: 1px dashed #eee;
  word-break: keep-all;
  overflow-wrap: break-word;

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

const cleanAndTruncateText = (text, maxLength = 40) => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
};

export default function MealMenu({ texts, lang }) {
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

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

  useEffect(() => {
    // 데이터 로드 후 오늘 날짜로 스크롤
    if (weekData && scrollContainerRef.current) {
      scrollToToday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekData]);

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

  const getTodayIndex = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // 일요일(0)은 -1, 월요일(1)은 0, ..., 금요일(5)은 4
    return dayOfWeek === 0 ? -1 : dayOfWeek - 1;
  };

  const scrollToToday = () => {
    if (!scrollContainerRef.current) return;

    const todayIndex = getTodayIndex();
    if (todayIndex < 0 || todayIndex > 4) return; // 주말이면 스크롤 안함

    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('[data-day-index]');
    
    if (cards[todayIndex]) {
      const card = cards[todayIndex];
      const containerWidth = container.offsetWidth;
      const cardWidth = card.offsetWidth;
      const cardLeft = card.offsetLeft;
      
      // 카드를 중앙에 위치시키기
      const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
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

      <ScrollContainer ref={scrollContainerRef}>
        <DayGrid>
          {[0, 1, 2, 3, 4].map((dayIndex) => {
            const dayData = weekData[dayIndex];
            const today = dayData ? isToday(dayData.date) : false;

            return (
              <DayCard 
                key={dayIndex} 
                $isToday={today}
                data-day-index={dayIndex}
              >
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
      </ScrollContainer>
    </Container>
  );
}