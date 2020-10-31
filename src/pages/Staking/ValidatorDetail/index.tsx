import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, List, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { renderHashString } from '../../../common/utils/string';
import { useViewport } from '../../../context/ViewportContext';
import { getDelegationsByValidator, getValidator } from '../../../service/smc';
import { isLoggedIn } from '../../../service/wallet'
import './validator.css'
import { numberFormat } from '../../../common/utils/number';

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
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} style={{marginBottom: '30px'}}>
                    <div>
                        <Panel header={<h4>Validator information</h4>} shaded>
                            <List>
                                <List.Item>
                                    <span className="property-title">Address: </span> {renderHashString(validator?.address || '', 50)}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total Delegator: </span> {numberFormat(validator?.totalDels || 0)}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total staked amount: </span> {weiToKAI(validator?.totalStakedAmount)}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Voting Power: </span> {numberFormat(validator?.votingPower || 0)}
                                </List.Item>
                            </List>
                            <ButtonToolbar style={{marginTop: '30px'}}>
                                <Button appearance="primary"
                                    onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${valAddr}`) : history.push('/wallet') }}
                                >
                                    Delegate for this validator
                                </Button>
                            </ButtonToolbar>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={16}>
                    <div>
                        <Panel header={<h4>Delegators</h4>} shaded>
                            <Table
                                hover={false}
                                wordWrap
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column width={400} verticalAlign="middle">
                                    <HeaderCell>Delegator Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {renderHashString(rowData.address, 50)} </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Staked Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.stakeAmount)} KAI</div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Rewards Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.rewardsAmount)} KAI</div>
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