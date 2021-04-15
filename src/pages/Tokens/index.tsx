import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import { TABLE_CONFIG } from '../../config';
import { getContractsList, ITokenContract } from '../../service';
import './tokens.css'
import unverified from '../../resources/unverified.svg';
import { VerifiedTokens } from './VerifiedTokens';
import { UnVerifiedTokens } from './UnverifiedTokens';


const Tokens = () => {

    const [activeKey, setActiveKey] = useState('verified')

    const [verifiedTokensPage, setVerifiedTokensPage] = useState(TABLE_CONFIG.page);
    const [verifiedTokensSize, setVerifiedTokensSize] = useState(TABLE_CONFIG.limitDefault);
    const [verifiedTokens, setVerifiedTokens] = useState<ITokenContract[]>([] as ITokenContract[])
    const [totalVerifiedTokens, setTotalVerifiedTokens] = useState(0);
    const [verifiedTokensLoading, setVerifiedTokensLoading] = useState(false);

    const [unverifiedTokensPage, setUnverifiedTokensPage] = useState(TABLE_CONFIG.page);
    const [unverifiedTokensSize, setUnverifiedTokensSize] = useState(TABLE_CONFIG.limitDefault);
    const [unverifiedTokens, setUnverifiedTokens] = useState<ITokenContract[]>([] as ITokenContract[])
    const [totalUnverifiedTokens, setTotalUnverifiedTokens] = useState(0);
    const [unverifiedTokensLoading, setUnverifiedTokensLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setVerifiedTokensLoading(true);
            const rs = await getContractsList(verifiedTokensPage, verifiedTokensSize, 'Verified');
            setVerifiedTokens(rs.contracts);
            setTotalVerifiedTokens(rs?.total);
            setVerifiedTokensLoading(false);
        })()
    }, [verifiedTokensPage, verifiedTokensSize])


    useEffect(() => {
        (async () => {
            setUnverifiedTokensLoading(true);
            const rs = await getContractsList(unverifiedTokensPage, unverifiedTokensSize, 'Unverified');
            setUnverifiedTokens(rs.contracts);
            setTotalUnverifiedTokens(rs?.total);
            setUnverifiedTokensLoading(false);
        })()
    }, [unverifiedTokensPage, unverifiedTokensSize])

    return (
        <div className="container txs-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Token Tracker KRC20
                        </div>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="unverified-note">
                            <img
                                className="token-logo"
                                style={{
                                    width: 20,
                                    height: 20,
                                    marginTop: 0,
                                    marginRight: 10
                                }}
                                src={unverified} alt="kardiachain" />
                            <span style={{
                                color: 'white',
                                verticalAlign: 'bottom'
                            }}>Unverified Tokens</span>
                        </div>
                        <div className="custom-nav">
                            <Nav
                                appearance="subtle"
                                activeKey={activeKey}
                                onSelect={setActiveKey}
                                style={{ marginBottom: 20 }}>
                                <Nav.Item eventKey="verified">
                                    {`Verified Tokens (${totalVerifiedTokens || 0})`}
                                </Nav.Item>
                                <Nav.Item eventKey="unverified">
                                    {`Unverified Tokens (${totalUnverifiedTokens || 0})`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'verified':
                                        return (
                                            <VerifiedTokens
                                                tokens={verifiedTokens}
                                                totalTokens={totalVerifiedTokens}
                                                page={verifiedTokensPage}
                                                setPage={setVerifiedTokensPage}
                                                size={verifiedTokensSize}
                                                setSize={setVerifiedTokensSize}
                                                loading={verifiedTokensLoading} />
                                        );
                                    case 'unverified':
                                        return (
                                            <UnVerifiedTokens
                                                tokens={unverifiedTokens}
                                                totalTokens={totalUnverifiedTokens}
                                                page={unverifiedTokensPage}
                                                setPage={setUnverifiedTokensPage}
                                                size={unverifiedTokensSize}
                                                setSize={setUnverifiedTokensSize}
                                                loading={unverifiedTokensLoading} />
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
export default Tokens;