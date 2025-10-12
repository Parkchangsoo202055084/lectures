// FILE: src/components/CalendarPage.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import enUS from "date-fns/locale/en-US";
import { FiMenu } from "react-icons/fi";

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
  const rawEvents = useMemo(() => {
    const langEvents = eventsData[lang] || eventsData.ko;
    return langEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  }, [lang]);

  const [view, setView] = useState("month"); 
  const [eventFilter, setEventFilter] = useState({
    school: true, 
    holiday: true,
    exam: true,
  });

  const filteredEvents = useMemo(() => {
    return rawEvents.filter((event) => {
      if (event.type === 'school' && eventFilter.school) return true;
      if (event.type === 'holiday' && eventFilter.holiday) return true;
      if (event.type === 'exam' && eventFilter.exam) return true;
      return false;
    });
  }, [rawEvents, eventFilter]);

  const [events, setEvents] = useState(filteredEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedEventId, setHighlightedEventId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setEvents(filteredEvents);
  }, [filteredEvents]);

  // 언어가 변경되면 이벤트 업데이트
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menuButton = e.target.closest('button[aria-label="Menu Toggle"]');
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !menuButton) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // highlightEvent prop이 변경되면 해당 이벤트로 이동
  useEffect(() => {
    if (highlightEvent && highlightEvent.title && highlightEvent.start) {
      console.log('🎯 하이라이트할 이벤트:', highlightEvent);
      
      // 약간의 딜레이를 주어 캘린더가 완전히 렌더링된 후 실행
      setTimeout(() => {
        // 해당 이벤트 찾기
        const targetEvent = rawEvents.find(
          (event) => event.title === highlightEvent.title
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
          setTimeout(() => setHighlightedEventId(null), 3000);
        }
      }, 100); // 100ms 딜레이
    }
  }, [highlightEvent, rawEvents]);

  const handleFilterChange = (type) => {
    setEventFilter(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setMenuOpen(false); 
  };

  // 이벤트 타입에 따라 스타일을 다르게 적용하는 함수
  const eventPropGetter = (event) => {
    let style = {
      backgroundColor: "#3174ad",
      color: "white",
      borderRadius: "4px",
      border: "none",
      padding: "2px 5px",
      margin: "1px 0",
      fontSize: "12px",
      minHeight: "20px",
      lineHeight: "1.3",
      opacity: 0.95,
      whiteSpace: "normal",
      overflow: "hidden",
    };

    if (event.type === "holiday") {
      style.backgroundColor = "#ff7f7f";
    } else if (event.type === "exam") {
      style.backgroundColor = "#32a852";
    } else if (event.type === "school") {
      style.backgroundColor = "#3174ad";
    }

    if (event.title === highlightedEventId) {
      style = {
        ...style,
        backgroundColor: "#ff9800",
        border: "3px solid #f57c00",
        fontWeight: "bold",
        boxShadow: "0 0 15px rgba(255, 152, 0, 0.8)",
        animation: "pulse 1s ease-in-out infinite",
        opacity: 1,
      };
    }
    return { style };
  };
  
  const navigateCalendar = (swipeDistance) => {
    const threshold = 50;
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        setSelectedDate((prev) => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() + 1);
          return newDate;
        });
      } else {
        setSelectedDate((prev) => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() - 1);
          return newDate;
        });
      }
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const swipeDistance = touchStartX.current - e.changedTouches[0].clientX;
    navigateCalendar(swipeDistance);
  };
  const handleMouseDown = (e) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
  };
  const handleMouseUp = (e) => {
    if (isDragging.current) navigateCalendar(touchStartX.current - e.clientX);
    isDragging.current = false;
  };
  const handleMouseMove = (e) => {
    if (isDragging.current) e.preventDefault();
  };

  return (
    <div 
      style={{ 
        height: "85vh",
        padding: "20px", 
        minHeight: "550px",
        position: "relative",
        overflow: "hidden" 
      }}
    >
      
      <h2 className="pc-only-title" style={{ margin: "0 0 16px 0", flex: 1 }}>{texts.title}</h2>

      <div className="mobile-only-header" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu Toggle" 
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
            zIndex: 3000, 
          }}
        >
          <FiMenu />
        </button>
        <h2 style={{ margin: 0, flex: 1 }}>{texts.title}</h2>
        <button
          className="mobile-today"
          onClick={() => setSelectedDate(new Date())}
        >
          오늘
        </button>
      </div>

      <div
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
      >
        <div className="menu-section">
          <h4>보기 전환</h4>
          <button 
            onClick={() => handleViewChange('month')}
            style={{ fontWeight: view === 'month' ? 'bold' : 'normal', background: view === 'month' ? '#eee' : '#f8f8f8' }}
          >
            월
          </button>
          <button 
            onClick={() => handleViewChange('week')}
            style={{ fontWeight: view === 'week' ? 'bold' : 'normal', background: view === 'week' ? '#eee' : '#f8f8f8' }}
          >
            주
          </button>
          <button 
            onClick={() => handleViewChange('day')}
            style={{ fontWeight: view === 'day' ? 'bold' : 'normal', background: view === 'day' ? '#eee' : '#f8f8f8' }}
          >
            일
          </button>
          <button 
            onClick={() => handleViewChange('agenda')}
            style={{ fontWeight: view === 'agenda' ? 'bold' : 'normal', background: view === 'agenda' ? '#eee' : '#f8f8f8' }}
          >
            일정
          </button>
        </div>

        <div className="menu-section">
          <h4>타입 토글</h4>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.school} 
              onChange={() => handleFilterChange('school')}
            /> 
            학사일정
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.holiday} 
              onChange={() => handleFilterChange('holiday')}
            /> 
            공휴일
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.exam} 
              onChange={() => handleFilterChange('exam')}
            /> 
            시험기간
          </label>
        </div>
      </div>

      <div 
        style={{ height: "calc(100% - 50px)" }}
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={selectedDate}
          view={view} 
          onNavigate={(date) => setSelectedDate(date)}
          onView={(newView) => setView(newView)}
          style={{ height: "100%", borderRadius: 8 }}
          culture={lang}
          messages={texts.toolbar}
          views={["month", "week", "day", "agenda"]}
          eventPropGetter={eventPropGetter}
          selectable={true} 
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(255, 152, 0, 0.8); }
          50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 152, 0, 1); }
        }

        .pc-only-title {
            display: none; 
        }

        .mobile-menu {
          position: fixed;
          top: 70px; 
          left: 0; 
          width: 240px;
          height: auto; 
          max-height: calc(100% - 70px); 
          background: white;
          box-shadow: 4px 0 12px rgba(0,0,0,0.2);
          padding: 20px;
          transition: transform 0.3s ease-out;
          z-index: 4000;
          
          transform: translateX(-100%);
          pointer-events: none;
          overflow-y: auto; 
        }
        .mobile-menu.open { 
            transform: translateX(0); 
            pointer-events: auto;
        }

        .menu-section { margin-bottom: 20px; }
        .menu-section h4 { margin-bottom: 8px; font-size: 14px; }
        .menu-section label {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            cursor: pointer;
        }
        .menu-section input[type="checkbox"] {
            margin-right: 10px;
        }
        .menu-section button {
          display: block;
          width: 100%;
          margin-bottom: 5px;
          padding: 8px;
          border: 1px solid #ddd;
          background: #f8f8f8;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
        }
        
        @media (min-width: 769px) {
            .pc-only-title { 
                display: block; 
            }
            .mobile-only-header { 
                display: none !important;
            }
            .mobile-menu { 
                display: none !important; 
            }
        }

        @media (max-width: 768px) {
          .pc-only-title { 
            display: none !important; 
          }
          .rbc-toolbar { display: none !important; }
          
          .mobile-only-header { 
              display: flex !important;
          }

          .mobile-today {
            background: #3174ad;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 13px;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;