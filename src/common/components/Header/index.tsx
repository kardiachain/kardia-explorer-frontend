import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/kardia-logo.png';
import { isAccessWallet, logoutWallet } from '../../../service/wallet';
import './header.css';

const Header = () => {
    const [activeKey, setActiveKey] = useState('explorer');
    const [showMenu, setShowMenu] = useState(false);
    const {isMobile} = useViewport()

    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname.split('/')[1])
    }, [location])

    const isAccess = isAccessWallet();
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
                                    <Nav.Item eventKey="" icon={<Icon icon="explore" />} href="/">Explorer</Nav.Item>
                                    <Nav.Item eventKey="network" icon={<Icon icon="connectdevelop" />} href="/network">View Network</Nav.Item>
                                    <Nav.Item eventKey="network" icon={<Icon icon="share-alt" />} href="/staking">Staking</Nav.Item>
                                    <Nav.Item eventKey="wallet" icon={<Icon icon="money" />} href={!isAccess ? "/wallet" : "/dashboard"}>Wallet</Nav.Item>
                                    <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item>
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
                    <Nav.Item eventKey="" href="/">Explorer</Nav.Item>
                    <Nav.Item eventKey="network" href="/network">View Network</Nav.Item>
                    <Nav.Item eventKey="staking" href="/staking">Staking</Nav.Item>
                    <Nav.Item eventKey="wallet" href={!isAccess ? "/wallet" : "/dashboard"}>Wallet</Nav.Item>
                    <Nav.Item eventKey="faucet" href="/faucet">Faucet</Nav.Item>
                </Nav>
                <Nav onSelect={setActiveKey} activeKey={activeKey} pullRight>

                    {
                        !isAccess ? (
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
                                <Dropdown.Item eventKey="send-transaction" href="/send-transaction">Send transaction</Dropdown.Item>
                                <Dropdown.Item eventKey="smart-contract" href="/smart-contract">Smart contract</Dropdown.Item>
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