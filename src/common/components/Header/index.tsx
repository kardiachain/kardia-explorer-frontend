import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/kardia-logo.png';
import { isLoggedIn, logoutWallet } from '../../../service/wallet';
import './header.css';

const Header = () => {
    const [activeKey, setActiveKey] = useState('explorer');
    const [showMenu, setShowMenu] = useState(false);
    const { isMobile } = useViewport()

    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname.split('/')[1])
    }, [location])

    let history = useHistory();

    const logout = () => {
        logoutWallet()
        history.push('/wallet')
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
                                    <Nav.Item eventKey="network" icon={<Icon icon="connectdevelop" />} href="/network">View Network</Nav.Item>
                                    {
                                        !isLoggedIn() ? (
                                            <Nav.Item eventKey="wallet" icon={<Icon icon="money" />} href={"/wallet"}>Wallet</Nav.Item>
                                        ) : (
                                                <Dropdown eventKey="wallet" icon={<Icon icon="money" />} title="Wallet">
                                                    <Dropdown.Item href="/dashboard/send-transaction">Send transaction</Dropdown.Item>
                                                    <Dropdown.Item href="/dashboard/staking">Staking</Dropdown.Item>
                                                    <Dropdown.Item href="/dashboard/smart-contract">Smart contract</Dropdown.Item>
                                                    <Dropdown.Item href="/dashboard/transaction-history">Transactions history</Dropdown.Item>
                                                </Dropdown>
                                            )
                                    }
                                    <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item>
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
                <Nav onSelect={setActiveKey} activeKey={activeKey}>
                    <Nav.Item eventKey="" href="/">Home</Nav.Item>
                    <Dropdown eventKey="blockchain" title="Blockchain">
                        <Dropdown.Item href="/txs">View Transactions</Dropdown.Item>
                        <Dropdown.Item href="/blocks">View Blocks</Dropdown.Item>
                    </Dropdown>
                    <Nav.Item eventKey="network" href="/network" >View Network</Nav.Item>
                    <Nav.Item eventKey="wallet" href={!isLoggedIn() ? "/wallet" : "/dashboard/send-transaction"}>Wallet</Nav.Item>
                    <Nav.Item eventKey="network" href="/validators" >Validators</Nav.Item>
                    <Nav.Item eventKey="faucet" href="/faucet">Faucet</Nav.Item>
                </Nav>
                <Nav onSelect={setActiveKey} activeKey={activeKey} pullRight>

                    {
                        !isLoggedIn() ? (
                            <Dropdown
                                icon={<Icon icon="money" size="lg" />}
                                placement="bottomEnd"
                                noCaret>
                                <Dropdown.Item eventKey="create-wallet" href="/create-wallet">Create Wallet</Dropdown.Item>
                                <Dropdown.Item eventKey="access-wallet" href="/access-your-wallet">Access your wallet</Dropdown.Item>
                            </Dropdown>
                        ) : (
                                <Dropdown
                                    icon={<Icon icon="money" size="lg" />}
                                    placement="bottomEnd"
                                    noCaret>
                                    <Dropdown.Item eventKey="send-transaction" href="/dashboard/send-transaction">Send transaction</Dropdown.Item>
                                    <Dropdown.Item eventKey="staking" href="/dashboard/staking">Staking</Dropdown.Item>
                                    <Dropdown.Item eventKey="smart-contract" href="/dashboard/smart-contract">Smart contract</Dropdown.Item>
                                    <Dropdown.Item eventKey="transaction-history"href="/dashboard/transaction-history">Transactions history</Dropdown.Item>
                                    <Dropdown.Item eventKey="logout-wallet" href="/wallet" onSelect={logout}>Logout wallet</Dropdown.Item>
                                </Dropdown>
                            )
                    }
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default Header;