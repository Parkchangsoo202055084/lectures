// src/components/BusLiveMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { useKakaoMap } from "../map/useKakaoMap";
import { dropMarkers, clearMarkerAndInfo } from "../map/markers";
import { BUILDINGS } from "../data/buildings";

/** 목적지(한신대 메인 좌표) */
const HSU_CENTER = BUILDINGS["장공관(본관)"];

/** 한신대 정문 / 병점역후문 (둘 다 등록)
 *  stationId는 방향에 따라 다를 수 있으니 필요 시 교체하세요.
 */
const BUS_STOPS = [
  {
    label: "한신대 정문 정류장",
    lat: 37.194066,
    lng: 127.023545,
    stationId: "223000317",
    // 동일한 routeId 사용, 정류장 내 순서(staOrder)는 1
    routeId: "241363002",
    staOrder: 23,
  },
  {
    label: "병점역후문",
    lat: 37.206728,
    lng: 127.031852,
    stationId: "233000701",
    // 동일한 routeId 사용, 정류장 내 순서(staOrder)는 9
    routeId: "241363002",
    staOrder: 18,
  },
];

/** ⚠️ 공공데이터포털 인증키 (일반 인증키)
 *  배포 전에는 .env에 넣고 가져다 쓰세요!
 *  예: REACT_APP_GG_BUS_KEY=...
 */
const API_KEY =
  "a15e3d2156d9fdca6e76651e9b977dcfd281b8566ca6a4973a25c868f62b5e1f";

