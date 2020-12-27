import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col, Tag } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import './blocks.css'
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../config';
import { Link, useHistory } from 'react-router-dom';
import { numberFormat } from '../../common/utils/number';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import SearchSection from '../../common/components/Header/SearchSection';
import { weiToKAI } from '../../common/utils/amount';

const { Column, HeaderCell, Cell } = Table;

const Blocks = () => {
    const [blocks, setBlocks] = useState([] as KAIBlock[])
    const [totalBlock, setTotalBlock] = useState(0)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const { isMobile } = useViewport()
    let history = useHistory();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchBlocks(page, size);
            setLoading(false)
        })()
    }, [page, size])

    useEffect(() => {
        const loop = setInterval(async () => {
            await fetchBlocks(page, size);
        }, TIME_INTERVAL_MILISECONDS)
        return () => clearInterval(loop);
    }, [page, size])

    const fetchBlocks = async (page: number, size: number) => {
        const blocks = await getBlocks(page, size);
        setTotalBlock(blocks.totalBlocks)
        setBlocks(blocks.blocks)
    }

    return (
        <div className="container block-container">
            <SearchSection />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="block-title" style={{ padding: '0px 5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon className="gray-highlight" icon="cubes" size={"2x"} />
                            <p style={{ marginLeft: '12px' }} className="title color-white">Blocks</p>
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="block-summary">
                       <Tag className="gray-tab-custom">Block #{numberFormat(blocks[blocks.length - 1]?.blockHeight || 0)} to #{numberFormat(blocks[0]?.blockHeight || 0)} (Total of {numberFormat(totalBlock)} blocks)</Tag>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    wordWrap
                                    hover={false}
                                    rowHeight={60}
                                    height={400}
                                    autoHeight
                                    data={blocks}
                                    loading={loading}
                                >
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Block</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        <Icon className="gray-highlight" icon="cubes" style={{ marginRight: '5px' }} />
                                                        <Link className="color-white" to={`/block/${rowData.blockHeight}`} >{numberFormat(rowData.blockHeight)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 130 : 0} verticalAlign="middle">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div><Icon className="orange-highlight" icon="clock-o" style={{ marginRight: '5px' }} /> {millisecondToHMS(rowData.age || 0)}</div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={4} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Proposer</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.validator.hash,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.validator.hash}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} verticalAlign="middle">
                                        <HeaderCell>Txs</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.transactions ? <span className="color-white">0</span> :
                                                            <Link className="color-white" to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(rowData.transactions)}</Link>
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Gas Used</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {numberFormat(rowData.gasUsed)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Gas Limit</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {numberFormat(rowData.gasLimit)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Rewards</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.rewards), 8)} KAI
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                </Table>
                                <TablePagination
                                    lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                    activePage={page}
                                    displayLength={size}
                                    total={totalBlock}
                                    onChangePage={setPage}
                                    onChangeLength={setSize}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default Blocks