import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import { TABLE_CONFIG } from '../../config';
import { getContractKRC721 } from '../../service/tokens-nft';
import './style.css'
import { Tokens } from './Tokens';
import { UnverifiedToken } from './UnverifiedToken'

const TokensNFT = () => {

    const [activeKey, setActiveKey] = useState('verified')


    const [loading, setLoading] = useState(false);

    const [tokenPage, setTokenPage] = useState(TABLE_CONFIG.page);
    const [tokenSize, setTokenSize] = useState(TABLE_CONFIG.limitDefault);
    const [tokens, setTokens] = useState([])


    const [unverified , setUnverifiedToken] = useState([])
    const [unverifiedTokenPage, setUnverifiedTokenPage] = useState(TABLE_CONFIG.page);
    const [unverifiedTokenSize, setUnverifiedTokenSize] = useState(TABLE_CONFIG.limitDefault);


    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getContractKRC721(tokenPage, tokenSize);

            const _verifyTokens = rs.contracts.filter((it: any) => it.isVerified === true)
            const _unverifyTokens = rs.contracts.filter((it: any) => it.isVerified === false)
            
            setTokens(_verifyTokens);
            setTokenSize(_verifyTokens.length);

            setUnverifiedToken(_unverifyTokens);
            setUnverifiedTokenSize(_unverifyTokens.length)
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
                                    {`Verified Token (${tokenSize || 0})`}
                                </Nav.Item>

                                <Nav.Item eventKey="unverified">
                                    {`Unverified Token (${unverifiedTokenSize || 0})`}
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

                                    case 'unverified':
                                        return (
                                            <UnverifiedToken
                                                tokens={unverified}
                                                totalTokens={1}
                                                page={unverifiedTokenPage}
                                                setPage={setUnverifiedTokenPage}
                                                size={unverifiedTokenSize}
                                                setSize={setUnverifiedTokenSize}
                                                loading={loading} />
                                        )
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