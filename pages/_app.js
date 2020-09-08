import React from 'react'
import 'antd/dist/antd.css';

const Jrun2ng = ({ Component }) => {

    return (
        <div style={{height:'100%', width:'100%'}}>
           <Component />
           <script type="text/javascript"
                    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b31117910c5af1f02ade4940f5762a07=services,clusterer,drawing"></script>
        </div>
    )

}

export default Jrun2ng;