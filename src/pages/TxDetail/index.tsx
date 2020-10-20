import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, List, Panel } from 'rsuite';
import { getTxByHash } from '../../service/kai-explorer';
import './txDetail.css'

const TxDetail = () => {
    const query = new URLSearchParams(useLocation().search);
    const txHash = query.get("hash") || '';
    const [dataDisplay, setDataDisplay] = useState([] as any[])

    useEffect(() => {
        (async () => {
            const tx = await getTxByHash(txHash);
            const data = [
                { title: 'Transaction Hash', content: tx.txHash },
                { title: 'Block Number', content: tx.blockNumber },
                { title: 'Block Hash', content: tx.blockHash },
                { title: 'Status', content: tx.status ? 'Success' : 'Pending' },
                { title: 'TimeStamp', content: tx.time },
                { title: 'From', content: tx.from },
                { title: 'To', content: tx.to },
                { title: 'Value', content: tx.value },
                { title: 'Gas Price', content: tx.gasPrice },
                { title: 'Nonce', content: tx.nonce },
                { title: 'Transaction Index', content: tx.transactionIndex },
                { title: 'Input Data', content: tx.input }
            ] as any[]
            setDataDisplay(data)
        })()
    }, [])

    return (
        <React.Fragment>
            <div className="tx-detail-container">
                <h3>Transaction Details</h3>
                <Divider />
                <Panel shaded>
                    <List bordered={false}>
                        {dataDisplay.map((item, index) => (
                            <List.Item key={index} index={index}>
                                <FlexboxGrid justify="start">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="title">{item.title}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="content">{item.content}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        ))}
                    </List>
                </Panel>
            </div>
        </React.Fragment>
    )
}

export default TxDetail;