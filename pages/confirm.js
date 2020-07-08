import React, { useState, useEffect } from 'react'
import { Col, Row, Divider, Button } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router'

import {
    HomeOutlined,
    PhoneOutlined
} from '@ant-design/icons'



const confirm = () => {
    const [item, setItem] = useState();

    // useEffect(()=>{
    //     axios.get(`http://221.160.155.96:8888/orders`)
    //     .then(e=>{
    //         console.log(e)
    //         // setItem(e)
    //     })
    // },[])

    const goHome = () => {
        Router.push('/')
    }


    return (
        <div style={{ margin: '10px', }}>
            <Row justify={'center'} >
                <b>주문확인</b>
            </Row>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Row>
                입금현황 : 대기 <br />
                배송지역 : 청주시 흥덕구 복대동 사고뭉치<br />
                주문일시 : <br />
            </Row>
            <Row gutter={12} style={{ marginTop: '10px' }} >
                <Col span={12} ><Button style={{ width: '100%' }}><PhoneOutlined />전화</Button></Col>
                <Col span={12}><Button style={{ width: '100%' }} onClick={goHome}><HomeOutlined />고객정보</Button></Col>
            </Row>

            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            물품내역 : {}

            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            <Row style={{width:'100%',float:'right'}}>
                <Col span={6}>
                    <b>총 주문 금액</b>
            </Col>
                <Col span={18} style={{width:'100%',float:'right'}}>
                <b>30,000원</b>
                </Col>

            </Row>


        </div>
    )
}

export default confirm;