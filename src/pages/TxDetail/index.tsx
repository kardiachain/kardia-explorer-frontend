import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Nav } from 'rsuite';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { getTxByHash } from '../../service/kai-explorer';
import './txDetail.css'
import { hashValid } from '../../common/utils/validate';
import Logs from './Logs';
import TxDetailOverview from './overview';

const TxDetail = () => {
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>({} as KAITransaction)
    const [loading, setLoading] = useState(true)
    const [activeKey, setActiveKey] = useState('overview')


    useEffect(() => {
        setLoading(true)
        // Refetch txD
        if (hashValid(txHash)) {
            (async () => {
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
                            {`Logs`}
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
                                    <Logs />
                                )
                        }
                    })()
                }
            </Panel>


        </div>
    )
}


export default TxDetail;