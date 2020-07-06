import React from 'react'
import { Col, Row, Button } from 'antd';
import Link from 'next/link';

const home = () => {
    return (
        <>
            <Link href='/menu'>
                <a>
                    <Row style={{ height: '50vh' }} justify={'center'} align={'middle'}>
                        <Row><h1>주문화면</h1></Row>
                    </Row>
                </a>
            </Link>
            <Link href='/manager'>
                <a>
                    <Row style={{ height: '50vh' }} justify={'center'} align={'middle'}>
                        <Row><h1>발주화면</h1></Row>
                    </Row>
                </a>
            </Link>
        </>
    )
}

export default home;