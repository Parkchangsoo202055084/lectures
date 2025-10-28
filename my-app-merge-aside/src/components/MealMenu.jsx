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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DayCard = styled.div`
  background: ${props => props.$isToday ? '#fff9e6' : 'white'};
  border: ${props => props.$isToday ? '2px solid #401e83' : '1px solid #eee'};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const DayName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${props => props.$isToday ? '#401e83' : '#333'};
`;

const TodayBadge = styled.span`
  background: #401e83;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 8px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  border-bottom: 1px dashed #eee;

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

  useEffect(() => {
    fetchMealData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMealData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 이번 주의 월요일과 금요일 날짜 계산
      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      
      const monday = new Date(today);
      monday.setDate(today.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);

      // Firestore에서 이번 주 식단 가져오기
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
        const dayKey = date.getDay() - 1; // 월요일=0, 화요일=1, ...
        
        if (dayKey >= 0 && dayKey < 5) {
          meals[dayKey] = {
            date: date,
            menu: data.menu || []
          };
        }
      });

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
      <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>
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

              {dayData && dayData.menu && dayData.menu.length > 0 ? (
                <MenuList>
                  {dayData.menu.map((item, idx) => (
                    <MenuItem key={idx}>{item}</MenuItem>
                  ))}
                </MenuList>
              ) : (
                <div style={{ color: '#999', fontSize: '14px', padding: '12px 0' }}>
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