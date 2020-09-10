<<<<<<< HEAD
import React, {useEffect} from 'react';

const keywordS = (keyword, radius) => {
    useEffect(() => {
        let container = document.getElementById('map');
        let options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
        let map = new kakao.maps.Map(container, options);

        let infowindow = new kakao.maps.InfoWindow({zIndex: 1});
        let geocoder = new kakao.maps.services.Geocoder();
        let ps = new kakao.maps.services.Places();

        ps.keywordSearch(keyword, placesSearchCB);

        function placesSearchCB(data, status, pagination) {
=======
import React,{useEffect} from 'react';


const keywordS = (keyword) => {
 
    useEffect(()=>{
        const infowindow = new kakao.maps.InfoWindow({zIndex: 1});

        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
    
        const map = new kakao.maps.Map(container, options);
    
        // 키워드로 좌표를 검색합니다
        const ps = new kakao.maps.services.Places();
    
        ps.keywordSearch(keyword, function (data, status, pagination) {
    
            // 정상적으로 검색이 완료됐으면
>>>>>>> ce526d2caf5691fff517f8bcbb4a9966fe4201e0
            if (status === kakao.maps.services.Status.OK) {
                // 정상적으로 검색이 완료됐으면
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
<<<<<<< HEAD
                let bounds = new kakao.maps.LatLngBounds();

                for (let i = 0; i < data.length; i++) {
=======
                const bounds = new kakao.maps.LatLngBounds();
    
                for (var i = 0; i < data.length; i++) {
>>>>>>> ce526d2caf5691fff517f8bcbb4a9966fe4201e0
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            }
        }

        function displayMarker(place) {
            // 마커를 생성하고 지도에 표시합니다
<<<<<<< HEAD
            let marker = new kakao.maps.Marker({
=======
            const marker = new kakao.maps.Marker({
>>>>>>> ce526d2caf5691fff517f8bcbb4a9966fe4201e0
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });

            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', function () {
                        let detailAddr = !!place.road_address ? '<div>도로명주소 : ' + place.road_address.address_name + '</div>' : '';
                        // detailAddr += '<div>지번 주소 : ' + place.address.address_name + '</div>';

                        let content = '<div class="bAddr">' +
                            '<span class="title">' + place.place_name + '</span>' +
                            detailAddr +
                            '</div>';

                        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
            });

            function searchDetailAddrFromCoords(coords, callback) {
                // 좌표로 법정동 상세 주소 정보를 요청합니다
                geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
            }
        }
    }, [radius, keyword])

return (<>

</>)
}

export default keywordS;