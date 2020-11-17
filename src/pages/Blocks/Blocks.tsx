import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col } from 'rsuite';
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

const { Column, HeaderCell, Cell } = Table;

const Blocks = () => {
    const [blocks, setBlocks] = useState([] as KAIBlock[])
    const [latestBlock, setLatestBlock] = useState<KAIBlock>()
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
        setLatestBlock(blocks[0])
        setBlocks(blocks)
    }

    return (
        <div className="container block-container">
            <SearchSection />
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="cubes" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Blocks</p>
                </div>
            </div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
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
                                                        <Icon className="highlight" icon="cubes" style={{ marginRight: '5px' }} />
                                                        <Link to={`/block/${rowData.blockHeight}`} >{numberFormat(Number(rowData.blockHeight))}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div><Icon className="highlight" icon="clock-o" style={{ marginRight: '5px' }} /> {millisecondToHMS(rowData.age || 0)}</div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Block Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.blockHash,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/block/${rowData.blockHash}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
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
                                                            !rowData.transactions ? '0' :
                                                                <Link to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(Number(rowData.transactions))}</Link>
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
                                </Table>
                                <TablePagination
                                    lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                    activePage={page}
                                    displayLength={size}
                                    total={latestBlock?.blockHeight}
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