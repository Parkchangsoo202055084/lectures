// src/data/clubData.js
// 동아리 링크 정보 및 카탈로그

import { useState, useEffect } from 'react';

export default function ClubHub({ initialClub }) {
  // eslint-disable-next-line no-unused-vars
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]); 
  // eslint-disable-next-line no-unused-vars
  const [selectedClub, setSelectedClub] = useState(initialClub || null); 

  // initialClub이 변경되면 자동으로 선택
  useEffect(() => {
    if (initialClub) {
      setSelectedClub(initialClub);
      // 해당 동아리의 카테고리로 자동 이동
      const category = Object.keys(CLUBS_BY_CATEGORY).find(cat =>
        CLUBS_BY_CATEGORY[cat].some(club => club.name === initialClub.name)
      );
      if (category) {
        setActiveCategory(category);
      }
    }
  }, [initialClub]);
}

// 동아리 카탈로그 (검색용 - clubData.js와 clubTexts.js 모두에서 필요)
export const CLUBS_BY_CATEGORY = {
  공연: [
    { name: "소리아리", desc: "크리에이티브 뮤직 밴드" },
    { name: "메트로폴리스", desc: "하드락 밴드 동아리" },
    { name: "MUSE", desc: "HSU ғʀᴇᴇꜱᴛʏʟᴇ ʙᴀɴᴅ 'MUSE'" },
    { name: "FADER", desc: "한신대학교 힙합동아리 FADER" },
    { name: "DIO", desc: "한신대학교 댄스동아리 DIO" },
    { name: "보라성", desc: "민중가요·노래패" },
    { name: "일과놀이", desc: "풍물놀이패" },
    { name: "별자리", desc: "뮤지컬 동아리" },
  ],
  전시: [
    { name: "몽당연필", desc: "그림&보드게임 동아리" },
    { name: "we wear", desc: "한신대 패션동아리" },
    { name: "녹연다우회", desc: "다도 동아리" },
    { name: "민알", desc: "사진 동아리" },
    { name: "MINAL", desc: "사진 동아리" },
    { name: "크라임씬", desc: "추리 동아리" },
  ],
  학술: [
    { name: "SSOA", desc: "중앙광고동아리" },
    { name: "애드썬", desc: "광고동아리" },
    { name: "평화나비", desc: "평화·인권 동아리" },
  ],
  운동: [
    { name: "비상", desc: "한신대학교 배구 동아리" },
    { name: "검우회 기백", desc: "검도 동아리" },
    { name: "APEX", desc: "축구 동아리" },
    { name: "갱스터", desc: "야구 동아리" },
    { name: "킬러웨일즈", desc: "미식축구부" },
    { name: "SMASH IT", desc: "배드민턴 중앙동아리" },
    { name: "더플라이트", desc: "농구 동아리" },
  ],
  종교: [
    { name: "CCC", desc: "기독교 동아리" },
    { name: "IVF", desc: "기독교 동아리" },
  ],
  봉사: [
    { name: "로타랙트", desc: "봉사·교류 동아리" },
    { name: "E&G", desc: "봉사·교류 동아리" },
  ],
};

export const CATEGORIES = Object.keys(CLUBS_BY_CATEGORY);

// 동아리 링크 정보 (언어 무관)
export const CLUB_LINKS = {
  soriari: {
    youtube: "https://www.youtube.com/@soriari_",
    instagram: "https://www.instagram.com/soriari_official"
  },
  metropolis: {
    youtube: "https://m.youtube.com/@metropolis3815"
  },
  muse: {
    linktree: "https://linktr.ee/band.muse",
    instagram: "https://www.instagram.com/muse__1995/"
  },
  fader: {
    linktree: "https://linktr.ee/fader5301",
    instagram: "https://www.instagram.com/fader5301hs/"
  },
  dio: {
    youtube: "https://www.youtube.com/channel/UChs-wnk5lJFonX4mI_SricQ",
    instagram: "https://www.instagram.com/di_o_fficial/"
  },
  borasung: {
    instagram: "https://www.instagram.com/hs.borasung"
  },
  ilgwanori: {
    instagram: "https://www.instagram.com/1nol2s_log/"
  },
  asterism: {
    instagram: "https://www.instagram.com/hsu_asterism/"
  },
  wewear: {
    instagram: "https://www.instagram.com/wewear_fashionclub/"
  },
  nokyeon: {
    instagram: "https://www.instagram.com/greeneny_32/"
  },
  minal: {
    instagram: "https://www.instagram.com/minal__kr/"
  },
  adsun: {
    kakao: "https://open.kakao.com/o/sAkpcUgh",
    youtube: "https://youtube.com/@adsun-hsuniv",
    littly: "https://litt.ly/redsunadsun",
    instagram: "https://www.instagram.com/redsun_adsun/"
  },
  bisang: {
    instagram: "https://www.instagram.com/hanshin_volleyball"
  },
  gibaek: {
    youtube: "https://www.youtube.com/@검우회기백",
    instagram: "https://www.instagram.com/gibaek1973"
  },
  apex: {
    instagram: "https://www.instagram.com/hsu_apex/"
  },
  gangster: {
    youtube: "https://www.youtube.com/@hsu_gangster",
    instagram: "https://www.instagram.com/hanshin_gangster/"
  },
  killerwhales: {
    instagram: "https://www.instagram.com/hsunivfootball/",
    linktree: "https://linktr.ee/killerwhales_official"
  },
  ccc: {
    instagram: "https://www.instagram.com/hanshin_ccc/"
  },
  ivf: {
    instagram: "https://www.instagram.com/hanshin_ivf/"
  },
  rotaract: {
    instagram: "https://www.instagram.com/rotaract_eng/"
  }
};

// 동아리명 -> ID 매핑 (검색용)
export const CLUB_NAME_TO_ID = {
  // 한국어
  "소리아리": "soriari",
  "메트로폴리스": "metropolis",
  "MUSE": "muse",
  "FADER": "fader",
  "DIO": "dio",
  "보라성": "borasung",
  "일과놀이": "ilgwanori",
  "별자리": "asterism",
  "몽당연필": "mongdang",
  "we wear": "wewear",
  "녹연다우회": "nokyeon",
  "민알": "minal",
  "MINAL": "minal",
  "크라임씬": "crimescene",
  "SSOA": "ssoa",
  "애드썬": "adsun",
  "평화나비": "peacenabi",
  "비상": "bisang",
  "검우회 기백": "gibaek",
  "APEX": "apex",
  "갱스터": "gangster",
  "킬러웨일즈": "killerwhales",
  "SMASH IT": "smashit",
  "더플라이트": "theflight",
  "CCC": "ccc",
  "IVF": "ivf",
  "로타랙트": "rotaract",
  "E&G": "rotaract",
  
  // 영어
  "Soriari": "soriari",
  "Metropolis": "metropolis",
  "Borasung": "borasung",
  "Ilgwanori": "ilgwanori",
  "Asterism": "asterism",
  "Mongdang Pencil": "mongdang",
  "We Wear": "wewear",
  "Nokyeon Dawoohoe": "nokyeon",
  "Crime Scene": "crimescene",
  "Adsun": "adsun",
  "Peace Butterfly": "peacenabi",
  "Bisang": "bisang",
  "Gibaek": "gibaek",
  "Gangster": "gangster",
  "Killer Whales": "killerwhales",
  "The Flight": "theflight",
  "Rotaract (E&G)": "rotaract"
};