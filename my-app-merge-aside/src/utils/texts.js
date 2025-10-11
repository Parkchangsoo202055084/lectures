// FILE: src/utils/texts.js

import { ASIDE_CONTENT } from "../data/asideContent";

export const texts = {
  ko: {
    nav: {
      searchPlaceholder: "검색어를 입력하세요",
      searchAriaLabel: "검색",
      searchNoResult: "검색 결과가 없습니다. (건물/편의시설 위주로 검색해보세요)",
      langButton: "English",
      logoAlt: "한신대학교 로고",
    },
    auth: {
      login: "로그인",
      logout: "로그아웃",
      welcome: "환영합니다",
      emailLogin: "이메일로 로그인",
      emptyInput: "이메일과 비밀번호를 입력해주세요.",
      emailLoginFailed: "이메일 로그인에 실패했습니다.",
      googleLoginFailed: "구글 로그인에 실패했습니다.",
    },
    mapDetails: {
      title: "층별 정보",
      floorsLabel: "층",
      roomsLabel: "시설",
      aliasLabel: "별칭:",
      floorsSection: "층별 안내",
    },
    assistDetails: {
      notSelected: "좌측에서 항목을 선택하세요. (장학금 / 상담센터 / 학습지원 / 교내 전화번호 / 커뮤니티)",
      notReady: "해당 항목의 내용이 아직 준비되지 않았습니다.",
      "장학금": {
        title: "장학금 안내",
        body: {
          intro: "성적장학금, 교내장학금, 국가장학금, 근로장학 등 신청·자격·기간을 요약합니다.",
          list: [
            "성적장학: 직전 학기 성적 기준, 등록금 범위 내 차등 지급",
            "국가장학: 한국장학재단 신청(1·2차), 소득분위에 따른 지원",
            "근로장학: 학내 부서 근로, 시급제",
            "기타: 교외장학 연계(재단·지자체 등)",
          ],
        },
      },
      "상담센터": {
        title: "상담센터 안내",
        body: {
          intro: "개인상담, 심리검사, 집단상담을 운영합니다. 온라인 예약 후 방문해 주세요.",
          list: [
            "개인상담: 학업/대인관계/진로",
            "심리검사: 성격, 적성, 스트레스 등",
            "운영시간: 평일 09:00~17:00 (점심 12:00~13:00)",
          ],
        },
      },
      "학습지원": {
        title: "학습지원 안내",
        body: {
          intro: "튜터링, 스터디, 학습법 특강, 글쓰기 클리닉을 제공합니다.",
          list: [
            "튜터링/스터디: 팀 구성 후 프로그램 신청",
            "학습법 특강: 중간·기말 시험 전 집중 운영",
            "글쓰기 클리닉: 레포트/졸업논문 첨삭",
          ],
        },
      },
      "교내 전화번호": {
        title: "교내 전화번호",
        body: {
          intro: "각 부서별 전화번호는 아래와 같습니다.",
          list: [
            "총무처: 031-379-6000",
            "교무처: 031-379-6100",
          ],
        },
      },
      "커뮤니티": {
        title: "커뮤니티 게시판",
      },
    },
    clubDetails: {
      notSelected: "좌측에서 항목을 선택하세요. (중앙동아리 / 가입방법)",
      howToJoin: {
        title: "동아리 가입 방법",
        body: "동아리 가입을 원하면 매년 3월 초에 진행되는 동아리 박람회에 참여하거나, 각 동아리 SNS를 통해 문의할 수 있습니다. 자세한 일정은 학생지원팀 공지사항을 확인하세요.",
      },
      centralClub: {
        title: "중앙동아리 목록",
        body: "중앙동아리 목록은 추후 업데이트 예정입니다.",
      },
      categorySuffix: "분과",
    },
    busInfo: {
      notSelected: "좌측에서 항목을 선택하세요.(버스 노선 / 셔틀버스 / 기타 정보)",
      notReady: "해당 항목의 내용이 아직 준비되지 않았습니다.",
      imageAlt: {
        '1550-1': '1550-1 운행 시간표',
        '1552': '1552 운행 시간표',
        '5104_1': '5104 서울 세마',
        '5104_2': '5104 세마 서울',
        'M4449': 'M4449 운행 시간표',
        '수원역 셔틀': '수원역 셔틀',
        '동탄 경유 셔틀': '동탄 경유 셔틀',
        '학교가는 버스 정보': '한신대학교 버스 노선도',
        '셔틀 운행 시간': '셔틀 운행 시간',
        '병점역 버스 탑승 정보': '병점역 버스 탑승',
      },
      "1550-1": {
        title: "1550-1번 버스 노선 정보",
        images: [{ src: "1550-1 운행시간표.jpeg", altKey: "1550-1", style: { width: "80%", height: "auto" } }],
      },
      "1552": {
        title: "1552번 버스 노선 정보",
        images: [{ src: "1552 운행시간표.jpeg", altKey: "1552", style: { width: "80%", height: "auto" } }],
      },
      "5104": {
        title: "5104번 버스 노선 정보",
        images: [
          { src: "5104 서울 세마.jpeg", altKey: "5104_1", style: { width: "60%", height: "auto", marginBottom: 20 } },
          { src: "5104 세마 서울.jpeg", altKey: "5104_2", style: { width: "60%", height: "auto" } },
        ],
      },
      "M4449": {
        title: "M4449번 버스 노선 정보",
        images: [{ src: "M4449 운행 시간표.jpeg", altKey: "M4449", style: { width: "60%", height: "auto" } }],
      },
      "수원역 셔틀": {
        title: "수원역 셔틀 운행 안내",
        images: [{ src: "수원역 셔틀.jpeg", altKey: "수원역 셔틀", style: { width: "80%", height: "auto" } }],
      },
      "동탄 경유 셔틀": {
        title: "동탄 경유 셔틀 운행 안내",
        images: [{ src: "동탄 경유 (세마) 셔틀.jpeg", altKey: "동탄 경유 셔틀", style: { width: "80%", height: "auto" } }],
      },
      "학교가는 버스 정보": {
        title: "학교가는 버스 정보",
        images: [
          { src: "버스정보.jpeg", altKey: "학교가는 버스 정보", style: { width: "50%", height: "auto"} },
        ],
      },
      "셔틀 운행 시간": {
        title: "셔틀버스 운행 시간표",
        images: [
          { src: "셔틀 운행 시간.jpeg", altKey: "셔틀 운행 시간", style: { width: "80%", height: "auto"} },
        ],
      },
      "병점역 버스 탑승 정보": {
        title: "병점역 버스 탑승 안내",
        images: [{ src: "병점역 버스 탑승.jpeg", altKey: "병점역 버스 탑승 정보", style: { width: "80%", height: "auto" } }],
      },
    },
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
    },
    otInfo: {
      title: "OT 안내",
      body: "신입생 OT는 2월 말 예정입니다. 장소와 일정은 추후 공지됩니다.",
    },
    aside: {
      map: ASIDE_CONTENT.ko.map,
      bus: ASIDE_CONTENT.ko.bus,
      newB: ASIDE_CONTENT.ko.newB,
      club: ASIDE_CONTENT.ko.club,
      assist: ASIDE_CONTENT.ko.assist,
    },
    newB: {
      notSelected: "좌측에서 항목을 선택하세요. (학사일정 / OT 안내)"
    },
  },
  en: {
    nav: {
      searchPlaceholder: "Enter search term",
      searchAriaLabel: "Search",
      searchNoResult: "No search results found. (Try searching for buildings/facilities)",
      langButton: "한국어",
      logoAlt: "Hanshin University Logo",
    },
    auth: {
      login: "Login",
      logout: "Logout", 
      welcome: "Welcome",
      emailLogin: "Login with Email",
      emptyInput: "Please enter email and password.",
      emailLoginFailed: "Email login failed.",
      googleLoginFailed: "Google login failed.",
    },
    mapDetails: {
      title: "Floor Information",
      floorsLabel: "Floor",
      roomsLabel: "Rooms",
      aliasLabel: "Alias:",
      floorsSection: "Floor Information",
    },
    assistDetails: {
      notSelected: "Select an item from the left. (Scholarship / Counseling Center / Academic Support / Phone Numbers / Community)",
      notReady: "Content for this item is not yet available.",
      "Scholarship": {
        title: "Scholarship Guide",
        body: {
          intro: "A summary of application details, eligibility, and deadlines for academic, on-campus, national, and work-study scholarships.",
          list: [
            "Academic Scholarship: Based on previous semester's grades, differentiated payment within tuition fees",
            "National Scholarship: Apply through the Korea Student Aid Foundation, support based on income bracket.",
            "Work-study: On-campus work, hourly wage system.",
            "Other: External scholarship links (foundations, local governments, etc.)",
          ],
        },
      },
      "Counseling Center": {
        title: "Counseling Center",
        body: {
          intro: "We provide individual counseling, psychological tests, and group counseling. Please make an online reservation before visiting.",
          list: [
            "Individual Counseling: Academics/Interpersonal relationships/Career",
            "Psychological Test: Personality, aptitude, stress, etc.",
            "Hours: Weekdays 09:00~17:00 (Lunch 12:00~13:00)",
          ],
        },
      },
      "Academic Support": {
        title: "Academic Support",
        body: {
          intro: "We offer tutoring, study groups, learning method lectures, and writing clinics.",
          list: [
            "Tutoring/Study Group: Form a team and apply for a program",
            "Learning Method Lectures: Intensive sessions before midterms and finals",
            "Writing Clinic: Editing for reports/graduation theses",
          ],
        },
      },
      "Phone Numbers": {
        title: "Phone Numbers",
        body: {
          intro: "Phone numbers for each department are as follows.",
          list: [
            "General Affairs: +82-31-379-6000",
            "Academic Affairs: +82-31-379-6100",
          ],
        },
      },
      "Community": {
        title: "Community Board",
      },
    },
    clubDetails: {
      notSelected: "Select an item from the left. (Central Clubs / How to Join)",
      howToJoin: {
        title: "How to Join a Club",
        body: "If you want to join a club, you can attend the club fair held in early March every year or contact each club through their social media. Check the Student Support Team's announcements for detailed schedules.",
      },
      centralClub: {
        title: "Central Clubs",
        body: "The central clubs list will be updated later.",
      },
      categorySuffix: "",
    },
    busInfo: {
      notSelected: "Select an item from the left. (Bus Routes / Shuttle Bus / Other Info)",
      notReady: "Content for this item is not yet available.",
      imageAlt: {
        '1550-1': '1550-1 Bus Schedule',
        '1552': '1552 Bus Schedule',
        '5104_1': '5104 Seoul Sema',
        '5104_2': '5104 Sema Seoul',
        'M4449': 'M4449 Bus Schedule',
        "Suwon Station Shuttle": 'Suwon Station Shuttle',
        "Dongtan Shuttle": 'Dongtan Shuttle',
        "Bus Info to School": 'Bus Info to School',
        "Shuttle Schedule": 'Shuttle Schedule',
        "Byeongjeom Station Bus Info": 'Byeongjeom Station Bus Info',
      },
      "1550-1": {
        title: "Bus Route 1550-1",
        images: [{ src: "1550-1 운행시간표.jpeg", altKey: "1550-1", style: { width: "80%", height: "auto" } }],
      },
      "1552": {
        title: "Bus Route 1552",
        images: [{ src: "1552 운행시간표.jpeg", altKey: "1552", style: { width: "80%", height: "auto" } }],
      },
      "5104": {
        title: "Bus Route 5104",
        images: [
          { src: "5104 서울 세마.jpeg", altKey: "5104_1", style: { width: "60%", height: "auto", marginBottom: 20 } },
          { src: "5104 세마 서울.jpeg", altKey: "5104_2", style: { width: "60%", height: "auto" } },
        ],
      },
      "M4449": {
        title: "Bus Route M4449",
        images: [{ src: "M4449 운행 시간표.jpeg", altKey: "M4449", style: { width: "60%", height: "auto" } }],
      },
      "Suwon Station Shuttle": {
        title: "Suwon Station Shuttle Info",
        images: [{ src: "수원역 셔틀.jpeg", altKey: "Suwon Station Shuttle", style: { width: "80%", height: "auto" } }],
      },
      "Dongtan Shuttle": {
        title: "Dongtan Shuttle Info",
        images: [{ src: "동탄 경유 (세마) 셔틀.jpeg", altKey: "Dongtan Shuttle", style: { width: "80%", height: "auto" } }],
      },
      "Bus Info to School": {
        title: "Bus Info to School",
        images: [
          { src: "버스정보.jpeg", altKey: "Bus Info to School", style: { width: "50%", height: "auto"} },
        ],
      },
      "Shuttle Schedule": {
        title: "Shuttle Schedule",
        images: [
          { src: "셔틀 운행 시간.jpeg", altKey: "Shuttle Schedule", style: { width: "80%", height: "auto"} },
        ],
      },
      "Byeongjeom Station Bus Info": {
        title: "Byeongjeom Station Bus Info",
        images: [{ src: "병점역 버스 탑승.jpeg", altKey: "Byeongjeom Station Bus Info", style: { width: "80%", height: "auto" } }],
      },
    },
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
    },
    otInfo: {
      title: "OT Guide",
      body: "Freshman orientation is scheduled for late February. The location and schedule will be announced later.",
    },
    aside: {
      map: ASIDE_CONTENT.en.map,
      bus: ASIDE_CONTENT.en.bus,
      newB: ASIDE_CONTENT.en.newB,
      club: ASIDE_CONTENT.en.club,
      assist: ASIDE_CONTENT.en.assist,
    },
    newB: {
      notSelected: "Select an item from the left. (Academic Calendar / OT Guide)"
    }
  },
};