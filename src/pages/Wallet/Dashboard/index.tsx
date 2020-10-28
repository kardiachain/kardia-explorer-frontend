import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import './dashboard.css'
import { Dropdown, Icon, Nav, Sidenav } from 'rsuite';
import { Route, Switch } from 'react-router-dom';
import SendTransaction from './SendTransaction';
import YourDelegators from './YourDelegators';
import SmartContract from './SmartContract';
import TransactionHistory from './TransactionHistory';
import DelegatorCreate from './DelegatedValidators/DelegatorCreate';
import { useViewport } from '../../../context/ViewportContext';
import DelegatedValidators from './DelegatedValidators';

const DashboardWallet = () => {
    const [activeKey, setActiveKey] = useState("0");
    const { isMobile } = useViewport()

    return (
        <div className="dashboard-container">
            {
                !isMobile ? (
                    <div className="left-container">
                    <Sidenav defaultOpenKeys={['staking']} onSelect={setActiveKey}>
                        <Sidenav.Body>
                            <Nav>
                                <Nav.Item eventKey="1" active={activeKey === "1"} href="/wallet/send-transaction" icon={<Icon icon="send" />}>
                                    Send transaction
                                </Nav.Item>
                                <Dropdown eventKey="staking" icon={<Icon icon="group" />} title="Staking" open={true}>
                                    <Dropdown.Item eventKey="validator" href="/wallet/staking/your-delegators">Your Delegators</Dropdown.Item>
                                    <Dropdown.Item  eventKey="delegator" href="/wallet/staking/delegated-validators">Delegated validators</Dropdown.Item>
                                </Dropdown>
                                <Nav.Item eventKey="3" active={activeKey === "3"} href="/wallet/smart-contract" icon={<Icon icon="file-code-o" />}>
                                    Smart contract
                                </Nav.Item>
                                <Nav.Item eventKey="4" active={activeKey === "4"} href="/wallet/transaction-history" icon={<Icon icon="order-form" />}>
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
                </Switch>
            </div>
        </div>
    )
}

export default DashboardWallet;