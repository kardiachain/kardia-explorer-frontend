import React from 'react';
import { Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { renderHashToRedirect, StakingIcon, weiToKAI, numberFormat } from '../../../common';
import { TABLE_CONFIG } from '../../../config';
import { useViewport } from '../../../context/ViewportContext';

const { Column, HeaderCell, Cell } = Table;

const DelegatorList = ({delegators, page, limit, loading, totalDelegators, setpage, setLimit} : {
    delegators: Delegator[];
    page: number;
    limit: number;
    loading: boolean;
    totalDelegators: number;
    setpage: (newPage: number) => void;
    setLimit: (newLimit: number) => void;
}) => {

    const { isMobile } = useViewport();
   
    return (
        <>
            <Table
                hover={false}
                wordWrap
                autoHeight
                rowHeight={() => 60}
                data={delegators}
                loading={loading}
            >
                <Column flexGrow={3} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Address</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div>
                                    {   
                                        renderHashToRedirect({
                                            hash: rowData.address,
                                            headCount: isMobile ? 5 : 20,
                                            tailCount: 4,
                                            showTooltip: false,
                                            redirectTo: `/address/${rowData.address}`
                                        })
                                    }
                                    {
                                        rowData.owner ? (
                                            <StakingIcon
                                                character="owner"
                                                style = {{
                                                    width: 50,
                                                    borderRadius:'8px',
                                                    marginTop:'4px'
                                                }}
                                                className="common"
                                                size='small'/>
                                        ) : <></>
                                    }
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Staked (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div> {numberFormat(weiToKAI(rowData.stakeAmount), 4)}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                    <HeaderCell>Rewards (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div> {numberFormat(weiToKAI(rowData.rewardsAmount), 4)}</div>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
            <TablePagination
                lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                activePage={page}
                displayLength={limit}
                total={totalDelegators}
                onChangePage={setpage}
                onChangeLength={setLimit}
            />
        </>
    );
}

export default DelegatorList;