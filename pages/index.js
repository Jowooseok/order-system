import React, { useEffect, useState } from 'react'
import { Menu, Dropdown, Button, Divider, Input } from 'antd';
import Link from 'next/link';

const { Search } = Input;

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
        </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
        </a>
        </Menu.Item>
    </Menu>
);

const home = () => {

    const [address, setAddress] = useState('청원구청');
    const [radius, setRadius] = useState(1500);
    const [searchMethod, setSearchMethod] = useState('주소');


    useEffect(() => {
        let container = document.getElementById('map');
        let options = {
            center: new kakao.maps.LatLng(36.652168231792736, 127.49570654728812),
            level: 7
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

    const searchClick = () => {
        if(searchMethod==='주소'){
            setSearchMethod('키워드')
        }else{
            setSearchMethod('주소')
        }
    }
    

    return (
        <>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>

            <div id='map' style={{ height: '100vh', zIndex: '0' }}>
                <Button style={{ width: '10%', float: 'left', zIndex: '2' }} onClick={searchClick} >{searchMethod}</Button>
                <Search style={{ width: '60%', position: 'absolute', zIndex: '2' }} placeholder="주소 입력" onSearch={value => { setAddress(value) }} enterButton />
                <Input style={{ width: '20%', float: 'right', zIndex: '2' }} onChange={e => { setRadius(e.target.value) }} placeholder='반경미터입력' />
            </div>
        </>
    )
}

export default home;

