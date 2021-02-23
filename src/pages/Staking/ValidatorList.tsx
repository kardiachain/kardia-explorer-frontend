import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Table } from 'rsuite';
import languageAtom from '../../atom/language.atom';
import Button from '../../common/components/Button';
import { StakingIcon } from '../../common/components/IconCustom';
import { formatAmount, weiToKAI } from '../../common/utils/amount';
import { getLanguageString } from '../../common/utils/lang';
import { numberFormat } from '../../common/utils/number';
import { renderHashStringAndTooltip, renderStringAndTooltip } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service/wallet';
import './staking.css'

const { Column, HeaderCell, Cell } = Table;

const ValidatorList = ({ validators = [] as Validator[], loading = true }: {
    validators: Validator[];
    loading: boolean;
}) => {
    let history = useHistory();
    const { isMobile } = useViewport();
    const language = useRecoilValue(languageAtom)

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
                    <HeaderCell><span style={{marginLeft: 50}}>{getLanguageString(language, 'VALIDATOR', 'TEXT')}</span></HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
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
                    <HeaderCell>{getLanguageString(language, 'RANK', 'TEXT')}</HeaderCell>
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
                    <HeaderCell>{getLanguageString(language, 'STAKED_AMOUNT_KAI', 'TEXT')}</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{formatAmount(Number(weiToKAI(rowData.stakedAmount)))}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>{getLanguageString(language, 'VOTING_POWER', 'TEXT')} (%)</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.votingPower || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={140} verticalAlign="middle">
                    <HeaderCell>{getLanguageString(language, 'DELEGATORS', 'TEXT')}</HeaderCell>
                    <Cell>
                        {(rowData: Validator) => {
                            return (
                                <div>{rowData.totalDelegators || '0'}</div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={100} verticalAlign="middle">
                    <HeaderCell>{getLanguageString(language, 'COMMISSION', 'TEXT')} (%)</HeaderCell>
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
                                <Button className="kai-button-gray delegate-btn" onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>
                                    {getLanguageString(language, 'DELEGATE', 'BUTTON')}
                                </Button>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default ValidatorList;