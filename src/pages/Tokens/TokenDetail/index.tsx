import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Nav, Placeholder, List } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { useViewport } from '../../../context/ViewportContext';
import './style.css'
import { getTokenContractInfor } from '../../../service/kai-explorer';
import { renderHashToRedirect } from '../../../common/utils/string';
import { ITokenDetails, ITokenHoldersByToken, ITokenTranferTx } from '../../../service/kai-explorer/tokens/type';
import { convertValueFollowDecimal } from '../../../common/utils/amount';
import { numberFormat } from '../../../common/utils/number';
import TokenTransfers from './TokenTransfers';
import { TABLE_CONFIG } from '../../../config';
import { getTokenHoldersByToken, getTokenTransferTx } from '../../../service/kai-explorer/tokens';
import TokenHolder from './TokenHolder';

const { Paragraph } = Placeholder;

const TokenDetail = () => {
    const { contractAddress }: any = useParams()
    const { isMobile } = useViewport();
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState('transfer')
    const [tokenInfor, setTokenInfor] = useState<ITokenDetails>({} as ITokenDetails);
    const [transferTxs, setTransferTxs] = useState<ITokenTranferTx[]>([] as ITokenTranferTx[])
    const [totalTransferTxs, setTotalTransferTxs] = useState(0)
    const [transferTxsPage, setTransferTxsPage] = useState(TABLE_CONFIG.page)
    const [transferTxsSize, setTransferTxsSize] = useState(TABLE_CONFIG.limitDefault)
    const [transferTxsLoading, setTransferTxsLoading] = useState(false)

    const [holders, setHolders] = useState<ITokenHoldersByToken[]>([] as ITokenHoldersByToken[])
    const [totalHolder, setTotalHolder] = useState(0)
    const [holdersSize, setHoldersSize] = useState(TABLE_CONFIG.limitDefault)
    const [holdersPage, setHoldersPage] = useState(TABLE_CONFIG.page)
    const [holdersLoading, setHoldersLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getTokenContractInfor(contractAddress);
            setTokenInfor(rs);
            setLoading(false);
        })()
    }, [contractAddress])

    useEffect(() => {
        (async () => {
            setTransferTxsLoading(true)
            const rs = await getTokenTransferTx(contractAddress, transferTxsPage, transferTxsSize)
            setTotalTransferTxs(rs.total)
            setTransferTxs(rs.txs)
            setTransferTxsLoading(false)
        })()
    }, [transferTxsSize, transferTxsPage, contractAddress])

    useEffect(() => {
        (async () => {
            setHoldersLoading(true)
            const rs = await getTokenHoldersByToken(contractAddress, holdersPage, holdersSize)
            setTotalHolder(rs.total)        
            setHolders(rs.holders)
            setHoldersLoading(false)
        })()
    }, [holdersSize, holdersPage, contractAddress])

    return (
        <div className="container token-details-container">
            <div style={{ marginBottom: 10 }}>
                <img src={tokenInfor.logo} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="logo" />
                <span className="color-white"><span className="fs-18">Token</span> {tokenInfor.tokenName} {tokenInfor.symbol ? `[${tokenInfor.symbol}]` : ''}</span>
            </div>

            <FlexboxGrid justify="space-between">
                <FlexboxGridItem componentClass={Col} colspan={24} md={14} sm={24} style={{ marginBottom: '25px' }}>
                    <Panel className="overview panel-bg-gray" header="Overview [KRC-20]">
                        {
                            loading ? <Paragraph style={{ marginBottom: 15 }} rows={5} /> : (
                                <List bordered={false}>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                                <div className="property-title">Token name</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                                <div className="property-content">{tokenInfor.tokenName}</div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                                <div className="property-title">Contract</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                                <div className="property-content">
                                                    {
                                                        renderHashToRedirect({
                                                            hash: tokenInfor.address,
                                                            headCount: isMobile ? 5 : 50,
                                                            tailCount: 15,
                                                            showTooltip: false,
                                                            redirectTo: `/address/${tokenInfor.address}`,
                                                            showCopy: true
                                                        })
                                                    }</div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                                <div className="property-title">Decimals</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                                <div className="property-content">
                                                    {tokenInfor.decimals}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24}>
                                                <div className="property-title">Total supply</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} xs={24}>
                                                <div className="property-content">
                                                    {numberFormat(convertValueFollowDecimal(tokenInfor.totalSupply, tokenInfor.decimals))} {tokenInfor.symbol}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                </List>
                            )
                        }
                    </Panel>
                </FlexboxGridItem>

                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="custom-nav">
                            <Nav
                                appearance="subtle"
                                activeKey={activeKey}
                                onSelect={setActiveKey}
                                style={{ marginBottom: 20 }}>
                                <Nav.Item eventKey="transfer">
                                    {`Transfers (${totalTransferTxs || 0})`}
                                </Nav.Item>
                                <Nav.Item eventKey="holders">
                                    {`Holders (${totalHolder || 0})`}
                                </Nav.Item> 
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'transfer':
                                        return (
                                            <TokenTransfers
                                                txs={transferTxs}
                                                totalTx={totalTransferTxs}
                                                loading={transferTxsLoading}
                                                size={transferTxsSize}
                                                setSize={setTransferTxsSize}
                                                page={transferTxsPage}
                                                setPage={setTransferTxsPage} />
                                        );
                                    case 'holders':
                                        return (
                                            <TokenHolder
                                                holders={holders}
                                                totalHolder={totalHolder}
                                                size={holdersSize}
                                                page={holdersPage}
                                                setSize={setHoldersSize}
                                                setPage={setHoldersPage}
                                                loading={holdersLoading}
                                            />
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
export default TokenDetail;