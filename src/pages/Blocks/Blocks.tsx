import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col, Divider } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import './blocks.css'
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../config';
import { useHistory } from 'react-router-dom';
import { numberFormat } from '../../common/utils/number';
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
            const blocks = await getBlocks(page, size);
            setLoading(false)
            setLatestBlock(blocks[0])
            setBlocks(blocks)
        })()
    }, [page, size])

    return (
        <div className="container block-container">
            <h3>Blocks</h3>
            <Divider />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    wordWrap
                                    virtualized
                                    hover={false}
                                    rowHeight={60}
                                    height={400}
                                    autoHeight
                                    data={blocks}
                                    loading={loading}
                                >
                                    <Column width={100}>
                                        <HeaderCell>Block</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div> <Icon icon="cubes" style={{ marginRight: '5px' }} />
                                                        {renderHashToRedirect({
                                                            hash: rowData.blockHeight,
                                                            headCount: isMobile ? 20 : 45,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/block/${rowData.blockHeight}`) }
                                                        })} </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={150}>
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>{millisecondToHMS(rowData.age || 0)}</div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={450}>
                                        <HeaderCell>Block Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.blockHash,
                                                            headCount: isMobile ? 20 : 45,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/block/${rowData.blockHash}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={450}>
                                        <HeaderCell>Proposer</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.validator.hash,
                                                            headCount: isMobile ? 20 : 45,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/address/${rowData.validator.hash}`) }
                                                        })}                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={100}>
                                        <HeaderCell>Txn</HeaderCell>
                                        <Cell>
                                            {(rowData: KAIBlock) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.transactions,
                                                            headCount: 20,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/txs?block=${rowData.blockHeight}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={100}>
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
                                    <Column width={100}>
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