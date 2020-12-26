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


const Home = () => {

    const [blockHeight, setBlockHeight] = useState(0)
    const [tpsCalculateBlocks, setTpsCalculateBlocks] = useState<KAIBlock[]>([]);
    const [blocks, setBlocks] = useState<KAIBlock[]>([]);
    const [blocksForChart, setBlocksForChart] = useState<KAIBlock[]>([]);
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const [totalTxs, setTotalTxs] = useState(0)
    const [tokenInfor, setTokenInfor] = useState({} as KaiToken)

    const history = useHistory();

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
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{marginRight: !isMobile ? 5 : 0}} className="wrap-token bocktime-chart-container">
                            <BlockTimeChart blockList={blocksForChart} />
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{marginLeft: !isMobile ? 5 : 0}} className="wrap-token">
                            <Panel shaded className="_wrap panel-bg-gray">
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="rocket" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight">Symbol:</p>
                                        <p className="mt0 fw700 color-white">KAI</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="usd" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight">Price:</p>
                                        <p className="mt0 fw700 color-white">$ {tokenInfor.price ? numberFormat(tokenInfor.price as number, 6) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="line-chart" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p>Market Cap:</p>
                                        <p className="mt0 fw700 color-white">$ {tokenInfor.price ? numberFormat(tokenInfor.market_cap, 3) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="signal" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight">Volume 24h:</p>
                                        <p className="mt0 fw700 color-white">$ {tokenInfor.volume_24h ? numberFormat(tokenInfor.volume_24h as number, 3) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="refresh" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p>Circulating Supply:</p>
                                        <p className="mt0 fw700 color-white">{tokenInfor.circulating_supply ? numberFormat(tokenInfor.circulating_supply) : ''}</p>
                                    </div>
                                </div>
                                <div className="token-infor">
                                    <div className="left">
                                        <Icon className="gray-highlight" icon="database" size={"2x"} />
                                    </div>
                                    <div className="right">
                                        <p className="color-graylight">Total Supply:</p>
                                        <p className="mt0 fw700 color-white">{tokenInfor.total_supply ? numberFormat(tokenInfor.total_supply as number) : ''}</p>
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
                                <Icon className="gray-highlight" icon="th-large" size={"lg"} />
                                <p style={{ marginLeft: '12px' }} className="title color-white">Latest Blocks</p>
                            </div>
                            <Button onClick={() => { history.push('/blocks') }} style={{marginRight: 0}}>View all</Button>
                        </div>
                        <BlockSection blockList={blocks} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="section-right" componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: '20px' }}>
                        <div className="block-title">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="gray-highlight" icon="exchange" size={"lg"} />
                                <p style={{ marginLeft: '12px' }} className="title color-white">Latest Transactions</p>
                            </div>
                            <Button onClick={() => { history.push('/txs') }} style={{marginRight: 0}}>View all</Button>
                        </div>
                        <TransactionSection transactionList={transactionList} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>

            </div>
        </React.Fragment>
    )
}

export default Home;