import React, { useEffect, useState } from 'react';
import './home.css'
import { Divider, FlexboxGrid, Col } from 'rsuite';
import TransactionSection from './TransactionSection';
import BlockSection from './BlockSection';
import { getBlocks, getTransactions } from '../../service/kai-explorer';
import { BLOCK_COUNT_FOR_CHART, BLOCK_NUMBER_FOR_CAL_TPS, RECORDS_NUMBER_SHOW_HOMEPAGE, TABLE_CONFIG } from '../../config';
import BlockTimeChart from './BlockTimeChart';
import StatsSection from './StatsSection';
import { useViewport } from '../../context/ViewportContext';


const Home = () => {

    const [blockHeight, setBlockHeight] = useState(0)
    const [tpsCalculateBlocks, setTpsCalculateBlocks] = useState<KAIBlock[]>([]);
    const [blocks, setBlocks] = useState<KAIBlock[]>([]);
    const [blocksForChart, setBlocksForChart] = useState<KAIBlock[]>([]);
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const [totalTxs, setTotalTxs] = useState(0)

    const {isMobile} = useViewport()
    
    const fetchBlockChart = async () => {
        // Get transaction
        const transactionsResponse = await getTransactions(TABLE_CONFIG.page, RECORDS_NUMBER_SHOW_HOMEPAGE);
        setTransactionList(transactionsResponse.transactions);
        setTotalTxs(transactionsResponse.totalTxs);

        // Get blocks
        const blockList = await getBlocks(TABLE_CONFIG.page, BLOCK_COUNT_FOR_CHART)
        blockList[0] && setBlockHeight(blockList[0].blockHeight)
        const originBlockList = JSON.parse(JSON.stringify(blockList))

        // Get block for calculate tps
        setTpsCalculateBlocks(originBlockList.slice(originBlockList.length - BLOCK_NUMBER_FOR_CAL_TPS))

        // Get block for block list
        setBlocks(originBlockList.slice(0, RECORDS_NUMBER_SHOW_HOMEPAGE))

        // Get blocks for block time chart
        setBlocksForChart(blockList.reverse())
    }
    
    useEffect(() => {
        const loop = setInterval(fetchBlockChart, 2000)
        return () => {
            clearInterval(loop)
        }
    }, [])

    return (
        <React.Fragment>
            <div className="container home-container">
                <div className="home-top-section">
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                            <BlockTimeChart blockList={blocksForChart} />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                            <StatsSection totalTxs={totalTxs} blockHeight={blockHeight} blockList={tpsCalculateBlocks} />
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
                {isMobile && <Divider />}
                <FlexboxGrid justify="space-between" style={{marginTop: !isMobile ? '30px' : '0' }}>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={10} sm={24} style={{marginBottom: '20px'}}>
                        <BlockSection blockList={blocks} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={14} sm={24} style={{marginBottom: '20px'}}>
                        <TransactionSection transactionList={transactionList} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Divider />
            </div>
        </React.Fragment>
    )
}

export default Home;