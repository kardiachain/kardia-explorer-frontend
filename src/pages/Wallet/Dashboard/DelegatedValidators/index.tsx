import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Panel, Table } from 'rsuite';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidatorsByDelegator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {

    const { isMobile } = useViewport()
    const [validators, setValidators] = useState([] as ValidatorFromSMC[])
    const myAccount = getAccount() as Account

    useEffect(() => {
        (async () => {
            const valFromSmc = await getValidatorsByDelegator(myAccount.publickey)
            setValidators(valFromSmc)
        })()
    }, [myAccount.publickey]);

    return (
        <div>
            <Panel header={<h4>Your validators</h4>} shaded>
                <Table
                    autoHeight
                    rowHeight={70}
                    data={validators}
                >
                    <Column width={isMobile ? 200 : 400} verticalAlign="middle">
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <div>{rowData.address}</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Your delegate amount</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <div>0</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Your rewards</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <div>0</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Withdraw Rewards</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <ButtonToolbar>
                                        <Button color="violet">
                                            Withdraw Rewards
                                        </Button>
                                    </ButtonToolbar>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Withdraw </HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <ButtonToolbar>
                                        <Button color="violet">
                                            Withdraw All
                                        </Button>
                                    </ButtonToolbar>
                                )
                            }}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        </div>
    )
}

export default Delegator;