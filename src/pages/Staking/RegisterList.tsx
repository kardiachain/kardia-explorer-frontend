import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Icon, Table, Tag } from 'rsuite';
import Button from '../../common/components/Button';
import { formatAmount, weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { truncate } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service/wallet';
import './staking.css'

const { Column, HeaderCell, Cell } = Table;

const RegisterList = ({ registers = [] as Register[] }: { registers: Register[] }) => {

    let history = useHistory();
    const { isMobile } = useViewport();

    return (
        <div>
            <Table
                wordWrap
                hover={false}
                autoHeight
                data={registers}
            >
                <Column width={60} verticalAlign="middle">
                    <HeaderCell>Rank</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div className="rank-tab" style={{ backgroundColor: "#502052" }}>
                                    {rowData.rank}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                    <HeaderCell>Validator</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>
                                    { rowData.isProposer ? (
                                        <div className="verify-proposer-icon">
                                            <Icon icon="check-circle" size={"lg"} />
                                        </div>
                                    ) : <></>
                                    }
                                    <Link to={`/validator/${rowData?.address}`}>

                                        <div className="validator-title">
                                            <Tag className={rowData?.status.color} style={{marginRight: 5}}>
                                                {rowData?.status.content}
                                            </Tag>
                                            <span className="validator-name">{rowData.name}</span>
                                        </div>
                                        {/* <div className="validator-title">
                                            {
                                                rowData.name ? <span className="validator-name">{rowData.name}</span> : <></>
                                            }
                                            <div className="validator-address">{truncate(rowData.address, 10, 4)}</div>
                                        </div> */}
                                        <div className="validator-address">{truncate(rowData.address, 10, 4)}</div>
                                    </Link>
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Staked Amount</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))} KAI</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Voting power</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.votingPower || '0'} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 140 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Total Delegators</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle" align="center">
                    <HeaderCell>Commission</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{numberFormat(rowData?.commissionRate || 0, 2)} %</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={150} verticalAlign="middle" align="center">
                    <HeaderCell>Action</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
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

export default RegisterList;