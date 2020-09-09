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
    const [radiusChange, setRadiusChange] = useState(1500);
    const [radius, setRadius] = useState(1500);
    const [searchMethod, setSearchMethod] = useState('주소');

    if (searchMethod === '주소') {
        addressS(address, radius) //useEffect를 함수 안에서 사용 => 참고로 document나 window를 사용하기 위해서는 next.js는 useEffect안에서 사용 가능
    } else {
        keywordS(keyword);
    }

    const searchClick = () => {
        if (searchMethod === '주소') {
            setSearchMethod('키워드')
        } else if (searchMethod === '키워드') {
            setSearchMethod('주소')
        }
    }

    const enterRadius = () =>{
        setRadius(radiusChange)
    }


    return (
        <>
            <script type="text/javascript"
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07&libraries=services,clusterer,drawing"></script>

            <div id='map' style={{ height: '100vh',zIndex:0 }}>

            </div>

            <Button type={'dashed'} style={{ width: '30%', position: 'absolute',top:'0px' }} onClick={searchClick}>{searchMethod}</Button>
            <Input style={{ width: '70%', right: '0px', position: 'absolute',top:'0px' }} onChange={e => {
                setRadiusChange(e.target.value)
            }} placeholder='반경미터입력' onPressEnter={enterRadius}  />
            <Button type={'danger'} style={{ right: '0px', position: 'absolute',top:'0px',border:'1px solid' }} onClick={enterRadius}>Click</Button>
           
            <Search style={{ width: '100%', position: 'absolute', top: '32px'}} placeholder={searchMethod + '입력'} onSearch={value => {
                (searchMethod === '주소') ? setAddress(value) : setKeyword(value)
            }} enterButton />\

            {/* <StarFilled style={{
                bottom: '300px',
                right: '1px',
                color: 'yellow',
                position: 'absolute',
                fontSize: '50px'
            }} /> */}



        </>
    )
}

export default home;

