import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, Col, Divider, FlexboxGrid, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getValidatorsFromSMC } from '../../service/smc';
import { isLoggedIn } from '../../service/wallet';
import './staking.css'
import { numberFormat } from '../../common/utils/number';

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
        <div className="container validators-container">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={10} style={{marginBottom: isMobile ? '15px' : '0'}}>
                    <h3>Validators</h3>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={14} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <ButtonToolbar>
                        <Button appearance="primary"
                            onClick={() => { isLoggedIn() ? history.push("/wallet/staking/your-delegators") : history.push('/wallet') }}
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
                            wordWrap
                            hover={false}
                            autoHeight
                            rowHeight={70}
                            data={validators}
                        >
                            <Column minWidth={isMobile ? 120 : 300} flexGrow={2} verticalAlign="middle">
                                <HeaderCell>Validator</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>
                                                {renderHashToRedirect({
                                                    hash: rowData?.address,
                                                    headCount: isMobile ? 20 : 50,
                                                    tailCount: 4,
                                                    showTooltip: true,
                                                    callback: () => { history.push(`/validator/${rowData?.address}`) }
                                                })}
                                            </div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column minWidth={200} flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Total Staked Amount</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{weiToKAI(rowData.totalStakedAmount)} KAI</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column minWidth={100} flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Voting power</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{numberFormat(Number(rowData.votingPower)) || '0'}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column minWidth={100} flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Total Delegators</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{rowData.totalDels || '0'}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column minWidth={100} flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Commission</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <div>{`${rowData.commission || '0'} %`}</div>
                                        );
                                    }}
                                </Cell>
                            </Column>
                            <Column minWidth={100} flexGrow={1} verticalAlign="middle" align="center">
                                <HeaderCell>Action</HeaderCell>
                                <Cell>
                                    {(rowData: ValidatorFromSMC) => {
                                        return (
                                            <Button appearance="primary" onClick={() => { isLoggedIn() ? history.push(`/wallet/staking/${rowData.address}`) : history.push('/wallet') }}>Delegate</Button>
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