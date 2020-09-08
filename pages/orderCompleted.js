import React from 'react'
import { Col, Row,Divider } from 'antd';
import Link from 'next/link';

const orderCompleted = () => {
    return (
        <div style={{ margin: '10px', width:'100%',height:'100vh' }}>
            <Link href={'/index'}><a>
            <Row justify={'center'} align={'middle'} style={{height:'100vh' }}>
                <h1>주문완료</h1>
            </Row>
            </a></Link>

        </div>
    )
}

export default orderCompleted;