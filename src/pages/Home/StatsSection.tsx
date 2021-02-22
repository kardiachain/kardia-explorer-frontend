import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { Icon, Panel } from 'rsuite';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';
import { numberFormat } from '../../common/utils/number';
import { calculateTPS, getTotalStats } from '../../service/kai-explorer';
import './stat.css'

const StatsSection = ({ totalTxs = 0, blockHeight = 0, blockList = [] }: { totalTxs: number, blockHeight: number, blockList: KAIBlock[] }) => {
    const [tps, setTps] = useState(0)
    const [totalStats, setTotalStats] = useState({} as TotalStats)
    
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        const tps = calculateTPS(blockList);
        setTps(tps);
        (async () => {
            const totalStats = await getTotalStats();
            setTotalStats(totalStats)
        })()
    }, [blockList]);

    return (
        <div className="stats-section">
                <Panel className="stat-container panel-bg-transparent" shaded>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="cubes" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{getLanguageString(language, 'BLOCK_HEIGHT', 'TEXT')}</div>
                        <div className="value color-white">{numberFormat(blockHeight)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="realtime" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{getLanguageString(language, 'LIVE_TPS', 'TEXT')}</div>
                        <div className="value color-white">{numberFormat(tps)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="exchange" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{getLanguageString(language, 'TRANSACTIONS', 'TEXT')}</div>
                        <div className="value color-white">{numberFormat(totalTxs)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="vcard" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{getLanguageString(language, 'ADDRESSES', 'TEXT')}</div>
                        <div className="value color-white">{numberFormat(totalStats.totalHolders)}</div>
                    </div>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="gray-highlight" icon="file-text-o" size={"lg"} />
                        </div>
                        <div className="title color-graylight">{getLanguageString(language, 'CONTRACTS', 'TEXT')}</div>
                        <div className="value color-white">{numberFormat(totalStats.totalContracts)}</div>
                    </div>
                </Panel>
        </div>
    )
}

export default StatsSection