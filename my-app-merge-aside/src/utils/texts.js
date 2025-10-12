// src/utils/texts.js

import { ASIDE_CONTENT } from "../data/asideContent"; // 경로는 프로젝트 구조에 맞게 유지

// 새로 생성한 기능별 텍스트 파일들을 모두 import
import { navTexts } from "./texts/navTexts";
import { authTexts } from "./texts/authTexts";
import { mapDetailTexts } from "./texts/mapDetailTexts";
import { assistTexts } from "./texts/assistTexts";
import { clubTexts } from "./texts/clubTexts";
import { busInfoTexts } from "./texts/busInfoTexts";
import { newBTexts } from "./texts/newBTexts";

// 최종 texts 객체 구성
export const texts = {
  ko: {
    nav: navTexts.ko,
    auth: authTexts.ko,
    mapDetails: mapDetailTexts.ko,
    assistDetails: assistTexts.ko,
    clubDetails: clubTexts.ko.clubDetails,
    busInfo: busInfoTexts.ko,
    
    // newBTexts는 세 개의 최상위 키를 가지고 있으므로 분리하여 매핑합니다.
    calendarPage: newBTexts.ko.calendarPage,
    otInfo: newBTexts.ko.otInfo,
    newB: newBTexts.ko.newB,
    
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
    
    aside: ASIDE_CONTENT.en,
  },
};