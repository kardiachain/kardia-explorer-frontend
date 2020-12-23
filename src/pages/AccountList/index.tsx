import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import SearchSection from '../../common/components/Header/SearchSection';
import { SortType } from '../../common/constant';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getAccounts } from '../../service/kai-explorer';
import './style.css';

const { Column, HeaderCell, Cell } = Table;

const AccountList = () => {

    const { isMobile } = useViewport();
    const history = useHistory();
    const [holderAccounts, setHolderAccounts] = useState([] as HolderAccount[]);
    const [page, setPage] = useState(TABLE_CONFIG.page);
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault);
    const [totalAccount, setTotalAccount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortType, setSortType] = useState(SortType.ASC);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getAccounts(page, size, sortType);
            setHolderAccounts(rs.holderAccounts);
            setTotalAccount(rs.totalAccount);
            setLoading(false);
        })()
    }, [page, size, sortType])

    const handleSort = () => {
        if (sortType === SortType.ASC) {
            setSortType(SortType.DSC);
        } else {
            setSortType(SortType.ASC);
        }
    }

    return (
            <div className="container txs-container">
            <SearchSection />
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="vcard" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Accounts</p>
                </div>
            </div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    rowHeight={60}
                                    height={400}
                                    data={holderAccounts}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column flexGrow={4} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Address</HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        {rowData.isContract ? <Icon icon="file-text-o" style={{ marginRight: '5px' }} /> : <></>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.address,
                                                            headCount: isMobile ? 5 : 45,
                                                            tailCount: 4,
                                                            showTooltip: false,
                                                            callback: () => { history.push(`/address/${rowData.address}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    {/* <Column flexGrow={2} minWidth={isMobile ? 70 : 0} verticalAlign="middle">
                                        <HeaderCell>Name</HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        {rowData.name}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column> */}
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>
                                            <span className="sort-button" onClick={handleSort}>
                                                <span>Balance</span>
                                                <Icon style={{marginLeft: 3}} icon={sortType === SortType.ASC ? "arrow-up-line" : "arrow-down-line"} />
                                            </span>
                                        </HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                    {numberFormat(weiToKAI(rowData.balance), 4)} KAI
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
                                    total={totalAccount}
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

export default AccountList;