import React from 'react'
import { Col, Row, Button, Divider } from 'antd';
import Link from 'next/link';

const home = () => {
    return (
        <>
            <Link href='/order'>
                <a>
                    <Row style={{ height: '50vh' }} justify={'center'} align={'middle'}>
                        <Row><h1>주문화면</h1></Row>
                    </Row>
                </a>
            </Link>
            <Divider />
            <Link href='/confirm'>
                <a>
                    <Row style={{ height: '50vh' }} justify={'center'} align={'middle'}>
                        <Row><h1>발주확인화면</h1></Row>
                    </Row>
                </a>
            </Link>
        </>
    )
}

export default home;