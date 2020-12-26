import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon, Whisper, Tooltip } from 'rsuite';
import { StakingIcon } from '../../common/components/IconCustom';
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
                        height={420}
                        hover={false}
                        data={transactionList}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon className="gray-highlight" icon="exchange" style={{ marginRight: '10px' }} />
                                                {renderHashToRedirect({
                                                    hash: rowData.txHash,
                                                    headCount: isMobile ? 4 : 8,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                })}
                                            </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={isMobile ? 150 : 0}>
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>
                                                <span style={{marginRight: 5}}>From:</span>
                                                {renderHashToRedirect({
                                                    hash: rowData.from,
                                                    headCount: isMobile ? 4 : 8,
                                                    tailCount: 4,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/address/${rowData.from}`) }
                                            })}
                                            </div>
                                            <div>
                                                {
                                                    !rowData.toSmcAddr ? (
                                                        <>
                                                            <Icon className="gray-highlight" icon="arrow-circle-right" style={{ marginRight: '5px' }} /><span style={{marginRight: 5}}> To:</span>
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
                                                                <Icon className="gray-highlight" icon="file-text-o" style={{ marginRight: '5px' }} />To:
                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.toSmcAddr}</Tooltip>}>
                                                                    <Link className="color-white" style={{marginLeft: 5, fontSize: 12, fontWeight: 'bold'}} to={`/address/${rowData.toSmcAddr}`}>{rowData.toSmcName}</Link>
                                                                </Whisper>
                                                                {
                                                                    rowData.isInValidatorsList ? (
                                                                        <StakingIcon
                                                                            color={rowData?.role?.classname}
                                                                            character={rowData?.role?.character}
                                                                            size='small' style={{ marginLeft: 5 }} />

                                                                    ) : <></>
                                                                }
                                                            </>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right" verticalAlign="middle" minWidth={isMobile ? 100 : 0} flexGrow={1}>
                            <HeaderCell>Value</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            {numberFormat(weiToKAI(rowData.value))} KAI
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