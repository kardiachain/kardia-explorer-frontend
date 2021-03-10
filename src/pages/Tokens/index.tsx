import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Table } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { TABLE_CONFIG } from '../../config';
import { getContractsList } from '../../service/kai-explorer';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import './tokens.css'
import { ITokenContract } from '../../service/kai-explorer/tokens/type';
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
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    rowHeight={60}
                                    data={tokens}
                                    autoHeight
                                    hover={false}
                                    wordWrap
                                    loading={loading}
                                >
                                    <Column flexGrow={4} minWidth={250} verticalAlign="middle">
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
                                                            <Link className="token-name" to={`/token/${rowData?.address}`}>{rowData.name}</Link>
                                                            <div className="token-address">{rowData.address}</div>
                                                            <div className="token-info">
                                                                {rowData.info && rowData.info.length > 100 ? `${rowData.info.substr(0, 100)}...` : rowData.info}
                                                            </div>
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} minWidth={isMobile ? 70 : 100} verticalAlign="middle">
                                        <HeaderCell>Type</HeaderCell>
                                        <Cell>
                                            {(rowData: ITokenContract) => {
                                                return (
                                                    <div>
                                                        {rowData.type}
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