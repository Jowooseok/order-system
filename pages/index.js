import React, {useEffect, useState} from 'react'
import {Menu, Dropdown, Button, Divider, Input} from 'antd';
import Link from 'next/link';
import {StarFilled} from '@ant-design/icons';
import addressS from './addressS';
import keywordS from './keywordS';

const {Search} = Input;


const home = () => {
    const [address, setAddress] = useState(' ');
    const [keyword, setKeyword] = useState(' ');
    const [radius, setRadius] = useState(1500);
    const [searchMethod, setSearchMethod] = useState('주소');

    if (searchMethod === '주소') {
        useEffect(() => {
            addressS(address,radius)
        }, [address, radius])
    } else {
        useEffect(() => {
            keywordS(keyword);
        },[keyword]) //요거 추가해주셔야 state값 바뀔때 렌더링 되서 바로 적용됩니다.
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

        </>
    )
}

export default home;

