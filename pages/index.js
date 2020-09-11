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

const home = () => {
    const [radius, setRadius] = useState(0);
    const [searchMethod, setSearchMethod] = useState('주소');
    const [map, setMap] = useState();

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
        setMap(new kakao.maps.Map(container, options))

        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        // 주소로 좌표를 검색합니다
        const geocoder = new kakao.maps.services.Geocoder(); //주소 검색

        const ps = new kakao.maps.services.Places(); // 키워드 검색

        a = geocoder;
        i = infowindow;
        b = kakao.maps.services;
        p = ps;
    },[])

    const searchKeyword = (value) => {
        if(radius===0){
            alert('반경미터를 선택 후 검색해주세요!')
        }else{
            p.keywordSearch(value, function (data, status, pagination) {

                // 정상적으로 검색이 완료됐으면
                if (status === b.Status.OK) {
    
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
                            i.setContent(content);
                            i.open(map, marker);
    
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
                    a.coord2Address(coords.getLng(), coords.getLat(), callback);
                }
            }
        }
     
    }

    const searchAddress = (value) => {
            if(radius===0){
                alert('반경미터를 선택 후 검색해주세요!')
            }else{
                a.addressSearch(value, function (result, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === b.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
        
                        // // 결과값으로 받은 위치를 마커로 표시합니다
                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: coords
                        })
                   
                        //인포윈도우로 장소에 대한 설명을 표시합니다
                        kakao.maps.event.addListener(marker, 'click', function () {
                            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                            let content = '<div style="padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' + result[0].address.address_name + '</div>';
                            i.setContent(content);
                            i.open(map, marker);
                        });


                        try {
                            const circle = new kakao.maps.Circle({
                                center: new kakao.maps.LatLng(coords.Ha, coords.Ga),  // 원의 중심좌표 입니다
                                radius: radius, // 미터 단위의 원의 반지름입니다
                                strokeWeight: 5, // 선의 두께입니다
                                strokeColor: '#75B8FA', // 선의 색깔입니다
                                strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                strokeStyle: 'dashed', // 선의 스타일 입니다
                                fillColor: '#CFE7FF', // 채우기 색깔입니다
                                fillOpacity: 0.7  // 채우기 불투명도 입니다
                            });
                      
                            circle.setMap(map);
                        } catch (error) {
                            console.log(error)
                        }
                   
        
                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                        return;
                    }
                });
            }
        
    }

    const searchFuction = (value) => { 
        if(searchMethod ==='주소'){
            searchAddress(value);
        }else{
            searchKeyword(value);
        }
    }

    const onClickSearchMethod = () => {
        if (searchMethod === '주소') {
            setSearchMethod('키워드')
        } else if (searchMethod === '키워드') {
            setSearchMethod('주소')
        }
    }

    const enterRadius15 = () => {
        setRadius(1500)
    }
    const enterRadius20 = () => {
        setRadius(2000)
    }
    const enterRadius25 = () => {
        setRadius(2500)
    }
    const enterRadius30 = () => {
        setRadius(3000)
    }

    return (
        <>
            <script type="text/javascript"
<<<<<<< HEAD
                    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=f5257ceead83a67940fcafe2a21c87ae&libraries=services,clusterer,drawing"></script>
=======
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>
>>>>>>> 394547351b660cb740f9d94b83a9525228de36b1

            <div id='map' style={{ height: '100vh', zIndex: 0 }}>
            </div>

            <div>
                <Button type={'dashed'} style={{ width: '30%', position: 'absolute', top: '0px' }} onClick={onClickSearchMethod}>{searchMethod}</Button>
                <Button type={'primary'} style={{ position: 'absolute', top: '0px', left: '115px' }} onClick={enterRadius15}>1.5km</Button>
                <Button type={'danger'} style={{ position: 'absolute', top: '0px', left: '185px' }} onClick={enterRadius20}>2km</Button>
                <Button type={'primary'} style={{ position: 'absolute', top: '0px', left: '245px' }} onClick={enterRadius25}>2.5km</Button>
                <Button type={'danger'} style={{ position: 'absolute', top: '0px', left: '315px' }} onClick={enterRadius30}>3km</Button>
            </div>

            <Search style={{ width: '100%', position: 'absolute', top: '32px' }} placeholder={'입력해주세요'} onSearch={searchFuction} onPressEnter={searchFuction} enterButton />
            <StarFilled style={{
                bottom: '300px',
                right: '1px',
                color: 'yellow',
                position: 'absolute',
                fontSize: '50px'
            }} onClick={()=>{window.location.reload()}}  />
        </>
    )
}

export default home;