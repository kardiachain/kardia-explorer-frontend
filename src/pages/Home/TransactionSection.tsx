import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon, Whisper, Tooltip } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = ({ transactionList = [] }: {
    transactionList: KAITransaction[]
}) => {
    const { isMobile } = useViewport();
    const history = useHistory();
    return (
        <Panel shaded className="panel-bg-gray">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={390}
                        hover={false}
                        data={transactionList}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                            <HeaderCell><span style={{marginLeft: 40}}>Tx Hash</span></HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <span className="container-icon-left">
                                                <Icon icon="exchange" className="gray-highlight" />
                                            </span>
                                            <span className="container-content-right" style={{ display: 'inline-block' }}>
                                                {renderHashToRedirect({
                                                    hash: rowData.txHash,
                                                    headCount: isMobile ? 4 : 8,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                })}
                                                <div className="fs-12">{millisecondToHMS(rowData.age || 0)}</div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                            <HeaderCell><span style={{marginLeft: 40}}>Detail</span></HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <span className="container-icon-left">
                                                <Icon icon={rowData.toSmcAddr ? "file-text-o" : "arrow-circle-right"}className="gray-highlight" />
                                            </span>
                                            <span className="container-content-right">
                                                <span style={{ marginRight: 5, fontSize: 12 }}>From:</span>
                                                {renderHashToRedirect({
                                                    hash: rowData.from,
                                                    headCount: isMobile ? 4 : 8,
                                                    tailCount: 4,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/address/${rowData.from}`) }
                                                })}
                                                <div>
                                                    <span style={{ marginRight: 5, fontSize: 12 }}>To:</span>
                                                    {
                                                        !rowData.toSmcAddr ? (
                                                            <>
                                                                {renderHashToRedirect({
                                                                    hash: rowData.to,
                                                                    headCount: isMobile ? 4 : 8,
                                                                    tailCount: 4,
                                                                    showTooltip: false,
                                                                    callback: () => { history.push(`/address/${rowData.to}`) }
                                                                })}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.toSmcAddr}</Tooltip>}>
                                                                    <Link className="color-white" style={{ fontSize: 12}} to={`/address/${rowData.toSmcAddr}`}>{rowData.toSmcName}</Link>
                                                                </Whisper>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right" verticalAlign="middle" minWidth={isMobile ? 100 : 0} flexGrow={1}>
                            <HeaderCell>Value (KAI)</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            {numberFormat(weiToKAI(rowData.value))}
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
};

export default TransactionSection;