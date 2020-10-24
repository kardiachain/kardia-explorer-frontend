import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import './dashboard.css'
import { Icon, Nav, Sidenav } from 'rsuite';
import { Route, Switch } from 'react-router-dom';
import SendTransaction from './SendTransaction';
import Validators from './Validators';
import SmartContract from './SmartContract';
import TransactionHistory from './TransactionHistory';
import ValidatorDetail from './Validators/ValidatorDetail';
import { useViewport } from '../../../context/ViewportContext';

const DashboardWallet = () => {
    const [activeKey, setActiveKey] = useState("0");
    const { isMobile } = useViewport()

    return (
        <div className="dashboard-container">
            {
                !isMobile ? (
                    <div className="left-container">
                    <Sidenav onSelect={setActiveKey}>
                        <Sidenav.Body>
                            <Nav>
                                <Nav.Item eventKey="1" active={activeKey === "1"} href="/dashboard/send-transaction" icon={<Icon icon="send" />}>
                                    Send transaction
                                                </Nav.Item>
                                <Nav.Item eventKey="2" active={activeKey === "2"} href="/dashboard/staking" icon={<Icon icon="group" />}>
                                    Staking
                                                </Nav.Item>
                                <Nav.Item eventKey="3" active={activeKey === "3"} href="/dashboard/smart-contract" icon={<Icon icon="file-code-o" />}>
                                    Smart contract
                                                </Nav.Item>
                                <Nav.Item eventKey="4" active={activeKey === "4"} href="/dashboard/transaction-history" icon={<Icon icon="order-form" />}>
                                    Transactions history
                                                </Nav.Item>
                            </Nav>
                        </Sidenav.Body>
                    </Sidenav>
                </div>
                ) : <></>
            }

            <div className="right-container" style={isMobile ? {width: '100%'} : {}}>
                <DashboardHeader />
                <Switch>
                    <Route path="/dashboard/send-transaction">
                        <SendTransaction />
                    </Route>
                    <Route path="/dashboard/staking">
                        <Validators />
                    </Route>
                    <Route path="/dashboard/smart-contract">
                        <SmartContract />
                    </Route>
                    <Route path="/dashboard/transaction-history">
                        <TransactionHistory />
                    </Route>
                    <Route path="/dashboard/validator">
                        <ValidatorDetail />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default DashboardWallet;