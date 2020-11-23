import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/kardia-logo.png';
import { isLoggedIn, logoutWallet } from '../../../service/wallet';
import './header.css';
import NetworkSelect from './NetworkSelect';

const Header = () => {
    const [activeKey, setActiveKey] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const { isMobile } = useViewport()

    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname.split('/')[location.pathname.split('/').length - 1])
    }, [location])

    let history = useHistory();

    const logout = () => {
        logoutWallet()
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
                                    <Nav.Item eventKey="" icon={<Icon icon="explore" />} href="/">Home</Nav.Item>
                                    <Dropdown eventKey="blockchain" icon={<Icon icon="unlink" />} title="Blockchain">
                                        <Dropdown.Item href="/txs">View Transactions</Dropdown.Item>
                                        <Dropdown.Item href="/blocks">View Blocks</Dropdown.Item>
                                    </Dropdown>
                                    <Nav.Item eventKey="network" icon={<Icon icon="connectdevelop" />} href="/network">Network</Nav.Item>
                                    <Nav.Item eventKey="documentation" icon={<Icon icon="book" />} href="/documentation">Documentation</Nav.Item>
                                    <Nav.Item eventKey="staking" icon={<Icon icon="peoples" />} href="/staking" >Staking</Nav.Item>
                                    <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item>
                                    {
                                        !isLoggedIn() ? (
                                            <Nav.Item eventKey="wallet" icon={<Icon icon="money" />} href={"/wallet-login"}>Wallet</Nav.Item>
                                        ) : (
                                                <Dropdown eventKey="wallet" icon={<Icon icon="money" />} title="Wallet">
                                                <Dropdown.Item href="/wallet/dashboard">Dashboard</Dropdown.Item>
                                                    <Dropdown.Item href="/wallet/send-transaction">Send transaction</Dropdown.Item>
                                                    <Dropdown.Item href="/wallet/staking/your-delegators">Your Delegators</Dropdown.Item>
                                                    <Dropdown.Item href="/wallet/staking/delegated-validators">Delegated Validators</Dropdown.Item>
                                                    <Dropdown.Item href="/wallet/smc/byte-code-deployment">Deploy Contract</Dropdown.Item>
                                                    <Dropdown.Item href="/wallet/smc/interaction" >Interact With Contract</Dropdown.Item>
                                                </Dropdown>
                                            )
                                    }
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
                    <Nav className="kardia-nav" onSelect={setActiveKey} activeKey={activeKey}>
                        <Nav.Item eventKey="" href="/">Home</Nav.Item>
                        <Dropdown title="Blockchain">
                            <Dropdown.Item eventKey="txs" href="/txs">View Transactions</Dropdown.Item>
                            <Dropdown.Item eventKey="blocks" href="/blocks">View Blocks</Dropdown.Item>
                        </Dropdown>
                        <Nav.Item eventKey="network" href="/network" >Network</Nav.Item>
                        <Nav.Item eventKey="documentation" href="/documentation" >Documentation</Nav.Item>
                        <Nav.Item eventKey="staking" href="/staking" >Staking</Nav.Item>
                        {
                            isLoggedIn() ? (
                                <Dropdown
                                    title="Wallet"
                                    placement="bottomEnd"
                                >
                                    <Dropdown.Item eventKey="dashboard" href="/wallet/dashboard">Dashboard</Dropdown.Item>
                                    <Dropdown.Item eventKey="send-transaction" href="/wallet/send-transaction">Send transaction</Dropdown.Item>
                                    <Dropdown.Item eventKey="your-delegators" href="/wallet/staking/your-delegators" >Your Delegators</Dropdown.Item>
                                    <Dropdown.Item eventKey="delegated-validators" href="/wallet/staking/delegated-validators" >Delegated Validators</Dropdown.Item>
                                    <Dropdown.Item eventKey="byte-code-deployment" href="/wallet/smc/byte-code-deployment">Deploy Contract</Dropdown.Item>
                                    <Dropdown.Item eventKey="interaction" href="/wallet/smc/interaction" >Interact With Contract</Dropdown.Item>
                                    <Dropdown.Item eventKey="logout-wallet" onSelect={logout}>Logout wallet</Dropdown.Item>
                                </Dropdown>
                            ) : (
                                    <Nav.Item eventKey="wallet" href="/wallet-login">Wallet</Nav.Item>
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

export default Header;