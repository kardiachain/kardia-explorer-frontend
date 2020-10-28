import React, { useEffect, useState } from 'react'
import { Alert, Button, ButtonToolbar, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { getValidatorsByDelegator, withdraw, withdrawReward } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {

    const [yourValidators, setYourValidators] = useState([] as YourValidator[])
    const myAccount = getAccount() as Account
    const [withdrawRewardsLoading, setWithdrawRewardsLoading] = useState('')
    const [withdrawLoading, setWithdrawLoading] = useState('')

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorsByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
        })()
    }, [myAccount.publickey]);

    const withdrawRewards = async (valAddr: string) => {
        setWithdrawRewardsLoading(valAddr)
        try {
            const withdrawTx = await withdrawReward(valAddr, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw rewards success.')
            } else {
                Alert.error('Withdraw rewards failed.')
            }
            setWithdrawRewardsLoading('')
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
            setWithdrawRewardsLoading('')
        }
    }

    const widthdraw = async (valAddr: string) => {
        setWithdrawLoading(valAddr)
        try {
            const withdrawTx = await withdraw(valAddr, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw success.')
            } else {
                Alert.error('Withdraw failed.')
            }
            setWithdrawLoading('')
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
            setWithdrawLoading('')
        }
    }

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
                                        <Button appearance="primary" onClick={() => {
                                            withdrawRewards(rowData.validatorAddr)
                                        }}
                                            loading={withdrawRewardsLoading === rowData.validatorAddr}>
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
                                        <Button appearance="primary"
                                        loading={withdrawLoading === rowData.validatorAddr }
                                        onClick={() => {widthdraw(rowData.validatorAddr)}}>
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