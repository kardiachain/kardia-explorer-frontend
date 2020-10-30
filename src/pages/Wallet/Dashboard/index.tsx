import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import './dashboard.css'
import { Dropdown, Icon, Nav, Sidenav } from 'rsuite';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import SendTransaction from './SendTransaction';
import YourDelegators from './YourDelegators';
import SmartContract from './SmartContract';
import TransactionHistory from './TransactionHistory';
import DelegatorCreate from './DelegatedValidators/DelegatorCreate';
import { useViewport } from '../../../context/ViewportContext';
import DelegatedValidators from './DelegatedValidators';

const DashboardWallet = () => {
    const [activeKey, setActiveKey] = useState("send-transaction");
    const { isMobile } = useViewport()
    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname.split('/')[location.pathname.split('/').length - 1])
    }, [location])

    return (
        <div className="dashboard-container">
            {
                !isMobile ? (
                    <div className="left-container">
                    <Sidenav defaultOpenKeys={['staking']}>
                        <Sidenav.Body>
                            <Nav onSelect={setActiveKey} activeKey={activeKey}>
                                <Nav.Item eventKey="send-transaction" active={activeKey === "1"} href="/wallet/send-transaction" icon={<Icon icon="send" />}>
                                    Send Transaction
                                </Nav.Item>
                                <Nav.Item eventKey="transaction-history" active={activeKey === "4"} href="/wallet/transaction-history" icon={<Icon icon="order-form" />}>
                                    Transactions History
                                </Nav.Item>
                                <Dropdown eventKey="staking" icon={<Icon icon="group" />} title="Staking" open={true}>
                                    <Dropdown.Item eventKey="your-delegators" href="/wallet/staking/your-delegators">Your Delegators</Dropdown.Item>
                                    <Dropdown.Item  eventKey="delegated-validators" href="/wallet/staking/delegated-validators">Delegated Validators</Dropdown.Item>
                                </Dropdown>
                                <Nav.Item eventKey="smart-contract" active={activeKey === "3"} href="/wallet/smart-contract" icon={<Icon icon="file-code-o" />}>
                                    Smart Contract
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
                    <Route path="/wallet/send-transaction">
                        <SendTransaction />
                    </Route>
                    <Route path="/wallet/staking/your-delegators">
                        <YourDelegators />
                    </Route>
                    <Route path="/wallet/staking/delegated-validators">
                        <DelegatedValidators />
                    </Route>
                    <Route path="/wallet/smart-contract">
                        <SmartContract />
                    </Route>
                    <Route path="/wallet/transaction-history">
                        <TransactionHistory />
                    </Route>
                    <Route path="/wallet/staking/:valAddr">
                        <DelegatorCreate />
                    </Route>
                    <Route path="/wallet">
                        <Redirect to="/wallet/send-transaction" />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default DashboardWallet;