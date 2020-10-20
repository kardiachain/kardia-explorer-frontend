import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel } from 'rsuite';
import { millisecondToHMS, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport();
    let history = useHistory();
    useEffect(() => {
        (async () => {
            const transactions = await getTransactions(1, TABLE_CONFIG.limitDefault);
            setTransactionList(transactions)
        })()
    }, [])
    return (
        <Panel header="Latest transactions" shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        autoHeight
                        rowHeight={60}
                        height={400}
                        hover={false}
                        data={transactionList}
                        onRowClick={data => {
                            console.log(data);
                        }}
                    >
                        <Column width={isMobile ? 120 : 350}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>{renderHashToRedirect(rowData.txHash, isMobile ? 10 : 30, () => { history.push(`/tx?hash=${rowData.txHash}`) })}</div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 170 : 350}>
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>From: {renderHashToRedirect(rowData.from, isMobile ? 10 : 30, () => { })} </div>
                                            <div>To: {renderHashToRedirect(rowData.from, isMobile ? 10 : 30, () => { })}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right">
                            <HeaderCell>Value</HeaderCell>
                            <Cell dataKey="value" />
                        </Column>
                    </Table>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
};

export default TransactionSection;