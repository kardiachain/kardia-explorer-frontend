import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Table, Tooltip, Whisper, Nav } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { useViewport } from '../../../context/ViewportContext';
import bnb from '../../../resources/bnb.webp';
import './tokenDetail.css'
import { numberFormat } from '../../../common/utils/number';
import Transfers from './Transfers';

const { Column, HeaderCell, Cell } = Table;


const TokenDetail = () => {
    let history = useHistory();
    const { isMobile } = useViewport();
    const [activeKey, setActiveKey] = useState('validators')
    const [tokens, setTokens] = useState([
        {
            name: 'BNB',
            price: 237,
            change: 5.04,
            volume: 3078509017,
            marketCap: 365666886336,
            holders: 315307,
            contractAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
        }
    ])

    return (
        <div className="container txs-container">
            <div style={{ marginBottom: 10 }}>
                <img src={bnb} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="logo" />
                <span className="color-white">Token BNB</span>
            </div>

            <FlexboxGrid>
                <FlexboxGridItem colspan={24} md={24} sm={24} style={{ marginRight: !isMobile ? 5 : 0, borderRadius: 8 }} className="wrap-token">
                    <Panel bordered header="Overview [KRC-20]">
                        <div className="row" style={{ display: 'flex' }}>
                            <div className="left" style={{ flex: 1, borderRight: '1px solid gray' }}>
                                <p className="color-graylight">Price: $ {numberFormat(2329400)} @ 0.136401 Eth (-3.30%)</p>
                            </div>

                            <div className="right" style={{ flex: 1, paddingLeft: '24px' }}>
                                <p className="color-graylight">FULLY DILUTED MARKET CAP: $ {numberFormat(36137958496)}</p>
                            </div>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Max Total Supply:</p>
                            <span className="flex9 color-graylight">{numberFormat(16579517)} BNB</span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Holders:</p>
                            <span className="flex9 color-graylight">{numberFormat(315306)} (0.00%)</span>
                        </div>

                        <div className="row no-border">
                            <p className="flex3 color-graylight">Transfers:</p>
                            <span className="flex9 color-graylight">
                                {numberFormat(16579517)} BNB
                            </span>
                        </div>

                    </Panel>
                </FlexboxGridItem>

                <FlexboxGridItem colspan={24} md={24} sm={24} style={{ marginLeft: !isMobile ? 5 : 0, borderRadius: 8 }} className="wrap-token">
                    <Panel bordered header="Profile Summary">
                        <div className="row">
                            <p className="flex3 color-graylight">Contract:</p>
                            <span className="flex9 color-graylight">0xB8c77482e45F1F44dE1745F52C74426C631bDD52</span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Decimals:</p>
                            <span className="flex9 color-graylight">18</span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Official Site:</p>
                            <span className="flex9 color-graylight">https://www.binance.com/</span>
                        </div>

                        <div className="row no-border" style={{ display: 'flex' }}>
                            <p className="flex3 color-graylight">Social Profiles: </p>
                            <ul className="flex9 social" style={{ display: 'flex', paddingLeft: 0 }}>
                                <li><a href="https://medium.com/kardiachain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="medium" size={"lg"} /></a></li>
                                <li><a href="https://twitter.com/KardiaChain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="twitter" size={"lg"} /></a></li>
                                <li><a href="https://t.me/kardiachain" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="telegram" size={"lg"} /></a></li>
                                <li><a href="https://www.facebook.com/KardiaChainFoundation/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="facebook" size={"lg"} /></a></li>
                                <li><a href="https://www.instagram.com/kardiachainofficial/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="instagram" size={"lg"} /></a></li>
                                <li><a href="https://www.youtube.com/channel/UC51X-DS1VBqzVhd8UU4Aymg" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="youtube" size={"lg"} /></a></li>
                                <li><a href="https://www.reddit.com/r/KardiaChain/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="reddit" size={"lg"} /></a></li>
                                <li><a href="https://www.linkedin.com/company/kardiachain/" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="linkedin" size={"lg"} /></a></li>
                            </ul>
                        </div>
                    </Panel>
                </FlexboxGridItem>
            </FlexboxGrid>

            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="custom-nav">
                            <Nav
                                appearance="subtle"
                                activeKey={activeKey}
                                onSelect={setActiveKey}
                                style={{ marginBottom: 20 }}>
                                <Nav.Item eventKey="validators">
                                    {`Transfers`}
                                </Nav.Item>
                                <Nav.Item eventKey="candidates">
                                    {`Holders`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'validators':
                                        return (
                                            <Transfers/>
                                        );

                                }
                            })()
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

        </div>
    )
}
export default TokenDetail;