import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table } from 'rsuite';
import {
    renderHashStringAndTooltip,
    renderStringAndTooltip,
    Button,
    StakingIcon,
    formatAmount,
    weiToKAI,
    numberFormat
} from '../../common';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service';
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
                <Column flexGrow={3} minWidth={isMobile ? 200 : 250} verticalAlign="middle">
                    <HeaderCell><span style={{ marginLeft: 50 }}>Validator</span></HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <Link to={`/validator/${rowData?.address}`}>
                                    <div>
                                        <div style={{ display: 'inline-block', width: 50 }}>
                                            <StakingIcon
                                                color={rowData?.role?.classname}
                                                character={rowData?.role?.character}
                                                size='normal' style={{ marginRight: 5 }} />
                                        </div>
                                        <div className="validator-info color-white">
                                            <div className="validator-name">
                                                {
                                                    renderStringAndTooltip({
                                                        str: rowData.name,
                                                        headCount: isMobile ? 12 : 25,
                                                        showTooltip: false
                                                    })
                                                }
                                            </div>
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
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>Staked Amount (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>Total Delegators</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={100} verticalAlign="middle">
                    <HeaderCell>Commission (%)</HeaderCell>
                    <Cell>
                        {(rowData: Candidate) => {
                            return (
                                <div>{numberFormat(rowData?.commissionRate || 0, 2)}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={120} verticalAlign="middle">
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