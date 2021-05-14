import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import './dashboard.css'
import { Dropdown, Icon, Nav, Sidenav } from 'rsuite';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import SendTransaction from './SendTransaction';
import YourDelegators from './YourDelegators';
import SmartContract from './SmartContract';
import TransactionHistory from './TransactionHistory';
import DelegatorCreate from './DelegatedValidators/DelegatorCreate';
import { useViewport } from '../../../context/ViewportContext';
import DelegatedValidators from './DelegatedValidators';
import AuthRouter from '../../../AuthRouter';
import DeployWithByteCode from './SmartContract/DeployWithByteCode';
import InteracteWithSmc from './SmartContract/InteracteWithSmc';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import ConfirmPassword from '../ConfirmPassword';
import { isExtensionWallet, useWalletStorage } from '../../../service';
import CreateProposal from './Proposal';
import Vote from './Proposal/Vote';
import DeployWithSourceCode from './SmartContract/DeployWithSourceCode'
const DashboardWallet = () => {

    const [activeKey, setActiveKey] = useState("send-transaction");
    const { isMobile } = useViewport()
    const location = useLocation()
    const history = useHistory()

    const walletLocalState = useRecoilValue(walletState)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [walletStored, setWalletStored] = useWalletStorage();

    // Handle Kardia Extension Wallet change account
    if (walletStored.externalWallet) {
        window && window.kardiachain && window.kardiachain.on('accountsChanged', (accounts: any) => {
            if (accounts && accounts[0] !== walletStored.address) {
                setWalletStored({
                    privatekey: '',
                    address: accounts[0],
                    isAccess: true,
                    externalWallet: true,
                });
            }
        })
    }

    useEffect(() => {
        if ((walletLocalState && walletLocalState?.account?.privatekey) || isExtensionWallet()) {
            setShowConfirmPassword(false);
        } else {
            setShowConfirmPassword(true)
        }
    }, [walletLocalState]);

    useEffect(() => {
        setActiveKey(location.pathname.split('/')[location.pathname.split('/').length - 1])
    }, [location])

    return (
        <div className="dashboard-container" style={{filter: showConfirmPassword ? 'blur(7px)' : 'none'}}>
            {
                !isMobile ? (
                    <div className="left-container">
                        <Sidenav defaultOpenKeys={['staking', 'smart-contract']}>
                            <Sidenav.Body>
                                <Nav onSelect={setActiveKey} activeKey={activeKey}>
                                    <Nav.Item
                                        eventKey="dashboard"
                                        active={activeKey === "4"}
                                        onClick={() => { history.push("/wallet/dashboard") }}
                                        icon={<Icon icon="order-form" />} > Dashboard
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey="send-transaction"
                                        active={activeKey === "1"}
                                        onClick={() => { history.push("/wallet/send-transaction") }}
                                        icon={<Icon icon="send" />}> Send Transaction
                                    </Nav.Item>
                                    <Dropdown eventKey="staking" icon={<Icon icon="group" />} title="Staking">
                                        <Dropdown.Item
                                            eventKey="for-validator"
                                            onClick={() => { history.push("/wallet/staking/for-validator") }}>For Validator
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="for-delegator"
                                            onClick={() => { history.push("/wallet/staking/for-delegator") }}>For Delegator
                                        </Dropdown.Item>
                                    </Dropdown>
                                    <Dropdown eventKey="smart-contract" icon={<Icon icon="file-code-o" />} title="Smart Contract">
                                        <Dropdown.Item eventKey="source-code-deployment" href="/wallet/smc/source-code-deployment">Deploy By Source Code</Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="byte-code-deployment"
                                            onClick={() => { history.push("/wallet/smc/byte-code-deployment") }}>Deploy Contract
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="interaction"
                                            onClick={() => { history.push("/wallet/smc/interaction") }}>Interact With Contract
                                         </Dropdown.Item>
                                    </Dropdown>
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </div>
                ) : <></>
            }

            <div className="right-container" style={isMobile ? { width: '100%' } : {}}>
                <DashboardHeader />
                <Switch>
                    <AuthRouter component={SendTransaction} path="/wallet/send-transaction" />
                    <AuthRouter component={YourDelegators} path="/wallet/staking/for-validator" />
                    <AuthRouter component={DelegatedValidators} path="/wallet/staking/for-delegator" />
                    <AuthRouter component={SmartContract} path="/wallet/smart-contract" />
                    <AuthRouter component={TransactionHistory} path="/wallet/dashboard" />
                    {/* <AuthRouter component={DelegatorCreate}  path="/wallet/staking/:valAddr" /> */}
                    <Route path="/wallet/staking/:valAddr">
                        <DelegatorCreate />
                    </Route>
                    <AuthRouter component={DeployWithSourceCode} path="/wallet/smc/source-code-deployment" />
                    <AuthRouter component={DeployWithByteCode} path="/wallet/smc/byte-code-deployment" />
                    <AuthRouter component={InteracteWithSmc} path="/wallet/smc/interaction" />
                    <AuthRouter component={CreateProposal} path="/wallet/proposal-create" />
                    <Route component={Vote} path="/wallet/proposal-vote/:proposalId" />
                    <Route path="/wallet">
                        <Redirect to="/wallet/dashboard" />
                    </Route>
                </Switch>
            </div>
            <ConfirmPassword
                showModal={showConfirmPassword}
                setShowModal={setShowConfirmPassword}/>
        </div>
    )
}

export default DashboardWallet;