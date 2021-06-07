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
import { useTranslation } from 'react-i18next';

const { Column, HeaderCell, Cell } = Table;

const ValidatorList = ({ validators = [] as Validator[], loading = true }: {
    validators: Validator[];
    loading: boolean;
}) => {
    let history = useHistory();
    const { isMobile } = useViewport();
    const { t } = useTranslation()

    return (
        <div>
            <Table
                wordWrap
                hover={false}
                autoHeight
                rowHeight={() => 80}
                data={validators}
                loading={loading}
            >
                <Column flexGrow={3} minWidth={isMobile ? 200 : 250} verticalAlign="middle">
                    <HeaderCell><span style={{ marginLeft: 50 }}>{t('validator')}</span></HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
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
                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>{t('rank')}</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>
                                    {rowData.rank}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>{t('stakedAmount')} (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>{t('votingPower')} (%)</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.votingPower || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>{t('delegators')}</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={100} verticalAlign="middle">
                    <HeaderCell>{t('commission')} (%)</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{numberFormat(rowData?.commissionRate || 0, 2)}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={120} verticalAlign="middle">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <Button className="kai-button-gray delegate-btn" onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>{t('delegate')}</Button>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default ValidatorList;