// FILE: src/components/CalendarPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import enUS from "date-fns/locale/en-US";

// 학사일정 데이터 가져오기
import eventsData from "../data/eventsData";

// CalendarPage 컴포넌트
const CalendarPage = ({ texts, lang = "ko", highlightEvent = null }) => {
  // 언어에 따른 로케일 설정
  const locale = lang === "ko" ? ko : enUS;
  
  const localizer = useMemo(() => {
    return dateFnsLocalizer({
      format,
      parse,
      startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // 월요일 시작
      getDay,
      locales: { [lang]: locale },
    });
  }, [lang, locale]);

  // 언어에 맞는 이벤트 데이터 선택 및 Date 객체로 변환
  const formattedEvents = useMemo(() => {
    const langEvents = eventsData[lang] || eventsData.ko;
    return langEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  }, [lang]);

  const [events, setEvents] = useState(formattedEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedEventId, setHighlightedEventId] = useState(null);

  // 언어가 변경되면 이벤트 업데이트
  useEffect(() => {
    setEvents(formattedEvents);
  }, [formattedEvents]);

  // highlightEvent prop이 변경되면 해당 이벤트로 이동
  useEffect(() => {
    if (highlightEvent && highlightEvent.title && highlightEvent.start) {
      console.log('🎯 하이라이트할 이벤트:', highlightEvent);
      
      // 약간의 딜레이를 주어 캘린더가 완전히 렌더링된 후 실행
      setTimeout(() => {
        // 해당 이벤트 찾기
        const targetEvent = formattedEvents.find(
          event => event.title === highlightEvent.title
        );
        
        if (targetEvent) {
          console.log('✅ 이벤트 찾음:', targetEvent);
          // 해당 날짜로 이동
          const eventDate = new Date(targetEvent.start);
          console.log('📅 이동할 날짜:', eventDate);
          setSelectedDate(eventDate);
          // 이벤트 하이라이트
          setHighlightedEventId(targetEvent.title);
          
          // 3초 후 하이라이트 제거
          setTimeout(() => {
            setHighlightedEventId(null);
          }, 3000);
        } else {
          console.log('❌ 이벤트를 찾을 수 없음');
        }
      }, 100); // 100ms 딜레이
    }
  }, [highlightEvent, formattedEvents]);

  // 이벤트 타입에 따라 스타일을 다르게 적용하는 함수
  const eventPropGetter = (event) => {
    // 하이라이트된 이벤트는 특별한 스타일 적용
    if (event.title === highlightedEventId) {
      console.log('🎨 하이라이트 스타일 적용:', event.title);
      return {
        className: `${event.type} highlighted-event`,
        style: {
          backgroundColor: "#ff9800", // 주황색으로 강조
          color: "white",
          border: "3px solid #f57c00",
          fontWeight: "bold",
          borderRadius: "4px",
          boxShadow: "0 0 15px rgba(255, 152, 0, 0.8)",
          animation: "pulse 1s ease-in-out infinite",
        }
      };
    }
    
    let newStyle = {
      backgroundColor: "#3174ad", // 기본 배경색
      color: "white",
      borderRadius: "0px",
      border: "none",
    };
    
    if (event.type === "holiday") {
      newStyle.backgroundColor = "#ff7f7f"; // 공휴일은 붉은색
    } else if (event.type === "exam") {
      newStyle.backgroundColor = "#32a852"; // 시험 기간은 녹색
    }
    
    return {
      className: event.type,
      style: newStyle,
    };
  };

  return (
    <div style={{ 
      height: "80vh", 
      padding: "20px",
      // 모바일 대응
      minHeight: "500px"
    }}>
      <h2 style={{ marginBottom: 16 }}>{texts.title}</h2>
      <div style={{
        height: "calc(100% - 50px)",
        // 모바일에서 캘린더가 잘 보이도록 조정
        minHeight: "450px"
      }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", borderRadius: 8 }}
          culture={lang}
          messages={texts.toolbar}
          views={["month", "week", "day", "agenda"]}
          eventPropGetter={eventPropGetter}
        />
      </div>
      
      {/* 모바일 전용 스타일 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.8);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(255, 152, 0, 1);
          }
        }
        
        .highlighted-event {
          z-index: 100 !important;
        }
        
        @media (max-width: 768px) {
          .rbc-calendar {
            font-size: 12px;
          }
          
          .rbc-toolbar {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .rbc-toolbar-label {
            font-size: 16px;
            font-weight: bold;
          }
          
          .rbc-btn-group {
            display: flex;
            gap: 5px;
          }
          
          .rbc-btn-group button {
            padding: 5px 10px;
            font-size: 12px;
          }
          
          .rbc-header {
            padding: 5px 2px;
            font-size: 11px;
          }
          
          .rbc-date-cell {
            padding: 2px;
          }
          
          .rbc-event {
            padding: 2px 4px;
            font-size: 10px;
          }
          
          .rbc-event-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          /* 주간/일간 뷰 최적화 */
          .rbc-time-slot {
            min-height: 30px;
          }
          
          .rbc-time-header-content {
            font-size: 11px;
          }
          
          /* 아젠다 뷰 최적화 */
          .rbc-agenda-view table {
            font-size: 12px;
          }
          
          .rbc-agenda-date-cell,
          .rbc-agenda-time-cell {
            padding: 8px 5px;
          }
          
          .rbc-agenda-event-cell {
            padding: 8px 5px;
          }
        }
        
        @media (max-width: 480px) {
          .rbc-calendar {
            font-size: 10px;
          }
          
          .rbc-toolbar-label {
            font-size: 14px;
          }
          
          .rbc-btn-group button {
            padding: 4px 8px;
            font-size: 11px;
          }
          
          .rbc-header {
            font-size: 10px;
            padding: 3px 1px;
          }
          
          .rbc-event {
            font-size: 9px;
            padding: 1px 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;