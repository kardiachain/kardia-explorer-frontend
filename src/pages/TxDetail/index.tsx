import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Nav } from 'rsuite';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { getContractEvents, getTxByHash } from '../../service';
import './txDetail.css'
import Logs from './Logs';
import TxDetailOverview from './overview';
import { hashValid } from '../../common';

const TxDetail = () => {
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>({} as KAITransaction)
    const [loading, setLoading] = useState(true)
    const [activeKey, setActiveKey] = useState('overview')

    const [logs, setLogs] = useState([]);


    useEffect(() => {
        setLoading(true)
        // Refetch txD
        if (hashValid(txHash)) {
            (async () => {
                try {
                    const data = await getContractEvents(1, 10, txHash);
                    setLogs(data);
                } catch(e){}

                let tx = await getTxByHash(txHash);
                if (tx.txHash) {
                    setTxDetail(tx);
                    setLoading(false);
                    return;
                }

                const fetchTxDetail = setInterval(async () => {
                    tx = await getTxByHash(txHash);
                    if (tx.txHash) {
                        setTxDetail(tx)
                        setLoading(false)
                        clearInterval(fetchTxDetail)
                    }
                }, TIME_INTERVAL_MILISECONDS);
                return () => clearInterval(fetchTxDetail);
            })();
        }
    }, [txHash])

    return (
        <div className="container tx-detail-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Transaction Details
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                <div className="custom-nav">
                    <Nav
                        appearance="subtle"
                        activeKey={activeKey}
                        onSelect={setActiveKey}
                        style={{ marginBottom: 20 }}>
                        <Nav.Item eventKey="overview">
                            {`Overview`}
                        </Nav.Item>
                        <Nav.Item eventKey="logs">
                            {`Logs ${logs.length > 0 ? `(${logs.length})` : ''}`}
                        </Nav.Item>
                    </Nav>
                </div>
                {
                    (() => {
                        switch (activeKey) {
                            case 'overview':
                                return (
                                    <TxDetailOverview txDetail={txDetail} loading={loading} />
                                );
                            case 'logs':
                                return (
                                    <Logs logs={logs}/>
                                )
                        }
                    })()
                }
            </Panel>


        </div>
    )
}


export default TxDetail;