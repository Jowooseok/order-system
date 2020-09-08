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
            addressS(address,radius) //useEffect를 함수 안에서 사용 => 참고로 document나 window를 사용하기 위해서는 next.js는 useEffect안에서 사용 가능
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

        </>
    )
}

export default home;

