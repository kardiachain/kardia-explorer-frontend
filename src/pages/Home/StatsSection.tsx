import React, { useEffect, useState } from 'react'
import { Col, Icon, Panel, Row } from 'rsuite';
import { numberFormat } from '../../common/utils/number';
import { useViewport } from '../../context/ViewportContext';
import { calculateTPS } from '../../service/kai-explorer';
import './home.css'

const StatsSection = ({ totalTxs = 0, blockHeight = 0, blockList = [] }: { totalTxs: number, blockHeight: number, blockList: KAIBlock[] }) => {
    const [tps, setTps] = useState(0)

    const {isMobile} = useViewport()

    useEffect(() => {
        const tps = calculateTPS(blockList);
        setTps(tps);
    }, [blockList]);

    return (
        <div className="stats-section">
            <Row className="stat-group">
                <Col md={12} sm={12} xs={12}>
                    <Panel className="stat-container">
                        <div className="icon">
                            <Icon icon="cubes" size={isMobile ? undefined : "lg"} />
                        </div>
                        <div className="value">{numberFormat(blockHeight)}</div>
                        <div className="title">Block Height</div>
                    </Panel>
                </Col>
                <Col md={12} sm={12} xs={12}>
                    <Panel className="stat-container">
                        <div className="icon">
                            <Icon icon="recycle" size={isMobile ? undefined : "lg"} />
                        </div>
                        <div className="value">{numberFormat(tps)}</div>
                        <div className="title">Live TPS</div>
                    </Panel>
                </Col>
                <Col md={12} sm={12} xs={12}>
                    <Panel className="stat-container">
                        <div className="icon">
                            <Icon icon="exchange" size={isMobile ? undefined : "lg"} />
                        </div>
                        <div className="value">{numberFormat(totalTxs)}</div>
                        <div className="title">Transactions</div>
                    </Panel>
                </Col>
                <Col md={12} sm={12} xs={12}>
                    <Panel className="stat-container">
                        <div className="icon">
                            <Icon icon="peoples" size={isMobile ? undefined : "lg"} />
                        </div>
                        <div className="value">{numberFormat(0)}</div>
                        <div className="title">Holders</div>
                    </Panel>
                </Col>
            </Row>
        </div>
    )
}

export default StatsSection