/** 호출할 엔드포인트 (경기도 버스 도착 정보 v2) */
const ARRIVAL_ENDPOINT =
  "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalItemv2";

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

  // stationId를 키로 하는 도착정보 맵 (각 정류장별 HTML 문자열)
  const [arrivalInfoMap, setArrivalInfoMap] = useState(
    BUS_STOPS.reduce((acc, s) => {
      acc[s.stationId] = "불러오는 중…";
      return acc;
    }, {})
  );
  const refreshTimer = useRef(null);

  /** 🚌 도착 정보 불러오기 */
  // stationId 외에 routeId, staOrder를 전달하면 URL에 포함하여 특정 노선/정차순서에 맞춘 정보를 요청합니다.
  const fetchBusArrival = async (stationId, routeId, staOrder) => {
    try {
      let url =
        `${ARRIVAL_ENDPOINT}?serviceKey=${API_KEY}` +
        `&stationId=${encodeURIComponent(stationId)}`;
      // routeId/staOrder가 전달되면 쿼리에 추가
      if (routeId) url += `&routeId=${encodeURIComponent(routeId)}`;
      if (typeof staOrder !== "undefined" && staOrder !== null)
        url += `&staOrder=${encodeURIComponent(staOrder)}`;
      url += `&format=json`;

      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // 응답 포맷 호환 처리
      // - data.go.kr 전형: json.response.body.items.item
      // - 일부 변형: json.msgBody.busArrivalList
      // - 구형 gg.go.kr: json.BusArrivalInfo[1].row
      // - v2 단일 객체 형식: json.response.msgBody.busArrivalItem (예시 제공)
      const rows =
        json?.response?.body?.items?.item || // data.go.kr 전형
        json?.msgBody?.busArrivalList || // 일부 문서 변형
        json?.BusArrivalInfo?.[1]?.row || // 구형 gg.go.kr
        json?.response?.msgBody?.busArrivalItem || // v2 단일 객체
        json?.msgBody?.busArrivalItem ||
        [];

      // list는 배열 형태로 통일
      let list;
      if (Array.isArray(rows)) {
        list = rows;
      } else if (rows && typeof rows === "object" && (rows.predictTime1 || rows.predictTimeSec1 || rows.routeId || rows.stationId)) {
        // v2 단일 객체(busArrivalItem)인 경우, predictTime1/2 등을 이용해 최대 2개의 도착정보 항목으로 변환
        const item = rows;
        const arr = [];
        if (typeof item.predictTime1 !== "undefined" || typeof item.predictTimeSec1 !== "undefined") {
          arr.push({
            routeName: item.routeName || item.ROUTE_NAME || item.routeId || item.ROUTE_ID || "버스",
            destination: item.routeDestName || item.destination || item.PLACE_NAME || "",
            predictTime1: typeof item.predictTime1 !== "undefined" ? item.predictTime1 : undefined,
            PREDICT_TRAV_TM: typeof item.predictTimeSec1 !== "undefined" ? item.predictTimeSec1 : undefined,
            __raw: item,
          });
        }
        if (typeof item.predictTime2 !== "undefined" || typeof item.predictTimeSec2 !== "undefined") {
          arr.push({
            routeName: item.routeName || item.ROUTE_NAME || item.routeId || item.ROUTE_ID || "버스",
            destination: item.routeDestName || item.destination || item.PLACE_NAME || "",
            predictTime1: typeof item.predictTime2 !== "undefined" ? item.predictTime2 : undefined,
            PREDICT_TRAV_TM: typeof item.predictTimeSec2 !== "undefined" ? item.predictTimeSec2 : undefined,
            __raw: item,
          });
        }
        list = arr;
      } else {
        list = rows ? [rows] : [];
      }

      if (!list.length) {
        setArrivalInfoMap((m) => ({ ...m, [stationId]: "도착 정보 없음" }));
        return;
      }

      const html = list
        .map((r) => {
          const route = r.routeName || r.ROUTE_NAME || r.routeId || r.ROUTE_ID || "버스";
          const location = r.__raw?.locationNo1 || r.locationNo1;
          const time = toMinuteText(r).replace(" 후", " 후");
          const locationText = typeof location === 'number' ? `${location}정류장 전` : "";
          return `${route}(${locationText}, ${time})`;
        })
        .join("<br/>");

      setArrivalInfoMap((m) => ({ ...m, [stationId]: html || "도착 정보 없음" }));
    } catch (err) {
      console.error("[Arrival API Error]", err);
      setArrivalInfoMap((m) => ({ ...m, [stationId]: "⚠️ 도착 정보를 불러올 수 없습니다." }));
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
      points: BUS_STOPS.map((s) => ({
        ...s,
        // 각 정류장마다 고유한 arrival-info id 사용
        label: `
          <div style="font-size:12px;line-height:1.5">
            <b>${s.label}</b><br/>
            <div id="arrival-info-${s.stationId}" style="margin-top:6px;color:#333;">${arrivalInfoMap[s.stationId] || "불러오는 중…"}</div>
            <a href="https://map.kakao.com/link/to/한신대학교,${HSU_CENTER.lat},${HSU_CENTER.lng}"
               target="_blank" rel="noreferrer"
               style="display:inline-block;margin-top:6px;padding:6px 10px;border:1px solid #ddd;border-radius:6px;text-decoration:none;">
               한신대까지 길찾기
            </a>
          </div>`,
          // 클릭 시 해당 정류장 정보만 갱신 (routeId, staOrder 포함)
          onClick: () => fetchBusArrival(s.stationId, s.routeId, s.staOrder),
      })),
      // 전역 클릭 핸들러 대신 포인트별 onClick 사용
    });

  // 초기 1회 호출: 모든 정류장 정보 불러오기 (각 정류장별 routeId / staOrder 포함)
  BUS_STOPS.forEach((s) => fetchBusArrival(s.stationId, s.routeId, s.staOrder));

    // 탭 전환/리사이즈 대응
    requestAnimationFrame(relayout);

    // 30초 자동 새로고침: 모든 정류장 갱신
    refreshTimer.current = setInterval(() => {
      BUS_STOPS.forEach((s) => fetchBusArrival(s.stationId, s.routeId, s.staOrder));
    }, 30000);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /** InfoWindow 내부 텍스트 갱신 (각 정류장별) */
  useEffect(() => {
    Object.entries(arrivalInfoMap).forEach(([stationId, html]) => {
      const el = document.getElementById(`arrival-info-${stationId}`);
      if (el) el.innerHTML = html;
    });
  }, [arrivalInfoMap]);

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