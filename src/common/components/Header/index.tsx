import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Drawer, Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import { useViewport } from '../../../context/ViewportContext';
import logo from '../../../resources/Logo-dark.svg';
import logo_testnet from '../../../resources/logo-testnet.svg';
import './header.css';
import { useSetRecoilState } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import { isLoggedIn, logoutWallet } from '../../../service';
import { NetworkSelect } from './NetworkSelect';
import { useTranslation } from 'react-i18next';

export const KAIHeader = () => {
    const { t } = useTranslation()

    const [activeKey, setActiveKey] = useState('home');
    const [showMenu, setShowMenu] = useState(false);
    const { isMobile } = useViewport()

    const location = useLocation()
    let history = useHistory();

    const setWalletState = useSetRecoilState(walletState);

    const mainnet_mode = process.env.REACT_APP_MAINNET_MODE as string === 'true'

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
                        <img src={mainnet_mode ? logo : logo_testnet} alt="Kardia block explorer" />
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
                                        }}>{t('home')}</Nav.Item>
                                    <Dropdown eventKey="blockchain" icon={<Icon className="gray-highlight" icon="unlink" />} title="Blockchain">
                                        <Dropdown.Item onClick={() => {
                                            history.push("/txs")
                                            setShowMenu(false)
                                        }}>{t('viewTransactions')}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/blocks")
                                            setShowMenu(false)
                                        }}>{t('viewBlocks')}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/accounts")
                                            setShowMenu(false)
                                        }}>{t('viewAccounts')}</Dropdown.Item>
                                    </Dropdown>

                                    <Dropdown eventKey="network" icon={<Icon className="gray-highlight" icon="globe2" />} title="Network">
                                        <Dropdown.Item onClick={() => {
                                            history.push("/network")
                                            setShowMenu(false)
                                        }}>{t('network')}</Dropdown.Item>
                                        <Dropdown.Item onClick={() => {
                                            history.push("/proposals")
                                            setShowMenu(false)
                                        }}>{t('proposal')}</Dropdown.Item>
                                   
                                    </Dropdown>

                                    <Nav.Item eventKey="" icon={<Icon className="gray-highlight" icon="list-ul" />}
                                        onClick={() => {
                                            history.push("/tokens")
                                            setShowMenu(false)
                                        }}>{t('tokens')}</Nav.Item>

                                 
                                    <Nav.Item eventKey="staking" icon={<Icon className="gray-highlight" icon="peoples" />}
                                        onClick={() => {
                                            history.push("/staking")
                                            setShowMenu(false)
                                        }} >{t('staking')}</Nav.Item>
                                    {
                                        !isLoggedIn() ? (
                                            <Nav.Item eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />} 
                                            onClick={() => { 
                                                history.push("/wallet-login")
                                                setShowMenu(false)
                                             }}>{t('wallet')}</Nav.Item>
                                        ) : (
                                                <Dropdown eventKey="wallet" icon={<Icon className="gray-highlight" icon="money" />} title="Wallet">
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/dashboard")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('dashboard')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/send-transaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('sendTransaction')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-validator")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('forValidator')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/staking/for-delegator")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('forDelegator')}
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/byte-code-deployment")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('deployContract')}
                                                        </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            history.push("/wallet/smc/interaction")
                                                            setShowMenu(false)
                                                        }}>
                                                        {t('interactWithContract')}
                                                        </Dropdown.Item>
                                                </Dropdown>
                                            )
                                    }
                                    {/* <Nav.Item eventKey="faucet" icon={<Icon icon="usd" />} href="/faucet">Faucet</Nav.Item> */}
                                    <NetworkSelect />
                                    {
                                        isLoggedIn() ? <Nav.Item eventKey="logout-wallet" icon={<Icon icon="sign-out" />} onClick={logout}>{t('logoutWallet')}t</Nav.Item> : <></>
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
                        <img src={mainnet_mode ? logo : logo_testnet} alt="Kardia block explorer" />
                    </div>
                </Link>
            </Navbar.Header>
            <Navbar.Body>
                <Nav className="kardia-nav" activeKey={activeKey}>
                    <Nav.Item eventKey="" onClick={() => { history.push("/") }}>{t('home')}</Nav.Item>
                    <Dropdown title="Blockchain" style={{ marginRight: '10px' }}>
                        <Dropdown.Item eventKey="txs" onClick={() => { history.push("/txs") }}>{t('viewTransactions')}</Dropdown.Item>
                        <Dropdown.Item eventKey="blocks" onClick={() => { history.push("/blocks") }}>{t('viewBlocks')}</Dropdown.Item>
                        <Dropdown.Item eventKey="accounts" onClick={() => { history.push("/accounts") }}>{t('viewAccounts')}</Dropdown.Item>
                        {/* Hidden dropdown item */}
                        <Dropdown.Item eventKey="blockchain" style={{ display: "none" }}></Dropdown.Item>
                    </Dropdown>

                    <Dropdown title={t('network')} style={{ marginRight: '10px' }}>
                        <Dropdown.Item eventKey="network" onClick={() => { history.push("/network") }}>{t('viewNetwork')}</Dropdown.Item>
                        <Dropdown.Item eventKey="proposals" onClick={() => { history.push("/proposals") }}>{t('proposal')}</Dropdown.Item>
                    </Dropdown>

                    <Nav.Item eventKey="tokens" onClick={() => { history.push("/tokens") }}>{t('tokens')}</Nav.Item>
                    <Nav.Item eventKey="staking" onClick={() => { history.push("/staking") }}>{t('staking')}</Nav.Item>
                    {
                        isLoggedIn() ? (
                            <Dropdown
                                title={t('wallet')}
                                placement="bottomEnd">
                                <Dropdown.Item eventKey="dashboard" onClick={() => { history.push("/wallet/dashboard") }}>{t('dashboard')}</Dropdown.Item>
                                <Dropdown.Item eventKey="send-transaction" onClick={() => { history.push("/wallet/send-transaction") }}>{t('sendTransaction')}</Dropdown.Item>
                                <Dropdown.Item eventKey="for-validator" onClick={() => { history.push("/wallet/staking/for-validator") }} >{t('forValidator')}</Dropdown.Item>
                                <Dropdown.Item eventKey="for-delegator" onClick={() => { history.push("/wallet/staking/for-delegator") }} >{t('forDelegator')}</Dropdown.Item>
                                <Dropdown.Item eventKey="byte-code-deployment" onClick={() => { history.push("/wallet/smc/byte-code-deployment") }} >{t('deployContract')}</Dropdown.Item>
                                <Dropdown.Item eventKey="interaction" onClick={() => { history.push("/wallet/smc/interaction") }} >{t('interactWithContract')}</Dropdown.Item>
                                <Dropdown.Item eventKey="logout-wallet" onSelect={logout}>{t('logoutWallet')}</Dropdown.Item>
                            </Dropdown>
                        ) : (
                                <Nav.Item eventKey="wallet" onClick={() => { history.push("/wallet-login") }}>{t('wallet')}</Nav.Item>
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