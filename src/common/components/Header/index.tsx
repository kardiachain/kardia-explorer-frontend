import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/Logo-dark.svg';
import { isLoggedIn, logoutWallet } from '../../../service/wallet';
import './header.css';
import NetworkSelect from './NetworkSelect';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import languageAtom from '../../../atom/language.atom';
import { getLanguageString } from '../../utils/lang';
import LanguageSelect from './LanguageSelect';

const Header = () => {
    const [activeKey, setActiveKey] = useState('home');
    const [showMenu, setShowMenu] = useState(false);
    const { isMobile } = useViewport()

    const location = useLocation()
    let history = useHistory();
    const language = useRecoilValue(languageAtom)

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
                                        }}>{getLanguageString(language, 'HOME', 'MENU')}</Nav.Item>
                                    <Dropdown eventKey="blockchain" icon={<Icon className="gray-highlight" icon="unlink" />}
                                     title={getLanguageString(language, 'BLOCKCHAIN', 'MENU')}>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/txs")
                                            setShowMenu(false)
                                        }}>{getLanguageString(language, 'VIEW_TRANSACTIONS', 'MENU')}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/blocks")
                                            setShowMenu(false)
                                        }}>{getLanguageString(language, 'VIEW_BLOCKS', 'MENU')}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/accounts")
                                            setShowMenu(false)
                                        }}>{getLanguageString(language, 'VIEW_ACCOUNTS', 'MENU')}</Dropdown.Item>
                                    </Dropdown>
                                    <Nav.Item eventKey="network" icon={<Icon className="gray-highlight" icon="globe2" />}
                                        onClick={() => {
                                            history.push("/network")
                                            setShowMenu(false)
                                        }}>{getLanguageString(language, 'NETWORK', 'MENU')}</Nav.Item>
                                    {/* <Nav.Item eventKey="documentation" icon={<Icon className="gray-highlight" icon="book" />} href="/documentation">Documentation</Nav.Item> */}
                                    <Nav.Item eventKey="proposal" icon={<Icon className="gray-highlight" icon="data-increase" />}
                                        onClick={() => {
                                            history.push("/proposals")
                                            setShowMenu(false)
                                        }}>{getLanguageString(language, 'PROPOSAL', 'MENU')}</Nav.Item>
                                    <Nav.Item eventKey="staking" icon={<Icon className="gray-highlight" icon="peoples" />}
                                        onClick={() => {
                                            history.push("/staking")
                                            setShowMenu(false)
                                        }} >{getLanguageString(language, 'STAKING', 'MENU')}</Nav.Item>
                                    {
                                        !isLoggedIn() ? (
                                            <Nav.Item eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />}
                                                onClick={() => {
                                                    history.push("/wallet-login")
                                                    setShowMenu(false)
                                                }}>{getLanguageString(language, 'WALLET', 'MENU')}</Nav.Item>
                                        ) : (
                                                <Dropdown eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />} title={getLanguageString(language, 'WALLET', 'MENU')}>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/dashboard")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'DASHBOARD', 'MENU')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/send-transaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'SEND_TRANSACTION', 'MENU')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-validator")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'FOR_VALIDATOR', 'MENU')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-delegator")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'FOR_DELEGATOR', 'MENU')}
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/byte-code-deployment")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'DEPLOY_CONTRACT', 'MENU')}
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/interaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        {getLanguageString(language, 'INTERACT_WITH_CONTRACT', 'MENU')}
                                                        </Dropdown.Item>
                                                </Dropdown>
                                            )
                                    }
                                    {/* <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item> */}
                                    <NetworkSelect />
                                    {
                                        isLoggedIn() ? <Nav.Item eventKey="logout-wallet" icon={<Icon icon="sign-out" />} onClick={logout}>{getLanguageString(language, 'LOGOUT_WALLET', 'MENU')}</Nav.Item> : <></>
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
                    <Nav.Item eventKey="" onClick={() => { history.push("/") }}>
                        {getLanguageString(language, 'HOME', 'MENU')}
                    </Nav.Item>
                    <Dropdown title={getLanguageString(language, 'BLOCKCHAIN', 'MENU')} style={{ marginRight: '10px' }}>
                        <Dropdown.Item eventKey="txs" onClick={() => { history.push("/txs") }}>
                            {getLanguageString(language, 'VIEW_TRANSACTIONS', 'MENU')}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="blocks" onClick={() => { history.push("/blocks") }}>
                            {getLanguageString(language, 'VIEW_BLOCKS', 'MENU')}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="accounts" onClick={() => { history.push("/accounts") }}>
                            {getLanguageString(language, 'VIEW_ACCOUNTS', 'MENU')}
                        </Dropdown.Item>
                        {/* Hidden dropdown item */}
                        <Dropdown.Item eventKey="blockchain" style={{ display: "none" }}></Dropdown.Item>
                    </Dropdown>
                    <Nav.Item eventKey="network" onClick={() => { history.push("/network") }}>
                        {getLanguageString(language, 'NETWORK', 'MENU')}
                    </Nav.Item>
                    <Nav.Item eventKey="proposals" onClick={() => { history.push("/proposals") }}>
                        {getLanguageString(language, 'PROPOSAL', 'MENU')}
                    </Nav.Item>
                    {/* <Nav.Item eventKey="documentation" href="/documentation" >Documentation</Nav.Item> */}
                    <Nav.Item eventKey="staking" onClick={() => { history.push("/staking") }}>
                        {getLanguageString(language, 'STAKING', 'MENU')}
                    </Nav.Item>
                    {
                        isLoggedIn() ? (
                            <Dropdown
                                title={getLanguageString(language, 'WALLET', 'MENU')}
                                placement="bottomEnd">
                                <Dropdown.Item eventKey="dashboard" onClick={() => { history.push("/wallet/dashboard") }}>
                                    {getLanguageString(language, 'DASHBOARD', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="send-transaction" onClick={() => { history.push("/wallet/send-transaction") }}>
                                    {getLanguageString(language, 'SEND_TRANSACTION', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="for-validator" onClick={() => { history.push("/wallet/staking/for-validator") }} >
                                    {getLanguageString(language, 'FOR_VALIDATOR', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="for-delegator" onClick={() => { history.push("/wallet/staking/for-delegator") }} >
                                    {getLanguageString(language, 'FOR_DELEGATOR', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="byte-code-deployment" onClick={() => { history.push("/wallet/smc/byte-code-deployment") }} >
                                    {getLanguageString(language, 'DEPLOY_CONTRACT', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="interaction" onClick={() => { history.push("/wallet/smc/interaction") }} >
                                    {getLanguageString(language, 'INTERACT_WITH_CONTRACT', 'MENU')}
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="logout-wallet" onSelect={logout}>
                                    {getLanguageString(language, 'LOGOUT_WALLET', 'MENU')}
                                </Dropdown.Item>
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
                <Nav>
                    <LanguageSelect />
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default Header;