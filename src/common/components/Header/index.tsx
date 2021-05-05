import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/Logo-dark.svg';
import './header.css';
import { useSetRecoilState } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import { isLoggedIn, logoutWallet } from '../../../service';
import { NetworkSelect } from './NetworkSelect';

export const KAIHeader = () => {
    const [activeKey, setActiveKey] = useState('home');
    const [showMenu, setShowMenu] = useState(false);
    const { isMobile } = useViewport()

    const location = useLocation()
    let history = useHistory();

    const setWalletState = useSetRecoilState(walletState);

    useEffect(() => {
        if (location.pathname.indexOf("/address/") > -1 ||
            location.pathname.indexOf("/tx/") > -1 ||
            location.pathname.indexOf("/block/") > -1) {
            setActiveKey("blockchain");
            return;
        }
        if (location.pathname.indexOf("/validator/") > -1) {
            setActiveKey("staking");
            return;
        }
        let activeKey = location.pathname.split('/')[location.pathname.split('/').length - 1];
        setActiveKey(activeKey)
    }, [location])

    const logout = () => {
        logoutWallet()
        setWalletState({} as WalletState)
        history.push('/wallet-login')
    }


    if (isMobile) {
        return (
            <div className="kai-header-container-mobile">
                <Link to="/" className="navbar-brand logo">
                    <div className="kai-logo-container">
                        <img src={logo} alt="Kardia block explorer" />
                    </div>
                </Link>
                <div className="kai-header-container-mobile-menu" >
                    <button onClick={() => setShowMenu(true)}>
                        <Icon icon="bars" size="2x" inverse />
                    </button>
                </div>
                <Drawer
                    size="xs"
                    placement="right"
                    show={showMenu}
                    onHide={() => setShowMenu(false)}
                    keyboard
                    className="kai-header-mobile-menu-container"
                >
                    <Drawer.Body>
                        <Sidenav appearance="subtle">
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item eventKey="" icon={<Icon className="gray-highlight" icon="explore" />}
                                        onClick={() => {
                                            history.push("/")
                                            setShowMenu(false)
                                        }}>Home</Nav.Item>
                                    <Dropdown eventKey="blockchain" icon={<Icon className="gray-highlight" icon="unlink" />} title="Blockchain">
                                        <Dropdown.Item onClick={() => {
                                            history.push("/txs")
                                            setShowMenu(false)
                                        }}>View Transactions</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/blocks")
                                            setShowMenu(false)
                                        }}>View Blocks</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/accounts")
                                            setShowMenu(false)
                                        }}>View Accounts</Dropdown.Item>
                                    </Dropdown>

                                    <Dropdown eventKey="network" icon={<Icon className="gray-highlight" icon="globe2" />} title="Network">
                                        <Dropdown.Item onClick={() => {
                                            history.push("/network")
                                            setShowMenu(false)
                                        }}>Network</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/proposals")
                                            setShowMenu(false)
                                        }}>Proposal</Dropdown.Item>
                                   
                                    </Dropdown>

                                    <Nav.Item eventKey="" icon={<Icon className="gray-highlight" icon="list-ul" />}
                                        onClick={() => {
                                            history.push("/tokens")
                                            setShowMenu(false)
                                        }}>Tokens</Nav.Item>

                                 
                                    <Nav.Item eventKey="staking" icon={<Icon className="gray-highlight" icon="peoples" />}
                                        onClick={() => {
                                            history.push("/staking")
                                            setShowMenu(false)
                                        }} >Staking</Nav.Item>
                                    {
                                        !isLoggedIn() ? (
                                            <Nav.Item eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />} 
                                            onClick={() => { 
                                                history.push("/wallet-login")
                                                setShowMenu(false)
                                             }}>Wallet</Nav.Item>
                                        ) : (
                                                <Dropdown eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />} title="Wallet">
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/dashboard")
                                                            setShowMenu(false)
                                                        }}>
                                                        Dashboard
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/send-transaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        Send transaction
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-validator")
                                                            setShowMenu(false)
                                                        }}>
                                                        For Validator
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-delegator")
                                                            setShowMenu(false)
                                                        }}>
                                                        For Delegator
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/byte-code-deployment")
                                                            setShowMenu(false)
                                                        }}>
                                                        Deploy Contract
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/interaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        Interact With Contract
                                                        </Dropdown.Item>
                                                </Dropdown>
                                            )
                                    }
                                    {/* <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item> */}
                                    <NetworkSelect />
                                    {
                                        isLoggedIn() ? <Nav.Item eventKey="logout-wallet" icon={<Icon icon="sign-out" />} onClick={logout}>Logout wallet</Nav.Item> : <></>
                                    }
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </Drawer.Body>
                </Drawer>
            </div>
        )
    }
    return (
        <Navbar appearance="inverse" className="kai-header-container">
            <Navbar.Header>
                <Link to="/" className="navbar-brand logo">
                    <div className="kai-logo-container">
                        <img src={logo} alt="Kardia block explorer" />
                    </div>
                </Link>
            </Navbar.Header>
            <Navbar.Body>
                <Nav className="kardia-nav" activeKey={activeKey}>
                    <Nav.Item eventKey="" onClick={() => { history.push("/") }}>Home</Nav.Item>
                    <Dropdown title="Blockchain" style={{ marginRight: '10px' }}>
                        <Dropdown.Item eventKey="txs" onClick={() => { history.push("/txs") }}>View Transactions</Dropdown.Item>
                        <Dropdown.Item eventKey="blocks" onClick={() => { history.push("/blocks") }}>View Blocks</Dropdown.Item>
                        <Dropdown.Item eventKey="accounts" onClick={() => { history.push("/accounts") }}>View Accounts</Dropdown.Item>
                        {/* Hidden dropdown item */}
                        <Dropdown.Item eventKey="blockchain" style={{ display: "none" }}></Dropdown.Item>
                    </Dropdown>

                    <Dropdown title="Network" style={{ marginRight: '10px' }}>
                        <Dropdown.Item eventKey="network" onClick={() => { history.push("/network") }}>View Network</Dropdown.Item>
                        <Dropdown.Item eventKey="proposals" onClick={() => { history.push("/proposals") }}>Proposal</Dropdown.Item>
                    </Dropdown>

                    <Nav.Item eventKey="tokens" onClick={() => { history.push("/tokens") }}>Tokens</Nav.Item>
                    <Nav.Item eventKey="staking" onClick={() => { history.push("/staking") }}>Staking</Nav.Item>
                    {
                        isLoggedIn() ? (
                            <Dropdown
                                title="Wallet"
                                placement="bottomEnd">
                                <Dropdown.Item eventKey="dashboard" onClick={() => { history.push("/wallet/dashboard") }}>Dashboard</Dropdown.Item>
                                <Dropdown.Item eventKey="send-transaction" onClick={() => { history.push("/wallet/send-transaction") }}>Send transaction</Dropdown.Item>
                                <Dropdown.Item eventKey="for-validator" onClick={() => { history.push("/wallet/staking/for-validator") }} >For Validator</Dropdown.Item>
                                <Dropdown.Item eventKey="for-delegator" onClick={() => { history.push("/wallet/staking/for-delegator") }} >For Delegator</Dropdown.Item>
                                <Dropdown.Item eventKey="byte-code-deployment" onClick={() => { history.push("/wallet/smc/byte-code-deployment") }} >Deploy Contract</Dropdown.Item>
                                <Dropdown.Item eventKey="interaction" onClick={() => { history.push("/wallet/smc/interaction") }} >Interact With Contract</Dropdown.Item>
                                <Dropdown.Item eventKey="logout-wallet" onSelect={logout}>Logout wallet</Dropdown.Item>
                            </Dropdown>
                        ) : (
                                <Nav.Item eventKey="wallet" onClick={() => { history.push("/wallet-login") }}>Wallet</Nav.Item>
                            )
                    }
                    {/* <Nav.Item eventKey="faucet" href="/faucet">Faucet</Nav.Item> */}
                </Nav>
                <Nav className="kardia-nav" pullRight>
                    <NetworkSelect />
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}


export * from './SearchSection'
export * from './NetworkSelect'