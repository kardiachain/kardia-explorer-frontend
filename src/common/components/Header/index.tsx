import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/kardia-logo.png';
import './header.css';

const Header = () => {
    const [activeKey, setActiveKey] = useState('explorer');
    const [showMenu, setShowMenu] = useState(false);
    const {isMobile} = useViewport()
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
                                    <Nav.Item eventKey="explorer" icon={<Icon icon="explore" />} href="/">Explorer</Nav.Item>
                                    <Nav.Item eventKey="network" icon={<Icon icon="connectdevelop" />} href="/network">View Network</Nav.Item>
                                    <Nav.Item eventKey="wallet" icon={<Icon icon="money" />} href="/wallet">Wallet</Nav.Item>
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
                    <Nav.Item eventKey="explorer" href="/explorer">Explorer</Nav.Item>
                    <Nav.Item eventKey="network" href="/network">View Network</Nav.Item>
                    <Nav.Item eventKey="wallet" href="/wallet">Wallet</Nav.Item>
                    <Nav.Item eventKey="faucet" href="/faucet">Faucet</Nav.Item>
                </Nav>
                <Nav onSelect={setActiveKey} activeKey={activeKey} pullRight>
                    <Dropdown 
                        icon={<Icon icon="money" size="lg" />}
                        placement="bottomEnd"
                        noCaret
                    >
                        <Dropdown.Item eventKey="create-wallet" href="/create-wallet">Create Wallet</Dropdown.Item>
                        <Dropdown.Item eventKey="access-wallet" href="/access-your-wallet">Access your wallet</Dropdown.Item>
                    </Dropdown>
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default Header;