import React, {useEffect, useState} from 'react'
import {Menu, Dropdown, Button, Divider, Input} from 'antd';
import Link from 'next/link';
import {StarFilled} from '@ant-design/icons';
import addressS from '../pages/addressS';
import keywordS from '../pages/keywordS';

const {Search} = Input;


const home = () => {
    const [address, setAddress] = useState(' ');
    const [keyword, setKeyword] = useState(' ');
    const [radius, setRadius] = useState(1500);
    const [searchMethod, setSearchMethod] = useState('주소');



    if (searchMethod === '주소') {
<<<<<<< HEAD
        useEffect(() => {
            let container = document.getElementById('map');
            let options = {
                center: new kakao.maps.LatLng(36.7332136, 127.3946865),
                level: 8
            };

            let map = new kakao.maps.Map(container, options);


            // 주소로 좌표를 검색합니다
            let geocoder = new kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, function (result, status) {

                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
                    let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    let marker = new kakao.maps.Marker({
                        map: map,
                        position: coords
                    });

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    // let infowindow = new kakao.maps.InfoWindow({
                    //     content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
                    // });
                    // infowindow.open(map, marker);

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다

                    if (!isNaN(radius)) { //한글/영어/특수문자등 입력 방지

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

                        // 지도에 원을 표시합 니다
                        circle.setMap(map);
                    }

                    map.setCenter(coords);
                }
            });
        }, [address, radius])
    }
    // 키워드로 좌표를 검색합니다
    else {
        useEffect(() => {
            let container = document.getElementById('map');
            let options = {
                center: new kakao.maps.LatLng(36.7332136, 127.3946865),
                level: 8
            };

            let map = new kakao.maps.Map(container, options);

            let infowindow = new kakao.maps.InfoWindow({zIndex:1});

            let ps = new kakao.maps.services.Places();

            ps.keywordSearch(keyword, function (data, status, pagination) {

                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    let bounds = new kakao.maps.LatLngBounds();

                    for (var i = 0; i < data.length; i++) {
                        displayMarker(data[i]);
                        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                    }

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                    map.setBounds(bounds);

                }
            });

            function displayMarker(place) {
                // 마커를 생성하고 지도에 표시합니다
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(place.y, place.x)
                });

                // 마커에 클릭이벤트를 등록합니다
                kakao.maps.event.addListener(marker, 'click', function () {
                    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                    infowindow.open(map, marker);
                });
            }
        })
=======
            addressS(address,radius) //useEffect를 함수 안에서 사용 => 참고로 document나 window를 사용하기 위해서는 next.js는 useEffect안에서 사용 가능
    } else {
            keywordS(keyword);
>>>>>>> 4e2b5f6cf29926eff91d4c65a9bad7e300ca818b
    }

    const searchClick = () => {
        if (searchMethod === '주소') {
            setSearchMethod('키워드')
        } else if (searchMethod === '키워드') {
            setSearchMethod('주소')
        }
    }


    return (
        <>
            <script type="text/javascript"
                    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>


            <div style={{height: '10vh', zIndex: '0'}}>
                <Button style={{width: '50%',}} onClick={searchClick}>{searchMethod}</Button>
                <Input style={{width: '50%',}} onChange={e => {
                    setRadius(e.target.value)
                }} placeholder='반경미터입력'/>
                <Search style={{width: '100%', float: 'left'}} placeholder={searchMethod + '입력'} onSearch={value => {
                    (searchMethod === '주소') ? setAddress(value) : setKeyword(value)
                }}  enterButton/>
                <StarFilled style={{
                    bottom: '300px',
                    right: '1px',
                    zIndex: '2',
                    color: 'yellow',
                    position: 'absolute',
                    fontSize: '50px'
                }}/>
            </div>
            <div id='map' style={{height: '90vh'}}></div>

        </>
    )
}

export default home;

