import React, {useEffect} from 'react';


const keywordS = (keyword,radius) => {

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
        const map = new kakao.maps.Map(container, options);

        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        kakao.maps.event.addListener(map, 'zoom_changed', function() {

            let resultDiv = document.getElementById('result');
        });

        const infowindow = new kakao.maps.InfoWindow({zIndex: 1}); // 마커에 주소표시
        const ps = new kakao.maps.services.Places(); // 키워드 검색
        const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

        ps.keywordSearch(keyword, function (data, status, pagination) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                let bounds = new kakao.maps.LatLngBounds();

                for (let i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);

            }
        });

        function displayMarker(place) {
            // 마커를 생성하고 지도에 표시합니다
            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });
            const location = new kakao.maps.LatLng(place.y,place.x);

            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', function () {
                searchDetailAddrFromCoords(location, function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        let detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                        detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                        let content = '<div style="padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' +
                            '<span class="title">' + place.place_name + '</span>' +
                            detailAddr +
                            '</div>';
                        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                        infowindow.setContent(content);
                        infowindow.open(map, marker);

                        const circle = new kakao.maps.Circle({
                            center: location,  // 원의 중심좌표 입니다
                            radius: radius, // 미터 단위의 원의 반지름입니다
                            strokeWeight: 5, // 선의 두께입니다
                            strokeColor: '#75B8FA', // 선의 색깔입니다
                            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                            strokeStyle: 'dashed', // 선의 스타일 입니다
                            fillColor: '#CFE7FF', // 채우기 색깔입니다
                            fillOpacity: 0.7  // 채우기 불투명도 입니다
                        });
                        circle.setMap(map);
                    }
                });
            });
            function searchDetailAddrFromCoords(coords, callback) {
                // 좌표로 법정동 상세 주소 정보를 요청합니다
                geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
            }
        }
    }, [radius,keyword])

    return (<></>)
}

export default keywordS;