import React, { useEffect, useState } from 'react'
import { Icon, Panel } from 'rsuite';
import { numberFormat } from '../../common/utils/number';
import { calculateTPS } from '../../service/kai-explorer';
import './home.css'

const StatsSection = ({ totalTxs = 0, blockHeight = 0, blockList = [] }: { totalTxs: number, blockHeight: number, blockList: KAIBlock[] }) => {
    const [tps, setTps] = useState(0)

    useEffect(() => {
        const tps = calculateTPS(blockList);
        setTps(tps);
    }, [blockList]);

    return (
        <div className="stats-section">
                <Panel className="stat-container" shaded>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="cubes" size={"lg"} />
                        </div>
                        <div className="title">Block Height</div>
                        <div className="value">{numberFormat(blockHeight)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="recycle" size={"lg"} />
                        </div>
                        <div className="title">Live TPS</div>
                        <div className="value">{numberFormat(tps)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="exchange" size={"lg"} />
                        </div>
                        <div className="title">Transactions</div>
                        <div className="value">{numberFormat(totalTxs)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="peoples" size={"lg"} />
                        </div>
                        <div className="title">Holders</div>
                        <div className="value">{numberFormat(0)}</div>
                    </div>
                </Panel>
        </div>
    )
}

export default StatsSection