import React from 'react'
import { Col, Icon, Panel, Row } from 'rsuite';
import { useWalletStorage } from '../../../service/wallet';
import './dashboard.css';

const DashboardHeader = () => {
    const [walletStored, setWalletStored] = useWalletStorage()
    console.log(walletStored);
    
    return (
        <Row className="wallet-header-container">
            <Col md={8} sm={24} xs={24}>
                <Panel shaded bordered className="wallet-info-card address">
                    <div className="title"><Icon className="icon" icon="views-authorize"/>Address</div>
                    <div className="content">
                        <div>{walletStored.address}</div>
                    </div>
                </Panel>
            </Col>
            <Col md={8} sm={24} xs={24}>
                <Panel shaded bordered className="wallet-info-card balance">
                    <div className="title"><Icon className="icon" icon="money" />Balance</div>
                </Panel>
            </Col>
            <Col md={8} sm={24} xs={24}>
                <Panel shaded bordered className="wallet-info-card network">
                    <div className="title"><Icon className="icon" icon="cubes" />Network</div>
                </Panel>
            </Col>
        </Row>
    )
}

export default DashboardHeader;