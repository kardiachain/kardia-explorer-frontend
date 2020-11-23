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
import AuthRouter from '../../../AuthRouter';
// import DeployWithSourceCode from './SmartContract/DeployWithSourceCode';
import DeployWithByteCode from './SmartContract/DeployWithByteCode';
import InteracteWithSmc from './SmartContract/InteracteWithSmc';

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
                    <Sidenav defaultOpenKeys={['staking','smart-contract']}>
                        <Sidenav.Body>
                            <Nav onSelect={setActiveKey} activeKey={activeKey}>
                                <Nav.Item eventKey="dashboard" active={activeKey === "4"} href="/wallet/dashboard" icon={<Icon icon="order-form" />}>
                                    Dashboard
                                </Nav.Item>
                                <Nav.Item eventKey="send-transaction" active={activeKey === "1"} href="/wallet/send-transaction" icon={<Icon icon="send" />}>
                                    Send Transaction
                                </Nav.Item>
                                <Dropdown eventKey="staking" icon={<Icon icon="group" />} title="Staking" open={true}>
                                    <Dropdown.Item eventKey="your-delegators" href="/wallet/staking/your-delegators">Your Delegators</Dropdown.Item>
                                    <Dropdown.Item  eventKey="delegated-validators" href="/wallet/staking/delegated-validators">Delegated Validators</Dropdown.Item>
                                </Dropdown>
                                <Dropdown eventKey="smart-contract" icon={<Icon icon="file-code-o" />} title="Smart Contract" open={true}>
                                    {/* <Dropdown.Item eventKey="source-code-deployment" href="/wallet/smc/source-code-deployment">Deploy By Source Code</Dropdown.Item> */}
                                    <Dropdown.Item eventKey="byte-code-deployment" href="/wallet/smc/byte-code-deployment">Deploy Contract</Dropdown.Item>
                                    <Dropdown.Item eventKey="interaction" href="/wallet/smc/interaction">Interact With Contract</Dropdown.Item>
                                </Dropdown>
                            </Nav>
                        </Sidenav.Body>
                    </Sidenav>
                </div>
                ) : <></>
            }

            <div className="right-container" style={isMobile ? {width: '100%'} : {}}>
                <DashboardHeader />
                <Switch>
                    <AuthRouter component={SendTransaction}  path="/wallet/send-transaction" />
                    <AuthRouter component={YourDelegators}  path="/wallet/staking/your-delegators" />
                    <AuthRouter component={DelegatedValidators}  path="/wallet/staking/delegated-validators" />
                    <AuthRouter component={SmartContract}  path="/wallet/smart-contract" />
                    <AuthRouter component={TransactionHistory}  path="/wallet/dashboard" />
                    {/* <AuthRouter component={DelegatorCreate}  path="/wallet/staking/:valAddr" /> */}
                    <Route path="/wallet/staking/:valAddr">
                        <DelegatorCreate />
                    </Route>
                    {/* <AuthRouter component={DeployWithSourceCode} path="/wallet/smc/source-code-deployment" /> */}
                    <AuthRouter component={DeployWithByteCode} path="/wallet/smc/byte-code-deployment" />
                    <AuthRouter component={InteracteWithSmc} path="/wallet/smc/interaction" />
                    <Route path="/wallet">
                        <Redirect to="/wallet/dashboard" />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default DashboardWallet;