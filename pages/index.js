import React, { useEffect, useState } from 'react'
import { Menu, Dropdown, Button, Divider, Input, Affix } from 'antd';
import Link from 'next/link';
import { StarFilled } from '@ant-design/icons';
import addressS from '../pages/addressS';
import keywordS from '../pages/keywordS';

const { Search } = Input;


const home = () => {
    const [address, setAddress] = useState(' ');
    const [keyword, setKeyword] = useState(' ');
    const [radius, setRadius] = useState(0);
    const [searchMethod, setSearchMethod] = useState('주소');

    useEffect(()=> {
        let container = document.getElementById('map');
        let options = {
            center: new kakao.maps.LatLng(36.7332136, 127.3946865),
            level: 8
        };
        let map = new kakao.maps.Map(container, options);
    })

    if (searchMethod === '주소') {
        addressS(address, radius) //useEffect를 함수 안에서 사용 => 참고로 document나 window를 사용하기 위해서는 next.js는 useEffect안에서 사용 가능
    } else {
        keywordS(keyword);
    }

    const onClickSearch = (value) =>{
        if(searchMethod === '주소'){
            setAddress(value)
            setKeyword('')
        }else if(searchMethod === '키워드'){
            setKeyword(value)
            setAddress('');
        }
       
    }

    const searchClick = () => {
        if (searchMethod === '주소') {
            setSearchMethod('키워드')
        } else if (searchMethod === '키워드') {
            setSearchMethod('주소')
        }
    }

<<<<<<< HEAD
    return (
        <>
            <script type="text/javascript"
                    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=f5257ceead83a67940fcafe2a21c87ae&libraries=services,clusterer,drawing"></script>

            <div style={{height: '10vh', zIndex: '0'}}>
                <Button style={{width: '50%',}} onClick={searchClick}>{searchMethod}</Button>
                <Input style={{width: '50%',}} onChange={e => {
                    setRadius(e.target.value)
                }} placeholder='반경미터입력'/>
                <Search style={{width: '100%', float: 'left'}} placeholder={searchMethod + '입력'} onSearch={value => {
                    (searchMethod === '주소') ? setAddress(value) : setKeyword(value)
                }} enterButton/>
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
=======
    const enterRadius15 = () =>{
        setRadius(1500)
    }
    const enterRadius20 = () =>{
        setRadius(2000)
    }
    const enterRadius25 = () =>{
        setRadius(2500)
    }
    const enterRadius30 = () =>{
        setRadius(3000)
    }


    return (
        <>
            <script type="text/javascript"
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>

            <div id='map' style={{ height: '100vh',zIndex:0 }}>

            </div>
            <div>
            <Button type={'dashed'} style={{ width: '30%', position: 'absolute',top:'0px' }} onClick={searchClick}>{searchMethod}</Button>
            <Button type={'primary'} style={{ position:'absolute',top:'0px',left:'115px' }} onClick={enterRadius15}>1.5km</Button>
            <Button type={'danger'} style={{ position:'absolute',top:'0px',left:'185px' }} onClick={enterRadius20}>2km</Button>
            <Button type={'primary'} style={{ position:'absolute',top:'0px',left:'245px' }} onClick={enterRadius25}>2.5km</Button>
            <Button type={'danger'} style={{ position:'absolute',top:'0px',left:'315px' }} onClick={enterRadius30}>3km</Button>
            </div>
           
            <Search style={{ width: '100%', position: 'absolute', top: '32px'}} placeholder={searchMethod + '입력'} onSearch={onClickSearch} enterButton />\

            {/* <StarFilled style={{
                bottom: '300px',
                right: '1px',
                color: 'yellow',
                position: 'absolute',
                fontSize: '50px'
            }} /> */}



>>>>>>> ce526d2caf5691fff517f8bcbb4a9966fe4201e0
        </>
    )
}

export default home;