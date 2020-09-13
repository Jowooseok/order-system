import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import { Input, Col, Row, Drawer, List, Modal } from 'antd';
import Link from 'next/link';
import { StarFilled, EnvironmentFilled, MenuOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

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
let addAddress = '';


const home = () => {
    const [visibleD, setVisibleD] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [changeEdit, setChangeEdit] = useState('');
    const [changeAdd, setChangeAdd] = useState('');
    const [addressId, setAddresId] = useState(null);

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

        // const zoomControl = new kakao.maps.ZoomControl(); //컨트롤러 생성
        // map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);

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
                    addAddress = result[0].road_address.address_name;
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
                console.log(count)

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

                        addAddress = result[0].road_address.address_name;



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
                        console.log(count)

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

    const searchFuction = (e) => {
        const value = e.target.value
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

    const changeRadius = (value) => {
        radius = value;
        if (preCircle) {
            preCircle.setMap(null);
        }
        if (count === 1) {
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
            preCircle = circle;
        }
    }

    const enterRadius12 = () => {
        changeRadius(1200)
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

    const zoomIn = () => {
        map.setLevel(map.getLevel() - 1);
    }

    // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
    const zoomOut = () => {
        map.setLevel(map.getLevel() + 1);
    }

    //즐겨찾기 작업 시작
    const data = [
        {
            id: 1,
            title: '우석집',
            address: '청주시 복대동 1884 진영빌',
            latitude: 37,
            longitude: 127,
        },
        {
            id: 2,
            title: '수웅집',
            address: '청주시 복대동 1884 진영빌',
            latitude: 37,
            longitude: 130,
        },
        {
            id: 3,
            title: '경민집',
            address: '청주시 복대동 1884 진영빌',
            latitude: 36,
            longitude: 127,
        },
    ];

    //Drwer
    const showDrawer = () => {
        setVisibleD(true);
    };
    const onClose = () => {
        setVisibleD(false);
    };

    //dancelModal
    const showDeleteModal = (id) => () => {
        setVisibleDelete(true)
        setAddresId(id);
    }
    const deleteHandleOk = () => {  //서버로 삭제요청 보내기 로직 실행
        setVisibleDelete(false)
        console.log(addressId)
        setAddresId(null);
    }
    const deleteHandleCancel = e => {
        setVisibleDelete(false)
    }

    //editModal
    const showEditModal = (id) => () => {
        setVisibleEdit(true)
        setAddresId(id);
    }
    const editHandleOk = () => { //서버로 수정요청 보내기 로직 실행
        setVisibleEdit(false)
        console.log(addressId)
        setAddresId(null);
    }
    const editlHandleCancel = e => {
        setVisibleEdit(false)
    }

    const moveToAddress = (latitude, longitude) => () => { //주소 클릭시 맵 이동
        map.setCenter(new kakao.maps.LatLng(latitude, longitude))
    }

    //addModal
    const showAddModal = () => {
        setVisibleAdd(true)
  
    }
    const addHandleOk = () => { //서버로 수정요청 보내기 로직 실행
        setVisibleAdd(false)
        console.log(nowPosition,addAddress,changeAdd)
    }
    const addHandleCancel = e => {
        setVisibleAdd(false)
    }

    //즐겨찾기 추가
    const onClickFavorites = () => {
        if(count === 0){
            alert('즐겨찾기할 장소를 선택해주세요!')
        }else{
            showAddModal()
        }
    }

    return (
        <>
            <script type="text/javascript"
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>
                
                <meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" /> 
            <Col style={{ width: '100%', height: '100%', position: 'fixed' }}>
                <Row style={{ width: '100%', height: '15%', border: '1px solid', borderColor: 'rgb(242,243,245)' }}>
                    <Col style={{ width: '100%', height: '100%' }}>
                        <Row justify={'center'} align={'middle'} style={{ width: '100%', height: '47%', lineHeight: '1px' }}>
                            <EnvironmentFilled style={{ fontSize: '23px', lineHeight: '1px' }} /><span style={{ fontSize: '20px', lineHeight: '1px', fontFamily: `Grandstander, cursive`, paddingTop: '5px' }}>4Makers<b>Map</b></span>
                        </Row>
                        <Row justify={'center'} align={'middle'} style={{ width: '100%', height: '53%' }}>
                            <Input id="keyword" style={{ width: '100%', height: '90%', borderColor: 'white', borderRadius: '10px', margin: '10px', backgroundColor: 'rgb(242,243,245)', margin: '5px' }} placeholder={'장소,주소 검색'} onPressEnter={searchFuction} />
                        </Row>
                    </Col>

                </Row>
                <Row style={{ width: '100%', height: '85%' }}>
                    <div id='map' style={{ height: '100%', width: '100%' }}>
                    </div>
                </Row>
            </Col>
            <div style={{ fontFamily: `Grandstander, cursive` }}>

                <span style={{ position: 'absolute', bottom: '210px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} onClick={enterRadius12}><b>1.2</b></span>
                <span style={{ position: 'absolute', bottom: '160px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} onClick={enterRadius15}><b>1.5</b></span>
                <span style={{ position: 'absolute', bottom: '110px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} onClick={enterRadius20}><b>2.0</b></span>
                <span style={{ position: 'absolute', bottom: '60px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} onClick={enterRadius25}><b>2.5</b></span>
                <span style={{ position: 'absolute', bottom: '10px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} onClick={enterRadius30}><b>3.0</b></span>

            </div>
            <div >
                <MenuOutlined style={{ fontSize: '23px', position: 'absolute', right: '10px', top: '15px' }} onClick={showDrawer} />
                <Drawer
                    title={[<StarFilled style={{ color: 'RGB(250,225,0)', fontSize: '20px' }} />, <span style={{ fontSize: '16px' }}>즐겨찾기</span>]}
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visibleD}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item
                                actions={[<EditFilled onClick={showDeleteModal(item.id)} />, <DeleteFilled onClick={showEditModal(item.id)} />]}
                            >
                                <List.Item.Meta
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description={[<span onClick={moveToAddress(item.latitude, item.longitude)}>{item.address}</span>]}
                                />

                            </List.Item>
                        )}
                    />,
                </Drawer>
                <Modal
                    title="즐겨찾기 수정"
                    visible={visibleDelete}
                    onOk={deleteHandleOk}
                    onCancel={deleteHandleCancel}
                >
                    <Input placeholder={'입력해주세요'} onChange={(e) => setChangeEdit(e.target.value)} />
                </Modal>
                <Modal
                    title="즐겨찾기 삭제"
                    visible={visibleEdit}
                    onOk={editHandleOk}
                    onCancel={editlHandleCancel}
                >
                    <p>정말로 삭제하시겠습니까?</p>
                </Modal>
                <Modal
                    title="즐겨찾기 추가"
                    visible={visibleAdd}
                    onOk={addHandleOk}
                    onCancel={addHandleCancel}
                >
                    <Input placeholder={'저장할 명칭을 입력해주세요'} onChange={(e) => setChangeAdd(e.target.value)} />
                </Modal>
                <span onClick={zoomIn} style={{ position: 'absolute', top: '120px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} ><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" width={'15px'} /></span>
                <span onClick={zoomOut} style={{ position: 'absolute', top: '170px', right: '5px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'rgb(94,94,94)' }} ><img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" width={'15px'} /></span>
            </div>

          
            <StarFilled style={{ position: 'absolute',top: '56%', left: '5px', fontSize: '20px', border: '1px solid', borderRadius: '50%', padding: '10px', backgroundColor: 'white', borderColor: 'rgb(242,243,245)', color: 'RGB(250,225,0)' }} onClick={onClickFavorites} />
       
        </>
    )
}


export default home;