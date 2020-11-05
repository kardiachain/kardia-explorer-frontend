import React, { useEffect, useState } from 'react'
import { Alert, Button, ButtonToolbar, Icon, Modal, Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { getValidatorsByDelegator, withdraw, withdrawReward } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {

    const [yourValidators, setYourValidators] = useState([] as YourValidator[])
    const myAccount = getAccount() as Account
    const [showConfirmWithdrawRewardsModal, setShowConfirmWithdrawRewardsModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [validatorActive, setValidatorActive] = useState('')
    const [showConfirmWithdrawModal, setShowConfirmWithdrawModal] = useState(false)
    // const [showConfirmUndelegateModal, setShowConfirmUndelegateModal] = useState(false)

    useEffect(() => {
        (async () => {
            const yourVals = await getValidatorsByDelegator(myAccount.publickey)
            setYourValidators(yourVals)
        })()
    }, [myAccount.publickey]);

    const withdrawRewards = async () => {
        setIsLoading(true)
        try {
            const withdrawTx = await withdrawReward(validatorActive, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw rewards success.')
            } else {
                Alert.error('Withdraw rewards failed.')
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
        }
        setIsLoading(false)
        setShowConfirmWithdrawRewardsModal(false)
        setValidatorActive('')
    }

    const widthdraw = async () => {
        setIsLoading(true)
        try {
            const withdrawTx = await withdraw(validatorActive, myAccount);
            if (withdrawTx && withdrawTx.status) {
                Alert.success('Withdraw success.')
            } else {
                Alert.error('Withdraw failed.')
            }
        } catch (error) {
            Alert.error(`Withdraw failed: ${error.message}`)
        }
        setIsLoading(false)
        setShowConfirmWithdrawModal(false)
        setValidatorActive('')
    }

    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="group" />
                    <p style={{ marginLeft: '12px' }} className="title">Your validators</p>
                </div>
            </div>
            <Panel shaded>
                <Table
                    autoHeight
                    rowHeight={70}
                    data={yourValidators}
                    hover={false}
                    wordWrap={true}
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
                    <Column width={300} verticalAlign="middle">
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <ButtonToolbar>
                                        <Button appearance="primary" style={{marginRight: '10px'}} onClick={() => {
                                            setShowConfirmWithdrawRewardsModal(true)
                                            setValidatorActive(rowData.validatorAddr)
                                        }}>
                                            Rewards Amount
                                        </Button>
                                        <Button appearance="primary"
                                            onClick={() => {
                                                setShowConfirmWithdrawModal(true)
                                                setValidatorActive(rowData.validatorAddr)
                                            }}>
                                            Staked Amount
                                        </Button>
                                    </ButtonToolbar>
                                )
                            }}
                        </Cell>
                    </Column>
                    {/* <Column width={200} verticalAlign="middle">
                        <HeaderCell>Undelegate </HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <ButtonToolbar>
                                        <Button appearance="primary"
                                            onClick={() => {
                                            }}>
                                            Undelegate
                                        </Button>
                                    </ButtonToolbar>
                                )
                            }}
                        </Cell>
                    </Column> */}
                </Table>
            </Panel>
            {/* Modal confirm when withdraw rewards */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawRewardsModal} onHide={() => { setShowConfirmWithdrawRewardsModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm Withdraw Rewards</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to withdraw all your rewarded token.</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmWithdrawRewardsModal(false) }} appearance="subtle">
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={withdrawRewards} appearance="primary">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal confirm when withdraw staked token */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmWithdrawModal} onHide={() => { setShowConfirmWithdrawModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm withdraw all your staked token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to withdraw all your staked token.</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmWithdrawModal(false) }} appearance="subtle">
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={widthdraw} appearance="primary">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Delegator;