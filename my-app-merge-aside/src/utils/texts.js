// src/utils/texts.js

import { ASIDE_CONTENT } from "../data/asideContent";
// 기존 텍스트 파일들
import { navTexts } from "./texts/navTexts";
import { authTexts } from "./texts/authTexts";
import { mapDetailTexts } from "./texts/mapDetailTexts";
import { assistTexts } from "./texts/assistTexts";
import { busInfoTexts } from "./texts/busInfoTexts";
import { newBTexts } from "./texts/newBTexts";
import { calendarEventTitles } from "./texts/calendarEventTitles"; 
import { clubTexts } from "./texts/clubTexts";

// ✅ 최종 texts 객체
export const texts = {
  ko: {
    nav: navTexts.ko,
    auth: authTexts.ko,
    mapDetails: mapDetailTexts.ko,
    assistDetails: assistTexts.ko,
    busInfo: busInfoTexts.ko,

    club: clubTexts.ko, 
    clubDetails: clubTexts.ko.clubDetails,

    // 📅 학사/새내기 관련
    calendarPage: {
        ...newBTexts.ko.calendarPage, 
        eventTitles: calendarEventTitles.ko, // 이벤트 제목 통합
    },
    otInfo: newBTexts.ko.otInfo,
    newB: newBTexts.ko.newB,

    aside: ASIDE_CONTENT.ko,
  },

  en: {
    nav: navTexts.en,
    auth: authTexts.en,
    mapDetails: mapDetailTexts.en,
    assistDetails: assistTexts.en,
    busInfo: busInfoTexts.en,

    club: clubTexts.en,
    clubDetails: clubTexts.en.clubDetails,

    calendarPage: {
        ...newBTexts.en.calendarPage, 
        eventTitles: calendarEventTitles.en, // 이벤트 제목 통합
    },
    otInfo: newBTexts.en.otInfo,
    newB: newBTexts.en.newB,

    aside: ASIDE_CONTENT.en,
  },
};