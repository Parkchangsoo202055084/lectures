// src/utils/texts/busInfoTexts.js

const busImages = {
  ko: {
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
  en: {
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
  }
};

export const busInfoTexts = {
  ko: {
    notSelected: "좌측에서 항목을 선택하세요.(버스 노선 / 셔틀버스 / 기타 정보)",
    notReady: "해당 항목의 내용이 아직 준비되지 않았습니다.",
    imageAlt: busImages.ko,
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
  en: {
    notSelected: "Select an item from the left. (Bus Routes / Shuttle Bus / Other Info)",
    notReady: "Content for this item is not yet available.",
    imageAlt: busImages.en,
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
};