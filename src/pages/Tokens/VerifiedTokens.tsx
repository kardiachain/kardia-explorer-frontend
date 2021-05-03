import React from 'react'
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { convertValueFollowDecimal, numberFormat, renderHashToRedirect, renderStringAndTooltip } from '../../common';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { ITokenContract } from '../../service';


const { Column, HeaderCell, Cell } = Table;

export const VerifiedTokens = ({tokens, totalTokens, loading, size, page, setSize, setPage}: {
    tokens: ITokenContract[];
    totalTokens: number;
    loading: boolean;
    size: number;
    setSize: (_size: number) => void;
    page: number;
    setPage: (_page: number) => void;
}) => {

    const { isMobile } = useViewport();

    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Table
                    rowHeight={() => 80}
                    data={tokens}
                    autoHeight
                    hover={false}
                    wordWrap
                    loading={loading}
                >
                    <Column flexGrow={3} minWidth={270} verticalAlign="middle">
                        <HeaderCell>Token</HeaderCell>
                        <Cell>
                            {(rowData: ITokenContract) => {
                                return (
                                    <div>
                                        <img
                                            className="token-logo"
                                            src={rowData.logo}
                                            alt="kardiachain" />
                                        <span className="container-content-right">
                                            <Link className="token-name" to={`/token/${rowData?.address}`}>
                                                {
                                                    renderStringAndTooltip({
                                                        str: rowData.name,
                                                        headCount: isMobile ? 12 : 25,
                                                        showTooltip: true
                                                    })
                                                }
                                            </Link>
                                            <div className="token-info">
                                                {
                                                    renderStringAndTooltip({
                                                        str: rowData.info,
                                                        headCount: isMobile ? 12 : 30,
                                                        showTooltip: true
                                                    })
                                                }
                                            </div>
                                        </span>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={100} verticalAlign="middle">
                        <HeaderCell>Symbol</HeaderCell>
                        <Cell>
                            {(rowData: ITokenContract) => {
                                return (
                                    <div>
                                        {rowData.tokenSymbol}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={100} verticalAlign="middle">
                        <HeaderCell>Decimals</HeaderCell>
                        <Cell>
                            {(rowData: ITokenContract) => {
                                return (
                                    <div>
                                        {rowData.decimal}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Token address</HeaderCell>
                        <Cell>
                            {(rowData: ITokenContract) => {
                                return (
                                    <div>
                                        {
                                            renderHashToRedirect({
                                                hash: rowData.address,
                                                headCount: isMobile ? 5 : 12,
                                                tailCount: 4,
                                                showTooltip: true,
                                                redirectTo: `/address/${rowData.address}`
                                            })
                                        }
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} minWidth={100} verticalAlign="middle">
                        <HeaderCell>Total Supply</HeaderCell>
                        <Cell>
                            {(rowData: ITokenContract) => {
                                return (
                                    <div>
                                        { numberFormat(convertValueFollowDecimal(rowData.totalSupply, rowData.decimal))}
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
                    total={totalTokens}
                    onChangePage={setPage}
                    onChangeLength={setSize}
                />
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}