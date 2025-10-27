// src/utils/texts/newBTexts.js 

export const newBTexts = {
  ko: {
    notSelected: "좌측에서 항목을 선택하세요.(학사 정보 / 신입생 정보 / 캠퍼스 생활)",
    notReady: "해당 항목의 내용이 아직 준비되지 않았습니다.",
    
    calendarPage: {
      title: "📅 학사일정",
      toolbar: {
        next: "다음",
        previous: "이전",
        today: "오늘",
        month: "월",
        week: "주",
        day: "일",
        agenda: "일정",
      },
      viewSwitch: "보기 전환", 
      typeToggle: "타입 토글", 
      filterSchool: "학사일정",
      filterHoliday: "공휴일",
      filterExam: "시험기간",
    },
    
    // 학사 정보
    "강의실 찾기": {
      title: "강의실 찾는 방법",
      body: {
        intro: "강의실 번호의 앞 1자리 혹은 2자리는 건물 번호, 중간 1자리는 강의실이 있는 층, 뒤 2자리는 강의실 번호입니다.",
        list: [
          "예시) 강의실 번호 18521",
          " 18 = 18번 건물 (해오름관)",
          " 5 = 5층",
          " 21 = 21번 강의실",
          "",
          "각 건물의 위치는 캠퍼스 지도 페이지를 참고하세요.",
        ],
      },
    },
    "졸업 요건": {
      title: "졸업 요건과 졸업 학점",
      body: {
        intro: "한신대를 졸업하기 위한 조건입니다. 학과별로 상이할 수 있으므로 소속 학과의 학사 안내를 반드시 확인하세요.",
        list: [
          " 총 이수학점: 140학점 (2015년도 이후 입학자는 130학점)",
          " 전공 이수: 학과별 공지 확인",
          " 교양 이수: (최대 학점을 초과하면 졸업학점에 반영되지 않습니다)",
          "  - 1999~2003학번: 최소 35학점, 최대 55학점",
          "  - 2004~2016학번: 최소 35학점, 최대 45학점",
          "  - 2017~2022학번: 최소 35학점, 최대 49학점",
          "  - 2023학번~: 최소 35학점, 최대 45학점",
          " 8학기 이상 등록",
          "",
          "학과별 졸업요건 링크:",
          "전체: https://www.hs.ac.kr/kor/4935/subview.do",
          "경영학과: https://biz.hs.ac.kr/?act=info.page&pcode=graduation",
          "심리아동학부: https://www.hs.ac.kr/psychild/6443/subview.do",
          "인문콘텐츠학부: https://www.hs.ac.kr/humancon/6491/subview.do",
        ],
      },
    },
    
    // 신입생 정보
    "OT 안내": {
      title: "OT 안내",
      body: {
        intro: "신입생 OT는 2월 말 예정입니다. 장소와 일정은 추후 공지됩니다.",
      },
    },
    "학생 예비군": {
      title: "학생 예비군 안내",
      body: {
        intro: "학생예비군 훈련은 수원 오산과학화훈련장에서 진행됩니다.",
        list: [
          " 훈련 일정: 매년 4월 중순, 11월 중순",
          " 확실한 일정은 국방부에서 카카오톡과 메시지로 발송합니다",
          " 셔틀버스 정보는 학과 단톡방이나 학사공지를 확인하세요",
          " 훈련장소: 수원 오산과학화훈련장",
        ],
      },
    },
    
    // 캠퍼스 생활
    "한신대 와이파이": {
      title: "한신대 와이파이 안내",
      body: {
        intro: "교내 무선망 접속 방법입니다.",
        list: [
          " 와이파이 SSID: HANSHIN_WiFi",
          " 비밀번호: 0313790114",
          " 서비스 건물: 도서관, 강의동, 강의실, 휴게실, 식당",
          "",
          "사용방법:",
          "1. [무선 네트워크]에서 HANSHIN_WIFI 선택",
          "2. 인터넷 연결",
          "3. 무선랜 보안 비밀번호 입력 [0313790114]",
        ],
      },
    },
  },
  en: {
    notSelected: "Select an item from the left.(Academic Info / New Student Info / Campus Life)",
    notReady: "Content for this item is not yet available.",
    
    calendarPage: {
      title: "📅 Academic Calendar",
      toolbar: {
        next: "Next",
        previous: "Previous",
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        agenda: "Agenda",
      },
      viewSwitch: "View Switch",
      typeToggle: "Type Toggle",
      filterSchool: "Academic Events",
      filterHoliday: "Holidays",
      filterExam: "Exam Period",
    },
    
    // Academic Info
    "Classroom Finder": {
      title: "How to Find Classrooms",
      body: {
        intro: "The first 1 or 2 digits of the classroom number represent the building number, the middle digit represents the floor, and the last 2 digits represent the classroom number.",
        list: [
          "Example) Classroom number 18521",
          " 18 = Building 18 (Haeoreum Hall)",
          " 5 = 5th floor",
          " 21 = Classroom 21",
          "",
          "Please refer to the campus map page for the location of each building.",
        ],
      },
    },
    "Graduation Requirements": {
      title: "Graduation Requirements and Credits",
      body: {
        intro: "These are the conditions for graduating from Hanshin University. Requirements may vary by department, so be sure to check your department's academic guidelines.",
        list: [
          " Total Credits: 140 credits (130 credits for students admitted after 2015)",
          " Major Credits: Check department announcements",
          " Liberal Arts Credits: (Credits exceeding the maximum will not count toward graduation)",
          "  - Class of 1999~2003: Min 35, Max 55 credits",
          "  - Class of 2004~2016: Min 35, Max 45 credits",
          "  - Class of 2017~2022: Min 35, Max 49 credits",
          "  - Class of 2023~: Min 35, Max 45 credits",
          " Registration for 8 or more semesters",
          "",
          "Department-specific graduation requirements:",
          "General: https://www.hs.ac.kr/kor/4935/subview.do",
          "Business: https://biz.hs.ac.kr/?act=info.page&pcode=graduation",
          "Psychology & Child Studies: https://www.hs.ac.kr/psychild/6443/subview.do",
          "Humanities Contents: https://www.hs.ac.kr/humancon/6491/subview.do",
        ],
      },
    },
    
    // New Student Info
    "OT Guide": {
      title: "OT Guide",
      body: {
        intro: "Freshman orientation is scheduled for late February. The location and schedule will be announced later.",
      },
    },
    "Student Reserve Forces": {
      title: "Student Reserve Forces Training",
      body: {
        intro: "Student reserve forces training is conducted at the Suwon Osan Science Training Center.",
        list: [
          " Training Schedule: Mid-April and mid-November every year",
          " Exact schedule will be sent via KakaoTalk and text message from the Ministry of National Defense",
          " Check department group chat or academic announcements for shuttle bus information",
          " Training Location: Suwon Osan Science Training Center",
        ],
      },
    },
    
    // Campus Life
    "Hanshin WiFi": {
      title: "Hanshin WiFi Guide",
      body: {
        intro: "How to connect to the campus wireless network.",
        list: [
          " WiFi SSID: HANSHIN_WiFi",
          " Password: 0313790114",
          " Service Buildings: Library, lecture halls, classrooms, lounges, cafeteria",
          "",
          "Connection Instructions:",
          "1. Select HANSHIN_WIFI from [Wireless Networks]",
          "2. Connect to the internet",
          "3. Enter wireless security password [0313790114]",
        ],
      },
    },
  },
};