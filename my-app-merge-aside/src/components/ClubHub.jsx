// FILE: src/components/ClubHub.jsx
import React, { useMemo, useState, useEffect } from "react";
import ClubDetail from "./ClubDetail";
import 공연 from "../images/공연분과.png";
import 학술 from "../images/학술분과.png";
import 운동 from "../images/운동분과.png";
import 종교 from "../images/종교분과.png";
import 봉사 from "../images/봉사분과.png";
import 전시 from "../images/전시분과.png";

/** 배경 이미지 */
const CATEGORY_IMAGES = {
  공연,
  전시,
  학술,
  운동,
  종교,
  봉사,
};

/** 공통 링크 헬퍼 */
const extLink = (href, label) => (
  <a href={href} target="_blank" rel="noreferrer">
    {label}
  </a>
);

/** 카테고리별 동아리 목록 (한국어/영어 모두 포함) */
const CLUBS_BY_CATEGORY = {
  ko: {
    공연: [
      {
        name: "소리아리",
        desc: "크리에이티브 뮤직 밴드",
        custom: (
          <div>
            <div style={{ whiteSpace: "pre-line" }}>
              {`𝘾𝙍𝙀𝘼𝙏𝙄𝙑𝙀 𝙈𝙐𝙎𝙄𝘾 𝘽𝘼𝙉𝘿 '𝙎𝙊𝙍𝙄𝘼𝙍𝙄'✨`}
            </div>
            <p>
              유튜브 :{" "}
              {extLink(
                "https://www.youtube.com/@soriari_",
                "https://www.youtube.com/@soriari_"
              )}
            </p>
            <p>
              인스타 :{" "}
              {extLink(
                "https://www.instagram.com/soriari_official?utm_source=ig_web_button_share_sheet&igsh=dXptcDJmNTE0bWI5",
                "https://www.instagram.com/soriari_official"
              )}
            </p>
          </div>
        ),
      },
      {
        name: "메트로폴리스",
        desc: "하드락 밴드 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`-하드락밴드 동아리
-하드락 밴드지만 락, 메탈뿐만 아니라 장르 구분 없이 다룸`}
            <div style={{ marginTop: 6 }}>
              - 유튜브 링크 :{" "}
              {extLink(
                "https://m.youtube.com/@metropolis3815",
                "https://m.youtube.com/@metropolis3815"
              )}
            </div>
          </div>
        ),
      },
      {
        name: "MUSE",
        desc: "HSU ғʀᴇᴇꜱᴛʏʟᴇ ʙᴀɴᴅ 'MUSE'",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            링크트리 :{" "}
            {extLink(
              "https://linktr.ee/band.muse?utm_source=linktree_profile_share&ltsid=41ff0f57-f7f9-4452-8482-19d95834b258",
              "https://linktr.ee/band.muse"
            )}
            {"\n"}
            인스타그램 :{" "}
            {extLink(
              "https://www.instagram.com/muse__1995/",
              "https://www.instagram.com/muse__1995/"
            )}
            {"\n"}-노션, 유튜브, 인스타그램, 페이스북, 디스코드 등등
          </div>
        ),
      },
      {
        name: "FADER",
        desc: "한신대학교 힙합동아리 FADER",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            🌐Check Our Soundcloud🌐
            {"\n"}
            링크트리 :{" "}
            {extLink(
              "https://linktr.ee/fader5301?utm_source=linktree_profile_share&ltsid=0da22400-f7ba-46de-aca6-b57e49f8fec6",
              "https://linktr.ee/fader5301"
            )}
            {"\n"}- 플레이리스트, 방중공연 예매, 사운드클라우드
            {"\n"}
            인스타그램 :{" "}
            {extLink(
              "https://www.instagram.com/fader5301hs/",
              "https://www.instagram.com/fader5301hs/"
            )}
          </div>
        ),
      },
      {
        name: "DIO",
        desc: "한신대학교 댄스동아리 DIO",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`🤍한신대학교 댄스동아리 DIO🖤
Dance Is Original`}
            {"\n"}
            유튜브 :{" "}
            {extLink(
              "https://www.youtube.com/channel/UChs-wnk5lJFonX4mI_SricQ",
              "https://www.youtube.com/channel/UChs-wnk5lJFonX4mI_SricQ"
            )}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/di_o_fficial/",
              "https://www.instagram.com/di_o_fficial/"
            )}
          </div>
        ),
      },
      {
        name: "보라성",
        desc: "민중가요·노래패",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 중앙동아리 민중가요 노래패♪
💜행동하는! 노래패💜🎶
SINCE 1987`}
            {"\n"}
            {extLink(
              "https://www.instagram.com/hs.borasung?utm_source=ig_web_button_share_sheet&igsh=cWdsNmk5YTRhaGV6",
              "https://www.instagram.com/hs.borasung"
            )}
          </div>
        ),
      },
      {
        name: "일과놀이",
        desc: "풍물놀이패",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 중앙풍물패 일과놀이
𝒔𝒊𝒏𝒄𝒆 1982~
Korean traditional percussion band`}
            {"\n"}
            인스타그램 :{" "}
            {extLink(
              "https://www.instagram.com/1nol2s_log/",
              "https://www.instagram.com/1nol2s_log/"
            )}
          </div>
        ),
      },
      {
        name: "별자리",
        desc: "뮤지컬 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            공연 일정 : 9/15(월)~9/16(화) 19:10
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hsu_asterism/",
              "https://www.instagram.com/hsu_asterism/"
            )}
          </div>
        ),
      },
    ],
    전시: [
      {
        name: "몽당연필",
        desc: "그림&보드게임 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`-그림&보드게임 동아리 
-🎲주요 활동🎲
📅월별 대모임 : 필수 활동📅
매달 테마별 활동: 공예의 달 / 보드게임의 달 / 그림의 달
부원 전체가 함께하는 대규모 활동으로 더욱 다채로운 경험!

👥소모임 활동 :필수 활동👥
취향별 4인 소모임 구성 (그림팀 / 공예팀 / 보드게임팀 등)
1학기 동안 지속적인 활동으로 깊이 있는 경험과 친목 도모

🎪축제 부스 운영 :선택활동🎪
애완돌 키링 판매
모래병 / 조약돌 키링 만들기 체험
직접 제작한 작품들로 수익 창출!

🏕️동아리 MT🏕️
중간고사 후 대부도 1박 2일
바다와 함께하는 힐링 타임
*MT장소는 변경될 수 있습니다`}
          </div>
        ),
      },
      {
        name: "we wear",
        desc: "한신대 패션동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            한신대 패션동아리
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/wewear_fashionclub/",
              "https://www.instagram.com/wewear_fashionclub/"
            )}
          </div>
        ),
      },
      {
        name: "녹연다우회",
        desc: "다도 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대 녹연다우회
안녕하세요 한신대학교 차 동아리 "녹연다우회"입니다🍵`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/greeneny_32/",
              "https://www.instagram.com/greeneny_32/"
            )}
          </div>
        ),
      },
      {
        name: "민알 (MINAL)",
        desc: "사진 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`HSU_MINAL
예술가
한신대학교 사진동아리 MINAL
🎞️청춘 기록장 민알📷`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/minal__kr/",
              "https://www.instagram.com/minal__kr/"
            )}
          </div>
        ),
      },
      {
        name: "크라임씬",
        desc: "추리 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`-추리 동아리
-추리 동아리 크라임씬은 JTBC 예능 크라임씬 시리즈를 바탕으로 만들어진 동아리로, 방송 크라임씬과 같이 부원들이 직접 살인사건의 용의자가 되어 누가 범인인지 추리하는 RPG (Role Playing Game) 게임을 제작 및 체험합니다.
-🔍주요 활동
-크라임씬 시나리오 구성 및 게임 제작
-게임 부스 준비
-방탈출 프로그램과 크라임씬 게임 플레이
-동아리 내 지니어스 게임 대회 & 보드게임 대회 등`}
          </div>
        ),
      },
    ],
    학술: [
      {
        name: "SSOA",
        desc: "중앙광고동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`-중앙광고동아리
-한신대학교 중앙광고동아리 SSOA는 2003년부터 이어져 온 전통과 체계적인 커리큘럼을 기반으로, 광고 기획에 필요한 능력과 사고를 단계적으로 쌓아갈 수 있는 공간입니다
-📍활동내용: 매주 화요일 19:00 장준하통일관 (시험기간 및 시험기간 전 주 제외)
✔️ 기획 스터디 및 경쟁PT 활동
✔️ 공모전 출품
✔️ 졸업생 멘토링
✔️ MT, 소모임 등 다양한 친목활동`}
          </div>
        ),
      },
      {
        name: "애드썬",
        desc: "광고동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`"Rᴇᴅꜱᴜɴ Aᴅꜱᴜɴ"
한신대학교 광고동아리`}
            {"\n"}
            오픈채팅방 :{" "}
            {extLink(
              "https://open.kakao.com/o/sAkpcUgh",
              "https://open.kakao.com/o/sAkpcUgh"
            )}
            {"\n"}
            유튜브 :{" "}
            {extLink(
              "https://youtube.com/@adsun-hsuniv?fbclid=PAZXh0bgNhZW0CMTEAAafcSXlj6Y_IpdmlBGYUv5LMm8P3maDKhk7HNmBPNyszABtJTJSUb4-qE454gw_aem_C7jAquX-380gkoFdLzhMtg",
              "https://youtube.com/@adsun-hsuniv"
            )}
            {"\n"}
            리틀리 :{" "}
            {extLink(
              "https://litt.ly/redsunadsun",
              "https://litt.ly/redsunadsun"
            )}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/redsun_adsun/",
              "https://www.instagram.com/redsun_adsun/"
            )}
          </div>
        ),
      },
      {
        name: "평화나비",
        desc: "평화·인권 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`-평화, 인권 동아리
-<일정🗓️>
-한강 피크닉🥳
-1929년 11월 3일 광주에서 일어난 항일학생운동 기념 2025대학생RUN' 마라톤 행사 공동기획단위 참가🏃‍♀️
-서대문 형무소 기행🏛
-수요시위 주관✊
-정기 세미나📚
-대동제 부스😆
-MT🍻`}
          </div>
        ),
      },
    ],
    운동: [
      {
        name: "비상(飛上)",
        desc: "한신대학교 배구 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 배구 동아리 비상(飛上)
———"비상하게, 비상하라."———
🏆2025 KUSF 클럽챔피언쉽 중부지역 예선 여자부 16강 진출
🏆2025 KUSF 클럽챔피언쉽 중부지역 예선 남자부 최종 3위
.
.
🎥유튜브: 한신대 배구동아리 비상`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hanshin_volleyball?utm_source=ig_web_button_share_sheet&igsh=MWpza2lkNDZpMHFmZg==",
              "https://www.instagram.com/hanshin_volleyball"
            )}
          </div>
        ),
      },
      {
        name: "검우회 기백",
        desc: "검도 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`51년의 역사가 있는 한신대학교 검우회 기백입니다`}
            {"\n"}
            유튜브 :{" "}
            {extLink(
              "https://www.youtube.com/@%EA%B2%80%EC%9A%B0%ED%9A%8C%EA%B8%B0%EB%B0%B1",
              "https://www.youtube.com/@검우회기백"
            )}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/gibaek1973?utm_source=ig_web_button_share_sheet&igsh=MXQ1Zm91MWhoanR0cA==",
              "https://www.instagram.com/gibaek1973"
            )}
          </div>
        ),
      },
      {
        name: "APEX",
        desc: "축구 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대 축구동아리
한신대학교 APEX
🏫 Hanshin univ.
⚽️ The official account of APEX Football Club`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hsu_apex/",
              "https://www.instagram.com/hsu_apex/"
            )}
          </div>
        ),
      },
      {
        name: "갱스터",
        desc: "야구 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 갱스터
아마추어 스포츠팀
𝑯𝑺𝑼 𝑩𝑨𝑺𝑬𝑩𝑨𝑳𝑳 𝑻𝑬𝑨𝑴 𝑮𝑨𝑵𝑮𝑺𝑻𝑬𝑹
한신대학교 중앙 야구동아리 갱스터`}
            {"\n"}
            유튜브 :{" "}
            {extLink(
              "https://www.youtube.com/@hsu_gangster?si=8mcJ7sUtwTAh9AOb&fbclid=PAZXh0bgNhZW0CMTEAAae9J0JhSHkSy4pLLyTic7UWHd37wC-B8Wmvhd1kVPBnmDklZ-O0dDAOypKZuA_aem_kY-Mu1nt4H59LuK6lNTF5Q",
              "https://www.youtube.com/@hsu_gangster"
            )}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hanshin_gangster/",
              "https://www.instagram.com/hanshin_gangster/"
            )}
          </div>
        ),
      },
      {
        name: "킬러웨일즈",
        desc: "미식축구부",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 미식축구부 킬러웨일즈
KILLER_WHALES`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hsunivfootball/",
              "https://www.instagram.com/hsunivfootball/"
            )}
            {"\n"}
            링크트리 :{" "}
            {extLink(
              "https://linktr.ee/killerwhales_official?utm_source=linktree_profile_share&ltsid=9be06670-cd12-4617-83d6-95e2f20a8d83",
              "https://linktr.ee/killerwhales_official"
            )}
          </div>
        ),
      },
      {
        name: "SMASH IT",
        desc: "배드민턴 중앙동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            배드민턴 중앙동아리 SMASH IT
          </div>
        ),
      },
      {
        name: "더플라이트",
        desc: "농구 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대학교 중앙동아리 더플라이트
-활동 내용
1. 농구 기본기훈련과 경기에 필요한 훈련 진행
2. 대회 참여 및 타 대학과의 친선경기 진행
3. 세미나 및 방중 MT`}
          </div>
        ),
      },
    ],
    종교: [
      {
        name: "CCC",
        desc: "기독교 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대 CCC
한신대 중앙동아리 CCC 공식계정💫
🌬 Movements everywhere`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hanshin_ccc/",
              "https://www.instagram.com/hanshin_ccc/"
            )}
          </div>
        ),
      },
      {
        name: "IVF",
        desc: "기독교 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`한신대 IVF
💗 한신대학교 중앙동아리 IVF
💗 캠퍼스와 세상 속의 하나님 나라 운동
💗 경기남 IVF 소속 @ggnivf`}
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/hanshin_ivf/",
              "https://www.instagram.com/hanshin_ivf/"
            )}
          </div>
        ),
      },
    ],
    봉사: [
      {
        name: "로타랙트 (E&G)",
        desc: "봉사·교류 동아리",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            한신대 E&G 로타랙트
            {"\n"}
            인스타 :{" "}
            {extLink(
              "https://www.instagram.com/rotaract_eng/",
              "https://www.instagram.com/rotaract_eng/"
            )}
          </div>
        ),
      },
    ],
  },
  en: {
    Performance: [
      {
        name: "Soriari",
        desc: "Creative Music Band",
        custom: (
          <div>
            <div style={{ whiteSpace: "pre-line" }}>
              {`𝘾𝙍𝙀𝘼𝙏𝙄𝙑𝙀 𝙈𝙐𝙎𝙄𝘾 𝘽𝘼𝙉𝘿 '𝙎𝙊𝙍𝙄𝘼𝙍𝙄'✨`}
            </div>
            <p>
              YouTube:{" "}
              {extLink(
                "https://www.youtube.com/@soriari_",
                "https://www.youtube.com/@soriari_"
              )}
            </p>
            <p>
              Instagram:{" "}
              {extLink(
                "https://www.instagram.com/soriari_official",
                "https://www.instagram.com/soriari_official"
              )}
            </p>
          </div>
        ),
      },
      {
        name: "Metropolis",
        desc: "Hard Rock Band",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`- Hard Rock Band
- Plays various genres including rock and metal`}
            <div style={{ marginTop: 6 }}>
              - YouTube:{" "}
              {extLink(
                "https://m.youtube.com/@metropolis3815",
                "https://m.youtube.com/@metropolis3815"
              )}
            </div>
          </div>
        ),
      },
      {
        name: "MUSE",
        desc: "HSU ғʀᴇᴇꜱᴛʏʟᴇ ʙᴀɴᴅ 'MUSE'",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            Linktree:{" "}
            {extLink(
              "https://linktr.ee/band.muse",
              "https://linktr.ee/band.muse"
            )}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/muse__1995/",
              "https://www.instagram.com/muse__1995/"
            )}
            {"\n"}- Notion, YouTube, Instagram, Facebook, Discord, etc.
          </div>
        ),
      },
      {
        name: "FADER",
        desc: "Hanshin University Hip-Hop Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            🌐Check Our Soundcloud🌐
            {"\n"}
            Linktree:{" "}
            {extLink(
              "https://linktr.ee/fader5301",
              "https://linktr.ee/fader5301"
            )}
            {"\n"}- Playlist, Concert Tickets, SoundCloud
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/fader5301hs/",
              "https://www.instagram.com/fader5301hs/"
            )}
          </div>
        ),
      },
      {
        name: "DIO",
        desc: "Hanshin University Dance Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`🤍Hanshin University Dance Club DIO🖤
Dance Is Original`}
            {"\n"}
            YouTube:{" "}
            {extLink(
              "https://www.youtube.com/channel/UChs-wnk5lJFonX4mI_SricQ",
              "https://www.youtube.com/channel/UChs-wnk5lJFonX4mI_SricQ"
            )}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/di_o_fficial/",
              "https://www.instagram.com/di_o_fficial/"
            )}
          </div>
        ),
      },
      {
        name: "Borasung",
        desc: "Folk Song Group",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Folk Song Group♪
💜Action! Song Group💜🎶
SINCE 1987`}
            {"\n"}
            {extLink(
              "https://www.instagram.com/hs.borasung",
              "https://www.instagram.com/hs.borasung"
            )}
          </div>
        ),
      },
      {
        name: "Ilgwanori",
        desc: "Traditional Percussion Band",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Traditional Percussion Band
𝒔𝒊𝒏𝒄𝒆 1982~
Korean traditional percussion band`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/1nol2s_log/",
              "https://www.instagram.com/1nol2s_log/"
            )}
          </div>
        ),
      },
      {
        name: "Asterism",
        desc: "Musical Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            Performance Schedule: 9/15(Mon)~9/16(Tue) 19:10
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hsu_asterism/",
              "https://www.instagram.com/hsu_asterism/"
            )}
          </div>
        ),
      },
    ],
    Exhibition: [
      {
        name: "Mongdang Pencil",
        desc: "Art & Board Game Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`- Art & Board Game Club
- 🎲Main Activities🎲
📅Monthly Gatherings: Required📅
Themed activities each month: Craft Month / Board Game Month / Art Month
Large-scale activities with all members for diverse experiences!

👥Small Group Activities: Required👥
Form 4-person groups by interest (Art Team / Craft Team / Board Game Team, etc.)
Deep experiences and bonding through continuous activities during the semester

🎪Festival Booth: Optional🎪
Pet rock keychain sales
Sand bottle / pebble keychain making experience
Generate revenue with self-made products!

🏕️Club MT🏕️
Daebudo Island 1 night 2 days after midterms
Healing time by the sea
*MT location subject to change`}
          </div>
        ),
      },
      {
        name: "We Wear",
        desc: "Fashion Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            Hanshin University Fashion Club
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/wewear_fashionclub/",
              "https://www.instagram.com/wewear_fashionclub/"
            )}
          </div>
        ),
      },
      {
        name: "Nokyeon Dawoohoe",
        desc: "Tea Ceremony Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Nokyeon Dawoohoe
Hello, we are Hanshin University Tea Club "Nokyeon Dawoohoe"🍵`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/greeneny_32/",
              "https://www.instagram.com/greeneny_32/"
            )}
          </div>
        ),
      },
      {
        name: "MINAL",
        desc: "Photography Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`HSU_MINAL
Artist
Hanshin University Photography Club MINAL
🎞️Youth Records MINAL📷`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/minal__kr/",
              "https://www.instagram.com/minal__kr/"
            )}
          </div>
        ),
      },
      {
        name: "Crime Scene",
        desc: "Mystery Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`- Mystery Club
- Crime Scene is a club based on JTBC's Crime Scene series. Members become suspects in murder cases and create/experience RPG (Role Playing Game) games to deduce who the culprit is.
- 🔍Main Activities
- Crime Scene scenario creation and game production
- Game booth preparation
- Escape room programs and Crime Scene gameplay
- Genius game tournaments & board game competitions within the club`}
          </div>
        ),
      },
    ],
    Academic: [
      {
        name: "SSOA",
        desc: "Central Advertising Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`- Central Advertising Club
- SSOA, Hanshin University's central advertising club since 2003, provides a space to systematically develop advertising planning skills through tradition and structured curriculum.
- 📍Activities: Every Tuesday 19:00 at Jangjunha Unification Hall (except exam periods)
✔️ Planning study & competitive PT activities
✔️ Contest submissions
✔️ Alumni mentoring
✔️ MT, small group meetings, and various social activities`}
          </div>
        ),
      },
      {
        name: "Adsun",
        desc: "Advertising Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`"Rᴇᴅꜱᴜɴ Aᴅꜱᴜɴ"
Hanshin University Advertising Club`}
            {"\n"}
            Open Chat:{" "}
            {extLink(
              "https://open.kakao.com/o/sAkpcUgh",
              "https://open.kakao.com/o/sAkpcUgh"
            )}
            {"\n"}
            YouTube:{" "}
            {extLink(
              "https://youtube.com/@adsun-hsuniv",
              "https://youtube.com/@adsun-hsuniv"
            )}
            {"\n"}
            Litt.ly:{" "}
            {extLink(
              "https://litt.ly/redsunadsun",
              "https://litt.ly/redsunadsun"
            )}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/redsun_adsun/",
              "https://www.instagram.com/redsun_adsun/"
            )}
          </div>
        ),
      },
      {
        name: "Peace Butterfly",
        desc: "Peace & Human Rights Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`- Peace & Human Rights Club
- <Schedule🗓️>
- Han River Picnic🥳
- Participation in 2025 College Student RUN' Marathon commemorating the anti-Japanese student movement in Gwangju on November 3, 1929🏃‍♀️
- Seodaemun Prison tour🏛
- Wednesday demonstration organization✊
- Regular seminars📚
- Daedongje booth😆
- MT🍻`}
          </div>
        ),
      },
    ],
    Sports: [
      {
        name: "Bisang",
        desc: "Volleyball Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Volleyball Club Bisang(飛上)
———"Fly High, Soar Higher."———
🏆2025 KUSF Club Championship Central Region Women's Round of 16
🏆2025 KUSF Club Championship Central Region Men's 3rd Place
.
.
🎥YouTube: Hanshin Volleyball Club Bisang`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hanshin_volleyball",
              "https://www.instagram.com/hanshin_volleyball"
            )}
          </div>
        ),
      },
      {
        name: "Gibaek",
        desc: "Kendo Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Kendo Club Gibaek with 51 years of history`}
            {"\n"}
            YouTube:{" "}
            {extLink(
              "https://www.youtube.com/@검우회기백",
              "https://www.youtube.com/@검우회기백"
            )}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/gibaek1973",
              "https://www.instagram.com/gibaek1973"
            )}
          </div>
        ),
      },
      {
        name: "APEX",
        desc: "Football Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Football Club
Hanshin University APEX
🏫 Hanshin univ.
⚽️ The official account of APEX Football Club`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hsu_apex/",
              "https://www.instagram.com/hsu_apex/"
            )}
          </div>
        ),
      },
      {
        name: "Gangster",
        desc: "Baseball Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Gangster
Amateur Sports Team
𝑯𝑺𝑼 𝑩𝑨𝑺𝑬𝑩𝑨𝑳𝑳 𝑻𝑬𝑨𝑴 𝑮𝑨𝑵𝑮𝑺𝑻𝑬𝑹
Hanshin University Central Baseball Club Gangster`}
            {"\n"}
            YouTube:{" "}
            {extLink(
              "https://www.youtube.com/@hsu_gangster",
              "https://www.youtube.com/@hsu_gangster"
            )}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hanshin_gangster/",
              "https://www.instagram.com/hanshin_gangster/"
            )}
          </div>
        ),
      },
      {
        name: "Killer Whales",
        desc: "American Football Team",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University American Football Team Killer Whales
KILLER_WHALES`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hsunivfootball/",
              "https://www.instagram.com/hsunivfootball/"
            )}
            {"\n"}
            Linktree:{" "}
            {extLink(
              "https://linktr.ee/killerwhales_official",
              "https://linktr.ee/killerwhales_official"
            )}
          </div>
        ),
      },
      {
        name: "SMASH IT",
        desc: "Badminton Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            Central Badminton Club SMASH IT
          </div>
        ),
      },
      {
        name: "The Flight",
        desc: "Basketball Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin University Central Club The Flight
- Activities
1. Basic basketball training and game preparation
2. Competition participation and friendly matches with other universities
3. Seminars and vacation MT`}
          </div>
        ),
      },
    ],
    Religion: [
      {
        name: "CCC",
        desc: "Christian Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin CCC
Hanshin University Central Club CCC Official Account💫
🌬 Movements everywhere`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hanshin_ccc/",
              "https://www.instagram.com/hanshin_ccc/"
            )}
          </div>
        ),
      },
      {
        name: "IVF",
        desc: "Christian Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            {`Hanshin IVF
💗 Hanshin University Central Club IVF
💗 God's Kingdom Movement on Campus and in the World
💗 Gyeonggi-Nam IVF member @ggnivf`}
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/hanshin_ivf/",
              "https://www.instagram.com/hanshin_ivf/"
            )}
          </div>
        ),
      },
    ],
    Service: [
      {
        name: "Rotaract (E&G)",
        desc: "Service & Exchange Club",
        custom: (
          <div style={{ whiteSpace: "pre-line" }}>
            Hanshin E&G Rotaract
            {"\n"}
            Instagram:{" "}
            {extLink(
              "https://www.instagram.com/rotaract_eng/",
              "https://www.instagram.com/rotaract_eng/"
            )}
          </div>
        ),
      },
    ],
  },
};

// 카테고리 키 매핑 (한국어 <-> 영어)
const CATEGORY_MAP = {
  ko: ["공연", "전시", "학술", "운동", "종교", "봉사"],
  en: ["Performance", "Exhibition", "Academic", "Sports", "Religion", "Service"],
};

export default function ClubHub({ texts = {}, lang = "ko", initialClub = null }) {
  const categories = CATEGORY_MAP[lang];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedClub, setSelectedClub] = useState(initialClub);

  // initialClub이 변경되면 selectedClub 업데이트
  useEffect(() => {
    if (initialClub) {
      setSelectedClub(initialClub);
    }
  }, [initialClub]);

  const clubs = useMemo(
    () => CLUBS_BY_CATEGORY[lang]?.[activeCategory] || [],
    [lang, activeCategory]
  );

  if (selectedClub) {
    return (
      <ClubDetail club={selectedClub} onBack={() => setSelectedClub(null)} />
    );
  }

  // 배경 이미지는 한국어 카테고리 키를 사용
  const koCategory = lang === "ko" ? activeCategory : CATEGORY_MAP.ko[CATEGORY_MAP.en.indexOf(activeCategory)];
  const bgUrl = CATEGORY_IMAGES[koCategory];

  const clubTexts = texts?.clubDetails || {};

  return (
    <div style={{ position: "relative", minHeight: "72vh" }}>
      {/* 배경 이미지 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgUrl || ""})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          filter: "saturate(0.95)",
          transform: "translateZ(0)",
        }}
      />

      {/* 내용 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ margin: "6px 0 16px" }}>
          {clubTexts.centralClub?.title || (lang === "ko" ? "중앙 동아리" : "Central Clubs")}
        </h2>

        {/* 분과 탭 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  border: `1px solid ${isActive ? "#401e83" : "#ddd"}`,
                  background: isActive ? "#401e83" : "#fff",
                  color: isActive ? "#fff" : "#333",
                  padding: "6px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                  boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {cat} {clubTexts.categorySuffix || (lang === "ko" ? "분과" : "")}
              </button>
            );
          })}
        </div>

        {/* 동아리 리스트 */}
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid #eee",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            backdropFilter: "blur(1px)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 12 }}>
            {clubs.map((club) => (
              <li key={club.name} style={{ padding: "10px 8px" }}>
                <button
                  onClick={() => setSelectedClub(club)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: 15,
                    color: "#2b2b2b",
                  }}
                >
                  {club.name}
                  {club.desc && (
                    <div style={{ fontSize: 12, color: "#7a7a7a" }}>
                      {club.desc}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}