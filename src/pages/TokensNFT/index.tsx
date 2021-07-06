import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import { TABLE_CONFIG } from '../../config';
import { getContractKRC721 } from '../../service/tokens-nft';
import './style.css'
import { Tokens } from './Tokens';


const TokensNFT = () => {

    const [activeKey, setActiveKey] = useState('verified')

    const [tokenPage, setTokenPage] = useState(TABLE_CONFIG.page);
    const [tokenSize, setTokenSize] = useState(TABLE_CONFIG.limitDefault);
    const [loading, setLoading] = useState(false);

    const [tokens, setTokens] = useState([])


    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getContractKRC721(tokenPage, tokenSize);
            setTokens(rs.contracts);
            setTokenSize(rs.total);
            setLoading(false);
        })()
    }, [tokenPage, tokenSize])

    return (
        <div className="container txs-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Non-Fungible Token Tracker KRC721
                        </div>
                    </div>
                </FlexboxGrid.Item>
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
                                <Nav.Item eventKey="verified">
                                    {`KRC721 Contract (${tokenSize || 0})`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'verified':
                                        return (
                                            <Tokens
                                                tokens={tokens}
                                                totalTokens={1}
                                                page={tokenPage}
                                                setPage={setTokenPage}
                                                size={tokenSize}
                                                setSize={setTokenSize}
                                                loading={loading} />
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
export default TokensNFT;