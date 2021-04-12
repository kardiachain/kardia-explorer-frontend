import React, { useState, useEffect } from 'react'
import { FlexboxGrid, Col, Panel, Nav } from 'rsuite';
import { TABLE_CONFIG } from '../../../../config';
import {Krc20Txs, TransactionHistoryList} from '../../../../common';
import { getKrc20Txs, getTxsByAddress, getAccount, ITokenTranferTx } from '../../../../service';

const TransactionHistory = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const myAccount = getAccount() as Account
    const [activeKey, setActiveKey] = useState('transactions')

    const [krc20Txs, setKrc20Txs] = useState<ITokenTranferTx[]>([] as ITokenTranferTx[])
    const [totalKrc20Txs, setTotalKrc20Txs] = useState(0)
    const [krc20TxsPage, setKrc20TxsPage] = useState(TABLE_CONFIG.page)
    const [krc20TxsSize, setKrc20TxsSize] = useState(TABLE_CONFIG.limitDefault)
    const [krc20TxsLoading, setKrc20TxsLoading] = useState(false)

    useEffect(() => {
        if (!myAccount.publickey) return;
        (async () => {
            setLoading(true)
            const rs = await getTxsByAddress(myAccount.publickey, page, size);
            setLoading(false)
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
        })()
    }, [myAccount.publickey, page, size])

    useEffect(() => {
        if (!myAccount.publickey) return;
        (async () => {
            setKrc20TxsLoading(true)
            const rs = await getKrc20Txs(myAccount.publickey, krc20TxsPage, krc20TxsSize)
            setTotalKrc20Txs(rs.total)
            setKrc20Txs(rs.txs)
            setKrc20TxsLoading(false)
        })()
    }, [krc20TxsSize, krc20TxsPage, myAccount.publickey])

    return (
        <div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Transactions history
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
                                                address={myAccount.publickey}
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
        </div>
    )
}

export default TransactionHistory;