import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
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
        <Panel shaded className="panel-bg-gray">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={390}
                        data={blockList}
                        hover={false}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                            <HeaderCell><span style={{marginLeft: 40}}>Block Height</span></HeaderCell>
                            <Cell dataKey="blockHeight" >
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            <span className="container-icon-left" style={{lineHeight: '28px'}}>
                                                <Icon icon="cubes" className="gray-highlight"/>
                                            </span>
                                            <span className="container-content-right">
                                                <Link className="color-white text-bold" to={`/block/${rowData.blockHeight}`} >{numberFormat(rowData.blockHeight)}</Link>
                                                <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                            </span>
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
                                        <>
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
                                            <div>
                                            {
                                                !rowData.transactions ? <span className="sub-text">0 Txns</span>  :
                                                <Link className="sub-text" to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(rowData.transactions)} Txns</Link>
                                            }
                                            </div>
                                        </>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={110} align="right" verticalAlign="middle">
                            <HeaderCell>Rewards (KAI)</HeaderCell>
                            <Cell dataKey="transactions">
                                {(rowData: KAIBlock) => {
                                    return (
                                        <div>
                                            {
                                                !rowData.rewards ? '0' :
                                                numberFormat(weiToKAI(rowData.rewards), 8)
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