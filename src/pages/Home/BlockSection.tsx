import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const BlockSection = ({ blockList = [] }: {
    blockList: KAIBlock[]
}) => {
    const { isMobile } = useViewport()
    const history = useHistory();
    return (
        <Panel shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={420}
                        data={blockList}
                        hover={false}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={isMobile ? 100 : 0}>
                            <HeaderCell>Block Height</HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon icon="cubes" className="highlight" style={{ marginRight: '10px' }} />
                                                <Link to={`/block/${rowData.blockHeight}`} >{numberFormat(Number(rowData.blockHeight))}</Link>
                                            </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0}>
                            <HeaderCell>Proposer</HeaderCell>
                            <Cell>
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {
                                                renderHashToRedirect({
                                                    headCount: isMobile ? 5 : 12,
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
                                                <Link to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(Number(rowData.transactions))}</Link>
                                            }
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
}

export default BlockSection;