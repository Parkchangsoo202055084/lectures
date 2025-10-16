// src/components/CalendarPage.jsx 

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import enUS from "date-fns/locale/en-US";
import { FiMenu } from "react-icons/fi";

import eventsData from "../data/eventsData";
import { calendarEventTitles } from "../utils/texts/calendarEventTitles";

const CalendarPage = ({ texts, lang = "ko", highlightEvent = null }) => {
  const locale = lang === "ko" ? ko : enUS;
  const localizer = useMemo(() => {
    return dateFnsLocalizer({
      format,
      parse,
      startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
      getDay,
      locales: { [lang]: locale },
    });
  }, [lang, locale]);

  const calendarMessages = useMemo(() => {
    return texts?.toolbar || {};
  }, [texts]);
  
  const pageTexts = useMemo(() => {
    return texts || {};
  }, [texts]);

  const rawEvents = useMemo(() => {
    return eventsData.map((event) => ({
      ...event,
      title: calendarEventTitles[lang][event.id],
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

  useEffect(() => {
    const originalBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
    };

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed'; 
      document.body.style.width = '100%'; 
    } else {
      document.body.style.overflow = originalBodyStyle.overflow;
      document.body.style.position = originalBodyStyle.position;
      document.body.style.width = originalBodyStyle.width;
    }
    
    const handleClickOutside = (e) => {
      const menuButton = e.target.closest('button[aria-label="Menu Toggle"]');
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !menuButton) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = originalBodyStyle.overflow;
        document.body.style.position = originalBodyStyle.position;
        document.body.style.width = originalBodyStyle.width;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (highlightEvent && highlightEvent.title && highlightEvent.start) {
      setTimeout(() => {
        const targetEvent = rawEvents.find(
          (event) => event.title === highlightEvent.title
        );
        if (targetEvent) {
          const eventDate = new Date(targetEvent.start);
          setSelectedDate(eventDate);
          setHighlightedEventId(targetEvent.title);
          setTimeout(() => setHighlightedEventId(null), 3000);
        }
      }, 100);
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
      className="calendar-main-container" 
      style={{ 
        padding: "20px", 
        minHeight: "400px", 
        position: "relative",
        overflow: "hidden" 
      }}
    >
      
      <h2 className="pc-only-title" style={{ margin: "0 0 16px 0", flex: 1 }}>{pageTexts.title}</h2>

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
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <FiMenu />
        </button>
        <h2 style={{ 
          margin: 0, 
          flex: 1,
          fontSize: "18px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{pageTexts.title}</h2>
        <button
          className="mobile-today"
          onClick={() => setSelectedDate(new Date())}
          style={{
            flexShrink: 0,
          }}
        >
          {calendarMessages.today}
        </button>
      </div>

      <div
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
      >
        <div className="menu-section">
          <h4>{pageTexts.viewSwitch}</h4>
          <button 
            onClick={() => handleViewChange('month')}
            style={{ fontWeight: view === 'month' ? 'bold' : 'normal', background: view === 'month' ? '#eee' : '#f8f8f8' }}
          >
            {calendarMessages.month}
          </button>
          <button 
            onClick={() => handleViewChange('week')}
            style={{ fontWeight: view === 'week' ? 'bold' : 'normal', background: view === 'week' ? '#eee' : '#f8f8f8' }}
          >
            {calendarMessages.week}
          </button>
          <button 
            onClick={() => handleViewChange('day')}
            style={{ fontWeight: view === 'day' ? 'bold' : 'normal', background: view === 'day' ? '#eee' : '#f8f8f8' }}
          >
            {calendarMessages.day}
          </button>
          <button 
            onClick={() => handleViewChange('agenda')}
            style={{ fontWeight: view === 'agenda' ? 'bold' : 'normal', background: view === 'agenda' ? '#eee' : '#f8f8f8' }}
          >
            {calendarMessages.agenda}
          </button>
        </div>

        <div className="menu-section">
          <h4>{pageTexts.typeToggle}</h4>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.school} 
              onChange={() => handleFilterChange('school')}
            /> 
            {pageTexts.filterSchool}
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.holiday} 
              onChange={() => handleFilterChange('holiday')}
            /> 
            {pageTexts.filterHoliday}
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={eventFilter.exam} 
              onChange={() => handleFilterChange('exam')}
            /> 
            {pageTexts.filterExam}
          </label>
        </div>
      </div>

      <div 
        style={{ height: "100%" }} 
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
          messages={calendarMessages}
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

        .calendar-main-container {
            height: calc(100vh - 110px); 
        }

        @media (max-width: 768px) {
            .calendar-main-container {
                height: calc(100vh - 160px); 
            }
          
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
              padding: 6px 8px;
              font-size: 12px;
              cursor: pointer;
              white-space: nowrap;
            }
        }
        
        .rbc-event-content {
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
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
          z-index: 500; 
          
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
      `}</style>
    </div>
  );
};

export default CalendarPage;