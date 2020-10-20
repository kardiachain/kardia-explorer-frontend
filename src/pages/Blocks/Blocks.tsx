import React, { useEffect, useState } from 'react'
import { Panel, FlexboxGrid, Table, Icon, Col, Divider } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';
import { millisecondToHMS, renderHashString, renderHashToRedirect, truncate } from '../../common/utils/string';
import './blocks.css'
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../config';
import { useHistory } from 'react-router-dom';
const { Column, HeaderCell, Cell } = Table;

const Blocks = () => {
    const [blocks, setBlocks] = useState([] as KAIBlock[])
    const [blockLastest, setBlockLastest] = useState({} as KAIBlock)
    const [activePage, setActivePage] = useState(1)
    const { isMobile } = useViewport()
    let history = useHistory();

    useEffect(() => {
        (async () => {
            const blocks = await getBlocks(TABLE_CONFIG.skipDefault, TABLE_CONFIG.limitDefault);
            setBlockLastest(blocks[0])
            setBlocks(blocks)
        })()
    }, [])

    const handleChangePage = async (dataKey: number) => {
        const blocks = await getBlocks(dataKey, TABLE_CONFIG.limitDefault);
        setActivePage(dataKey)
        setBlockLastest(blocks[0])
        setBlocks(blocks)
    }

    const handleChangeLength = async (size: number) => {
        const blocks = await getBlocks(TABLE_CONFIG.skipDefault, size);
        setActivePage(TABLE_CONFIG.skipDefault)
        setBlockLastest(blocks[0])
        setBlocks(blocks)
    }

    return (
        <React.Fragment>
            <div className="block-container">
                <h3>Blocks</h3>
                <Divider />
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                        <Panel shaded>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                    <Table
                                        virtualized
                                        hover={false}
                                        rowHeight={60}
                                        height={650}
                                        data={blocks}
                                        onRowClick={data => {
                                            // history.push(`/block?block=${data.blockHash}`)
                                            console.log(data);
                                        }}
                                    >
                                        <Column width={100}>
                                            <HeaderCell>Block</HeaderCell>
                                            <Cell>
                                                {(rowData: KAIBlock) => {
                                                    return (
                                                        <div> <Icon icon="th-large" /> {renderHashToRedirect(rowData.blockHeight, isMobile ? 20 : 45, () => { history.push(`/block?block=${rowData.blockHeight}`) })} </div>
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
                                        <Column width={isMobile ? 120 : 400}>
                                            <HeaderCell>Block Hash</HeaderCell>
                                            <Cell>
                                                {(rowData: KAIBlock) => {
                                                    return (
                                                        <div>
                                                            {renderHashToRedirect(rowData.blockHash, isMobile ? 20 : 45, () => { history.push(`/block?block=${rowData.blockHash}`) })}
                                                        </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column width={isMobile ? 120 : 400}>
                                            <HeaderCell>Block validator</HeaderCell>
                                            <Cell>
                                                {(rowData: KAIBlock) => {
                                                    return (
                                                        <div>
                                                            {renderHashToRedirect(rowData.validator.hash, isMobile ? 20 : 45, () => { })}
                                                        </div>
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
                                                            {renderHashToRedirect(rowData.transactions, 20, () => { })}
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
                                                            {rowData.gasUsed}
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
                                                            {rowData.gasLimit}
                                                        </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                    </Table>
                                    <TablePagination
                                        lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                        activePage={activePage}
                                        displayLength={10}
                                        total={blockLastest.blockHeight || 0}
                                        onChangePage={handleChangePage}
                                        onChangeLength={handleChangeLength}
                                    />
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </React.Fragment>
    )
}

export default Blocks