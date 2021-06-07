import React, { useEffect, useState } from 'react'
import { Icon, Panel } from 'rsuite';
import { numberFormat } from '../../common';
import { calculateTPS, getTotalStats } from '../../service';
import './stat.css'
import { useTranslation } from 'react-i18next';

const StatsSection = ({ totalTxs = 0, blockHeight = 0, blockList = [] }: { totalTxs: number, blockHeight: number, blockList: KAIBlock[] }) => {
    const { t } = useTranslation()

    const [tps, setTps] = useState('0')
    const [totalStats, setTotalStats] = useState({} as TotalStats)

    useEffect(() => {
        try {
            const tps = calculateTPS(blockList);
            setTps(tps);
            (async () => {
                const totalStats = await getTotalStats();
                setTotalStats(totalStats)
            })()
        } catch (error) { }
    }, [blockList]);

    return (
        <div className="stats-section">
                <Panel className="stat-container panel-bg-transparent" shaded>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="cubes" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{t('blockHeight')}</div>
                        <div className="value color-white">{numberFormat(blockHeight)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="realtime" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{t('liveTPS')}</div>
                        <div className="value color-white">{numberFormat(tps)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="exchange" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{t('transactions')}</div>
                        <div className="value color-white">{numberFormat(totalTxs)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="vcard" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{t('addresses')}</div>
                        <div className="value color-white">{numberFormat(totalStats.totalHolders)}</div>
                    </div>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="file-text-o" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{t('contracts')}</div>
                        <div className="value color-white">{numberFormat(totalStats.totalContracts)}</div>
                    </div>
                </Panel>
        </div>
    )
}

export default StatsSection