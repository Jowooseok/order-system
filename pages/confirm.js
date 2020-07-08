import React, { useState, useEffect } from 'react'
import { Col, Row, Divider, Button, List } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router'

import {
    HomeOutlined,
    PhoneOutlined
} from '@ant-design/icons'



const confirm = () => {
    const [item, setItem] = useState();
    let totalPrice = 0
    let totalPrices = [];

    useEffect(() => {
        axios.get(`http://221.160.155.96:8888/orders`)
            .then(e => {
                setItem(e.data)
            })
    }, [])

    const goHome = () => {
        Router.push('/')
    }


    return (
        <div style={{ margin: '10px', }}>
            <Row justify={'center'} >
                <b>주문확인</b>
            </Row>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            <List
                dataSource={item}
                renderItem={(e, i) => (
                    <List.Item >

                        <Row>
                            입금현황 : 대기 <br />
                배송지역 : 청주시 흥덕구 복대동 사고뭉치<br />
                주문일시 : {e.orderDate} <br />
                        </Row>
                        <Row gutter={12} style={{ marginTop: '10px', width:'100%' }} >
                            <Col span={12} ><Button style={{ width: '100%' }}><PhoneOutlined />전화</Button></Col>
                            <Col span={12}><Button style={{ width: '100%' }} onClick={goHome}><HomeOutlined />고객정보</Button></Col>
                        </Row>

                        <div style={{ marginTop: '10px', width:'100%',  marginBottom: '10px', border:'1px solid' }} />

                    <Row style={{border:'1px dashed', width:'100%', padding:'5px'}}>
                <Col span={24}>물품내역 :  </Col>

                    <Col span={24}>
                        {e.orderItems.map(it => {
                            return (
                                <div>
                                    <div style={{ float: 'right' }}>
                                        {it.item.name} : {it.quantity}
                                    </div>
                                    <br />
                                </div>
                            )
                        })}
                        </Col>
                        </Row>



                        <div style={{ marginTop: '10px', width:'100%',  marginBottom: '10px', border:'1px solid' }} />

                        <Row style={{ width: '100%', float: 'right' }}>
                            <Col span={6}>
                                <b>총 주문 금액</b>
                            </Col>
                            <Col span={18} style={{ width: '100%', float: 'right' }}>
                                <b>{
                                    e.orderItems.map(ee=>{
                                    totalPrice = totalPrice + ee.item.price * ee.quantity
                                }                                
                                
                                ),totalPrices.push(totalPrice), console.log(totalPrice=0)}
                               
                                {totalPrices[i]}원</b>
                           
                            </Col>

                        </Row>

                    </List.Item>
                )}
            />



        </div>
    )
}

export default confirm;