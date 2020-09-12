import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import { Menu, Dropdown, Button, Divider, Input, Affix } from 'antd';
import Link from 'next/link';
import { StarFilled } from '@ant-design/icons';

const { Search } = Input;

let a = null;
let b = null;
let i = null;
let m = null;
let p = null;
let radius = 0;
let count = 0;
let nowPosition = null;
let preCircle = null;
let markers = [];
let map = null;

const home = () => {
    const [searchMethod, setSearchMethod] = useState('키워드');

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
        map = new kakao.maps.Map(container, options);

        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        // 주소로 좌표를 검색합니다
        const geocoder = new kakao.maps.services.Geocoder(); //주소 검색

        const ps = new kakao.maps.services.Places(); // 키워드 검색

        const zoomControl = new kakao.maps.ZoomControl(); //컨트롤러 생성
        map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

        a = geocoder;
        i = infowindow;
        b = kakao.maps.services;
        p = ps;
    }, [])

    const searchAddress = (value) => { // 주소

        count = 0;

        a.addressSearch(value, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === b.Status.OK) {
                removeMarker();
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
                nowPosition = coords;

                // // 결과값으로 받은 위치를 마커로 표시합니다
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                })
                markers.push(marker);
                //인포윈도우로 장소에 대한 설명을 표시합니다
                kakao.maps.event.addListener(marker, 'click', function () {

                    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                    let content = '<div style="padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' + result[0].address.address_name + '</div>';
                    i.setContent(content);

                    if (preCircle) {
                        preCircle.setMap(null);
                    }

                    const circle = new kakao.maps.Circle({
                        center: new kakao.maps.LatLng(coords.Ha, coords.Ga),  // 원의 중심좌표 입니다
                        radius: radius, // 미터 단위의 원의 반지름입니다
                        strokeWeight: 5, // 선의 두께입니다
                        strokeColor: '#75B8FA', // 선의 색깔입니다
                        strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                        strokeStyle: 'dashed', // 선의 스타일 입니다
                        fillColor: '#CFE7FF', // 채우기 색깔입니다
                        fillOpacity: 0.7  // 채우기 불투명도 입니다
                    });
                    
                    if (count === 0) {
                        count = 1;
                        i.open(map, marker);
                        circle.setMap(map);
                    } else {
                        i.close();
                        count = 0;
                        circle.setMap(null);
                    }

                    preCircle = circle;


                });


                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
                return;
            }
        });
        function removeMarker() {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }
    }


    const searchKeyword = (value) => { // 키워드

        count = 0;

        p.keywordSearch(value, function (data, status, pagination) {
            // 정상적으로 검색이 완료됐으면
            if (status === b.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                removeMarker();
                let bounds = new kakao.maps.LatLngBounds();
                for (let i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            }
            else {
                setSearchMethod('주소');
            }
        });

        function displayMarker(place) {
            // 마커를 생성하고 지도에 표시합니다
            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });
            markers.push(marker);
            const location = new kakao.maps.LatLng(place.y, place.x);

            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', function () {
                searchDetailAddrFromCoords(location, function (result, status) {
                    nowPosition = location;

                    if (status === kakao.maps.services.Status.OK) {

                        let detailAddr = result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                        detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                        let content = '<div style="padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' +
                            '<span class="title">' + place.place_name + '</span>' +
                            detailAddr +
                            '</div>';
                        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                        i.setContent(content);


                        if (preCircle) {
                            preCircle.setMap(null);
                        }

                        

                        const circle = new kakao.maps.Circle({
                            center: location,  // 원의 중심좌표 입니다
                            radius: radius, // 미터 단위의 원의 반지름입니다
                            strokeWeight: 5, // 선의 두께입니다
                            strokeColor: '#75B8FA', // 선의 색깔입니다
                            strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                            strokeStyle: 'dashed', // 선의 스타일 입니다
                            fillColor: '#CFE7FF', // 채우기 색깔입니다
                            fillOpacity: 0.7  // 채우기 불투명도 입니다
                        });

                        if (count === 0) {
                            count = 1;
                            i.open(map, marker);
                            circle.setMap(map);
                        } else {
                            i.close();
                            count = 0;
                            circle.setMap(null);
                        }

                        preCircle = circle;
                    }
                });
            });
        }
        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            a.coord2Address(coords.getLng(), coords.getLat(), callback);
        }
        function removeMarker() {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }
    }

    const searchFuction = (value) => {
        count = 0;
        if (!value.replace(/^\s+|\s+$/g, '')) {
            alert('검색어를 입력해주세요!');
            return false;
        }
        if (preCircle) {
            preCircle.setMap(null);
            i.close();
        }

        searchAddress(value);
        searchKeyword(value);
    }

    const changeRadius = (value) =>{
        radius = value;
        if (preCircle) {
            preCircle.setMap(null);
        }
        if(count===1){
            const circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(nowPosition.Ha, nowPosition.Ga),  // 원의 중심좌표 입니다
                radius: value, // 미터 단위의 원의 반지름입니다
                strokeWeight: 5, // 선의 두께입니다
                strokeColor: '#75B8FA', // 선의 색깔입니다
                strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'dashed', // 선의 스타일 입니다
                fillColor: '#CFE7FF', // 채우기 색깔입니다
                fillOpacity: 0.7  // 채우기 불투명도 입니다
            });
            circle.setMap(map)
            preCircle=circle;
        }
    }

    const enterRadius15 = () => {
        changeRadius(1500)
    }
    const enterRadius20 = () => {
        changeRadius(2000)

    }
    const enterRadius25 = () => {
        changeRadius(2500)
    }
    const enterRadius30 = () => {
        changeRadius(3000)
    }

    return (
        <>
            <script type="text/javascript"
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>

            <div id='map' style={{ height: '100vh', zIndex: 0 }}>
            </div>


            <Search id="keyword" style={{ width: '100%', position: 'absolute', top: '0px' }} placeholder={'입력해주세요'} onSearch={searchFuction} enterButton />

            <div>
                <Button type={'primary'} style={{ position: 'absolute', top: '32px', left: '0px' }} onClick={enterRadius15}>1.5km</Button>
                <Button type={'danger'} style={{ position: 'absolute', top: '32px', left: '70px' }} onClick={enterRadius20}>2km</Button>
                <Button type={'primary'} style={{ position: 'absolute', top: '32px', left: '130px' }} onClick={enterRadius25}>2.5km</Button>
                <Button type={'danger'} style={{ position: 'absolute', top: '32px', left: '200px' }} onClick={enterRadius30}>3km</Button>
            </div>
        </>
    )
}

export default home;