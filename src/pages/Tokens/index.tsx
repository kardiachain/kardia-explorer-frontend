import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Table } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { TABLE_CONFIG } from '../../config';
import { getContractsList, ITokenContract } from '../../service';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import './tokens.css'
import { renderHashToRedirect, renderStringAndTooltip, convertValueFollowDecimal, numberFormat } from '../../common';
import unverified from '../../resources/unverified.svg';

const { Column, HeaderCell, Cell } = Table;

const Tokens = () => {
    const [loading, setLoading] = useState(false);
    const { isMobile } = useViewport();

    const [page, setPage] = useState(TABLE_CONFIG.page);
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault);


    const [tokens, setTokens] = useState<ITokenContract[]>([] as ITokenContract[])
    const [totalContract, setTotalContract] = useState(0);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getContractsList(page, size);
            setTokens(rs.contracts);
            setTotalContract(rs?.total);
            setLoading(false);
        })()
    }, [page, size])

    return (
        <div className="container txs-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Token Tracker KRC20
                        </div>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="unverified-note">
                            <img 
                            className="token-logo" 
                            style={{
                                width: 20,
                                height: 20,
                                marginTop: 0,
                                marginRight: 10
                            }} 
                            src={unverified} alt="kardiachain" />
                            <span style={{
                                color: 'white',
                                verticalAlign: 'bottom'
                            }}>Unverified Tokens</span>
                        </div>
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
                                        <HeaderCell>Token adress</HeaderCell>
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
                                                        { numberFormat(convertValueFollowDecimal(rowData.totalSupply, rowData.decimal)) }
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
                                    total={totalContract}
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
export default Tokens;