// src/utils/texts.js

import { ASIDE_CONTENT } from "../data/asideContent";

// 기존 텍스트 파일들
import { navTexts } from "./texts/navTexts";
import { authTexts } from "./texts/authTexts";
import { mapDetailTexts } from "./texts/mapDetailTexts";
import { assistTexts } from "./texts/assistTexts";
import { clubTexts } from "./texts/clubTexts";
import { busInfoTexts } from "./texts/busInfoTexts";
import { newBTexts } from "./texts/newBTexts";

// 🆕 학사일정 & 동아리 상세 텍스트 추가
import { calendarEventTitles } from "./texts/calendarEventTitles";
import { clubDetailTexts } from "./texts/clubDetailTexts";

// 최종 texts 객체 구성
export const texts = {
  ko: {
    nav: navTexts.ko,
    auth: authTexts.ko,
    mapDetails: mapDetailTexts.ko,
    assistDetails: assistTexts.ko,
    clubDetails: clubTexts.ko.clubDetails,
    busInfo: busInfoTexts.ko,
    
    // newBTexts는 세 개의 최상위 키를 가지고 있으므로 분리하여 매핑
    calendarPage: newBTexts.ko.calendarPage,
    otInfo: newBTexts.ko.otInfo,
    newB: newBTexts.ko.newB,
    
    // 🆕 학사일정 제목
    calendarEventTitles: calendarEventTitles.ko,
    
    // 🆕 동아리 상세 정보
    clubDetailTexts: clubDetailTexts.ko,
    
    // aside는 기존대로 외부 ASIDE_CONTENT에서 가져옴
    aside: ASIDE_CONTENT.ko,
  },
  en: {
    nav: navTexts.en,
    auth: authTexts.en,
    mapDetails: mapDetailTexts.en,
    assistDetails: assistTexts.en,
    clubDetails: clubTexts.en.clubDetails,
    busInfo: busInfoTexts.en,
    
    calendarPage: newBTexts.en.calendarPage,
    otInfo: newBTexts.en.otInfo,
    newB: newBTexts.en.newB,
    
    // 🆕 학사일정 제목
    calendarEventTitles: calendarEventTitles.en,
    
    // 🆕 동아리 상세 정보
    clubDetailTexts: clubDetailTexts.en,
    
    aside: ASIDE_CONTENT.en,
  },
};