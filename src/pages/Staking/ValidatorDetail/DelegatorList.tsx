import React from 'react';
import { Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { StakingIcon } from '../../../common/components/IconCustom';
import { weiToKAI } from '../../../common/utils/amount';
import { numberFormat } from '../../../common/utils/number';
import { renderHashToRedirect } from '../../../common/utils/string';
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
                <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                    <HeaderCell>Address</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    {   
                                        renderHashToRedirect({
                                            hash: rowData.address,
                                            headCount: isMobile ? 5 : 45,
                                            tailCount: 4,
                                            showTooltip: false,
                                            callback: () => { window.open(`/address/${rowData.address}`) }
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
                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                    <HeaderCell>Staked Amount</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div> {numberFormat(weiToKAI(rowData.stakeAmount), 4)} KAI</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                    <HeaderCell >Claimable Rewards</HeaderCell>
                    <Cell>
                        {(rowData: Delegator) => {
                            return (
                                <div> {numberFormat(weiToKAI(rowData.rewardsAmount), 4)} KAI</div>
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