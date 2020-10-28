import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { getValidatorsByDelegator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {

    const [yourValidators, setYourValidators] = useState([] as YourValidator[])
    const myAccount = getAccount() as Account

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorsByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
        })()
    }, [myAccount.publickey]);

    return (
        <div>
            <Panel header={<h4>Your validators</h4>} shaded>
                <Table
                    autoHeight
                    rowHeight={70}
                    data={yourValidators}
                >
                    <Column width={400} verticalAlign="middle">
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{rowData.validatorAddr}</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Stakes Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{weiToKAI(rowData.yourStakeAmount)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Rewards Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{weiToKAI(rowData.yourRewardAmount)} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Withdraw Rewards</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
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
                            {(rowData: YourValidator) => {
                                return (
                                    <ButtonToolbar>
                                        <Button color="violet">
                                            Withdraw
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