import React, { useState, useEffect } from 'react'
import { Col, Row, Divider, Button, Affix, Modal, List } from 'antd';
import axios from 'axios';
import Router from 'next/router';

// const menulist = [
//     {
//         'name': '떡볶이',
//         'description': '맛있는 떡볶이',
//         'price': 1000,
//         'inventory': 5,
//         'distributor': '롯데'
//     },
//     {
//         'name': '우동',
//         'description': '맛있는 우동',
//         'price': 200,
//         'inventory': 6,
//         'distributor': '농심'
//     },

// ]

const order = () => {
    const [menulist, setMenulist] = useState([]); //아이템 정보 받아올때 사용
    const [orderList, setOrderList] = useState([]); //아이템 주문리스트
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    const [visible, setVisible] = useState(false) //모달
    // const [menuName, setMenuName] = useState(''); //모달메뉴이름

    useEffect(()=>{
        // setMenulist(axios.get())
      axios.get(`http://seansin.iptime.org//items`)
      .then((e)=>{
        let temp = [];
        temp.push(e.data.map((e)=>{
            return(
                {
                    id:e.id,
                    name:e.name,
                    description:e.description,
                    inventory:e.inventory,
                    distributor:e.distributor,
                    price:e.price,
                    quantity:0,
                }
                
            )
        }))
        setOrderList(temp);
        setMenulist(e.data)
      })
    },[])

    //모달
    const showModal = () => {
        if(totalQuantity===0){
            return
        }
        setVisible(true)
    }

    const handleOk = (e) => { //주문확인
        setVisible(false);

        let order = [];
        let orderItems = {};
        const axiosConfig = { headers:{ "Content-Type": "application/json" }}

        order.push(
            orderList[0].map(e=>{
                return(
                    {    
                        item:{
                            id:e.id,
                            name:e.name,
                            description:e.description,
                            inventory:e.inventory,
                            distributor:e.distributor,
                            price:e.price,
                        },
                        quantity:e.quantity
                    }
                )
            })
        )
       
        orderItems = order[0].concat();
        console.log(JSON.stringify({orderItems}))
        
       axios.post(`http://seansin.iptime.org//orders`,
        JSON.stringify({orderItems}),
        { headers:{ "Content-Type": "application/json" }}
       ).then(
           e=>{
            Router.push('/orderCompleted');
           }
       )
  
    }

    const handleCancel = (e) => {
        setVisible(false);
    }

    
    //아이템 수량 버튼
    const itemCountUp = (e) =>() => {
        let items = orderList.concat();
        let price = 0;

        items[0][e].quantity = items[0][e].quantity + 1
        setOrderList(items.concat())
        
        setTotalQuantity(totalQuantity + 1 )
        setTotalPrice(totalPrice + items[0][e].price)
        
    }

    const itemCountDown = (e) => ()=> {
        let items = orderList.concat();
        items[0][e].quantity = items[0][e].quantity - 1
        if(items[0][e].quantity < 0 ){
            items[0][e].quantity = 0
            setOrderList(items.concat())
            return;
        }
        setOrderList(items.concat())
        setTotalQuantity(totalQuantity - 1 )
        setTotalPrice(totalPrice - items[0][e].price)
      
    }

    const menuPrint = (menulist) => {
        let menu = [];
        menu = menulist;

        return (
            <List
                dataSource={menulist}
                bordered
                renderItem={(e,i) => (
                    <List.Item >
                        <Row style={{width:'100%'}}>
                            <Col span={24}>
                                <Row>
                                    <Col span={8} >
                                    <img src={e.imageURL} style={{width:'100%', height:'100%', padding:'5px'}} />
                               </Col>
                                    <Col span={16} >
                                        <Row>이름 : {e.name}</Row>
                                        <Row>설명 : {e.description}</Row>
                                        <Row>가격 : {e.price}</Row>
                                        <Row>재고: {e.inventory}</Row>
                                        <Row>유통사: {e.distributor}</Row>
                                    </Col>
                                </Row>
                                <Divider dashed={true} style={{ marginTop: '5px', marginBottom: '5px' }} />
                                <Row align={'middle'} style={{ float: 'right' }}>
                            수량 : {orderList[0]&&orderList[0][i].quantity} &nbsp; <Button onClick={itemCountUp(i)}>+</Button> &nbsp; <Button onClick={itemCountDown(i)}>-</Button>
                        </Row>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        )
    }


    return (
        <div style={{ margin: '10px', }}>
            <Row justify={'center'} >
                <b>메뉴</b>
            </Row>

            <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
            {menuPrint(menulist)}
            <Affix style={{ textAlign: 'center', marginTop: '5px' }} offsetBottom={40} 
            onClick={showModal}
            ><Button type={'primary'} style={{ width: '95%' }}>총수량 {totalQuantity} / {totalPrice}원 주문하기</Button></Affix>
            <Modal
                                        title='주문확인'
                                        visible={visible}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        {
                                            orderList[0]&&orderList[0].map(e=>{
                                                return(
                                                    <>
                                                        {e.name}  :  개수({e.quantity})  * 가격({e.price}) = {e.quantity * e.price} 원 <br/>
                                                    </>
                                                )
                                            })
                                            
                                        }
                                        <Divider dashed={true} style={{ marginTop: '10px', marginBottom: '10px' }} />
                                        <b>총 개수 : {totalQuantity} 개</b> <br />
                                        <b>총 가격 : {totalPrice} 원</b>  <br />
                                        <h3>주문하시겠습니까?</h3>
                                    </Modal>
        </div>
    )
}

export default order;