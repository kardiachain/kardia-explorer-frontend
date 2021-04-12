import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col, Whisper, Tooltip } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import './blocks.css'
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { Link } from 'react-router-dom';
import { TIME_INTERVAL_MILISECONDS, TABLE_CONFIG } from '../../config';
import { getBlocks } from '../../service';
import {
    millisecondToHMS,
    numberFormat,
    renderHashToRedirect,
    renderStringAndTooltip,
    SearchSection,
    weiToKAI
} from '../../common';

const { Column, HeaderCell, Cell } = Table;

const Blocks = () => {
    const [blocks, setBlocks] = useState([] as KAIBlock[])
    const [totalBlock, setTotalBlock] = useState(0)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const { isMobile } = useViewport()
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
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Blocks
                        </div>
                        <div className="sub-title">
                            Block #{numberFormat(blocks[blocks.length - 1]?.blockHeight || 0)} to #{numberFormat(blocks[0]?.blockHeight || 0)} (Total of {numberFormat(totalBlock)} blocks)
                        </div>
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
                                    <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                        <HeaderCell><span style={{ marginLeft: 40 }}>Block</span></HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        <span className="container-icon-left" style={{ lineHeight: '28px' }}>
                                                            <Icon icon="cubes" className="gray-highlight" />
                                                        </span>
                                                        <span className="container-content-right text-link">
                                                            <Link className="text-link text-bold" to={`/block/${rowData.blockHeight}`} >{numberFormat(rowData.blockHeight)}</Link>
                                                            <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 110 : 250} verticalAlign="middle">
                                        <HeaderCell>Proposer</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {
                                                            rowData.proposalName ? (
                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData?.proposalAddress || ''}</Tooltip>}>
                                                                    <Link className="text-link text-bold" to={`/address/${rowData?.proposalAddress || ''}`}>
                                                                        {
                                                                            renderStringAndTooltip({
                                                                                str: rowData?.proposalName || '',
                                                                                headCount: isMobile ? 12 : 25,
                                                                                showTooltip: true
                                                                            })
                                                                        }
                                                                    </Link>
                                                                </Whisper>
                                                            ) : (
                                                                    renderHashToRedirect({
                                                                        hash: rowData.proposalAddress,
                                                                        headCount: isMobile ? 5 : 10,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        redirectTo: `/address/${rowData.proposalAddress}`
                                                                    })
                                                                )
                                                        }
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
                                        <HeaderCell>Rewards (KAI)</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.rewards), 8)}
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