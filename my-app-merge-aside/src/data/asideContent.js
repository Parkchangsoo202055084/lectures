// FILE: src/data/asideContent.js

export const ASIDE_CONTENT = {
  ko: {
    map: {
      title: "건물",
      collapsible: [
        {
          title: "건물 목록",
          items: [
            "장공관(본관)",
            "필현관",
            "만우관",
            "샬롬채플",
            "임마누엘관(학생회관)",
            "경삼관(도서관)",
            "송암관",
            "소통관",
            "학습실습동",
            "한울관(체육관)",
            "성빈학사(생활관)",
            "새롬터",
            "해오름관",
            "장준하통일관",
            "늦봄관",
          ],
        },
        {
          title: "편의시설",
          items: [
            { label: "식당", children: ["학식(18관)", "학식(임마누엘관)"] },
            {
              label: "카페",
              children: ["카페ing(18관)", "카페ing(경삼관)", "베라티스", "스테이"],
            },
            { label: "편의점", children: ["CU", "emart24", "Seven-Eleven"] },
            {
              label: "주차장",
              children: Array.from({ length: 9 }, (_, i) => `주차장${i + 1}`),
            },
            { label: "은행/ATM" },
            { label: "우체국" },
            { label: "병원/약국" },
            { label: "서점/문구" },
          ],
        },
      ],
    },
    bus: {
      title: "버스 정보",
      collapsible: [
        {
          title: "버스 노선",
          items: ["1550-1", "1552", "5104", "M4449"],
        },
        {
          title: "셔틀버스",
          items: ["수원역 셔틀", "동탄 경유 셔틀"],
        },
        {
          title: "기타 정보",
          items: [
            "학교가는 버스 정보",
            "셔틀 운행 시간",
            "병점역 버스 탑승 정보",
          ],
        },
      ],
    },
    newB: { title: "재학생 정보", items: ["학사일정", "OT 안내"]},
    club: { title: "동아리", items: ["중앙동아리", "가입방법"] },
    assist: {
      title: "학생지원",
      items: ["장학금", "상담센터", "학습지원", "교내 전화번호", "커뮤니티"],
    },
  },
  en: {
    map: {
      title: "Buildings",
      collapsible: [
        {
          title: "Buildings List",
          items: [
            "Janggong Hall (Main)",
            "Pilheon Hall",
            "Manwoo Hall",
            "Shalom Chapel",
            "Emmanuel Hall (Student Union)",
            "Kyungsam Hall (Library)",
            "Songam Hall",
            "Sotong Hall",
            "Learning & Practice Hall",
            "Hanul Hall (Gym)",
            "Seongbin (Dormitory)",
            "Saeromteo",
            "Haeoreum Hall",
            "Jangjunha Unification Hall",
            "Neutbom Hall",
          ],
        },
        {
          title: "Facilities",
          items: [
            { label: "Cafeteria", children: ["Student Cafeteria (18 Hall)", "Student Cafeteria (Emmanuel Hall)"] },
            {
              label: "Cafe",
              children: ["Cafeing (18 Hall)", "Cafeing (Kyungsam Hall)", "Veratis", "Stay"],
            },
            { label: "Convenience Store", children: ["CU", "emart24", "Seven-Eleven"] },
            {
              label: "Parking Lot",
              children: Array.from({ length: 9 }, (_, i) => `Parking Lot ${i + 1}`),
            },
            { label: "Bank/ATM" },
            { label: "Post Office" },
            { label: "Hospital/Pharmacy" },
            { label: "Bookstore/Stationery" },
          ],
        },
      ],
    },
    bus: {
      title: "Bus Info",
      collapsible: [
        {
          title: "Bus Routes",
          items: ["1550-1", "1552", "5104", "M4449"],
        },
        {
          title: "Shuttle Bus",
          items: ["Suwon Station Shuttle", "Dongtan Shuttle"],
        },
        {
          title: "Other Info",
          items: [
            "Bus Info to School",
            "Shuttle Schedule",
            "Byeongjeom Station Bus Info",
          ],
        },
      ],
    },
    newB: { title: "Current Student Info", items: ["Academic Calendar", "OT Guide"]},
    club: { title: "Clubs", items: ["Central Clubs", "How to Join"] },
    assist: {
      title: "Student Support",
      items: ["Scholarship", "Counseling Center", "Academic Support", "Phone Numbers", "Community"],
    },
  },
};