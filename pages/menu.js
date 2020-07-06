import React from 'react'
import { Col, Row, Divider, Button, Affix } from 'antd';

const menulist = [
    {
        'img': 'img.png',
        'name': '떡볶이',
        'description': '맛있는 떡볶이',
        'price': 1000,
        'stock': 5,
        'distributor': '롯데'
    },
    {
        'img': 'img2.png',
        'name': '우동',
        'description': '맛있는 우동',
        'price': 200,
        'stock': 6,
        'distributor': '농심'
    },

]

const menu = () => {
    return (
        <div style={{ margin: '10px', }}>
            <Row justify={'center'} >
                <b>메뉴</b>
            </Row>
            <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />

            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={8}>
                            이미지
                       </Col>
                        <Col span={16}>
                            <Row>이름</Row>
                            <Row>설명</Row>
                            <Row>가격</Row>
                            <Row>재고</Row>
                            <Row>유통사</Row>
                        </Col>
                    </Row>
                    <Divider dashed={true} style={{ marginTop: '5px', marginBottom: '5px' }} />
                    <Row align={'middle'} style={{ float: 'right' }}>
                        수량 : 0 &nbsp; <Button>+</Button> &nbsp; <Button>-</Button>
                    </Row>
                </Col>

            </Row>
            <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />




            <Affix offsetBottom={40}><Button type={'primary'} style={{ float: 'right' }}>주문하기</Button></Affix>
        </div>
    )
}

export default menu;