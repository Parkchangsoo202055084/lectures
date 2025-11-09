import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  
  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const ScrollContainer = styled.div`
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

export const DayGrid = styled.div`
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

export const DayCard = styled.div`
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

export const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #f0f0f0;
`;

export const DayName = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${props => props.$isToday ? '#401e83' : '#333'};
`;

export const TodayBadge = styled.span`
  background: #401e83;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
`;

export const RestaurantSection = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const RestaurantTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: bold;
  color: #401e83;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const MenuItem = styled.li`
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

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
`;

export const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
`;
