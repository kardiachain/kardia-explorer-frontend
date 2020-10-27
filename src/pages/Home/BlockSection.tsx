import React from 'react'
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon, Button } from 'rsuite';
import { millisecondToHMS, renderHashToRedirect, truncate } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const BlockSection = ({ blockList = [] }: {
    blockList: KAIBlock[]
}) => {
    const { isMobile } = useViewport()
    const history = useHistory();
    return (
        <Panel header="Latest blocks" shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        loading={blockList.length === 0}
                        autoHeight
                        rowHeight={70}
                        height={400}
                        data={blockList}
                        hover={false}
                    >
                        <Column width={150}>
                            <HeaderCell>Block height</HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon icon="th-large" />
                                                {/* {renderHashToRedirect(rowData.blockHeight, 30, 4, () => { history.push(`/block/${rowData.blockHeight}`) })} */}
                                                {renderHashToRedirect({
                                                    hash: rowData.blockHeight,
                                                    headCount: 30,
                                                    tailCount: 4,
                                                    callback: () => { history.push(`/block/${rowData.blockHeight}`) }
                                                })}
                                                </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 120 : 350}>
                            <HeaderCell>Proposer</HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {truncate(rowData.validator.hash, isMobile ? 10 : 30, 4)}
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={100}>
                            <HeaderCell>Txn</HeaderCell>
                            <Cell dataKey="transactions">
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {renderHashToRedirect({
                                                hash: rowData.transactions,
                                                headCount: 30,
                                                tailCount: 4,
                                                callback: () => { history.push(`/txs?block=${rowData.blockHeight}`) }
                                            })}
                                            {/* {renderHashToRedirect(rowData.transactions, 30, 4, () => { history.push(`/txs?block=${rowData.blockHeight}`) })} */}
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
                <Button className="button-view-all" onClick={() => {history.push(`/blocks`)}}>View all blocks</Button>
            </FlexboxGrid>
        </Panel>
    )
}

export default BlockSection;