import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import './dashboard.css'
import { Col, Grid, Icon, Nav, Row, Sidenav } from 'rsuite';
import SendTransaction from './SendTransaction';
import Validators from './Validators';
import SmartContract from './SmartContract';
import TransactionHistory from './TransactionHistory';


const SelectOption = (props: any) => {
    return props.type === '1' ? (
            <SendTransaction />
        ) : props.type === '2' ? (
            <Validators />
        ) : props.type === '3' ? (
            <SmartContract />
        ) : (
            <TransactionHistory />
        )
}

const DashboardWallet = () => {
    const [activeKey, setActiveKey] = useState("2");

    return (
        <div className="dashboard-container">
            <DashboardHeader />
            <div className="dashboard-body">
                <Grid fluid>
                    <Row className="show-grid">
                        <Col xs={4}>
                            <div className="left-container">
                                <Sidenav onSelect={setActiveKey}>   
                                    <Sidenav.Body>
                                        <Nav>
                                            <Nav.Item eventKey="1" active={ activeKey === "1" } icon={<Icon icon="send" />}>
                                                Send transaction
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" active={ activeKey === "2" } icon={<Icon icon="group" />}>
                                                Validators
                                            </Nav.Item>
                                            <Nav.Item eventKey="3" active={ activeKey === "3" } icon={<Icon icon="file-code-o" />}>
                                                Smart contract
                                            </Nav.Item>
                                            <Nav.Item eventKey="4" active={ activeKey === "4" } icon={<Icon icon="order-form" />}>
                                                Transaction history
                                            </Nav.Item>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </div>
                        </Col>
                        <Col xs={20}>
                            <div className="right-container">
                                <SelectOption type={activeKey} />
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
    )  
}

export default DashboardWallet;