import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, List, Panel, SelectPicker, Nav } from 'rsuite';
import {
    StakingIcon,
    convertValueFollowDecimal,
    weiToKAI,
    Krc20Txs,
    TransactionHistoryList,
    numberFormat,
    renderHashString
} from '../../common';
import { TABLE_CONFIG } from '../../config';
import './addressDetail.css'
import { getHolderAccount, getKrc20Txs, getTokens, getTxsByAddress, ITokenTranferTx } from '../../service';
import { KardiaUtils } from 'kardia-js-sdk';


const AddressDetail = () => {
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { address }: any = useParams()
    const [holderAccount, setHolderAccount] = useState<HolderAccount>();
    const [tokens, setTokens] = useState([]);
    let history = useHistory();
    const [activeKey, setActiveKey] = useState('transactions')

    const [krc20Txs, setKrc20Txs] = useState<ITokenTranferTx[]>([] as ITokenTranferTx[])
    const [totalKrc20Txs, setTotalKrc20Txs] = useState(0)
    const [krc20TxsPage, setKrc20TxsPage] = useState(TABLE_CONFIG.page)
    const [krc20TxsSize, setKrc20TxsSize] = useState(TABLE_CONFIG.limitDefault)
    const [krc20TxsLoading, setKrc20TxsLoading] = useState(false)

    useEffect(() => {
        window.history.replaceState(null, document.title, `/address/${KardiaUtils.toChecksum(address)}`)
    }, [address])

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await Promise.all([
                getTxsByAddress(address, page, size),
                getHolderAccount(address),
                getTokens(address)
            ]);
            setLoading(false);
            setTransactionList(rs[0].transactions);
            setTotalTxs(rs[0].totalTxs);
            setHolderAccount(rs[1]);
            setTokens(rs[2].tokens);
        })()
    }, [page, size, address])

    useEffect(() => {
        (async () => {
            setKrc20TxsLoading(true)
            const rs = await getKrc20Txs(address, krc20TxsPage, krc20TxsSize)
            setTotalKrc20Txs(rs.total)
            setKrc20Txs(rs.txs)
            setKrc20TxsLoading(false)
        })()
    }, [krc20TxsSize, krc20TxsPage, address])

    return (
        <div className="container address-detail-container">
            {
                holderAccount?.isContract ? (
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Contract Detail
                        </div>
                    </div>
                ) : (
                        <div style={{ marginBottom: 16 }}>
                            <div className="title header-title">
                                Address Detail
                        </div>
                        </div>
                    )
            }
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: '25px' }}>
                    <Panel className="overview panel-bg-gray" shaded>
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Address: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="property-content">
                                            {renderHashString(address, 45)}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {
                                holderAccount?.name ? (
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                                <div className="property-title">Name: </div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                                <div className="property-content">
                                                    {holderAccount?.name}
                                                    {
                                                        holderAccount?.isInValidatorsList ? <StakingIcon
                                                            color={holderAccount?.role?.classname}
                                                            character={holderAccount?.role?.character || ''}
                                                            size='small' style={{ marginLeft: 5 }} /> : <></>
                                                    }
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                ) : <></>
                            }
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Balance: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="property-content">{numberFormat(weiToKAI(holderAccount?.balance))} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>

                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="property-title">Token: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <SelectPicker
                                            placeholder="Search for Token name"
                                            className="dropdown-custom"
                                            data={tokens}
                                            virtualized={false}
                                            style={{ width: '100%' }}
                                            renderMenuItem={(label, item: any) => {
                                                return (
                                                    <div className="rowToken" onClick={() => {
                                                        history.push(`/token/${item.contractAddress}`)
                                                    }}>
                                                        <div className="flex">
                                                            <img src={item.logo} alt="logo" width="12px" height="12px" style={{ marginRight: '4px' }} />
                                                            <p>{item.tokenSymbol}</p>
                                                        </div>
                                                        <span>{numberFormat(convertValueFollowDecimal(item.balance, item.tokenDecimals))}</span>
                                                    </div>
                                                );
                                            }}

                                        />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <div style={{ marginBottom: 16 }}>
                                <div className="title header-title">
                                    Transaction History
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
                                        <Nav.Item eventKey="transactions">
                                            {`Transactions (${totalTxs || 0})`}
                                        </Nav.Item>
                                        <Nav.Item eventKey="krc20">
                                            {`KRC20 Token Txs (${totalKrc20Txs || 0})`}
                                        </Nav.Item>
                                    </Nav>
                                </div>
                                {
                                    (() => {
                                        switch (activeKey) {
                                            case 'transactions':
                                                return (
                                                    <TransactionHistoryList
                                                        transactionList={transactionList}
                                                        loading={loading}
                                                        address={address}
                                                        totalTxs={totalTxs}
                                                        size={size}
                                                        setSize={setSize}
                                                        page={page}
                                                        setPage={setPage} />
                                                );
                                            case 'krc20':
                                                return (
                                                    <Krc20Txs
                                                        txs={krc20Txs}
                                                        totalTx={totalKrc20Txs}
                                                        loading={krc20TxsLoading}
                                                        size={krc20TxsSize}
                                                        setSize={setKrc20TxsSize}
                                                        page={krc20TxsPage}
                                                        setPage={setKrc20TxsPage} />
                                                )
                                        }
                                    })()
                                }
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default AddressDetail;