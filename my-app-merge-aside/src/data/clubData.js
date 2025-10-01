// FILE: src/data/clubData.js
// ClubHub.jsx에서 분리한 동아리 

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
    { name: "MINAL", desc: "사진 동아리" }, // 민알 영문명
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