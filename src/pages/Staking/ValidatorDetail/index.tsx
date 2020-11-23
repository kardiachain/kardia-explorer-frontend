import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { renderHashToRedirect } from '../../../common/utils/string';
import { useViewport } from '../../../context/ViewportContext';
import { isLoggedIn } from '../../../service/wallet'
import './validator.css'
import { numberFormat } from '../../../common/utils/number';
import Button from '../../../common/components/Button';
import { getDelegationsByValidator, getValidator } from '../../../service/smc/staking';
import Helper from '../../../common/components/Helper';
import { HelperMessage } from '../../../common/constant/HelperMessage';

const { Column, HeaderCell, Cell } = Table;

const ValidatorDetail = () => {
    const { isMobile } = useViewport()
    const history = useHistory()
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const [validator, setValidator] = useState<ValidatorFromSMC>()
    const { valAddr }: any = useParams();

    useEffect(() => {
        getDelegationsByValidator(valAddr).then(setDelegators);
        getValidator(valAddr).then(setValidator)
    }, [valAddr]);

    return (
        <div className="container val-detail-container">
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} style={{ marginBottom: '30px' }}>
                    <div>
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="user-info" size={"2x"} />
                                <p style={{ marginLeft: '12px' }} className="title">Validator information</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <List>
                                <List.Item>
                                    <span className="property-title">Address: </span>
                                    <span className="property-content">
                                        {
                                            renderHashToRedirect({
                                                hash: validator?.address,
                                                headCount: isMobile ? 10 : 30,
                                                tailCount: 4,
                                                showTooltip: true,
                                                callback: () => { window.open(`/address/${validator?.address}`) }
                                            })
                                        }
                                    </span>
                                </List.Item>
                                <List.Item>
                                    <Helper style={{ marginRight: 5 }} info={HelperMessage.CommissionRate} />
                                    <span className="property-title">Commission: </span>
                                    <span className="property-content">
                                        {numberFormat(validator?.commission || 0, 2)} %
                                    </span>
                                </List.Item>
                                <List.Item bordered={false}>
                                    <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxRate} />
                                    <span className="property-title">Max Commission Rate: </span>
                                    <span className="property-content">
                                        {numberFormat(validator?.maxRate || 0, 2)} %
                                    </span>
                                </List.Item>
                                <List.Item bordered={false}>
                                    <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxChangeRate} />
                                    <span className="property-title">Max Change Commission Rate: </span>
                                    <span className="property-content">
                                        {numberFormat(validator?.maxChangeRate || 0, 2)} %
                                    </span>
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total Delegator: </span>
                                    <span className="property-content">
                                        {numberFormat(validator?.totalDels || 0)}
                                    </span>
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total staked amount: </span>
                                    <span className="property-content">
                                        {numberFormat(weiToKAI(validator?.totalStakedAmount))} KAI
                                    </span>
                                </List.Item>
                            </List>
                            <Button size="big" style={{ marginTop: '30px' }}
                                onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${valAddr}`) : history.push('/wallet') }}
                            >
                                Delegate for this validator
                            </Button>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={16}>
                    <div>
                        <div className="block-title" style={{ padding: '0px 5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon className="highlight" icon="people-group" size={"2x"} />
                                <p style={{ marginLeft: '12px' }} className="title">Delegators</p>
                            </div>
                        </div>
                        <Panel shaded>
                            <Table
                                hover={false}
                                wordWrap
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div>
                                                    {
                                                        renderHashToRedirect({
                                                            hash: rowData.address,
                                                            headCount: isMobile ? 5 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { window.open(`/address/${rowData.address}`) }
                                                        })
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
                                                <div> {numberFormat(weiToKAI(rowData.stakeAmount))} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell >Claimable Rewards</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {numberFormat(weiToKAI(rowData.rewardsAmount))} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default ValidatorDetail;