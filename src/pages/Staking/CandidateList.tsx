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

const CandidateList = ({ candidates = [] as Candidate[], loading = true }: { candidates: Candidate[]; loading: boolean }) => {

    let history = useHistory();
    const { isMobile } = useViewport();

    return (
        <div className="register-list-container">
            <Table
                wordWrap
                hover={false}
                autoHeight
                data={candidates}
                rowHeight={() => 90}
                loading={loading}
            >
                <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                    <HeaderCell>Validator</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <Link to={`/validator/${rowData?.address}`}>
                                <div>
                                    <div style={{display: 'inline-block', width: 50}}>
                                        <StakingIcon
                                            color={rowData?.role?.classname}
                                            character={rowData?.role?.character}
                                            size='normal' style={{ marginRight: 5 }} />
                                    </div>
                                    <div className="validator-info color-white">
                                        <div className="validator-name color-white">{rowData.name}</div>
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
                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Rank</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>
                                    {rowData.rank}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle">
                    <HeaderCell>Staked Amount</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))} KAI</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle">
                    <HeaderCell>Voting power</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{rowData.votingPower || '0'} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle">
                    <HeaderCell>Total Delegators</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                    <HeaderCell>Commission</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{numberFormat(rowData?.commissionRate || 0, 2)} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={150} verticalAlign="middle">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <Button className="kai-button-gray delegate-btn" onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>Delegate</Button>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default CandidateList;