import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import {
    SearchSection,
    StakingIcon,
    SortType,
    weiToKAI,
    numberFormat,
    renderHashToRedirect,
    renderStringAndTooltip
} from '../../common';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getAccounts } from '../../service';
import './style.css';

const { Column, HeaderCell, Cell } = Table;

const AccountList = () => {

    const { isMobile } = useViewport();
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
            setHolderAccounts(rs?.holderAccounts);
            setTotalAccount(rs?.totalAccount);
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
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Account
                        </div>
                        <div className="sub-title">
                            {numberFormat(totalAccount)} accounts found
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
                                    height={400}
                                    data={holderAccounts}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column width={70} verticalAlign="middle">
                                        <HeaderCell>Index</HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        {rowData.index}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 150 : 250} verticalAlign="middle">
                                        <HeaderCell><span style={{ marginLeft: 40 }}>Address</span></HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        <span className="container-icon-left">
                                                            <Icon icon={!rowData.isContract ? "exchange" : "file-text-o"} className="gray-highlight" />
                                                        </span>
                                                        <span className="container-content-right middle-vertical">
                                                            {
                                                                renderHashToRedirect({
                                                                    hash: rowData.address,
                                                                    headCount: isMobile ? 5 : 20,
                                                                    tailCount: 4,
                                                                    showTooltip: true,
                                                                    redirectTo: `/address/${rowData.address}`
                                                                })
                                                            }
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 150 : 250} verticalAlign="middle">
                                        <HeaderCell>Name</HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        {
                                                            renderStringAndTooltip({
                                                                str: rowData.name,
                                                                headCount: isMobile ? 12 : 25,
                                                                showTooltip: true
                                                            })
                                                        }
                                                        {
                                                            rowData.isInValidatorsList ? (
                                                                <StakingIcon
                                                                    color={rowData?.role?.classname}
                                                                    character={rowData?.role?.character}
                                                                    size='small' style={{ marginLeft: 5 }} />
                                                            ) : <></>
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 200} verticalAlign="middle">
                                        <HeaderCell>
                                            <span className="sort-button" onClick={handleSort}>
                                                <span>Balance (KAI)</span>
                                                <Icon style={{ marginLeft: 3 }} icon={sortType === SortType.ASC ? "arrow-up-line" : "arrow-down-line"} />
                                            </span>
                                        </HeaderCell>
                                        <Cell>
                                            {(rowData: HolderAccount) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.balance), 4)}
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