import React, { useEffect, useState } from 'react'
import { Alert, Icon, Modal, Panel, Table } from 'rsuite';
import Button from '../../../../common/components/Button';
import { weiToKAI } from '../../../../common/utils/amount';
import { numberFormat } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidatorsByDelegator, withdraw, withdrawReward } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const Delegator = () => {


    const { isMobile } = useViewport()
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
                    wordWrap
                >
                    <Column flexGrow={3} verticalAlign="middle">
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>
                                        {
                                            renderHashToRedirect({
                                                hash: rowData.validatorAddr,
                                                headCount: isMobile ? 20 : 30,
                                                tailCount: 4,
                                                showTooltip: true,
                                                callback: () => { window.open(`/address/${rowData.validatorAddr}`) }
                                            })
                                        }
                                    </div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} verticalAlign="middle">
                        <HeaderCell>Stakes Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.yourStakeAmount))} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} verticalAlign="middle">
                        <HeaderCell>Rewards Amount</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div>{numberFormat(weiToKAI(rowData.yourRewardAmount))} KAI</div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column width={500} verticalAlign="middle">
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {(rowData: YourValidator) => {
                                return (
                                    <div style={{ display: "flex" }}>
                                        <Button style={{ marginRight: '10px' }} onClick={() => {
                                            setShowConfirmWithdrawRewardsModal(true)
                                            setValidatorActive(rowData.validatorAddr)
                                        }}>Claims Rewards </Button>
                                        <Button onClick={() => {
                                            setShowConfirmWithdrawModal(true)
                                            setValidatorActive(rowData.validatorAddr)
                                        }}>
                                            Withdraw Staked Amount
                                        </Button>
                                    </div>
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
                    <Button loading={isLoading} onClick={withdrawRewards} >
                        Confirm
                    </Button>
                    <Button onClick={() => { setShowConfirmWithdrawRewardsModal(false) }} className="primary-button">
                        Cancel
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
                    <Button loading={isLoading} onClick={widthdraw}>
                        Confirm
                    </Button>
                    <Button className="primary-button" onClick={() => { setShowConfirmWithdrawModal(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Delegator;