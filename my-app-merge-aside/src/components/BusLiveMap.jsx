// src/components/BusLiveMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { useKakaoMap } from "../map/useKakaoMap";
import { dropMarkers, clearMarkerAndInfo } from "../map/markers";
import { BUILDINGS } from "../data/buildings";

/** 목적지(한신대 메인 좌표) */
const HSU_CENTER = BUILDINGS["장공관(본관)"];

/** 한신대 정문 정류장 (임시 좌표 + 정류소 ID)
 *  stationId는 방향에 따라 다를 수 있어. 필요하면 바꿔줘.
 */
const BUS_STOP = {
  label: "한신대 정문 정류장",
  lat: 37.1949,
  lng: 127.0206,
  stationId: "233000512", // ← 예시(병점→한신대 방향). 반대편은 ID가 다를 수 있음
};

/** ⚠️ 공공데이터포털 인증키 (일반 인증키)
 *  배포 전에는 .env에 넣고 가져다 쓰세요!
 *  예: REACT_APP_GG_BUS_KEY=...
 */
const API_KEY =
  "bf1870619d0cd7bc1694fdb1954715490c1f7202c9040ce4f5607dfd9b7870";

/** 호출할 엔드포인트 (경기도 버스 도착 정보 v2) */
const ARRIVAL_ENDPOINT =
  "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalList";

/** 분 단위/초 단위 모두 대응해서 “X분 후”로 변환 */
function toMinuteText(r) {
  // predictTime1(분) 또는 PREDICT_TRAV_TM(초) 케이스 대응
  if (typeof r?.predictTime1 === "number") {
    return `${Math.round(r.predictTime1)}분 후`;
  }
  const sec = Number(r?.PREDICT_TRAV_TM);
  if (isFinite(sec) && sec >= 0) {
    return `${Math.round(sec / 60)}분 후`;
  }
  return "정보 없음";
}

export default function BusLiveMap({ height = "68vh" }) {
  const { mapRef, markerRef, infoRef, ready, relayout } = useKakaoMap({
    activeTab: "bus",
    containerId: "bus-live-map",
    center: HSU_CENTER,
    level: 4,
  });

  const [arrivalInfo, setArrivalInfo] = useState("불러오는 중…");
  const refreshTimer = useRef(null);

  /** 🚌 도착 정보 불러오기 */
  const fetchBusArrival = async () => {
    try {
      const url =
        `${ARRIVAL_ENDPOINT}?serviceKey=${API_KEY}` +
        `&stationId=${encodeURIComponent(BUS_STOP.stationId)}` +
        `&pageNo=1&numOfRows=10&resultType=json`;

      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // 응답 포맷 호환 처리 (data.go.kr 계열/gg.go.kr 구형 호환)
      const rows =
        json?.response?.body?.items?.item || // data.go.kr 전형
        json?.msgBody?.busArrivalList || // 일부 문서 변형
        json?.BusArrivalInfo?.[1]?.row || // 구형 gg.go.kr
        [];

      const list = Array.isArray(rows) ? rows : rows ? [rows] : [];

      if (!list.length) {
        setArrivalInfo("도착 정보 없음");
        return;
      }

      const html = list
        .map((r) => {
          const route =
            r.routeName || r.ROUTE_NAME || r.routeId || r.ROUTE_ID || "버스";
          const dest = r.destination || r.PLACE_NAME || "";
          return `${route} ${dest ? `(${dest})` : ""}: ${toMinuteText(r)}`;
        })
        .join("<br/>");

      setArrivalInfo(html || "도착 정보 없음");
    } catch (err) {
      console.error("[Arrival API Error]", err);
      setArrivalInfo("⚠️ 도착 정보를 불러올 수 없습니다.");
    }
  };

  /** 지도 초기화 + 마커 렌더링 */
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    clearMarkerAndInfo(markerRef, infoRef);

    dropMarkers({
      map: mapRef.current,
      markerRef,
      infoRef,
      // infoWindow content는 HTML 가능 (markers.js 참고)
      points: [
        {
          ...BUS_STOP,
          label: `
          <div style="font-size:12px;line-height:1.5">
            <b>${BUS_STOP.label}</b><br/>
            <div id="arrival-info" style="margin-top:6px;color:#333;">불러오는 중…</div>
            <a href="https://map.kakao.com/link/to/한신대학교,${HSU_CENTER.lat},${HSU_CENTER.lng}"
               target="_blank" rel="noreferrer"
               style="display:inline-block;margin-top:6px;padding:6px 10px;border:1px solid #ddd;border-radius:6px;text-decoration:none;">
               한신대까지 길찾기
            </a>
          </div>`,
        },
      ],
      onClick: fetchBusArrival, // 마커 클릭 시 갱신
    });

    // 초기 1회 호출
    fetchBusArrival();

    // 탭 전환/리사이즈 대응
    requestAnimationFrame(relayout);

    // 30초 자동 새로고침(원하면 제거 가능)
    refreshTimer.current = setInterval(fetchBusArrival, 30000);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /** InfoWindow 내부 텍스트 갱신 */
  useEffect(() => {
    const el = document.getElementById("arrival-info");
    if (el) el.innerHTML = arrivalInfo;
  }, [arrivalInfo]);

  return (
    <div
      id="bus-live-map"
      style={{
        width: "100%",
        height,
        border: "1px solid #eee",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    />
  );
}
