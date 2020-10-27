import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, Col, Divider, FlexboxGrid, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getValidatorsFromSMC } from '../../service/smc';
import { isLoggedIn } from '../../service/wallet';
import './validators.css'

const { Column, HeaderCell, Cell } = Table;
const Validators = () => {
    let history = useHistory();
    const { isMobile } = useViewport()
    const [validators, setValidators] = useState([] as ValidatorFromSMC[])
    useEffect(() => {
        (async () => {
            const valFromSmc = await getValidatorsFromSMC()
            setValidators(valFromSmc)
        })()
    }, []);
    return (
        <div className="validators-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <h3>Validators</h3>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ textAlign: 'right' }}>
                    <ButtonToolbar>
                        <Button color="violet"
                            onClick={() => { isLoggedIn() ? history.push("/dashboard/staking") : history.push('/wallet') }}
                        >
                            Register to become validator
                        </Button>
                    </ButtonToolbar>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <Divider />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
                        <Table
                            hover={false}
                            autoHeight
                            rowHeight={70}
                            data={validators}
                        >
                            <Column width={isMobile ? 120 : 450} verticalAlign="middle">
                                <HeaderCell>Validator</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>
                                                {renderHashToRedirect(rowData.address, isMobile ? 20 : 50, () => { history.push(`/validator/${rowData.address}`) })}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column width={200} verticalAlign="middle">
                                <HeaderCell>Voting power</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{weiToKAI(rowData.votingPower)} KAI</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column width={200} verticalAlign="middle">
                                <HeaderCell>Commission</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{`${rowData.commission} %`}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column width={200} verticalAlign="middle">
                                <HeaderCell>Action</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <Button color="violet" onClick={() => { isLoggedIn() ? history.push(`/dashboard/validator/${rowData.address}`) : history.push('/wallet') }}>Delegate</Button>
                                        );
                                    }}
                                </Cell>
                            </Column>
                        </Table>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}
export default Validators;