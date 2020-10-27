import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, List, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { renderHashString } from '../../../common/utils/string';
import { useViewport } from '../../../context/ViewportContext';
import { getDelegationsByValidator } from '../../../service/smc';
import { isLoggedIn } from '../../../service/wallet'
import './validator.css'

const { Column, HeaderCell, Cell } = Table;

const ValidatorDetail = () => {
    const { isMobile } = useViewport()
    const history = useHistory()
    const [delegators, setDelegators] = useState([] as Delegator[]);
    const { valAddr }: any = useParams();

    useEffect(() => {
        getDelegationsByValidator(valAddr).then(rs => {
            setDelegators(rs)
        });
    }, [valAddr]);

    return (
        <div className="val-detail-container">
            <FlexboxGrid>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                    <div className="val-info-container">
                        <Panel header={<h4>Validator information</h4>} shaded>
                            <List>
                                <List.Item>
                                    <span className="property-title">Address: </span> {valAddr}
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Commission: </span> 5%
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Total delegator: </span> 100
                                </List.Item>
                                <List.Item>
                                    <span className="property-title">Voting power: </span> 100
                                </List.Item>
                            </List>
                            <ButtonToolbar style={{marginTop: '30px'}}>
                                <Button color="violet"
                                    onClick={() => { isLoggedIn() ? history.push(`/dashboard/staking/${valAddr}`) : history.push('/wallet') }}
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
                                autoHeight
                                rowHeight={60}
                                data={delegators}
                            >
                                <Column width={isMobile ? 120 : 500} verticalAlign="middle">
                                    <HeaderCell>Address</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={isMobile ? 120 : 300} verticalAlign="middle">
                                    <HeaderCell>Delegate Amount</HeaderCell>
                                    <Cell>
                                        {(rowData: Delegator) => {
                                            return (
                                                <div> {weiToKAI(rowData.delegationsShares)} KAI</div>
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