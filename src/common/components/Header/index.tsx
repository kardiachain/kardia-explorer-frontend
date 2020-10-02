import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Nav, Navbar } from 'rsuite';
import logo from '../../../resources/kardia-logo.png';
import './header.css';

const Header = () => {
    const [activeKey, setActiveKey] = useState('explorer');
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
                    <Link to="/explorer"><Nav.Item eventKey="explorer">Explorer</Nav.Item></Link>
                    <Link to="/network"><Nav.Item eventKey="network">View Network</Nav.Item></Link>
                    <Link to="/wallet"><Nav.Item eventKey="wallet">Wallet</Nav.Item></Link>
                    <Link to="/faucet"><Nav.Item eventKey="faucet">Faucet</Nav.Item></Link>
                </Nav>
                <Nav onSelect={setActiveKey} activeKey={activeKey} pullRight>
                    <Dropdown
                        renderTitle={() => {
                            return <Nav.Item icon={<Icon icon="money" size="lg" />} circle />;
                        }}
                        placement="bottomEnd"
                    >
                        <Link to="/create-wallet"><Dropdown.Item eventKey="create-wallet">Create Wallet</Dropdown.Item></Link>
                        <Link to="/access-your-wallet"><Dropdown.Item eventKey="access-wallet">Access your wallet</Dropdown.Item></Link>
                    </Dropdown>
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default Header;