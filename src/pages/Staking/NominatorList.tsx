import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table } from 'rsuite';
import Button from '../../common/components/Button';
import { StakingIcon } from '../../common/components/IconCustom';
import { formatAmount, weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { renderHashStringAndTooltip } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service/wallet';
import './staking.css'

const { Column, HeaderCell, Cell } = Table;

const NominatorList = ({ nominators = [] as Nominator[], loading = true }: { nominators: Nominator[]; loading: boolean }) => {

    let history = useHistory();
    const { isMobile } = useViewport();

    return (
        <div className="register-list-container">
            <Table
                wordWrap
                hover={false}
                autoHeight
                data={nominators}
                rowHeight={() => 80}
                loading={loading}
            >
                <Column width={60} verticalAlign="middle">
                    <HeaderCell>Rank</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <div className="rank-tab" style={{ backgroundColor: "#e8d21d" }}>
                                    {rowData.rank}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                    <HeaderCell>Validator</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <Link to={`/validator/${rowData?.address}`}>
                                    <div>
                                        <StakingIcon
                                            color={rowData?.role?.classname}
                                            character={rowData?.role?.character}
                                            size='small' style={{ marginRight: 5 }} />
                                        <span className="validator-name">{rowData.name}</span>
                                        <div className="validator-address">
                                            {renderHashStringAndTooltip(
                                                rowData.address,
                                                isMobile ? 10 : 15,
                                                4,
                                                true
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Staked Amount</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))} KAI</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Voting power</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <div>{rowData.votingPower || '0'} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Total Delegators</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Commission</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <div>{numberFormat(rowData?.commissionRate || 0, 2)} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={150} verticalAlign="middle" align="center">
                    <HeaderCell>Action</HeaderCell>
                    <Cell>
                        {(rowData: Nominator) => {
                            return (
                                <Button onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>Delegate</Button>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default NominatorList;