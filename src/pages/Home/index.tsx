import React, { useEffect, useState } from 'react';
import './home.css'
import { FlexboxGrid, Col, Panel } from 'rsuite';
import TransactionSection from './TransactionSection';
import { useHistory } from 'react-router-dom';
import BlockSection from './BlockSection';
import { getBlocks, getTransactions, getTokenInfor } from '../../service/kai-explorer';
import { BLOCK_COUNT_FOR_CHART, BLOCK_NUMBER_FOR_CAL_TPS, RECORDS_NUMBER_SHOW_HOMEPAGE, TABLE_CONFIG } from '../../config';
import BlockTimeChart from './BlockTimeChart';
import StatsSection from './StatsSection';
import { useViewport } from '../../context/ViewportContext';
import { Icon } from 'rsuite';
import SearchSection from '../../common/components/Header/SearchSection';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import Button from '../../common/components/Button';
import { numberFormat } from '../../common/utils/number';
import { useRecoilValue } from 'recoil';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';


const Home = () => {

    const [blockHeight, setBlockHeight] = useState(0)
    const [tpsCalculateBlocks, setTpsCalculateBlocks] = useState<KAIBlock[]>([]);
    const [blocks, setBlocks] = useState<KAIBlock[]>([]);
    const [blocksForChart, setBlocksForChart] = useState<KAIBlock[]>([]);
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const [totalTxs, setTotalTxs] = useState(0)
    const [tokenInfor, setTokenInfor] = useState({} as KaiToken)

    const history = useHistory();
    const language = useRecoilValue(languageAtom)

    const { isMobile } = useViewport()

    const fetchBlockChart = async () => {
        // Get transaction
        const transactionsResponse = await getTransactions(TABLE_CONFIG.page, RECORDS_NUMBER_SHOW_HOMEPAGE);
        setTransactionList(transactionsResponse.transactions);
        setTotalTxs(transactionsResponse.totalTxs);

        // Get blocks
        const blockResponse = await getBlocks(TABLE_CONFIG.page, BLOCK_COUNT_FOR_CHART)
        blockResponse && setBlockHeight(blockResponse.totalBlocks);
        const blockList = blockResponse.blocks;
        const originBlockList = JSON.parse(JSON.stringify(blockList))

        // Get block for calculate tps
        setTpsCalculateBlocks(originBlockList.slice(originBlockList.length - BLOCK_NUMBER_FOR_CAL_TPS))

        // Get block for block list
        setBlocks(originBlockList.slice(0, RECORDS_NUMBER_SHOW_HOMEPAGE))

        // Get blocks for block time chart
        setBlocksForChart(blockList.reverse())
    }

    useEffect(() => {
        (async () => {
            await fetchBlockChart()
            const tokenInfor = await getTokenInfor();
            setTokenInfor(tokenInfor);
        })()

        const loop = setInterval(fetchBlockChart, TIME_INTERVAL_MILISECONDS)
        return () => {
            clearInterval(loop)
        }
    }, [])

    return (
        <React.Fragment>
            <div className="container home-container">
                <SearchSection />
                <div>
                    <FlexboxGrid className="home-top-section" justify="space-between" style={{ alignItems: 'normal' }}>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{marginRight: !isMobile ? 5 : 0, borderRadius: 8}} className="wrap-token bocktime-chart-container">
                            <BlockTimeChart blockList={blocksForChart} />
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{marginLeft: !isMobile ? 5 : 0, borderRadius: 8}} className="wrap-token">
                            <Panel shaded className="_wrap panel-bg-gray">
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="rocket" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'SYMBOL', 'TEXT')}</p>
                                        <p className="mt0 fw700 color-white fs-15">{getLanguageString(language, 'KAI', 'TEXT')}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="usd" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'PRICE', 'TEXT')} ($)</p>
                                        <p className="mt0 fw700 color-white fs-15 word-break-all">{tokenInfor.price ? numberFormat(tokenInfor.price as number, 6) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="signal" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'VOLUMN_24H', 'TEXT')} ($)</p>
                                        <p className="mt0 fw700 color-white fs-15 word-break-all">{tokenInfor.volume_24h ? numberFormat(tokenInfor.volume_24h as number, 3) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="line-chart" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'MARKET_CAP', 'TEXT')} ($)</p>
                                        <p className="mt0 fw700 color-white fs-15 word-break-all">{tokenInfor.price ? numberFormat(tokenInfor.market_cap, 3) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="database" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'TOTAL_SUPPLY', 'TEXT')} (KAI)</p>
                                        <p className="mt0 fw700 color-white fs-15 word-break-all">{tokenInfor.total_supply ? numberFormat(tokenInfor.total_supply as number) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="coincide" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight fs-12">{getLanguageString(language, 'TOTAL_REWAEDS', 'TEXT')} (KAI)</p>
                                        <p className="mt0" style={{wordBreak: 'break-all'}}>
                                            <span className="fw700 color-white fs-15 word-break-all">{tokenInfor.mainnet_circulating_supply ? numberFormat(tokenInfor.mainnet_circulating_supply) : 0}</span>
                                        </p>
                                    </div>
                                </div>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>

                <FlexboxGrid>
                    <StatsSection totalTxs={totalTxs} blockHeight={blockHeight} blockList={tpsCalculateBlocks} />
                </FlexboxGrid>

                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item className="section-left" componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: '20px' }}>
                        <div className="block-title">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p className="title color-white fs-24">{getLanguageString(language, 'LATEST_BLOCKS', 'TEXT')}</p>
                            </div>
                            <Button className="transparent-btn" onClick={() => { history.push('/blocks') }} style={{marginRight: 0}}>{getLanguageString(language, 'VIEW_ALL', 'BUTTON')}</Button>
                        </div>
                        <BlockSection blockList={blocks} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="section-right" componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: '20px' }}>
                        <div className="block-title">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p className="title color-white fs-24">{getLanguageString(language, 'LATEST_TRANSACTIONS', 'TEXT')}</p>
                            </div>
                            <Button className="transparent-btn" onClick={() => { history.push('/txs') }} style={{marginRight: 0}}>{getLanguageString(language, 'VIEW_ALL', 'BUTTON')}</Button>
                        </div>
                        <TransactionSection transactionList={transactionList} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>

            </div>
        </React.Fragment>
    )
}

export default Home;