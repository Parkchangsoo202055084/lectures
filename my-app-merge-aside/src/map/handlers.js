// FILE: src/features/map/handlers.js (수정된 코드)

import { BUILDING_DETAILS } from "../../data/buildingDetails";
import { BUILDINGS } from "../../data/buildings";
import { FACILITIES } from "../../data/facilities";

/**
 * 건물 선택 핸들러를 생성합니다.
 * @param {object} params
 * @param {object} params.mapRef - 지도 ref
 * @param {object} params.markerRef - 마커 ref
 * @param {object} params.infoRef - 인포윈도우 ref
 * @param {boolean} params.ready - 지도 준비 상태
 * @param {function} params.onDetail - 상세 정보 콜백
 */
export const makeHandleSelectBuilding = ({ mapRef, markerRef, infoRef, ready, onDetail, lang = 'ko' }) => (buildingName) => { // lang 파라미터 추가
    if (!ready) return;

    const { kakao } = window;
    const map = mapRef.current;
    const building = BUILDINGS[buildingName];
    
    // **수정된 부분: alias를 포함한 전체 상세 데이터를 가져옵니다.**
    const buildingDetailFullData = BUILDING_DETAILS[buildingName] || {};

    if (!building) {
        onDetail(null);
        markerRef.current?.setMap(null);
        infoRef.current?.close();
        return;
    }

    const pos = new kakao.maps.LatLng(building.lat, building.lng);
    const marker = markerRef.current || new kakao.maps.Marker({ position: pos, map });
    marker.setPosition(pos);
    marker.setMap(map);
    markerRef.current = marker;

    const content = `<div style="padding:5px;font-size:12px;"><b>${buildingName}</b></div>`;
    const infowindow = infoRef.current || new kakao.maps.InfoWindow({ content, position: pos });
    infowindow.setContent(content);
    infowindow.setPosition(pos);
    infowindow.open(map, marker);
    infoRef.current = infowindow;

    map.setCenter(pos);

    // **수정된 부분:** 'ko'나 'en' 필드가 아닌, alias를 포함한 *전체 데이터 객체*를 전달합니다.
    // 이렇게 해야 onDetail을 받는 컴포넌트(DetailPanel 등)에서 alias를 참조할 수 있습니다.
    onDetail({
        type: 'building',
        title: buildingName,
        data: buildingDetailFullData, // alias와 ko/en 객체 모두 포함된 전체 데이터 전달
        coords: { lat: building.lat, lng: building.lng }
    });
};

/**
 * 편의시설 선택 핸들러를 생성합니다.
 */
export const makeHandleSelectFacility = ({ mapRef, markerRef, infoRef, ready, onDetail }) => (category, item) => {
    if (!ready) return;

    const { kakao } = window;
    const map = mapRef.current;
    const facility = FACILITIES[category]?.[item];

    if (!facility) {
        onDetail(null);
        markerRef.current?.setMap(null);
        infoRef.current?.close();
        return;
    }

    const pos = new kakao.maps.LatLng(facility.lat, facility.lng);
    const marker = markerRef.current || new kakao.maps.Marker({ position: pos, map });
    marker.setPosition(pos);
    marker.setMap(map);
    markerRef.current = marker;

    const content = `<div style="padding:5px;font-size:12px;"><b>${item}</b></div>`;
    const infowindow = infoRef.current || new kakao.maps.InfoWindow({ content, position: pos });
    infowindow.setContent(content);
    infowindow.setPosition(pos);
    infowindow.open(map, marker);
    infoRef.current = infowindow;

    map.setCenter(pos);

    // 'type'과 'data'를 포함하는 통일된 형식으로 객체를 전달합니다.
    onDetail({
        type: 'facility',
        title: item,
        data: { description: facility.description },
        coords: { lat: facility.lat, lng: facility.lng }
    });
};