import React from 'react'
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon, Button } from 'rsuite';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const BlockSection = ({ blockList = [] }: {
    blockList: KAIBlock[]
}) => {
    const { isMobile } = useViewport()
    const history = useHistory();
    console.log(blockList);
    
    return (
        <Panel shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        autoHeight
                        rowHeight={70}
                        height={400}
                        data={blockList}
                        hover={false}
                        wordWrap
                    >
                        <Column flexGrow={1}>
                            <HeaderCell>Block Height</HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon icon="cubes" style={{ marginRight: '10px' }} />
                                                {renderHashToRedirect({
                                                    hash: rowData.blockHeight,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/block/${rowData.blockHeight}`) }
                                                })}
                                            </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="center" flexGrow={2}>
                            <HeaderCell>Proposer</HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {
                                                renderHashToRedirect({
                                                    headCount: isMobile ? 10 : 15,
                                                    showTooltip: false,
                                                    hash: rowData.validator.hash,
                                                    callback: () => { history.push(`/address/${rowData.validator.hash}`) }
                                                })
                                            }
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={1} align="right">
                            <HeaderCell>Txn</HeaderCell>
                            <Cell dataKey="transactions">
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {
                                                !rowData.transactions ? '0' :
                                                renderHashToRedirect({
                                                    hash: rowData.transactions,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/txs?block=${rowData.blockHeight}`) }
                                                })
                                            }
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
                {/* <Button className="button-view-all" onClick={() => { history.push(`/blocks`) }}>View all blocks</Button> */}
            </FlexboxGrid>
        </Panel>
    )
}

export default BlockSection;